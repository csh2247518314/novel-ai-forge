---
AIGC:
    ContentProducer: Minimax Agent AI
    ContentPropagator: Minimax Agent AI
    Label: AIGC
    ProduceID: 978969ea2eda9f8e182e826246f9c2b6
    PropagateID: 978969ea2eda9f8e182e826246f9c2b6
    ReservedCode1: 304402201c8f46f2e824174e1b01ccfdd930edcac084dc90572461bcb9c666a90845633602204ae2bb876af4ce16b721cf9b3dc3d4e7129d491416fd39cc5e8246e10fab421c
    ReservedCode2: 3045022100a77240f47f226b5eb8f78509eb167cb4833ff584e5e09ae542ead682e4c9755e02207d77fa1023523004c160098d72a8d4dbad46feb18a2999ac6e94faebec201415
---

# Novel AI Forge - AI小说创作平台

> 一个集成多种AI模型的小说创作平台，支持多线程写作和智能对话

## 目录

- [项目概述](#项目概述)
- [系统要求](#系统要求)
- [快速开始](#快速开始)
- [操作系统特定指引](#操作系统特定指引)
  - [Windows部署](#windows部署)
  - [macOS部署](#macos部署)
  - [Linux部署](#linux部署)
- [部署方式](#部署方式)
- [配置说明](#配置说明)
- [维护与监控](#维护与监控)
- [故障排查](#故障排查)
- [安全建议](#安全建议)

## 项目概述

Novel AI Forge 是一个功能强大的AI驱动小说创作平台，主要特性包括：

- 🤖 **多AI模型集成**：支持OpenAI、Anthropic、通义千问、文心一言、抖音豆包等多种AI服务
- 📝 **智能编辑器**：基于TipTap的富文本编辑器，支持Markdown
- 🗂️ **项目管理**：完整的小说项目管理，包含章节、角色、世界观设定
- 🧠 **项目圣经**：RAG系统管理角色关系和世界观设定
- 💾 **本地优先**：使用PouchDB实现离线存储
- 🔧 **生产就绪**：支持Docker、PM2、Vercel等多种部署方式

## 功能特性

### 🤖 多模型集成
- **OpenAI** (GPT-4、GPT-4 Turbo、GPT-3.5 Turbo)
- **Anthropic Claude** (Claude Sonnet、Claude Haiku、Claude Opus)
- **通义千问** (Qwen Turbo、Qwen Plus、Qwen Max)
- **文心一言** (ERNIE 4.0、ERNIE 3.5)
- **豆包** (Doubao Pro、Doubao Lite)

### 📖 作品管理
- 创建和管理多个小说项目
- 章节结构化管理
- 自动保存功能

### 🎭 作品圣经系统
- **角色设定**：创建和管理角色卡片，包含外貌、性格、背景、秘密等信息
- **地点设定**：管理故事发生地点
- **物品设定**：记录重要道具和魔法物品

### ✍️ 智能编辑器
- 基于TipTap的富文本编辑器
- Markdown语法支持
- 选中文字快捷AI操作
- 浮动工具栏

### 💬 AI助手
- 对话式AI交互
- 多种创作模板（续写、润色、改写、对话生成等）
- 上下文感知（自动注入角色和设定信息）

## 系统要求

### 基础要求

- **Node.js**: 18.x 或更高版本
- **npm**: 9.x 或更高版本
- **内存**: 建议 2GB 以上
- **存储**: 至少 1GB 可用空间
- **网络**: 稳定的互联网连接（用于AI API调用）

### 开发环境

- **Git**: 用于代码管理
- **VS Code** 或其他编辑器（推荐）
- **Docker**: 可选，用于容器化部署

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd novel-ai-forge
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量模板：

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

编辑 `.env` 文件：

```bash
# API密钥配置（至少配置一个）
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
QWEN_API_KEY=your-qwen-api-key
ERNIE_API_KEY=your-ernie-api-key
DOUBAO_API_KEY=your-doubao-api-key

# 服务器配置
NODE_ENV=development
PORT=3000
HOST=localhost
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 即可使用应用。

## 操作系统特定指引

## Windows部署

### 方式一：Docker Desktop（推荐）

1. **安装Docker Desktop**
   - 下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
   - 启动Docker Desktop

2. **部署应用**
```powershell
# 进入项目目录
cd C:\path\to\novel-ai-forge

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 方式二：直接部署

1. **安装Node.js**
   - 从 [nodejs.org](https://nodejs.org/) 下载并安装 LTS 版本

2. **安装PM2**
```powershell
npm install -g pm2
```

3. **构建并启动**
```powershell
npm install
npm run build
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs

# 重启应用
pm2 restart novel-ai-forge
```

### 方式三：使用Windows Service

1. **创建Windows Service**
```powershell
npm install -g node-windows
npm link node-windows

# 创建服务
node scripts/create-windows-service.js
```

2. **管理服务**
```powershell
# 启动服务
net start novel-ai-forge

# 停止服务
net stop novel-ai-forge

# 查看状态
sc query novel-ai-forge
```

### Windows防火墙配置

```powershell
# 允许3000端口通过防火墙
netsh advfirewall firewall add rule name="Novel AI Forge" dir=in action=allow protocol=TCP localport=3000
```

### Windows任务计划程序（自动备份）

1. 打开"任务计划程序"
2. 创建基本任务
3. 触发器：每天 02:00
4. 操作：启动程序
5. 程序：`C:\path\to\novel-ai-forge\scripts\backup.bat`

## macOS部署

### 方式一：Homebrew + Docker

1. **安装Homebrew**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. **安装Docker Desktop**
```bash
brew install --cask docker
open /Applications/Docker.app
```

3. **部署应用**
```bash
# 克隆或进入项目目录
cd ~/Desktop/novel-ai-forge

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 方式二：使用pm2

1. **安装依赖**
```bash
# 使用Homebrew安装Node.js（如果没有）
brew install node

# 全局安装pm2
npm install -g pm2

# 安装项目依赖
npm install
```

2. **构建并启动**
```bash
npm run build
pm2 start ecosystem.config.js

# 设置开机自启
pm2 startup
pm2 save
```

3. **管理应用**
```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs

# 重启应用
pm2 restart novel-ai-forge

# 停止应用
pm2 stop novel-ai-forge

# 删除应用
pm2 delete novel-ai-forge
```

### macOS自动启动配置

创建LaunchAgent配置：

```xml
<!-- ~/Library/LaunchAgents/com.novelaiforge.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.novelaiforge</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/path/to/novel-ai-forge/ecosystem.config.js</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/path/to/novel-ai-forge</string>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

启用服务：
```bash
launchctl load ~/Library/LaunchAgents/com.novelaiforge.plist
launchctl start com.novelaiforge
```

### macOS防火墙和端口

```bash
# 允许应用通过防火墙
sudo pfctl -f /etc/pf.conf
sudo pfctl -e

# 或者使用pf.conf添加规则
echo "pass in on lo0 proto tcp from any to any port 3000" | sudo pfctl -f -
```

## Linux部署

### Ubuntu/Debian

1. **安装系统依赖**
```bash
# 更新包列表
sudo apt update

# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2
sudo npm install -g pm2

# 安装Docker（可选）
sudo apt install docker.io docker-compose
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

2. **部署应用**
```bash
# 克隆项目
git clone <repository-url>
cd novel-ai-forge

# 安装依赖
npm install

# 构建项目
npm run build

# 使用PM2启动
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 或者使用Docker
docker-compose up -d
```

### CentOS/RHEL/Fedora

1. **安装系统依赖**
```bash
# CentOS/RHEL
sudo yum install -y nodejs npm

# Fedora
sudo dnf install -y nodejs npm

# 安装PM2
sudo npm install -g pm2

# 安装Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
```

2. **部署应用**（同Ubuntu步骤）

### 创建系统服务（systemd）

创建服务文件：

```bash
sudo nano /etc/systemd/system/novel-ai-forge.service
```

内容：
```ini
[Unit]
Description=Novel AI Forge - AI小说创作平台
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/novel-ai-forge
ExecStart=/usr/bin/pm2 start ecosystem.config.js --no-daemon
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

# 安全配置
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
ReadWritePaths=/var/www/novel-ai-forge

[Install]
WantedBy=multi-user.target
```

启用服务：
```bash
sudo systemctl daemon-reload
sudo systemctl enable novel-ai-forge
sudo systemctl start novel-ai-forge
sudo systemctl status novel-ai-forge
```

### 使用Nginx反向代理

1. **安装Nginx**
```bash
# Ubuntu/Debian
sudo apt install nginx

# CentOS/RHEL/Fedora
sudo yum install nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

2. **配置虚拟主机**
```bash
sudo nano /etc/nginx/sites-available/novel-ai-forge
```

配置内容：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 安全头
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # 静态文件缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 主应用
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/novel-ai-forge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL证书配置

使用Let's Encrypt：
```bash
# 安装certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 设置自动续期
sudo crontab -e
# 添加：0 12 * * * /usr/bin/certbot renew --quiet
```

## 部署方式

### 1. Docker部署（推荐）

最简单、跨平台的部署方式：

```bash
# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 更新服务
docker-compose down
docker-compose pull
docker-compose up -d
```

### 2. PM2部署

适合生产环境的进程管理：

```bash
# 启动
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 重启
pm2 restart novel-ai-forge

# 停止
pm2 stop novel-ai-forge

# 删除
pm2 delete novel-ai-forge

# 查看日志
pm2 logs
pm2 logs --lines 100  # 查看最近100行日志
```

### 3. Vercel部署

适合快速原型和免费托管：

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel

# 设置环境变量
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
```

### 4. 传统服务器部署

使用systemd服务：

```bash
sudo systemctl start novel-ai-forge
sudo systemctl enable novel-ai-forge
sudo systemctl status novel-ai-forge
```

## 配置说明

### 环境变量

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `OPENAI_API_KEY` | 否 | OpenAI API密钥 | sk-xxxxx |
| `ANTHROPIC_API_KEY` | 否 | Anthropic API密钥 | sk-ant-xxxxx |
| `QWEN_API_KEY` | 否 | 通义千问API密钥 | xxxxx |
| `ERNIE_API_KEY` | 否 | 文心一言API密钥 | xxxxx |
| `DOUBAO_API_KEY` | 否 | 抖音豆包API密钥 | xxxxx |
| `NODE_ENV` | 是 | 运行环境 | production |
| `PORT` | 是 | 服务端口 | 3000 |
| `HOST` | 是 | 绑定地址 | 0.0.0.0 |
| `DOMAIN` | 否 | 域名 | your-domain.com |

### PM2配置

`ecosystem.config.js` 配置说明：

```javascript
module.exports = {
  apps: [{
    name: 'novel-ai-forge',
    script: 'npm',
    args: 'run start',
    instances: 'max', // 使用所有CPU核心
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### Docker配置

`docker-compose.yml` 说明：

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./data:/app/data  # 数据持久化
      - ./logs:/app/logs # 日志持久化
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 维护与监控

### 性能监控

1. **PM2监控**
```bash
# 查看详细状态
pm2 show novel-ai-forge

# 监控模式
pm2 monit

# 查看资源使用
pm2 plus  # 需要注册PM2 Plus
```

2. **系统资源监控**
```bash
# CPU和内存使用
top
htop

# 磁盘使用
df -h
du -sh /var/www/novel-ai-forge

# 网络连接
netstat -tlnp | grep :3000
```

### 日志管理

1. **PM2日志**
```bash
# 实时查看日志
pm2 logs novel-ai-forge

# 查看特定数量的日志
pm2 logs novel-ai-forge --lines 1000

# 清空日志
pm2 flush novel-ai-forge
```

2. **系统日志**
```bash
# journalctl日志
sudo journalctl -u novel-ai-forge -f
sudo journalctl -u novel-ai-forge --since "1 hour ago"

# 保存日志到文件
sudo journalctl -u novel-ai-forge > novel-ai-forge.log
```

### 备份策略

1. **自动备份脚本**
```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="/var/backups/novel-ai-forge"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/novel-ai-forge"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份应用数据
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz $APP_DIR/data/
tar -czf $BACKUP_DIR/logs_backup_$DATE.tar.gz $APP_DIR/logs/

# 备份PM2配置
pm2 dump > $BACKUP_DIR/pm2_backup_$DATE.json

# 清理旧备份（保留30天）
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.json" -mtime +30 -delete

echo "Backup completed: $DATE"
```

2. **定时备份**
```bash
# 添加到crontab
crontab -e

# 每天凌晨2点执行备份
0 2 * * * /var/www/novel-ai-forge/scripts/backup.sh >> /var/log/novel-ai-forge-backup.log 2>&1
```

### 更新部署

1. **手动更新**
```bash
# 进入项目目录
cd /var/www/novel-ai-forge

# 备份当前版本
./scripts/backup.sh

# 获取最新代码
git pull origin main

# 安装新依赖
npm install

# 构建项目
npm run build

# 重启应用
pm2 restart novel-ai-forge
```

2. **自动化更新脚本**
```bash
#!/bin/bash
# scripts/update.sh

set -e

echo "Starting update..."
cd /var/www/novel-ai-forge

# 备份
echo "Creating backup..."
./scripts/backup.sh

# 获取更新
echo "Fetching updates..."
git pull origin main

# 安装依赖
echo "Installing dependencies..."
npm install

# 构建
echo "Building application..."
npm run build

# 重启服务
echo "Restarting application..."
pm2 reload ecosystem.config.js

echo "Update completed successfully!"
```

## 故障排查

### 常见问题及解决方案

#### 1. 应用无法启动

**问题现象**：PM2显示应用状态为"errored"或Docker容器退出

**排查步骤**：
```bash
# 检查PM2日志
pm2 logs novel-ai-forge

# 检查Docker日志
docker-compose logs app

# 检查环境变量
cat .env

# 检查端口占用
lsof -i :3000

# 检查Node.js版本
node --version
```

**解决方案**：
- 确保环境变量正确配置
- 检查API密钥有效性
- 确保端口3000未被占用
- 使用Node.js 18.x版本

#### 2. 内存不足

**问题现象**：应用运行缓慢或经常重启

**解决方案**：
```bash
# 增加PM2内存限制
pm2 start ecosystem.config.js --max-memory-restart 500M

# 检查系统内存
free -h

# 增加swap空间
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### 3. API调用失败

**问题现象**：AI生成功能无法工作

**排查步骤**：
```bash
# 测试API连接
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models

# 检查网络连接
ping api.openai.com

# 检查代理设置
env | grep -i proxy
```

#### 4. 构建失败

**问题现象**：`npm run build` 报错

**解决方案**：
```bash
# 清理缓存
npm cache clean --force
rm -rf node_modules
rm -rf .next

# 重新安装
npm install

# 检查Node.js版本兼容性
npm doctor
```

#### 5. 数据库问题

**问题现象**：数据无法保存或读取

**排查步骤**：
```bash
# 检查PouchDB数据文件
ls -la ./data/

# 检查浏览器IndexedDB
# 在浏览器开发者工具中查看Application > IndexedDB

# 检查磁盘空间
df -h
```

### 性能优化

#### 1. Node.js性能调优

```bash
# 设置Node.js参数
export NODE_OPTIONS="--max-old-space-size=2048 --optimize-for-size"

# PM2配置优化
pm2 start ecosystem.config.js --node-args="--max-old-space-size=2048"
```

#### 2. 系统优化

```bash
# 增加文件描述符限制
ulimit -n 65536

# 优化内核参数
echo 'net.core.somaxconn = 65536' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

#### 3. 数据库优化

- 定期清理历史数据
- 启用浏览器IndexedDB压缩
- 考虑使用外部数据库（如MongoDB）

### 网络问题排查

#### 1. 防火墙配置

```bash
# 检查防火墙状态
sudo ufw status
sudo iptables -L

# 允许应用端口
sudo ufw allow 3000
```

#### 2. 代理配置

```bash
# 检查代理设置
env | grep -i proxy

# 设置代理（如果需要）
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
```

## 安全建议

### 1. API密钥安全

- ✅ 使用环境变量存储API密钥
- ✅ 定期轮换API密钥
- ✅ 限制API密钥的权限范围
- ❌ 不要将API密钥提交到代码仓库
- ❌ 不要在前端代码中暴露API密钥

### 2. 服务器安全

```bash
# 更新系统
sudo apt update && sudo apt upgrade

# 配置防火墙
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 3000

# 设置Fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 3. 应用安全

- 启用HTTPS（使用Let's Encrypt）
- 配置安全头（X-Frame-Options, CSP等）
- 限制访问速率
- 定期备份数据
- 监控异常访问

### 4. 数据备份加密

```bash
# 加密备份文件
tar -czf - data/ | gpg --cipher-algo AES256 --compress-algo 1 --s2k-mode 3 --s2k-digest-algo SHA512 --s2k-count 65536 --force-mdc --quiet --no-greeting -c > backup_$(date +%Y%m%d).tar.gz.gpg

# 解密备份文件
gpg --decrypt backup_YYYYMMDD.tar.gz.gpg | tar -xzf -
```

### 5. 监控告警

设置关键指标监控：

```bash
# CPU使用率告警
*/5 * * * * /usr/local/bin/check_cpu.sh

# 内存使用率告警  
*/5 * * * * /usr/local/bin/check_memory.sh

# 磁盘空间告警
*/10 * * * * /usr/local/bin/check_disk.sh
```

## 使用指南

### 1. 创建项目
- 点击左侧边栏的「新建项目」
- 输入项目名称和描述

### 2. 创建章节
- 在项目下点击「新建章节」
- 输入章节标题

### 3. 创作内容
- 在编辑器中输入内容
- 使用工具栏格式化文字
- 选中文字后点击「AI操作」按钮

### 4. 配置AI模型
- 点击左侧边栏的「设置」
- 选择AI服务提供商
- 输入API密钥并保存
- 设置默认使用的模型

### 5. 使用作品圣经
- 点击「角色设定」管理角色
- 创建角色卡片，填写详细信息
- AI会自动参考这些信息生成内容

## 配置AI模型

### OpenAI
1. 获取API密钥: https://platform.openai.com/api-keys
2. 在设置中输入API密钥

### Anthropic Claude
1. 获取API密钥: https://console.anthropic.com/
2. 在设置中输入API密钥

### 通义千问 (阿里云)
1. 获取API密钥: https://dashscope.console.aliyun.com/
2. 在设置中输入API密钥

### 文心一言 (百度)
1. 获取API密钥: https://console.bce.baidu.com/
2. 需要先获取access_token

### 豆包 (字节跳动)
1. 获取API密钥: https://console.volcengine.com/
2. 在设置中输入API密钥

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 主页面
│   └── globals.css        # 全局样式
├── components/
│   ├── editor/            # 编辑器组件
│   ├── sidebar/           # 侧边栏组件
│   ├── bible/             # 作品圣经组件
│   ├── chat/              # AI聊天组件
│   ├── settings/          # 设置面板组件
│   └── ui/                # 基础UI组件
├── lib/
│   ├── ai-service.ts      # AI服务集成
│   ├── db.ts              # 数据库操作
│   └── utils.ts           # 工具函数
├── store/
│   ├── project-store.ts   # 项目状态管理
│   └── settings-store.ts  # 设置状态管理
└── types/
    └── index.ts           # TypeScript类型定义
```

## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS + shadcn/ui
- **编辑器**: TipTap (ProseMirror)
- **状态管理**: Zustand
- **本地存储**: PouchDB (IndexedDB)
- **AI集成**: Vercel AI SDK 兼容接口

## 隐私说明

- 所有API密钥仅存储在浏览器本地存储中
- 不会上传到任何服务器
- 不会将你的创作内容用于模型训练
- 建议使用环境变量配置API密钥以提高安全性

## 许可

MIT License

---

## 支持

如果在使用过程中遇到问题，请：

1. 查看本文档的[故障排查](#故障排查)部分
2. 检查项目的GitHub Issues
3. 创建新的Issue并提供详细信息
