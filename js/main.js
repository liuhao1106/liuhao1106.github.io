/**
 * 课程网站主JavaScript文件
 * 处理数据加载和页面渲染
 */

// 全局课程数据缓存
let coursesData = null;

/**
 * 加载课程数据
 * @returns {Promise<Object>} 课程数据对象
 */
async function loadCoursesData() {
  if (coursesData) {
    return coursesData;
  }

  try {
    console.log('Fetching courses.json...');
    const response = await fetch('data/courses.json');
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error('Failed to load courses data: ' + response.status);
    }
    coursesData = await response.json();
    console.log('Courses data loaded:', coursesData);
    return coursesData;
  } catch (error) {
    console.error('Error loading courses data:', error);
    // 返回默认数据作为后备
    return getDefaultData();
  }
}

/**
 * 获取默认数据（当JSON加载失败时使用）
 */
function getDefaultData() {
  return {
    professor: {
      name: "刘昊",
      title: "同济大学哲学系助理教授",
      homepage: "https://liuhao1106.netlify.app/",
      email: "liuhao1106@tongji.edu.cn"
    },
    courses: []
  };
}

/**
 * 根据ID获取课程数据
 * @param {string} courseId - 课程ID
 * @returns {Object|null} 课程数据对象
 */
async function getCourseById(courseId) {
  const data = await loadCoursesData();
  return data.courses.find(c => c.id === courseId) || null;
}

/**
 * 渲染首页
 * @param {Object} data - 课程数据
 */
function renderHomePage(data) {
  console.log('Rendering homepage with data:', data);
  if (!data.courses) {
    console.log('No courses data found');
    return;
  }
  console.log('Courses count:', data.courses.length);

  // 按分类渲染课程
  const categories = ['undergraduate-major', 'undergraduate-general', 'graduate'];
  
  categories.forEach(category => {
    const grid = document.getElementById(`${category}-grid`);
    if (!grid) return;

    const categoryCourses = data.courses.filter(c => c.category === category);
    
    if (categoryCourses.length === 0) {
      grid.innerHTML = '<p style="color: var(--text-secondary);">暂无课程</p>';
      return;
    }

    grid.innerHTML = categoryCourses.map(course => {
      const isCurrentSemester = course.id === 'philosophy-history-ii' && course.semester === '2026春季学期';
      return `
      <article class="course-card ${isCurrentSemester ? 'current-semester' : ''}">
        <div class="course-header">
          <h3>${course.title}</h3>
          <span class="course-semester ${isCurrentSemester ? 'semester-highlight' : ''}">${course.semester}</span>
        </div>
        <p class="course-desc">${course.shortDesc}</p>
        <div class="course-meta">
          <span class="meta-item">📅 ${course.schedule}</span>
          <span class="meta-item">📝 ${course.credits}</span>
        </div>
        <a href="${course.link}" class="enter-link" ${course.link === '#' ? 'style="opacity: 0.6;"' : ''}>
          ${course.link === '#' ? '即将开设' : '进入课程 →'}
        </a>
      </article>
    `}).join('');
  });
}

/**
 * 渲染课程详情页
 * @param {string} courseId - 课程ID
 */
