# 刘昊 · 学术个人主页模板

> 一套面向人文学者的**数据驱动型静态站点模板**——零构建工具、JSON 即内容、动效克制、即拿即用。

同济大学哲学系刘昊老师的个人主页与课程网站。以纯静态 HTML/CSS/JavaScript 构建，所有内容通过 JSON 文件管理，改数据即更新页面，无需触碰 HTML。

## 为什么复用性高

这个项目不是"个人主页"，而是一套**可复用的学者站点框架**。任何人文学者只需替换 `data/` 目录下的 JSON 文件和几张图片，即可拥有一个完整的学术主页。

| 特性 | 说明 |
|---|---|
| **零构建工具** | 主站点无需 npm/webpack/vite，一个 `python -m http.server` 即可运行 |
| **JSON 即内容** | 简历、论文、课程、活动、照片全部存为 JSON，页面通过 `fetchJSON` 动态加载 |
| **数据复用** | `publications.json` 被 `cv.html` 和 `publications.html` 共享，一处修改两处同步 |
| **CSS 变量驱动** | 配色、字体、间距全部定义为 `:root` 变量，改一处即全站生效 |
| **响应式开箱即用** | 桌面/平板/手机三档适配，移动端导航自动切换 |
| **动效克制** | 0.4–0.5s 过渡、8–20px 位移、`prefers-reduced-motion` 支持，符合学术气质 |

## 项目结构

```
chph/
├── index.html                # 首页：个人简介、项目卡片、相关链接
├── cv.html                   # 个人简历（fetch profile.json + publications.json）
├── publications.html         # 学术成果（fetch publications.json）
├── courses.html              # 课程总览（fetch courses.json）
├── events.html               # 学术活动与媒体报道（fetch events.json）
├── gallery.html              # 足迹照片画廊（fetch photos.json）
├── lixuegraph.html           # 宋明理学史知识图谱（D3.js 力导向图）
├── history.html              # 网站更新历史
├── article-template.html     # 文章页模板
├── check_json.py             # JSON 数据校验脚本
├── COVER.jpg                 # 全站底纹背景图
│
├── css/
│   ├── style.css             # 设计系统（变量、导航、卡片、布局、动效）
│   ├── events.css            # 活动页专用样式
│   └── gallery.css           # 画廊页专用样式
├── js/
│   ├── main.js               # 全局脚本（导航、数据加载、动效、课程渲染）
│   └── markdown.js           # Markdown 渲染工具
├── data/                     # 站点数据（改这里即更新全站）
│   ├── profile.json          # 简历：教育、履历、荣誉、项目、会议
│   ├── publications.json     # 成果：著作、论文、译文、报纸
│   ├── courses.json          # 课程信息与教学大纲
│   ├── events.json           # 活动记录与项目卡片
│   ├── photos.json           # 画廊照片元数据
│   ├── nodes.json            # 理学图谱节点
│   ├── links.json            # 理学图谱关系边
│   └── config.json           # 理学图谱配色配置
├── images/                   # 图片资源（头像、缩略图、画廊照片）
│
└── [课程文件夹]/              # 各课程独立目录，结构一致
```

## 技术栈

### 主站点（零依赖核心）

| 层 | 技术 | 说明 |
|---|---|---|
| 样式 | 原生 CSS | CSS 变量统一管理配色/字体/间距；Noto Serif SC 正文，LXGW WenKai 楷体 |
| 脚本 | 原生 JS | 无框架，`js/main.js` 提供导航、数据加载、动效、课程渲染等全部功能 |
| 数据 | JSON | 所有内容存于 `data/*.json`，页面通过 `fetchJSON` 动态加载 |
| 动效 | CSS + JS | Lenis 平滑滚动、View Transitions 转场、clip-path 揭示、磁吸链接、骨架屏 |
| 分析 | Google Analytics | ID: `G-0E1K9BJLZK` |
| 质感 | CSS | `COVER.jpg` 底纹 + SVG 噪点纹理，模拟纸质质感 |

## 快速开始

```bash
# 在项目根目录执行（必须以根目录为 Web 根，因为页面使用绝对路径 /css/...）
python -m http.server 8080
```

访问 `http://localhost:8080`。直接用 `file://` 打开会导致路径失效。

## 数据驱动：改 JSON 即更新全站

所有页面内容均从 `data/` 目录的 JSON 文件加载。修改数据无需触碰 HTML。

| 页面 | 数据文件 | 说明 |
|---|---|---|
| `index.html` | `data/events.json` | 首页项目卡片，复用 `projects` 数组 |
| `cv.html` | `data/profile.json` + `data/publications.json` | 简历 + 成果（成果数据与 `publications.html` 共享） |
| `publications.html` | `data/publications.json` | 著作、论文、译文、报纸，分类编号自动生成 |
| `courses.html` | `data/courses.json` | 课程信息与教学大纲 |
| `events.html` | `data/events.json` | 学术活动与媒体报道 |
| `gallery.html` | `data/photos.json` | 照片元数据，按日期倒序排列 |
| `lixuegraph.html` | `data/nodes.json` + `data/links.json` + `data/config.json` | D3 力导向图节点与边 |

修改后建议运行校验：

```bash
python check_json.py
```

### JSON 数据结构速览

**`profile.json`** — 简历数据：

```jsonc
{
  "lastUpdated": "2026.07.21",
  "basicInfo": { "title": "...", "department": "...", "email": "..." },
  "education": [{ "period": "...", "institution": "...", "status": "..." }],
  "work": [{ "period": "...", "position": "...", "note": "..." }],
  "research": ["研究方向一", "研究方向二"],
  "honors": [{ "year": "...", "title": "..." }],
  "projects": [{ "year": "...", "title": "...", "note": "..." }],
  "conferences": [{ "title": "...", "date": "...", "location": "..." }]
}
```

