# AGENTS.md

本文件为 AI 编码代理（如 TRAE、Claude Code 等）在本仓库中工作时的操作指南。阅读本文件可快速理解项目约定，避免破坏既有结构与设计系统。

## 项目概述

这是同济大学哲学系刘昊老师的个人主页与数字人文项目集合。站点所有者为文史背景学者，偏好素朴、克制的学术视觉风格。项目由两类内容组成：

1. **主站点**（项目根目录）：纯静态 HTML/CSS/JS 个人主页与课程网站
2. **专题子项目**（独立子目录）：陆陇其年谱可视化、理学知识图谱、朱子学思想结构叙事等

## 目录职责与边界

| 路径 | 职责 | 修改时注意 |
|---|---|---|
| `index.html` | 首页，含项目卡片与个人简介 | 项目卡片内容可直接编辑此文件 |
| `cv.html` `courses.html` `events.html` `gallery.html` `history.html` | 各功能页 | 均引用 `/css/style.css` 与全局导航 |
| `lixuegraph.html` | D3.js 理学知识图谱 | 数据来自 `data/nodes.json`、`data/links.json`、`data/config.json`，改数据即可更新图谱 |
| `css/style.css` | 全站设计系统（变量、导航、卡片、布局） | 修改 CSS 变量会全局生效，谨慎调整 |
| `css/events.css` `css/gallery.css` | 功能页专用样式 | 仅对应页面使用 |
| `js/main.js` | 全局脚本：导航交互（`initNavToggle`）、数据加载工具（`fetchJSON`）、课程详情页渲染 | 所有页面共享，各页面只需 `<script src="/js/main.js">` 即可获得导航切换功能，不再需要内联导航脚本 |
| `js/markdown.js` | Markdown 渲染工具 | — |
| `data/*.json` | 站点数据 | 修改后可用 `python check_json.py` 校验 |
| `lulongqinianpu/` | 陆陇其年谱可视化（独立 Vite 项目） | 见下方专节 |
| `daoliguimoessay/` | PDF 图册查看器 | 图片由 `pdf_to_images.py` 从 PDF 生成 |
| `daoliguimoessay2/` | 长滚动叙事页（Tailwind + GSAP） | 独立技术栈，不引用主站 CSS |
| `chinese-history/` 等 5 个课程目录 | 课程详情页 | 结构一致，均引用 `/css/style.css` |

## 设计系统约定

全站视觉风格定义在 `css/style.css`。修改样式前务必遵循以下约定。

### 配色

设计变量位于 `:root`，整体为黑白灰调的极简学术风格：

```css
--text-primary: #1a1a1a;   /* 主文字 */
--text-secondary: #4a4a4a; /* 次级文字 */
--text-muted: #7a7a7a;     /* 弱化文字 */
--bg-page: #faf9f7;        /* 页面背景（米白） */
--bg-content: rgba(255, 255, 255, 0.85); /* 内容区半透明白 */
--accent-color: #1a1a1a;   /* 强调色同主文字色 */
```

修改配色应优先调整变量而非硬编码颜色值。所有者偏好素朴、自然的背景色，避免过暗或过于鲜艳的配色。

### 字体

```css
--font-serif: "Noto Serif SC", "Source Han Serif SC", "SimSun", serif; /* 正文宋体 */
--font-kai: "LXGW WenKai", "KaiTi", serif;  /* 楷体，用于特殊文本 */
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

字体通过 Google Fonts 与 jsDelivr CDN 引入。涉及中文内容的图表或可视化，须显式设置字体为 `Noto Sans CJK SC` 或 `WenQuanYi Micro Hei`，否则中文会显示为方块。

### 背景质感

`body::before` 加载 `COVER.jpg` 作为固定底纹（opacity 0.06），`body::after` 叠加 SVG 噪点纹理。这两层是全站纸质质感的来源，不要删除。所有者偏好带模糊、灰度、噪点的斑驳质感。

### 布局与动效

- 最大宽度 `--max-width: 920px`，单栏居中为主
- 统一缓动曲线 `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`
- 动效应克制，过渡时间 0.4–0.5s，位移 8–20px，避免屏幕闪烁
- 导航项 hover 效果：卡片上浮 `translateY(-6px)`、阴影加深，避免过度炫目

## 路径约定

主站点所有页面使用**绝对根路径**（如 `/css/style.css`、`/images/...`、`/js/main.js`）。这意味着：

- 本地开发必须以项目根目录作为 Web 根启动服务器（`python -m http.server 8080`）
- 直接用 `file://` 协议打开页面会导致路径失效
- 部署到子路径时需调整路径前缀

子项目内部（如 `daoliguimoessay2/`）可能使用相对路径，以该子项目目录为准。

## 数据加载方式

