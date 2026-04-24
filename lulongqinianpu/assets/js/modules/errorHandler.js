/**
 * 错误处理模块 - 提供统一的错误处理和用户提示功能
 */

class ErrorHandler {
    constructor() {
        this.errorContainer = null;
        this.init();
    }

    /**
     * 初始化错误处理容器
     */
    init() {
        // 创建错误提示容器
        this.errorContainer = document.createElement('div');
        this.errorContainer.id = 'error-container';
        this.errorContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            font-family: 'Noto Sans SC', sans-serif;
        `;
        document.body.appendChild(this.errorContainer);

        // 监听全局错误
        window.addEventListener('error', (e) => {
            this.handleError({
                type: 'RUNTIME_ERROR',
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                userMessage: '页面运行出错，请刷新页面重试'
            });
        });

        // 监听未处理的Promise错误
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError({
                type: 'PROMISE_ERROR',
                message: e.reason?.message || '未知错误',
                userMessage: '异步操作失败，请检查网络连接'
            });
        });
    }

    /**
     * 处理错误
     * @param {Object} errorInfo - 错误信息
     */
    handleError(errorInfo) {
        console.error('[ErrorHandler]', errorInfo);
        
        const { type, userMessage, originalError } = errorInfo;
        
        // 显示用户友好的错误提示
        this.showErrorToast(userMessage || '发生未知错误');
        
        // 可以在这里添加错误上报逻辑
        this.reportError(errorInfo);
    }

    /**
     * 显示错误提示
     */
    showErrorToast(message, duration = 5000) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            background: linear-gradient(145deg, #fff5f5 0%, #ffe0e0 100%);
            border: 1px solid #ffcdd2;
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 10px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideInRight 0.3s ease;
            border-left: 4px solid #c41e3a;
        `;
        
        toast.innerHTML = `
            <span style="font-size: 20px;">⚠️</span>
            <div style="flex: 1;">
                <div style="font-weight: 500; color: #c41e3a; margin-bottom: 4px;">加载失败</div>
                <div style="font-size: 14px; color: #666;">${message}</div>
            </div>
            <button style="
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #999;
                padding: 4px;
            " onclick="this.parentElement.remove()">×</button>
        `;
        
        this.errorContainer.appendChild(toast);
        
        // 自动移除
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        }
    }

    /**
     * 显示成功提示
     */
    showSuccessToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            background: linear-gradient(145deg, #f5fff5 0%, #e0ffe0 100%);
            border: 1px solid #c8e6c9;
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 10px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: slideInRight 0.3s ease;
            border-left: 4px solid #4a6741;
        `;
        
        toast.innerHTML = `
            <span style="font-size: 20px;">✅</span>
            <div style="flex: 1;">
                <div style="font-weight: 500; color: #4a6741; margin-bottom: 4px;">成功</div>
                <div style="font-size: 14px; color: #666;">${message}</div>
            </div>
        `;
        
        this.errorContainer.appendChild(toast);
        
        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        }
    }

    /**
     * 显示加载状态
     */
    showLoading(message = '加载中...') {
        const loading = document.createElement('div');
        loading.id = 'global-loading';
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(245, 240, 232, 0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9998;
            backdrop-filter: blur(4px);
        `;
        
        loading.innerHTML = `
            <div style="
                width: 50px;
                height: 50px;
                border: 3px solid var(--paper-dark);
                border-top-color: var(--cinnabar);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            "></div>
            <div style="
                font-family: 'Noto Serif SC', serif;
                color: var(--ink-black);
                font-size: 16px;
                letter-spacing: 2px;
            ">${message}</div>
        `;
        
        document.body.appendChild(loading);
        return loading;
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        const loading = document.getElementById('global-loading');
        if (loading) {
            loading.style.opacity = '0';
            loading.style.transition = 'opacity 0.3s ease';
            setTimeout(() => loading.remove(), 300);
        }
    }

    /**
     * 错误上报（可以接入第三方服务）
     */
    reportError(errorInfo) {
        // 这里可以接入 Sentry、LogRocket 等错误监控服务
        // 目前仅记录到控制台
        console.log('[Error Report]', {
            ...errorInfo,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
    }
}

// 创建全局实例
const errorHandler = new ErrorHandler();

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ErrorHandler, errorHandler };
}
