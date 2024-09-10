# AI Toolbox

AI 工具箱是一个集成多种人工智能工具的Web应用程序,旨在为用户提供一站式AI解决方案。该项目由 [AI 编辑器 Cursor](https://fisherdaddy.com/posts/cursor-the-ai-code-editor/) 提供支持。

## 功能特性

- 文字转图片卡片：将文本转换为精美的图片卡片
- JSON格式化工具：美化和验证JSON数据
- 多语言支持：支持中文和英文界面切换
- 响应式设计：适配各种设备屏幕尺寸

## 快速开始

### 前置要求

- Node.js (版本 14.0.0 或更高)
- npm (版本 6.0.0 或更高)

### 安装

1. 克隆仓库
```bash
git clone https://github.com/your-username/ai-toolbox.git
cd ai-toolbox
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 在浏览器中打开 `http://localhost:3000` 查看应用

## 使用方法

1. 文字转图片卡片
   - 导航到 "文字卡片" 工具
   - 在左侧输入框中输入文本
   - 右侧实时预览生成的图片卡片
   - 点击 "导出为图片" 下载生成的图片

2. JSON格式化工具
   - 导航到 "JSON 格式化" 工具
   - 在左侧输入框中粘贴JSON数据
   - 右侧自动显示格式化后的JSON结构

## 技术栈

- React
- React Router
- Styled Components
- Vite