主站点所有内容均数据驱动，页面通过 `fetchJSON`（定义在 `js/main.js`）动态加载 JSON：

- `publications.html` → `data/publications.json`（著作、期刊论文、译文、报纸）
- `cv.html` → `data/profile.json`（简历）+ `data/publications.json`（复用成果数据，避免重复维护）
- `courses.html` → `data/courses.json`（课程信息与教学大纲）
- `index.html` → `data/events.json`（首页项目卡片，复用 `projects` 数组）
- `events.html` → `data/events.json`（活动记录与项目）
- `gallery.html` → `data/photos.json`（照片元数据）
- `lixuegraph.html` → `data/nodes.json` + `data/links.json` + `data/config.json`（并行 fetch）

修改站点数据时编辑对应 JSON 文件即可，无需改动 HTML。修改后建议运行 `python check_json.py` 校验格式。

`data/courses.json` 的课程分类字段 `category` 取值为：`undergraduate-major`、`undergraduate-general`、`graduate`。

`data/publications.json` 的结构为 `{ books: [], papers: [], translations: [], newspapers: [] }`，每条记录含 `title`、`journal`/`publisher`、`date`、`cssci`（布尔）、`note`（可选）等字段。`cv.html` 和 `publications.html` 共用此文件，在任一处添加论文即两处同步更新。

## 陆陇其年谱子项目（lulongqinianpu）

这是仓库中唯一的带构建工具的子项目，技术栈与主站点不同。

### 启动方式

```bash
cd lulongqinianpu
npm run dev      # Vite 开发服务器，端口 3000
```

### 技术栈

- **Leaflet 1.9.4**：第一部分行迹图
- **OpenLayers 8.2.0**：第二部分弟子地理分布
- **vis-network**：第三部分师承关系网络图
- **Chart.js 4.4.1**：第四部分统计图表
- 上述库通过 CDN 引入，`package.json` 中亦安装为开发依赖

### 数据文件

- `lulonqgqilife/陆陇其年谱结构化数据.json`：年谱事件，字段含 `year/age/location/event/type/coords`
- `disciples_records.json`：弟子记录，字段含 `name/styleName/type/origin/category/content/source`
- `teacher_student_network.json`：师承网络节点与边

### 后端

`backend/main.py` 为 FastAPI 应用，端口 8001，API 前缀 `/api`。前端在不启用后端时可直接 fetch 同目录 JSON 运行，后端为可选增强。

### 本地样式

`assets/css/main.css` 与 `assets/css/responsive.css` 为该子项目专用，使用宣纸/墨色/朱砂配色（`--ink-black`/`--paper-cream`/`--cinnabar` 等），与主站点的黑白灰调不同。修改该子项目样式时编辑这两个文件，不要混入主站 `css/style.css`。

## 常见任务指引

### 修改首页项目卡片

编辑 `data/events.json` 中的 `projects` 数组，首页 `index.html` 和活动页 `events.html` 均从此数据加载。每个项目含 `title`、`description`、`url`、`thumbnail`（可选）、`url2`（可选，用于有两个展示链接的项目）。

### 新增课程

1. 在 `data/courses.json` 的 `courses` 数组中添加课程对象（含 `id`、`category`、`title`、`shortDesc`、`semester`、`schedule`、`credits`、`link`）
2. 创建课程文件夹与 `index.html`（可复制现有课程页作为模板）
3. 确保新页面引用 `/css/style.css` 并包含全局导航

### 新增论文/成果

编辑 `data/publications.json`，在对应分类数组（`books`/`papers`/`translations`/`newspapers`）中添加记录。`publications.html` 和 `cv.html` 均从此文件加载，一次修改两处同步。

### 更新简历

编辑 `data/profile.json`，修改对应字段（教育、履历、荣誉、项目等）。`cv.html` 的论文部分自动从 `publications.json` 加载，无需在 `profile.json` 中重复维护。

### 修改全局样式

编辑 `css/style.css` 中的 `:root` 变量可调整全站配色与字体。修改组件样式时保持与既有卡片、导航的视觉一致性。

### 更新理学知识图谱数据

编辑 `data/nodes.json`（节点）与 `data/links.json`（关系边）。`data/config.json` 定义各分组的配色。`lixuegraph.html` 中的 D3 力导向图会在刷新后自动读取新数据。

## 不要做的事

- 不要删除 `body::before` 与 `body::after` 的背景纹理层
- 不要在主站点页面中使用相对路径引用 CSS/JS（保持绝对根路径 `/css/...`）
- 不要将 `lulongqinianpu/` 的样式混入主站 `css/style.css`
- 不要把课程数据内嵌进 HTML（保持数据与页面分离，通过 fetch 加载）
- 不要引入与极简学术风格冲突的鲜艳配色或过度动画
- 不要在 `lulongqinianpu/node_modules/` 中直接修改第三方库代码
