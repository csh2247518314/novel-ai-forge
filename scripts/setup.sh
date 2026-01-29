#!/bin/bash

# 服务器初始化脚本
# 使用方法: ./setup.sh

set -e

echo "=================================="
echo "Novel AI Forge 服务器初始化"
echo "=================================="

# 检查系统
if [ ! -f /etc/os-release ]; then
    echo "不支持的Linux发行版"
    exit 1
fi

# 安装Node.js
echo "正在检查Node.js..."
if ! command -v node &> /dev/null; then
    echo "安装Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js已安装: $(node --version)"
fi

# 安装PM2
echo "正在安装PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

# 创建用户（可选）
echo "是否创建专用用户? (y/n)"
read -r create_user
if [ "$create_user" = "y" ]; then
    USERNAME="novelforge"
    echo "创建用户: $USERNAME"
    sudo useradd -m -s /bin/bash "$USERNAME" 2>/dev/null || true
    USER_HOME=$(getent passwd "$USERNAME" | cut -d: -f6)
    
    # 创建目录
    sudo mkdir -p "$USER_HOME/www"
    sudo chown -R "$USERNAME:$USERNAME" "$USER_HOME/www"
else
    USER_HOME="/var/www"
fi

# 克隆项目
PROJECT_DIR="${USER_HOME}/www/novel-ai-forge"
echo "项目目录: $PROJECT_DIR"

if [ ! -d "$PROJECT_DIR" ]; then
    echo "是否克隆项目? (y/n)"
    read -r clone_repo
    if [ "$clone_repo" = "y" ]; then
        echo "请输入Git仓库URL:"
        read -r repo_url
        sudo git clone "$repo_url" "$PROJECT_DIR"
    else
        sudo mkdir -p "$PROJECT_DIR"
    fi
fi

# 设置权限
sudo chown -R "$(whoami):$(whoami)" "$PROJECT_DIR"

# 安装依赖
echo "正在安装依赖..."
cd "$PROJECT_DIR"
npm install

# 配置环境变量
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo "创建环境变量文件..."
    sudo cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
    echo "请编辑 $PROJECT_DIR/.env 填入API密钥"
fi

# 构建项目
echo "正在构建项目..."
npm run build

# 配置PM2
echo "配置PM2..."
pm2 delete novel-ai-forge 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

# 设置开机自启
echo "设置开机自启..."
pm2 startup | sudo tee /dev/null

# 创建备份目录
mkdir -p "$PROJECT_DIR/backups"

# 配置防火墙
echo "配置防火墙..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 22
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw --force enable
fi

echo "=================================="
echo "初始化完成!"
echo "=================================="
echo ""
echo "下一步操作:"
echo "1. 编辑 .env 文件填入API密钥"
echo "2. 运行 ./scripts/backup.sh 创建首次备份"
echo "3. 配置Nginx反向代理（可选）"
echo "4. 配置SSL证书（推荐）"
echo ""
echo "项目目录: $PROJECT_DIR"
echo "备份目录: $PROJECT_DIR/backups"
echo ""
