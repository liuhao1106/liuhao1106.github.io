/**
 * 刘昊个人主页 - 主脚本
 * 提供全局导航交互、数据加载工具与课程详情页渲染
 */

// ===== 全局导航栏移动端切换 =====
function initNavToggle() {
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('global-nav-inner');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    toggle.textContent = isOpen ? '✕' : '☰';
    toggle.setAttribute('aria-label', isOpen ? '关闭菜单' : '打开菜单');
  });

  document.addEventListener('click', function(e) {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      toggle.textContent = '☰';
      toggle.setAttribute('aria-label', '打开菜单');
    }
  });
}

// ===== 通用数据加载工具 =====
async function fetchJSON(path, fallback = null) {
  try {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error.message);
    return fallback;
  }
}

// ===== 课程数据加载（供课程详情页使用）=====
let _coursesData = null;

async function loadCoursesData() {
  if (_coursesData) return _coursesData;
  _coursesData = await fetchJSON('data/courses.json', { courses: [] });
  return _coursesData;
}

async function getCourseById(courseId) {
  const data = await loadCoursesData();
  return data.courses.find(c => c.id === courseId) || null;
}

// ===== 课程详情页渲染（供课程子页面调用）=====
async function renderCoursePage(courseId) {
  const course = await getCourseById(courseId);
  if (!course) {
    console.error('Course not found:', courseId);
    return;
  }

  document.title = `${course.title} · 刘昊`;

  const infoSection = document.getElementById('course-info');
  if (infoSection) {
    infoSection.innerHTML = `
      <ul class="info-list">
        <li><span class="label">课程名称</span><span class="value">${course.title}</span></li>
        <li><span class="label">课程简介</span><span class="value">${course.fullDesc}</span></li>
        ${course.assessment ? `<li><span class="label">考核要求</span><span class="value">${course.assessment}</span></li>` : ''}
      </ul>
    `;
  }

  const syllabusSection = document.getElementById('course-syllabus');
  if (syllabusSection && course.syllabus) {
    syllabusSection.innerHTML = `
      <table class="syllabus-table">
        <thead><tr><th>周次</th><th>主题</th><th>内容概要</th></tr></thead>
        <tbody>
          ${course.syllabus.map(item => `
            <tr>
              <td class="week-num">第${item.week}周</td>
              <td>${item.topic}</td>
              <td>${item.content}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  const resourcesSection = document.getElementById('course-resources');
  if (resourcesSection && course.textbooks) {
    resourcesSection.innerHTML = `
      <ul class="resource-list">
        ${course.textbooks.map(res => `
          <li class="resource-item">
            <div class="resource-title">${res.title}</div>
            <div class="resource-meta">${[res.publisher, res.year, res.type].filter(Boolean).join(' · ')}</div>
          </li>
        `).join('')}
      </ul>
    `;
  }
}

// ===== 滚动入场动画系统 =====
// 为带有 data-reveal 属性的元素添加滚动入场动画
// 动效克制：fade + translateY(16px)，0.5s，cubic-bezier(0.16,1,0.3,1)
// 支持 data-reveal-delay 属性（毫秒）用于错位波浪式入场
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length === 0) return;

  // 如果浏览器不支持 IntersectionObserver，直接显示所有元素
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-reveal-delay') || '0', 10);
        if (delay > 0) {
          entry.target.style.transitionDelay = delay + 'ms';
        }
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// ===== 章节标题逐字入位 =====
// 将 .section-title 的纯文字部分拆分为逐字节点，
// 由 IntersectionObserver 触发后逐字淡入（书法感"书"字落地）
function initSectionTitleCharAnim() {
  if (!('IntersectionObserver' in window)) return;

  const titles = document.querySelectorAll('.section-title');
  titles.forEach(title => {
    // 跳过已经处理过的（防止重复绑定）
    if (title.dataset.charSplit === '1') return;
    title.dataset.charSplit = '1';

    // 保留 ::before 装饰条，只拆分文字节点
    const textNodes = Array.from(title.childNodes).filter(n => n.nodeType === Node.TEXT_NODE);
    textNodes.forEach(node => {
      const text = node.textContent;
      if (!text.trim()) return;
      const frag = document.createDocumentFragment();
      // 用 Array.from 确保正确处理 surrogate pair
      Array.from(text).forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        // 中文字符 22ms 错峰，英文字母/数字 12ms，整体节奏不会拖沓
        const step = /[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(ch) ? 22 : 12;
        span.style.transitionDelay = (i * step) + 'ms';
        frag.appendChild(span);
      });
      title.replaceChild(frag, node);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  titles.forEach(t => observer.observe(t));
}

// ===== 回到顶部按钮 =====
function initBackToTop() {
  // 按钮由 HTML 注入到 <body> 末尾
  let btn = document.getElementById('back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', '回到顶部');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
  }

  let visible = false;
  function update() {
    const shouldShow = window.scrollY > window.innerHeight * 0.8;
    if (shouldShow !== visible) {
      visible = shouldShow;
      btn.classList.toggle('visible', visible);
    }
  }
  window.addEventListener('scroll', update, { passive: true });
  update();

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== 顶部滚动进度条 =====
// 注入一条 2px 茶色细线，随阅读进度生长；页面不可滚动时保持隐藏
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  let ticking = false;
  function update() {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    bar.style.transform = `scaleX(${progress})`;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
}

// ===== 侧边栏 Scrollspy =====
// 简历/成果页的侧边导航随滚动自动高亮当前章节。
// 因侧栏由各页面 fetch 后动态渲染，改为每次滚动时现查节点，兼容异步注入。
function initScrollSpy() {
  let ticking = false;

  function update() {
    ticking = false;
    const items = document.querySelectorAll('.sidebar-nav-item[href^="#"]');
    if (items.length === 0) return;

    const offset = 120; // 与 .content-section 的 scroll-margin-top 对齐
    let currentId = null;

    items.forEach(item => {
      const section = document.getElementById(item.getAttribute('href').slice(1));
      if (section && section.getBoundingClientRect().top <= offset) {
        currentId = section.id;
      }
    });

    // 尚未滚到第一节时高亮第一项；滚到页面底部时高亮最后一项
    if (!currentId) {
      currentId = items[0].getAttribute('href').slice(1);
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      currentId = items[items.length - 1].getAttribute('href').slice(1);
    }

    items.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

// ===== 顶部导航滚动态 + 链接入场 =====
function initGlobalNav() {
  const nav = document.querySelector('.global-nav');
  if (!nav) return;

  // 滚动后切换 is-scrolled 状态（基于文档滚动距离而非窗口高度）
  let scrolled = false;
  function updateNav() {
    const shouldScroll = window.scrollY > 12;
    if (shouldScroll !== scrolled) {
      scrolled = shouldScroll;
      nav.classList.toggle('is-scrolled', scrolled);
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // 导航链接错峰淡入：每项延迟 60ms，营造章节感
  const links = nav.querySelectorAll('.nav-link');
  links.forEach((link, i) => {
    link.style.opacity = '0';
    link.style.transform = 'translateY(-4px)';
    link.style.transition = 'opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out), color 0.3s var(--ease-out)';
    // 首屏触发
    setTimeout(() => {
      link.style.transitionDelay = (i * 60) + 'ms';
      link.style.opacity = '1';
      link.style.transform = 'translateY(0)';
    }, 80);
  });
}

// ===== 页面加载后自动初始化 =====
document.addEventListener('DOMContentLoaded', function() {
  initNavToggle();
  initGlobalNav();
  initScrollReveal();
  initSectionTitleCharAnim();
  initBackToTop();
  initScrollProgress();
  initScrollSpy();
});
