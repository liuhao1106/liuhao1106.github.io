/**
 * 全局 Markdown 渲染模块
 * 为网站提供 Markdown 解析和渲染功能
 */

// Markdown 渲染器配置
const MarkdownRenderer = {
  // 是否已初始化
  initialized: false,
  
  // 默认配置
  options: {
    breaks: true,        // 支持换行
    gfm: true,          // GitHub Flavored Markdown
    headerIds: true,    // 为标题添加 id
    mangle: false,      // 不转义内联 HTML
    sanitize: false,    // 不清理 HTML（注意：生产环境需要 XSS 防护）
    smartLists: true,   // 智能列表
    smartypants: true,  // 智能标点
    xhtml: false        // 不使用 XHTML
  },

  /**
   * 初始化 Markdown 渲染器
   * 动态加载 marked.js 库
   */
  init() {
    if (this.initialized) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      // 检查是否已加载 marked
      if (typeof marked !== 'undefined') {
        this._configureMarked();
        this.initialized = true;
        resolve();
        return;
      }
      
      // 动态加载 marked.js
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
      script.onload = () => {
        this._configureMarked();
        this.initialized = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load marked.js'));
      document.head.appendChild(script);
    });
  },

  /**
   * 配置 marked
   * @private
   */
  _configureMarked() {
    if (typeof marked !== 'undefined') {
      marked.setOptions(this.options);
    }
  },

  /**
   * 渲染 Markdown 文本为 HTML
   * @param {string} markdown - Markdown 文本
   * @returns {string} HTML 字符串
   */
  render(markdown) {
    if (!this.initialized) {
      console.warn('MarkdownRenderer not initialized. Call init() first.');
      return markdown;
    }
    
    if (typeof marked === 'undefined') {
      console.error('marked.js is not loaded');
      return markdown;
    }
    
    return marked.parse(markdown);
  },

  /**
   * 渲染指定元素内的 Markdown 内容
   * @param {string|Element} selector - CSS 选择器或 DOM 元素
   * @param {Object} options - 渲染选项
   * @param {boolean} options.replace - 是否替换原内容（默认 true）
   * @param {Function} options.callback - 渲染完成后的回调函数
   */
  async renderElement(selector, options = {}) {
    await this.init();
    
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;
    
    if (!element) {
      console.warn('Element not found:', selector);
      return;
    }
    
    const markdown = element.textContent || element.innerText || '';
    const html = this.render(markdown);
    
    if (options.replace !== false) {
      element.innerHTML = html;
    }
    
    // 应用代码高亮
    this.highlightCode(element);
    
    if (typeof options.callback === 'function') {
      options.callback(element);
    }
    
    return element;
  },

  /**
   * 渲染所有带有 data-markdown 属性的元素
   */
  async renderAll() {
    await this.init();
    
    const elements = document.querySelectorAll('[data-markdown]');
    const promises = Array.from(elements).map(el => this.renderElement(el));
    
    return Promise.all(promises);
  },

  /**
   * 从 URL 加载 Markdown 文件并渲染
   * @param {string} url - Markdown 文件 URL
   * @param {string|Element} target - 目标元素选择器或元素
   * @param {Object} options - 选项
   */
  async loadAndRender(url, target, options = {}) {
    try {
      await this.init();
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.status}`);
      }
      
      const markdown = await response.text();
      const html = this.render(markdown);
      
      const element = typeof target === 'string' 
        ? document.querySelector(target) 
        : target;
      
      if (element) {
        element.innerHTML = html;
        this.highlightCode(element);
        
        if (typeof options.callback === 'function') {
          options.callback(element);
        }
      }
      
      return html;
    } catch (error) {
      console.error('Error loading markdown:', error);
      throw error;
    }
  },

  /**
   * 代码高亮
   * @param {Element} container - 容器元素
   */
  highlightCode(container) {
    // 检查是否已加载 highlight.js
    if (typeof hljs !== 'undefined') {
      container.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });
    }
  },

  /**
   * 加载 highlight.js（用于代码高亮）
   * @param {string} theme - 主题名称，默认为 github
   */
  loadHighlight(theme = 'github') {
    return new Promise((resolve, reject) => {
      // 检查是否已加载
      if (typeof hljs !== 'undefined') {
        resolve();
        return;
      }
      
      // 加载 CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css`;
      document.head.appendChild(link);
      
      // 加载 JS
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
};

// 自动初始化（如果页面中有 data-markdown 元素）
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-markdown]')) {
    MarkdownRenderer.renderAll();
  }
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarkdownRenderer;
}
