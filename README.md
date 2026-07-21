# 刘昊 · 个人主页与数字人文项目

同济大学哲学系刘昊老师的个人主页、课程网站与数字人文可视化项目集合。站点以纯静态 HTML/CSS/JavaScript 为主体，并包含若干独立的专题可视化子项目（年谱、知识图谱、思想结构叙事等）。

## 项目结构

```
chph/
├── index.html                # 首页：个人简介、项目卡片、相关链接
├── cv.html                   # 个人简历
├── courses.html              # 课程总览（fetch data/courses.json）
├── events.html               # 学术活动与媒体报道
├── gallery.html              # 足迹（照片画廊）
├── history.html              # 网站更新历史
├── lixuegraph.html           # 宋明理学史知识图谱（D3.js 力导向图）
├── article-template.html     # 文章页模板
├── check_json.py             # JSON 数据校验脚本
├── COVER.jpg                 # 全站底纹背景图
│
├── css/                      # 全局样式
│   ├── style.css             # 主样式（设计系统、导航、卡片、布局）
│   ├── events.css            # 活动页样式
│   └── gallery.css           # 画廊页样式
├── js/
│   ├── main.js               # 全局脚本（导航、数据加载等）
│   └── markdown.js           # Markdown 渲染工具
├── data/                     # 站点数据（JSON）
│   ├── courses.json          # 课程信息与教学大纲
│   ├── publications.json     # 学术成果（著作、论文、译文、报纸）
│   ├── profile.json          # 简历数据（教育、履历、荣誉、项目等）
│   ├── events.json           # 活动记录与项目信息
│   ├── photos.json           # 画廊照片元数据
│   ├── nodes.json            # 理学图谱节点
│   ├── links.json            # 理学图谱关系边
│   └── config.json           # 理学图谱配色配置
├── images/                   # 图片资源（头像、横幅、画廊照片等）
│
├── lulongqinianpu/           # 寻踪陆陇其（年谱可视化，独立 Vite 项目）
├── daoliguimoessay/          # 道理规模与工夫次第（PDF 图册查看器）
├── daoliguimoessay2/         # 道理规模与工夫次第（长滚动叙事页）
├── chinese-history/          # 中国历史概论（通识课）
├── chinese-tradition/        # 中国传统文化（通识课）
├── ethics-classics/          # 伦理学经典
├── graduate-classics/        # 研究生·中国思想原典选读
└── graduate-neo-confucianism/# 研究生·宋明理学
```

## 技术栈

### 主站点

主站点为纯静态页面，无需构建工具，可直接用任意静态服务器托管。

- **样式**：原生 CSS，通过 CSS 变量统一管理配色与字体；正文使用 Noto Serif SC，楷体使用 LXGW WenKai
- **数据加载**：所有内容数据存放于 `data/*.json`，页面通过 `fetch` 动态加载（`js/main.js` 提供统一的 `fetchJSON` 工具函数）
- **公共脚本**：`js/main.js` 提供全局导航栏移动端切换（`initNavToggle`）、数据加载工具（`fetchJSON`）与课程详情页渲染函数，所有页面共享，无需在各页面内重复编写导航脚本
- **分析**：集成 Google Analytics（ID: `G-0E1K9BJLZK`）
- **背景效果**：`COVER.jpg` 作为固定底纹（opacity 0.06），叠加 SVG 噪点纹理模拟纸质质感

### 专题子项目

| 子项目 | 入口 | 可视化技术 | 数据来源 | 后端 |
|---|---|---|---|---|
| 寻踪陆陇其 | `lulongqinianpu/index.html` | Leaflet + OpenLayers + Chart.js + vis-network | 年谱 JSON、弟子记录 JSON、师承网络 JSON | FastAPI（可选，端口 8001） |
| 宋明理学史知识图谱 | `lixuegraph.html` | D3.js v7（力导向图） | `data/nodes.json`、`data/links.json`、`data/config.json` | 无 |
| 道理规模 v1 | `daoliguimoessay/pdf_viewer.html` | 原生 JS（PDF 转图片逐页展示） | `pdf_images/*.png` | 无 |
| 道理规模 v2 | `daoliguimoessay2/index.html` | Tailwind CSS + GSAP ScrollTrigger | 内嵌（无外部数据） | 无 |

## 本地开发

### 主站点

主站点使用相对根路径（如 `/css/style.css`），需以项目根目录作为 Web 根启动服务器，否则路径会失效。

```bash
# 在项目根目录执行
python -m http.server 8080
# 或
npx serve -l 8080
```

访问 `http://localhost:8080`。

### 寻踪陆陇其（lulongqinianpu）

该子项目为独立 Vite 项目，包含前端可视化与可选的 FastAPI 后端。

```bash
cd lulongqinianpu
npm install        # 安装依赖（首次）
npm run dev        # 启动 Vite 开发服务器（默认端口 3000）
```

如需启用后端 API（弟子数据、年谱、师承网络等接口）：

```bash
cd lulongqinianpu/backend
python main.py     # 启动 FastAPI，端口 8001
```

后端 API 前缀为 `/api`，提供 `/disciples`、`/chronicle`、`/network`、`/statistics` 等端点。前端在不启用后端时也可直接 fetch 同目录下的 JSON 文件运行。

## 设计系统

全站采用极简主义学术风格，核心设计变量定义在 `css/style.css` 的 `:root` 中：

- **配色**：页面背景 `#faf9f7`（米白），主文字 `#1a1a1a`，强调色同主文字色，整体呈黑白灰调
- **字体**：正文 Noto Serif SC（思源宋体），楷体 LXGW WenKai（霞鹜文楷），系统字体作为无衬线回退
- **布局**：单栏为主，最大宽度 920px，居中排版
- **质感**：底纹背景 + 纸质噪点纹理，半透明内容卡片配 `backdrop-filter` 毛玻璃效果
- **动效**：统一使用 `cubic-bezier(0.16, 1, 0.3, 1)` 缓动曲线

如需调整配色或字体，编辑 `css/style.css` 中的 CSS 变量即可全局生效。

## 课程页面约定

每门课程拥有独立文件夹，结构一致：

- `index.html`：课程详情页，引用 `/css/style.css`，包含全局顶部导航
- `2024-fall/` 等子文件夹：学期归档（可选）

新增课程时，在 `data/courses.json` 中添加课程数据，并创建对应的课程文件夹与 `index.html`。课程分类取值为 `undergraduate-major`（专业基础课）、`undergraduate-general`（通识课）、`graduate`（研究生课）。

## 部署

主站点为纯静态文件，将整个项目文件夹上传至任意静态托管服务即可（Netlify、Vercel、GitHub Pages 等）。注意所有页面使用绝对根路径（`/css/...`），需部署在根域名下，或部署到子路径时调整路径前缀。

寻踪陆陇其子项目可通过 `npm run build` 构建产物后单独部署，亦可直接作为静态文件由主站服务器提供。

## 维护信息

- **作者**：刘昊
- **单位**：同济大学哲学系
- **邮箱**：liuhao1106@tongji.edu.cn
- **个人主页**：https://liuhao1106.netlify.app/