**`publications.json`** — 成果数据（`cv.html` 与 `publications.html` 共享）：

```jsonc
{
  "books": [{ "title": "...", "publisher": "...", "date": "..." }],
  "papers": [{ "title": "...", "journal": "...", "date": "...", "cssci": true }],
  "translations": [{ "title": "...", "journal": "...", "date": "..." }],
  "newspapers": [{ "title": "...", "publisher": "...", "date": "..." }]
}
```

**`events.json`** — 活动与项目：

```jsonc
{
  "media": [{ "id": 1, "title": "...", "description": "...", "date": "...", "source": "...", "url": "..." }],
  "academic": [{ "id": 1, "title": "...", "description": "...", "date": "...", "location": "...", "url": "..." }],
  "projects": [{ "title": "...", "description": "...", "url": "...", "thumbnail": "...", "url2": "..." }]
}
```

**`courses.json`** — 课程数据：

```jsonc
{
  "professor": { "name": "...", "title": "...", "email": "..." },
  "categories": [
    { "id": "undergraduate-major", "name": "本科生·专业课" },
    { "id": "undergraduate-general", "name": "本科生·通识课" },
    { "id": "graduate", "name": "研究生课程" }
  ],
  "courses": [{ "id": "...", "category": "...", "title": "...", "syllabus": [{ "week": 1, "topic": "...", "content": "..." }] }]
}
```

**`photos.json`** — 照片元数据：

```jsonc
[{ "id": 1, "src": "images/gallery/photo.jpg", "title": "...", "description": "...", "date": "YYYY-MM-DD", "location": "..." }]
```

## 设计系统

全站视觉风格定义在 `css/style.css` 的 `:root` 中，修改变量即可全局生效。

### 配色

```css
--text-primary: #1a1a1a;        /* 主文字 */
--text-secondary: #4a4a4a;      /* 次级文字 */
--bg-page: #faf9f7;             /* 页面背景（米白） */
--accent-warm: #8b6f47;         /* 茶色赭石点缀色（全站唯一点缀） */
```

### 字体

```css
--font-serif: "Noto Serif SC", "Source Han Serif SC", "SimSun", serif;
--font-kai: "LXGW WenKai", "KaiTi", serif;
```

### 布局与动效

- 最大宽度 `920px`，单栏居中为主
- 统一缓动曲线 `cubic-bezier(0.16, 1, 0.3, 1)`
- 过渡时间 0.4–0.5s，位移 8–20px
- 全部动效兼容 `prefers-reduced-motion`

### 质感

`body::before` 加载 `COVER.jpg` 作为固定底纹（opacity 0.06），`body::after` 叠加 SVG 噪点纹理。这两层是全站纸质质感的来源。

## 动效系统

主站点内置五组动效，均为渐进增强，不影响内容可读性：

| 动效 | 触发方式 | 说明 |
|---|---|---|
| Lenis 平滑滚动 | 全局 | 惯性丝滑滚动，回顶按钮与锚点链接均走 Lenis |
| View Transitions | 页面跳转 | 浏览器原生 API，同源链接淡入淡出转场 |
| clip-path 揭示 | 滚动入视口 | 项目/画廊图片从遮罩中揭开，杂志编辑感 |
| 磁吸链接 | 鼠标悬停 | 核心按钮轻微跟随光标偏移 |
| 骨架屏 | 数据加载 | `fetch` 完成前显示微光闪烁占位 |

此外还有：滚动入场（`data-reveal`）、章节标题逐字入位、卡片 3D 倾斜 + 光泽跟随、Hero 视差形变、导航滚动增强等。

## 课程页面约定

每门课程拥有独立文件夹，结构一致：

- `index.html`：课程详情页，引用 `/css/style.css`，包含全局顶部导航
- `2024-fall/` 等子文件夹：学期归档（可选）

新增课程步骤：

1. 在 `data/courses.json` 的 `courses` 数组中添加课程对象
2. 创建课程文件夹与 `index.html`（可复制现有课程页作为模板）
3. 确保新页面引用 `/css/style.css` 并包含全局导航

## 复用指南：用这套模板搭建你自己的学术主页

1. **Fork 或克隆本仓库**
2. **替换数据**：编辑 `data/` 下的 JSON 文件，填入你的简历、论文、课程、活动、照片
3. **替换图片**：将 `images/profile-photo.png`、`COVER.jpg`、`images/gallery/` 替换为你自己的图片
4. **调整配色**（可选）：编辑 `css/style.css` 的 `:root` 变量
5. **修改导航**：在各 HTML 文件的 `.global-nav-inner` 中调整导航项
6. **部署**：上传至 GitHub Pages / Netlify / Vercel 等任意静态托管服务

> 注意：主站点使用绝对根路径（`/css/...`），需部署在根域名下。部署到子路径时需批量替换路径前缀。

## 部署

主站点为纯静态文件，将整个项目文件夹上传至任意静态托管服务即可：

- **GitHub Pages**：推送至 `gh-pages` 分支或设置 `main` 分支为 Pages 源
- **Netlify / Vercel**：连接仓库，构建命令留空，输出目录为项目根目录
- **传统服务器**：上传至 Web 服务器根目录

## 维护信息

- **作者**：刘昊
- **单位**：同济大学哲学系
- **邮箱**：liuhao1106@tongji.edu.cn
- **主页**：https://liuhao1106.netlify.app/
- **GitHub**：https://github.com/liuhao1106/liuhao1106.github.io

## License

MIT
