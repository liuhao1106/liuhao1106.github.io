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

// ===== 滚动视差 + Hero 形变 =====
// Hero 照片随滚动视差位移，标题随滚动缩小淡出——让首屏"持续呼吸"而非触发一次就静止
function initScrollParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.home-hero');
  if (!hero) return;

  const heroPhoto = hero.querySelector('.hero-photo-wrapper');
  const heroName = hero.querySelector('.home-hero h1');
  const heroNameEn = hero.querySelector('.hero-name-en');
  const heroDivider = hero.querySelector('.hero-divider');
  const heroSubtitle = hero.querySelector('.hero-subtitle');
  const heroIntro = hero.querySelector('.hero-intro');
  const fadeEls = [heroNameEn, heroDivider, heroSubtitle, heroIntro];

  // 入场动画结束后移除 animation，让滚动视差的 inline style 能生效
  let parallaxReady = false;
  if (heroName) {
    setTimeout(() => {
      heroName.style.animation = 'none';
      parallaxReady = true;
    }, 1600);
  } else {
    parallaxReady = true;
  }

  let ticking = false;

  function update() {
    ticking = false;
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;
    if (scrollY > heroHeight + 100) return;

    const progress = Math.min(scrollY / heroHeight, 1);

    // 照片视差：向下位移，产生深度感（入场期间也生效）
    if (heroPhoto) {
      heroPhoto.style.transform = `translateY(${progress * 36}px)`;
    }

    // 标题缩小淡出：入场动画结束后才接管
    if (parallaxReady) {
      if (heroName) {
        heroName.style.transform = `scale(${1 - progress * 0.08})`;
        heroName.style.opacity = String(1 - progress * 0.6);
      }
      fadeEls.forEach(el => {
        if (el) el.style.opacity = String(1 - progress * 0.85);
      });
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
}

// ===== 鼠标 3D 倾斜 =====
// Hero 照片跟随鼠标 3D 倾斜，增加交互生命感
function initTilt3D() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return; // 触屏设备跳过

  const heroWrapper = document.querySelector('.hero-photo-wrapper');
  if (!heroWrapper) return;
  const img = heroWrapper.querySelector('img');
  if (!img) return;

  heroWrapper.addEventListener('mousemove', (e) => {
    const rect = heroWrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    img.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  });

  heroWrapper.addEventListener('mouseleave', () => {
    img.style.transform = '';
  });
}

// ===== 通用卡片 3D 倾斜 + 光泽跟随 =====
// 为项目卡片和相册卡片绑定 mousemove 3D 倾斜，光泽高光跟随光标位置
// 用 dataset.tiltBound 防止重复绑定，支持动态加载后重复调用
function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.project-card, .gallery-item').forEach(card => {
    if (card.dataset.tiltBound === '1') return;
    card.dataset.tiltBound = '1';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // 光泽位置（CSS 变量驱动 ::after 径向高光）
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');

      // 3D 倾斜 + 上浮
      const maxTilt = card.classList.contains('gallery-item') ? 5 : 8;
      card.classList.add('tilting');
      card.style.transform = `perspective(800px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilting');
      card.style.transform = '';
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
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
  // 仅桌面端执行（移动端由 CSS animation navItemFadeIn 处理，避免 inline 样式冲突）
  if (window.matchMedia('(min-width: 641px)').matches) {
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
}

// ===== Lenis 平滑滚动 =====
// CDN 引入 Lenis，为全站添加惯性丝滑滚动
function initLenis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  // 与 requestAnimationFrame 同步
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 回到顶部按钮使用 Lenis 滚动
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    backBtn.addEventListener('click', () => lenis.scrollTo(0, { duration: 1.2 }));
  }

  // 锚点链接使用 Lenis 滚动
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.2 });
      }
    });
  });

  // 暴露到全局，供 View Transitions 重初始化
  window._lenis = lenis;
}

// ===== View Transitions 页面转场 =====
// 为导航链接添加跨页面淡入淡出转场（浏览器原生 API，零依赖）
function initViewTransitions() {
  if (!document.startViewTransition) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // 仅处理同源、非锚点、非新窗口链接
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
    if (link.target === '_blank') return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      // 触发转场
      document.startViewTransition(() => {
        window.location.href = href;
      });
    });
  });
}

// ===== 项目图 clip-path 揭示 =====
// 缩略图随滚动入视口时从遮罩中"揭开"，杂志编辑感
function initClipReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const targets = document.querySelectorAll('.project-thumb img, .gallery-image-wrapper img');
  if (targets.length === 0) return;

  targets.forEach(img => {
    if (img.dataset.clipReveal === '1') return;
    img.dataset.clipReveal = '1';
    img.style.clipPath = 'inset(100% 0 0 0)';
    img.style.transition = 'clip-path 1s var(--ease-out)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.clipPath = 'inset(0 0 0 0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(img => observer.observe(img));
}

// ===== 磁吸链接 =====
// 核心链接/按钮轻微跟随光标偏移，精密交互感
function initMagneticLinks() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const selectors = '.project-link, .lightbox-nav, .lightbox-close';
  document.querySelectorAll(selectors).forEach(el => {
    if (el.dataset.magnetic === '1') return;
    el.dataset.magnetic = '1';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ===== 骨架屏加载占位 =====
// 数据加载区域在 fetch 完成前显示微光闪烁占位
function initSkeletonLoading() {
  // 为动态加载容器添加骨架屏
  const containers = [
    { selector: '#projects-container', count: 3, template: 'project' },
    { selector: '#gallery-grid', count: 6, template: 'gallery' },
  ];

  containers.forEach(({ selector, count, template }) => {
    const container = document.querySelector(selector);
    if (!container) return;
    if (container.children.length > 0) return;

    let html = '';
    for (let i = 0; i < count; i++) {
      if (template === 'project') {
        html += `<div class="skeleton-card"><div class="skeleton-line skeleton-w60"></div><div class="skeleton-line skeleton-w90"></div><div class="skeleton-line skeleton-w40"></div></div>`;
      } else {
        html += `<div class="skeleton-gallery"><div class="skeleton-image"></div><div class="skeleton-line skeleton-w60"></div></div>`;
      }
    }
    container.innerHTML = html;
  });
}

// ===== 页面加载后自动初始化 =====
document.addEventListener('DOMContentLoaded', function() {
  initLenis();
  initNavToggle();
  initGlobalNav();
  initSkeletonLoading();
  initScrollReveal();
  initSectionTitleCharAnim();
  initBackToTop();
  initScrollSpy();
  initScrollParallax();
  initTilt3D();
  initViewTransitions();
  initClipReveal();
  initMagneticLinks();
});