async function renderCoursePage(courseId) {
  const course = await getCourseById(courseId);
  if (!course) {
    console.error('Course not found:', courseId);
    return;
  }

  // 设置页面标题
  document.title = `${course.title} · 刘昊`;

  // 渲染课程信息
  const infoSection = document.getElementById('course-info');
  if (infoSection) {
    infoSection.innerHTML = `
      <ul class="info-list">
        <li>
          <span class="label">课程名称</span>
          <span class="value">${course.title}</span>
        </li>
        <li>
          <span class="label">课程简介</span>
          <span class="value">${course.fullDesc}</span>
        </li>
        <li>
          <span class="label">课程沿革</span>
          <span class="value">${course.history}</span>
        </li>
        <li>
          <span class="label">考核要求</span>
          <span class="value">${course.assessment}</span>
        </li>
      </ul>
    `;
  }

  // 渲染课程大纲
  const syllabusSection = document.getElementById('course-syllabus');
  if (syllabusSection && course.syllabus) {
    syllabusSection.innerHTML = `
      <table class="syllabus-table">
        <thead>
          <tr>
            <th>周次</th>
            <th>主题</th>
            <th>内容概要</th>
          </tr>
        </thead>
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

  // 渲染讲义列表
  const lecturesSection = document.getElementById('course-lectures');
  if (lecturesSection && course.lectures) {
    lecturesSection.innerHTML = `
      <ul class="lecture-list">
        ${course.lectures.map(lecture => `
          <li class="lecture-item">
            <div class="lecture-header">
              <span class="lecture-title">${lecture.title}</span>
              <span class="lecture-week">第${lecture.week}周</span>
            </div>
            <p class="lecture-desc">${lecture.desc}</p>
            <div class="lecture-links">
              <a href="lectures/${lecture.file}">查看讲义</a>
            </div>
          </li>
        `).join('')}
      </ul>
    `;
  }

  // 渲染参考资源
  const resourcesSection = document.getElementById('course-resources');
  if (resourcesSection && course.resources) {
    resourcesSection.innerHTML = `
      <ul class="resource-list">
        ${course.resources.map(res => `
          <li class="resource-item">
            <div class="resource-title">
              <a href="${res.link}" ${res.link.startsWith('http') ? 'target="_blank"' : ''}>${res.title}</a>
            </div>
            <div class="resource-meta">${res.author} · ${res.type}</div>
          </li>
        `).join('')}
      </ul>
    `;
  }
}

/**
 * 渲染讲义页面
 * @param {string} courseId - 课程ID
 * @param {number} lectureWeek - 讲义周次
 */
async function renderLecturePage(courseId, lectureWeek) {
  const course = await getCourseById(courseId);
  if (!course || !course.lectures) return;

  const lecture = course.lectures.find(l => l.week === lectureWeek);
  if (!lecture) return;

  // 设置页面标题
  document.title = `${lecture.title} · ${course.title}`;

  // 渲染讲义头部
  const header = document.getElementById('lecture-header');
  if (header) {
    header.innerHTML = `
      <h1>${lecture.title}</h1>
      <p class="meta">${course.title} · 第${lecture.week}周</p>
    `;
  }

  // 渲染分页导航
  renderLecturePagination(course, lectureWeek);
}

/**
 * 渲染讲义分页导航
 * @param {Object} course - 课程数据
 * @param {number} currentWeek - 当前周次
 */
function renderLecturePagination(course, currentWeek) {
  const pagination = document.getElementById('lecture-pagination');
  if (!pagination || !course.lectures) return;

  const lectures = course.lectures.sort((a, b) => a.week - b.week);
  const currentIndex = lectures.findIndex(l => l.week === currentWeek);
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
  const nextLecture = currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null;

  pagination.innerHTML = `
    ${prevLecture ? `
      <a href="${prevLecture.file}" class="prev">
        上一讲：${prevLecture.title}
      </a>
    ` : '<span></span>'}
    <a href="../index.html#course-lectures">返回课程主页</a>
    ${nextLecture ? `
      <a href="${nextLecture.file}" class="next">
        下一讲：${nextLecture.title}
      </a>
    ` : '<span></span>'}
  `;
}

/**
 * 从URL获取课程ID
 * @returns {string|null}
 */
function getCourseIdFromUrl() {
  const path = window.location.pathname;
  const match = path.match(/courses\/([^/]+)/);
  return match ? match[1] : null;
}

/**
 * 从URL获取讲义周次
 * @returns {number|null}
 */
function getLectureWeekFromUrl() {
  const path = window.location.pathname;
  const match = path.match(/lecture-(\d+)\.html$/);
  return match ? parseInt(match[1], 10) : null;
}
