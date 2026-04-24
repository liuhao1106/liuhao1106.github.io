/**
 * 数据服务模块 - 提供数据加载、缓存和错误处理功能
 */

class DataService {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5分钟缓存
        this.loadingPromises = new Map();
    }

    /**
     * 加载JSON数据
     * @param {string} url - 数据URL
     * @param {Object} options - 配置选项
     * @returns {Promise<any>} 解析后的数据
     */
    async loadData(url, options = {}) {
        const cacheKey = `${url}_${JSON.stringify(options)}`;
        
        // 检查缓存
        if (this.cache.has(cacheKey)) {
            const { data, timestamp } = this.cache.get(cacheKey);
            if (Date.now() - timestamp < this.cacheExpiry) {
                console.log(`[DataService] 从缓存加载: ${url}`);
                return data;
            }
        }

        // 防止重复请求
        if (this.loadingPromises.has(cacheKey)) {
            return this.loadingPromises.get(cacheKey);
        }

        const promise = this._fetchData(url, options, cacheKey);
        this.loadingPromises.set(cacheKey, promise);

        try {
            const data = await promise;
            return data;
        } finally {
            this.loadingPromises.delete(cacheKey);
        }
    }

    /**
     * 内部获取数据方法
     */
    async _fetchData(url, options, cacheKey) {
        try {
            console.log(`[DataService] 开始加载: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // 更新缓存
            this.cache.set(cacheKey, { 
                data, 
                timestamp: Date.now(),
                url 
            });
            
            console.log(`[DataService] 加载成功: ${url}`);
            return data;
        } catch (error) {
            console.error(`[DataService] 加载失败: ${url}`, error);
            throw this._createError(error, url);
        }
    }

    /**
     * 创建友好的错误信息
     */
    _createError(error, url) {
        const errorInfo = {
            type: 'DATA_LOAD_ERROR',
            url: url,
            originalError: error.message,
            timestamp: new Date().toISOString(),
            userMessage: this._getUserFriendlyMessage(error, url)
        };
        
        return errorInfo;
    }

    /**
     * 获取用户友好的错误信息
     */
    _getUserFriendlyMessage(error, url) {
        if (error.message.includes('404')) {
            return `数据文件未找到: ${url}`;
        } else if (error.message.includes('NetworkError')) {
            return '网络连接失败，请检查网络设置';
        } else if (error.message.includes('JSON')) {
            return '数据格式错误，无法解析';
        } else {
            return `数据加载失败: ${error.message}`;
        }
    }

    /**
     * 清除缓存
     */
    clearCache() {
        this.cache.clear();
        console.log('[DataService] 缓存已清除');
    }

    /**
     * 获取缓存状态
     */
    getCacheStatus() {
        const status = [];
        this.cache.forEach((value, key) => {
            status.push({
                key: key,
                url: value.url,
                age: Date.now() - value.timestamp,
                expired: (Date.now() - value.timestamp) > this.cacheExpiry
            });
        });
        return status;
    }

    /**
     * 预加载数据
     */
    async preloadData(urls) {
        const promises = urls.map(url => this.loadData(url).catch(err => {
            console.warn(`[DataService] 预加载失败: ${url}`, err);
            return null;
        }));
        
        return Promise.all(promises);
    }
}

// 创建全局实例
const dataService = new DataService();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataService, dataService };
}
