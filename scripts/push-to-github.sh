#!/bin/bash
# GitHub 推送执行脚本

echo "🚀 Novel AI Forge - 执行 GitHub 推送"
echo "======================================"

# 获取用户信息
read -p "请输入您的 GitHub 用户名: " github_username
read -p "请输入仓库名称 (默认: novel-ai-forge): " repo_name

if [ -z "$repo_name" ]; then
    repo_name="novel-ai-forge"
fi

echo ""
echo "🔍 验证仓库地址: https://github.com/$github_username/$repo_name"
echo ""

# 检查是否已经添加远程仓库
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ 检测到已配置的远程仓库: $(git remote get-url origin)"
    read -p "是否要更新远程仓库地址? (y/N): " update_remote
    if [[ $update_remote =~ ^[Yy]$ ]]; then
        git remote remove origin
        git remote add origin "https://github.com/$github_username/$repo_name.git"
        echo "✅ 远程仓库地址已更新"
    fi
else
    echo "📡 添加远程仓库地址..."
    git remote add origin "https://github.com/$github_username/$repo_name.git"
fi

echo ""
echo "📋 推送前的最终检查:"
echo "   仓库地址: https://github.com/$github_username/$repo_name"
echo "   分支: $(git branch --show-current)"
echo "   待推送提交数: $(git rev-list --count HEAD)"
echo ""

read -p "确认推送到 GitHub? (y/N): " confirm_push

if [[ $confirm_push =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 开始推送到 GitHub..."
    
    # 推送代码
    if git push -u origin main; then
        echo ""
        echo "🎉 推送成功！"
        echo "📍 仓库地址: https://github.com/$github_username/$repo_name"
        echo "🌐 项目主页: https://github.com/$github_username/$repo_name/blob/main/README.md"
        echo ""
        echo "📝 建议后续操作:"
        echo "   1. 在 GitHub 仓库中添加描述和标签"
        echo "   2. 添加 MIT License"
        echo "   3. 创建首个 Release"
        echo "   4. 设置 GitHub Pages (可选)"
    else
        echo ""
        echo "❌ 推送失败，可能的原因:"
        echo "   1. 网络连接问题"
        echo "   2. GitHub 仓库不存在或地址错误"
        echo "   3. 权限不足 (需要输入 GitHub 用户名和密码/Token)"
        echo ""
        echo "💡 解决方案:"
        echo "   1. 检查 GitHub 仓库是否已创建"
        echo "   2. 确保使用正确的 GitHub 认证方式"
        echo "   3. 检查网络连接"
    fi
else
    echo ""
    echo "❌ 推送已取消"
    echo "💡 如需手动推送，请运行:"
    echo "   git push -u origin main"
fi

echo ""
echo "📚 更多信息请参考: GITHUB_DEPLOYMENT.md"