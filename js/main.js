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

// ===== 页面加载后自动初始化导航 =====
document.addEventListener('DOMContentLoaded', initNavToggle);
