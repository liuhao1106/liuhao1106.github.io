/**
 * 加载状态管理模块 - 骨架屏和渐进式加载
 */

class LoadingManager {
    constructor() {
        this.skeletons = new Map();
        this.init();
    }

    /**
     * 初始化骨架屏样式
     */
    init() {
        // 添加骨架屏CSS
        if (!document.getElementById('skeleton-styles')) {
            const style = document.createElement('style');
            style.id = 'skeleton-styles';
            style.textContent = `
                .skeleton {
                    background: linear-gradient(90deg, #f0ebe0 25%, #e8e0d0 50%, #f0ebe0 75%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s infinite;
                    border-radius: 4px;
                }
                
                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                
                .skeleton-text {
                    height: 1em;
                    margin-bottom: 0.5em;
                }
                
                .skeleton-text:last-child {
                    width: 80%;
                }
                
                .skeleton-card {
                    padding: 1.5rem;
                    background: linear-gradient(145deg, #faf8f3 0%, #f0ebe0 100%);
                    border-radius: 2px;
                    border: 1px solid var(--paper-dark);
                    margin-bottom: 1rem;
                }
                
                .skeleton-title {
                    height: 1.5em;
                    width: 60%;
                    margin-bottom: 1em;
                }
                
                .skeleton-content {
                    height: 4em;
                }
                
                .skeleton-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                }
                
                .skeleton-stat-card {
                    padding: 1.75rem 1.5rem;
                    text-align: center;
                    background: linear-gradient(145deg, #faf8f3 0%, #f0ebe0 100%);
                    border-radius: 2px;
                    border: 1px solid var(--paper-dark);
                }
                
                .skeleton-number {
                    height: 3.5rem;
                    width: 50%;
                    margin: 0 auto 0.75rem;
                }
                
                .skeleton-label {
                    height: 1rem;
                    width: 70%;
                    margin: 0 auto;
                }
                
                .skeleton-map {
                    height: 550px;
                    width: 100%;
                    border-radius: 2px;
                }
                
                .skeleton-network {
                    height: 600px;
                    width: 100%;
                    border-radius: 2px;
                }
                
                @media (max-width: 768px) {
                    .skeleton-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .skeleton-map {
                        height: 400px;
                    }
                    
                    .skeleton-network {
                        height: 400px;
                    }
                }
                
                @media (max-width: 480px) {
                    .skeleton-stats {
                        grid-template-columns: 1fr;
                    }
                }
                
                /* 渐进式加载动画 */
                .fade-in {
                    animation: fadeIn 0.5s ease forwards;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .content-placeholder {
                    min-height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--ink-gray);
                    font-family: 'Noto Serif SC', serif;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * 创建统计卡片骨架屏
     */
    createStatsSkeleton(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-stats';
        skeleton.id = `${containerId}-skeleton`;
        
        for (let i = 0; i < 4; i++) {
            skeleton.innerHTML += `
                <div class="skeleton-stat-card">
                    <div class="skeleton skeleton-number"></div>
                    <div class="skeleton skeleton-label"></div>
                </div>
            `;
        }
        
        container.appendChild(skeleton);
        this.skeletons.set(containerId, skeleton);
    }

    /**
     * 创建卡片骨架屏
     */
    createCardSkeleton(containerId, count = 3) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const skeleton = document.createElement('div');
        skeleton.id = `${containerId}-skeleton`;
        
        for (let i = 0; i < count; i++) {
            skeleton.innerHTML += `
                <div class="skeleton-card">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-content"></div>
                </div>
            `;
        }
        
        container.appendChild(skeleton);
        this.skeletons.set(containerId, skeleton);
    }

    /**
     * 创建地图骨架屏
     */
    createMapSkeleton(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton skeleton-map';
        skeleton.id = `${containerId}-skeleton`;
        
        container.appendChild(skeleton);
        this.skeletons.set(containerId, skeleton);
    }

    /**
     * 创建网络图骨架屏
     */
    createNetworkSkeleton(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton skeleton-network';
        skeleton.id = `${containerId}-skeleton`;
        
        container.appendChild(skeleton);
        this.skeletons.set(containerId, skeleton);
    }

    /**
     * 创建年谱卡片骨架屏
     */
    createChronicleSkeleton(containerId, count = 6) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const skeleton = document.createElement('div');
        skeleton.className = 'chronicle-grid';
        skeleton.id = `${containerId}-skeleton`;
        
        for (let i = 0; i < count; i++) {
            skeleton.innerHTML += `
                <div class="chronicle-card">
                    <div class="skeleton" style="height: 1.5em; width: 60%; margin-bottom: 1em;"></div>
                    <div class="skeleton" style="height: 4em; margin-bottom: 0.5em;"></div>
                    <div class="skeleton" style="height: 1em; width: 40%;"></div>
                </div>
            `;
        }
        
        container.appendChild(skeleton);
        this.skeletons.set(containerId, skeleton);
    }

    /**
     * 移除骨架屏并显示内容
     */
    removeSkeleton(containerId) {
        const skeleton = this.skeletons.get(containerId);
        if (skeleton) {
            skeleton.style.opacity = '0';
            skeleton.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                skeleton.remove();
                this.skeletons.delete(containerId);
            }, 300);
        }
    }

    /**
     * 渐进式显示内容
     */
    progressiveReveal(element, delay = 0) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        }
    }

    /**
     * 批量渐进式显示
     */
    progressiveRevealAll(selector, staggerDelay = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            this.progressiveReveal(el, index * staggerDelay);
        });
    }

    /**
     * 显示内容占位符
     */
    showPlaceholder(containerId, message = '暂无数据') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const placeholder = document.createElement('div');
        placeholder.className = 'content-placeholder';
        placeholder.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                <div>${message}</div>
            </div>
        `;
        
        container.appendChild(placeholder);
        return placeholder;
    }

    /**
     * 移除内容占位符
     */
    removePlaceholder(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const placeholder = container.querySelector('.content-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
    }

    /**
     * 清理所有骨架屏
     */
    clearAll() {
        this.skeletons.forEach((skeleton, containerId) => {
            this.removeSkeleton(containerId);
        });
    }
}

// 创建全局实例
const loadingManager = new LoadingManager();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LoadingManager, loadingManager };
}
