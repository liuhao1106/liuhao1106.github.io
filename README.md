# 刘昊 · 个人主页与课程网站

## 项目简介

这是一个纯静态的个人主页与课程展示网站，用于呈现同济大学哲学系刘昊老师的个人信息、学术成果以及各门哲学课程信息。网站采用HTML/CSS/JavaScript技术栈，无需后端服务器，可直接部署在任何静态托管服务上。

## 文件夹结构

```
chph/
├── index.html              # 首页 - 个人主页与课程门户
├── cv.html                 # 个人简历页面
├── publications.html       # 学术成果页面
├── history.html            # 网站更新历史页面
├── css/
│   └── style.css           # 全局样式文件
├── js/
│   └── main.js             # JavaScript功能文件
├── data/
│   └── courses.json        # 课程数据文件
├── images/                 # 图片资源文件夹
│   ├── banner-lighthouse.jpg
│   ├── profile-logo.png
│   └── profile-photo.png
├── philosophy-history-ii/  # 中国哲学史（下）课程
│   ├── index.html          # 课程详情页
│   └── lectures/           # 讲义文件夹
│       ├── lecture-01.html
│       ├── lecture-02.html
│       └── lecture-03.html
├── neo-confucian-classics/ # 宋明理学经典课程
│   ├── index.html
│   └── 2024-fall/          # 2024秋季学期归档
├── ethics-classics/        # 伦理学经典课程
│   └── index.html
├── chinese-tradition/      # 中国传统文化通识课
│   └── index.html
├── chinese-history/        # 中国历史概论通识课
│   └── index.html
├── graduate-neo-confucianism/  # 研究生宋明理学课程
│   └── index.html
└── graduate-classics/      # 研究生中国思想原典选读
    ├── index.html
    └── 2024-fall/          # 2024秋季学期归档
```

## 页面说明

### 主要页面

| 页面 | 文件 | 说明 |
|------|------|------|
| 首页 | `index.html` | 个人主页，展示简介、快速导航和课程列表 |
| 简历 | `cv.html` | 详细个人简历 |
| 成果 | `publications.html` | 学术论文、著作等成果展示 |
| 历史 | `history.html` | 网站更新历史记录 |

### 课程页面

每门课程都有独立的文件夹，包含：
- `index.html` - 课程详情页（课程简介、大纲、讲义、教材等）
- `lectures/` - 讲义文件夹（可选）
- `20XX-fall/` 或 `20XX-spring/` - 学期归档文件夹（可选）

## 快速开始

### 本地开发

```bash
# 使用 Python 启动本地服务器
python -m http.server 8080

# 或使用 npx serve
npx serve -l 8080
```

然后访问 `http://localhost:8080`

### 部署

将整个项目文件夹上传到您的静态托管服务（如Netlify、Vercel、GitHub Pages等）即可。

## 如何添加新课程

### 步骤1：在 data/courses.json 中添加课程数据

课程数据直接内嵌在 `index.html` 中，编辑首页文件中的 `coursesData` 对象：

```javascript
{
  "id": "course-id",           // 课程唯一标识
  "category": "undergraduate-major",  // 分类：undergraduate-major/undergraduate-general/graduate
  "title": "课程名称",
  "shortDesc": "简短描述（用于首页卡片）",
  "semester": "2026春季学期",  // 开课学期
  "schedule": "1-16周 周一3-4节 南321",  // 上课时间地点
  "credits": "2学分",          // 学分
  "link": "course-folder/index.html"  // 课程页面链接
}
```

### 步骤2：创建课程文件夹

```bash
mkdir course-folder
```

### 步骤3：创建课程详情页

复制 `philosophy-history-ii/index.html` 到新课程文件夹，然后修改：
- 页面标题
- 课程信息内容
- 课程大纲
- 每周讲义列表
- 教材和参考资源

### 步骤4：创建讲义页面（可选）

在课程文件夹下创建 `lectures/` 文件夹，添加讲义HTML文件。

## 如何更新课程内容

### 更新课程信息

编辑 `index.html` 中的 `coursesData` 对象即可更新首页课程卡片信息。

### 更新课程详情

直接编辑对应课程文件夹中的 `index.html` 文件。

### 添加新的讲义

1. 在课程详情页的"每周讲义"部分添加新讲义条目
2. 在 `lectures/` 文件夹中创建新的HTML文件
3. 更新前后讲义的导航链接

### 修改样式

所有页面的样式都引用 `/css/style.css`，修改此文件即可全局生效。

## 样式定制

网站采用**莫兰迪色系**的复古简约风格，主要设计元素包括：

- **配色方案**：
  - 背景色：`#faf8f5`（米白）
  - 主文字色：`#2c2c2c`（深褐）
  - 强调色：`#8b7355`（棕色）
  - 莫兰迪蓝：`#8b9dc3`
  - 莫兰迪玫瑰：`#c4a4a4`
  - 莫兰迪鼠尾草：`#9caf88`

- **字体**：Georgia, Times New Roman, 宋体
- **布局**：便当盒网格布局（Bento Grid）
- **装饰**：圆角卡片、细边框、柔和阴影

如需修改配色，编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
  --bg-color: #faf8f5;
  --text-primary: #2c2c2c;
  --text-secondary: #5a5a5a;
  --accent-color: #8b7355;
  --morandi-blue: #8b9dc3;
  --morandi-rose: #c4a4a4;
  --morandi-sage: #9caf88;
  /* ... */
}
```

## 部署指南

### Netlify

1. 将整个项目文件夹拖拽到Netlify部署页面
2. 或连接GitHub仓库自动部署
3. 访问地址：https://your-site.netlify.app

### GitHub Pages

1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择主分支作为发布源

### 其他静态托管

直接将项目文件夹内容上传到服务器即可。

## 技术特点

- **纯静态**：无需后端服务器，部署简单
- **响应式设计**：适配桌面和移动设备
- **模块化样式**：使用CSS变量统一管理配色
- **语义化HTML**：良好的可访问性
- **内嵌数据**：课程数据直接写在HTML中，无需额外请求

## 注意事项

1. **文件路径**：所有路径使用相对路径（如 `/css/style.css`），确保文件夹结构正确
2. **字符编码**：所有HTML文件使用UTF-8编码
3. **浏览器兼容**：支持现代浏览器（Chrome、Firefox、Safari、Edge）
4. **图片资源**：建议压缩图片以优化加载速度

## 维护信息

- **作者**：刘昊
- **单位**：同济大学哲学系
- **邮箱**：liuhao1106@tongji.edu.cn
- **个人主页**：https://liuhao1106.netlify.app/

---

*本网站由刘昊老师维护更新*
