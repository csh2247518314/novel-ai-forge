#!/bin/bash

# Novel AI Forge 备份脚本
# 使用方法: ./backup.sh

# 配置
BACKUP_DIR="/var/www/novel-ai-forge/backups"
DATA_DIR="/var/www/novel-ai-forge/.next/data"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="novel-ai-forge_backup_${DATE}.tar.gz"
RETENTION_DAYS=7

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 创建备份
echo "正在创建备份..."
tar -czf "${BACKUP_DIR}/${BACKUP_FILE}" -C /var/www/novel-ai-forge .next/data .env.local 2>/dev/null

if [ $? -eq 0 ]; then
    echo "备份成功: ${BACKUP_FILE}"
    
    # 计算备份大小
    SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)
    echo "备份大小: ${SIZE}"
    
    # 清理旧备份
    echo "正在清理 ${RETENTION_DAYS} 天前的备份..."
    find "$BACKUP_DIR" -name "*.tar.gz" -mtime +${RETENTION_DAYS} -delete
    
    # 同步到远程存储（可选）
    # rclone sync "$BACKUP_DIR" remote:backup/novel-ai-forge
    
    echo "备份完成!"
else
    echo "备份失败!"
    exit 1
fi
