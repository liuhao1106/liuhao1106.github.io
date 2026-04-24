/**
 * 陆陇其项目 TypeScript 类型定义
 */

// 弟子记录类型
interface DiscipleRecord {
    name: string;
    styleName: string;
    type: string;
    origin: string;
    category: string;
    content: string;
    source: string;
    additional?: string;
}

// 年谱事件类型
interface ChronicleEvent {
    year: number;
    age: number;
    location: string;
    event: string;
    type: string;
    coords: [number, number]; // [lng, lat]
}

// 内部使用的行迹事件类型
interface LifeTraceEvent {
    year: number;
    age: number;
    loc: string;
    event: string;
    type: string;
    lat: number;
    lng: number;
}

// 网络图节点类型
interface NetworkNode {
    id: string;
    label: string;
    group: 'teacher' | 'family' | 'relative' | 'disciple';
    title?: string;
    shape?: string;
    size?: number;
}

// 网络图边类型
interface NetworkEdge {
    from: string;
    to: string;
    label?: string;
    color?: string;
    dashes?: boolean;
}

// 网络图数据类型
interface NetworkData {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
}

// 统计数据类型
interface Statistics {
    total_disciples: number;
    by_type: Record<string, number>;
    by_origin: Record<string, number>;
}

// API 响应类型
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    count?: number;
    message?: string;
}

// 筛选参数类型
interface FilterParams {
    category?: string;
    type?: string;
    search?: string;
}

// 地图配置类型
interface MapConfig {
    center: [number, number];
    zoom: number;
    minZoom?: number;
    maxZoom?: number;
}

// 时期配置类型
interface EraConfig {
    name: string;
    start: number;
    end: number;
    color: string;
}

// 行迹图颜色映射类型
interface ColorMap {
    [key: string]: string;
}

// 错误信息类型
interface ErrorInfo {
    type: string;
    message: string;
    userMessage: string;
    url?: string;
    timestamp?: string;
}

// 缓存项类型
interface CacheItem<T> {
    data: T;
    timestamp: number;
    url: string;
}

// 数据服务配置类型
interface DataServiceConfig {
    cacheExpiry?: number;
    baseURL?: string;
    timeout?: number;
}

// 声明全局变量
declare global {
    interface Window {
        dataService: any;
        errorHandler: any;
        loadingManager: any;
        apiService: any;
        _highlightTimer: ReturnType<typeof setTimeout>;
        _labelTimer: ReturnType<typeof setTimeout>;
    }
}

export {
    DiscipleRecord,
    ChronicleEvent,
    LifeTraceEvent,
    NetworkNode,
    NetworkEdge,
    NetworkData,
    Statistics,
    ApiResponse,
    FilterParams,
    MapConfig,
    EraConfig,
    ColorMap,
    ErrorInfo,
    CacheItem,
    DataServiceConfig,
};
