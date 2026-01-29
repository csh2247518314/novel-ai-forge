#!/bin/bash
# GitHub仓库创建指引脚本

echo "🚀 Novel AI Forge - GitHub 部署指引"
echo "========================================"

echo ""
echo "📋 步骤 1: 创建 GitHub 仓库"
echo "1. 访问 https://github.com"
echo "2. 点击右上角的 '+' 号，选择 'New repository'"
echo "3. 仓库名称建议: novel-ai-forge"
echo "4. 描述建议: 'AI驱动的小说创作平台 - 集成多种AI模型的智能写作工具'"
echo "5. 选择 'Public' 或 'Private'"
echo "6. 不要勾选 'Add a README file', 'Add .gitignore', 或 'Choose a license'"
echo "7. 点击 'Create repository'"

echo ""
echo "📋 步骤 2: 添加远程仓库并推送代码"
echo ""
echo "在终端中运行以下命令:"
echo ""

# 获取用户输入
read -p "请输入您的 GitHub 用户名: " github_username
read -p "请输入仓库名称 (默认: novel-ai-forge): " repo_name
if [ -z "$repo_name" ]; then
    repo_name="novel-ai-forge"
fi

echo ""
echo "执行以下命令:"
echo "----------------------------------------"
echo "git remote add origin https://github.com/$github_username/$repo_name.git"
echo "git push -u origin main"
echo "----------------------------------------"

echo ""
echo "✅ 完成后，您的项目将托管在: https://github.com/$github_username/$repo_name"

echo ""
echo "🎯 下一步建议:"
echo "1. 在 GitHub 仓库中添加 'Topics' 标签: ai, novel, writing, nextjs, typescript"
echo "2. 在 GitHub 仓库中设置 Pages (如果有需要)"
echo "3. 添加许可证文件 (建议使用 MIT License)"
echo "4. 在项目设置中配置 Secrets (如果需要 CI/CD)"

echo ""
echo "📚 文档和链接:"
echo "- GitHub 仓库: https://github.com/$github_username/$repo_name"
echo "- README.md: 已包含完整的部署和使用指引"
echo "- 部署文档: 详见 README.md 中的部署部分"

echo ""
echo "🎉 恭喜！您的 Novel AI Forge 项目已成功推送到 GitHub！"