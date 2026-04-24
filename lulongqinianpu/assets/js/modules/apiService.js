/**
 * API 服务模块 - 前后端分离的数据接口
 */

class ApiService {
    constructor() {
        this.baseURL = this._detectBackendURL();
        this.timeout = 10000; // 10秒超时
        console.log(`[ApiService] 使用后端地址: ${this.baseURL}`);
    }

    /**
     * 自动检测后端地址
     */
    _detectBackendURL() {
        // 开发环境
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:8001';
        }
        // 生产环境 - 假设API在同域名下
        return '';
    }

    /**
     * 发送请求
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('请求超时，请检查网络连接');
            }
            
            throw error;
        }
    }

    /**
     * 获取弟子记录列表
     */
    async getDisciples(params = {}) {
        const queryParams = new URLSearchParams();
        if (params.category) queryParams.append('category', params.category);
        if (params.type) queryParams.append('type', params.type);
        if (params.search) queryParams.append('search', params.search);
        
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return this.request(`/api/disciples${query}`);
    }

    /**
     * 根据姓名获取弟子详情
     */
    async getDiscipleByName(name) {
        return this.request(`/api/disciples/${encodeURIComponent(name)}`);
    }

    /**
     * 获取年谱数据
     */
    async getChronicle() {
        return this.request('/api/chronicle');
    }

    /**
     * 获取网络图数据
     */
    async getNetwork() {
        return this.request('/api/network');
    }

    /**
     * 获取三余堂数据
     */
    async getSanyutang() {
        return this.request('/api/sanyutang');
    }

    /**
     * 获取统计数据
     */
    async getStatistics() {
        return this.request('/api/statistics');
    }

    /**
     * 健康检查
     */
    async healthCheck() {
        return this.request('/api/health');
    }

    /**
     * 检查后端是否可用
     */
    async isBackendAvailable() {
        try {
            await this.healthCheck();
            return true;
        } catch (error) {
            console.log('[ApiService] 后端服务不可用:', error.message);
            return false;
        }
    }
}

// 创建全局实例
const apiService = new ApiService();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiService, apiService };
}
