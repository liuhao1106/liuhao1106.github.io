/**
 * 交互管理模块 - URL路由、键盘快捷键、状态管理
 */

class InteractionManager {
    constructor() {
        this.currentSection = '';
        this.isAutoPlay = false;
        this.init();
    }

    /**
     * 初始化交互功能
     */
    init() {
        this.initURLRouting();
        this.initKeyboardShortcuts();
        this.initScrollSpy();
        this.initTouchGestures();
    }

    // ==================== URL 路由 ====================
    
    /**
     * 初始化 URL 路由
     */
    initURLRouting() {
        // 监听 hash 变化
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });

        // 初始处理
        if (window.location.hash) {
            setTimeout(() => this.handleHashChange(), 500);
        }

        // 更新 URL 当用户滚动到不同章节
        this.observeSections();
    }

    /**
     * 处理 hash 变化
     */
    handleHashChange() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            this.scrollToSection(hash);
        }
    }

    /**
     * 滚动到指定章节
     */
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // 头部偏移
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // 高亮章节标题
            this.highlightSection(sectionId);
        }
    }

    /**
     * 高亮章节
     */
    highlightSection(sectionId) {
        document.querySelectorAll('.section-title').forEach(title => {
            title.style.transition = 'color 0.3s ease';
            if (title.closest(`#${sectionId}`)) {
                title.style.color = 'var(--cinnabar)';
                setTimeout(() => {
                    title.style.color = '';
                }, 2000);
            }
        });
    }

    /**
     * 观察章节进入视口
     */
    observeSections() {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    if (sectionId !== this.currentSection) {
                        this.currentSection = sectionId;
                        this.updateURL(sectionId);
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    /**
     * 更新 URL（不触发滚动）
     */
    updateURL(sectionId) {
        const newHash = `#${sectionId}`;
        if (window.location.hash !== newHash) {
            history.replaceState(null, null, newHash);
        }
    }

    /**
     * 获取分享链接
     */
    getShareLink(sectionId = null) {
        const baseUrl = window.location.origin + window.location.pathname;
        const hash = sectionId || this.currentSection;
        return hash ? `${baseUrl}#${hash}` : baseUrl;
    }

    // ==================== 键盘快捷键 ====================
    
    /**
     * 初始化键盘快捷键
     */
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 忽略输入框中的按键
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            const key = e.key.toLowerCase();
            const ctrl = e.ctrlKey || e.metaKey;

            // 导航快捷键
            if (key === 'arrowdown' || key === 'j') {
                e.preventDefault();
                this.navigateSection('next');
            } else if (key === 'arrowup' || key === 'k') {
                e.preventDefault();
                this.navigateSection('prev');
            }

            // 功能快捷键
            if (ctrl) {
                switch (key) {
                    case '1':
                        e.preventDefault();
                        this.scrollToSection('life-trace-section');
                        break;
                    case '2':
                        e.preventDefault();
                        this.scrollToSection('map-section');
                        break;
                    case '3':
                        e.preventDefault();
                        this.scrollToSection('network-section');
                        break;
                    case '4':
                        e.preventDefault();
                        this.scrollToSection('chronicle-section');
                        break;
                    case 'f':
                        e.preventDefault();
                        this.toggleFullscreen();
                        break;
                }
            }

            // 空格键暂停/播放
            if (key === ' ' && this.isAutoPlay) {
                e.preventDefault();
                this.toggleAutoPlay();
            }

            // ESC 退出全屏
            if (key === 'escape') {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            }
        });

        // 显示快捷键提示
        this.showShortcutHint();
    }

    /**
     * 导航到上一个/下一个章节
     */
    navigateSection(direction) {
        const sections = Array.from(document.querySelectorAll('section[id]'));
        const currentIndex = sections.findIndex(s => s.id === this.currentSection);
        
        let targetIndex;
        if (direction === 'next') {
            targetIndex = Math.min(currentIndex + 1, sections.length - 1);
        } else {
            targetIndex = Math.max(currentIndex - 1, 0);
        }

        if (targetIndex !== currentIndex) {
            this.scrollToSection(sections[targetIndex].id);
        }
    }

    /**
     * 切换全屏
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('全屏模式不支持:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    /**
     * 显示快捷键提示
     */
    showShortcutHint() {
        const hint = document.createElement('div');
        hint.id = 'shortcut-hint';
        hint.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(245, 240, 232, 0.95);
            border: 1px solid var(--paper-dark);
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 12px;
            color: var(--ink-gray);
            z-index: 9999;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            font-family: 'Noto Sans SC', sans-serif;
            line-height: 1.8;
            max-width: 250px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        `;
        
        hint.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 8px; color: var(--ink-black);">
                ⌨️ 键盘快捷键
            </div>
            <div><kbd style="background: var(--paper-dark); padding: 2px 6px; border-radius: 3px; font-family: monospace;">↑/↓</kbd> 切换章节</div>
            <div><kbd style="background: var(--paper-dark); padding: 2px 6px; border-radius: 3px; font-family: monospace;">Ctrl+1~4</kbd> 跳转章节</div>
            <div><kbd style="background: var(--paper-dark); padding: 2px 6px; border-radius: 3px; font-family: monospace;">Ctrl+F</kbd> 全屏模式</div>
            <div style="margin-top: 8px; font-size: 11px; color: var(--ink-light);">
                按 ? 显示/隐藏此提示
            </div>
        `;
        
        document.body.appendChild(hint);

        // 显示提示（首次访问）
        if (!localStorage.getItem('shortcut-hint-shown')) {
            setTimeout(() => {
                hint.style.opacity = '1';
                hint.style.transform = 'translateY(0)';
            }, 2000);

            setTimeout(() => {
                hint.style.opacity = '0';
                hint.style.transform = 'translateY(10px)';
            }, 8000);

            localStorage.setItem('shortcut-hint-shown', 'true');
        }

        // ? 键切换显示
        document.addEventListener('keydown', (e) => {
            if (e.key === '?' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                const isVisible = hint.style.opacity === '1';
                hint.style.opacity = isVisible ? '0' : '1';
                hint.style.transform = isVisible ? 'translateY(10px)' : 'translateY(0)';
            }
        });
    }

    // ==================== 滚动监听 ====================
    
    /**
     * 初始化滚动监听
     */
    initScrollSpy() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * 处理滚动事件
     */
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;

        // 更新进度条（如果有）
        this.updateProgressBar(scrollPercent);

        // 显示/隐藏返回顶部按钮
        this.toggleBackToTop(scrollTop > 500);
    }

    /**
     * 更新进度条
     */
    updateProgressBar(percent) {
        let progressBar = document.getElementById('scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, var(--cinnabar), var(--accent-gold));
                z-index: 10000;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
        }
        progressBar.style.width = `${percent * 100}%`;
    }

    /**
     * 切换返回顶部按钮
     */
    toggleBackToTop(show) {
        let btn = document.getElementById('back-to-top');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'back-to-top';
            btn.innerHTML = '↑';
            btn.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: var(--accent-teal);
                color: white;
                border: none;
                font-size: 20px;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 16px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                opacity: 0;
                transform: translateY(20px);
                font-family: 'Noto Serif SC', serif;
            `;
            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            document.body.appendChild(btn);
        }

        btn.style.opacity = show ? '1' : '0';
        btn.style.transform = show ? 'translateY(0)' : 'translateY(20px)';
    }

    // ==================== 触摸手势 ====================
    
    /**
     * 初始化触摸手势
     */
    initTouchGestures() {
        let startY = 0;
        let startX = 0;

        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            const endX = e.changedTouches[0].clientX;
            const deltaY = startY - endY;
            const deltaX = startX - endX;

            // 垂直滑动切换章节（滑动距离大于 100px）
            if (Math.abs(deltaY) > 100 && Math.abs(deltaX) < 50) {
                if (deltaY > 0) {
                    this.navigateSection('next');
                } else {
                    this.navigateSection('prev');
                }
            }
        }, { passive: true });
    }

    // ==================== 状态管理 ====================
    
    /**
     * 保存当前状态到 localStorage
     */
    saveState() {
        const state = {
            section: this.currentSection,
            timestamp: Date.now(),
        };
        localStorage.setItem('lulongqi-state', JSON.stringify(state));
    }

    /**
     * 从 localStorage 恢复状态
     */
    restoreState() {
        try {
            const saved = localStorage.getItem('lulongqi-state');
            if (saved) {
                const state = JSON.parse(saved);
                // 只恢复 1 小时内的状态
                if (Date.now() - state.timestamp < 3600000) {
                    this.scrollToSection(state.section);
                }
            }
        } catch (e) {
            console.log('状态恢复失败:', e);
        }
    }

    /**
     * 切换自动播放
     */
    toggleAutoPlay() {
        this.isAutoPlay = !this.isAutoPlay;
        // 可以触发外部自动播放逻辑
        console.log('自动播放:', this.isAutoPlay ? '开启' : '关闭');
    }
}

// 创建全局实例
const interactionManager = new InteractionManager();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InteractionManager, interactionManager };
}
