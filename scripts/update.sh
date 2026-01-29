#!/bin/bash

# 系统更新脚本
# 使用方法: ./update.sh

set -e

echo "=================================="
echo "Novel AI Forge 更新脚本"
echo "=================================="

# 检查是否以root运行
if [ "$EUID" -ne 0 ]; then
    echo "请使用sudo运行: sudo $0"
    exit 1
fi

# 停止服务
echo "正在停止服务..."
if command -v pm2 &> /dev/null; then
    pm2 stop novel-ai-forge || true
elif command -v systemctl &> /dev/null; then
    systemctl stop novel-ai-forge || true
fi

# 备份数据
echo "正在备份数据..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
tar -czf /var/www/novel-ai-forge/backups/backup_before_update_${TIMESTAMP}.tar.gz \
    -C /var/www/novel-ai-forge .next/data .env.local 2>/dev/null || true

# 更新代码
echo "正在更新代码..."
cd /var/www/novel-ai-forge
git pull origin main || echo "Git更新失败，跳过"

# 安装依赖
echo "正在安装依赖..."
npm ci

# 构建
echo "正在构建..."
npm run build

# 重启服务
echo "正在重启服务..."
if command -v pm2 &> /dev/null; then
    pm2 start novel-ai-forge || pm2 restart novel-ai-forge
elif command -v systemctl &> /dev/null; then
    systemctl start novel-ai-forge
else
    echo "未检测到进程管理器，请手动重启"
    npm run start:prod &
fi

echo "=================================="
echo "更新完成!"
echo "=================================="
