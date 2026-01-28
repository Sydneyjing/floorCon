// ==================== 基础类型 ====================

// 渠道类型
export type Channel = 'mobile' | 'web';

// 客群类型
export type CustomerSegment = 'all' | 'vip' | 'regular' | 'new' | 'custom';

// 楼层类型
export type FloorType = 'banner' | 'product' | 'ad' | 'promotion';

// 状态类型
export type Status = 'active' | 'inactive';

// 跳转类型
export type ActionType = 'none' | 'h5' | 'native_schema' | 'program';

// ==================== 配置相关 ====================

// 跳转配置
export interface ActionConfig {
    type: ActionType;
    targetUrl?: string; // 当 type != 'none' 时必填
    params?: Record<string, string>; // 埋点或透传参数
}

// 投放策略配置
export interface StrategyConfig {
    priority: number; // 排序优先级
    timeRange: [string, string] | null; // ISO 字符串 [开始, 结束]
    targetTags: string[]; // 目标客群标签 ['vip', 'new_user']
}

// 埋点配置
export interface TrackingConfig {
    clickId?: string; // 点击监测ID
    exposureId?: string; // 曝光监测ID
}

// 模拟环境配置
export interface SimulationContext {
    currentTime: string; // 模拟当前时间
    userTags: string[]; // 模拟用户标签
}

// ==================== 图片相关 ====================

// 楼层图片项
export interface FloorImage {
    id: string;
    url: string;
    alt: string;
    order: number;
    // 跳转配置
    action: ActionConfig;
    // 投放策略
    strategy: StrategyConfig;
    // 埋点配置
    tracking?: TrackingConfig;
}

// 图片表单数据
export interface FloorImageFormData {
    url: string;
    alt: string;
    action: ActionConfig;
    strategy: StrategyConfig;
    tracking?: TrackingConfig;
}

// ==================== 楼层相关 ====================

// 楼层配置
export interface Floor {
    id: string;
    name: string;
    type: FloorType;
    images: FloorImage[];
    customerSegments: CustomerSegment[];
    priority: number;
    startTime: string;
    endTime: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}

// 楼层表单数据
export interface FloorFormData {
    name: string;
    type: FloorType;
    customerSegments: CustomerSegment[];
    startTime: string;
    endTime: string;
    status: Status;
}

// ==================== 页面配置相关 ====================

// 页面配置
export interface PageConfig {
    id: string;
    channel: Channel;
    pageName: string;
    floors: Floor[];
    createdAt: string;
    updatedAt: string;
}

// ==================== 旧版兼容类型 ====================

// 旧版广告楼层（保持向后兼容）
export interface AdFloor {
    id: string;
    channel: Channel;
    title: string;
    imageUrl: string;
    linkUrl: string;
    priority: number;
    startTime: string;
    endTime: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}

// 旧版广告楼层表单数据
export interface AdFloorFormData {
    title: string;
    imageUrl: string;
    linkUrl: string;
    priority: number;
    startTime: string;
    endTime: string;
    status: Status;
}

// ==================== 客群选项 ====================

export interface CustomerSegmentOption {
    value: CustomerSegment;
    label: string;
    color: string;
}

export const CUSTOMER_SEGMENT_OPTIONS: CustomerSegmentOption[] = [
    { value: 'all', label: '全部客户', color: 'blue' },
    { value: 'vip', label: 'VIP客户', color: 'gold' },
    { value: 'regular', label: '普通客户', color: 'green' },
    { value: 'new', label: '新客户', color: 'cyan' },
    { value: 'custom', label: '自定义', color: 'purple' },
];

// ==================== 用户标签选项 ====================

export interface UserTagOption {
    value: string;
    label: string;
    color: string;
}

export const USER_TAG_OPTIONS: UserTagOption[] = [
    { value: 'vip', label: 'VIP客户', color: 'gold' },
    { value: 'new_user', label: '新用户', color: 'cyan' },
    { value: 'regular', label: '普通客户', color: 'green' },
    { value: 'high_value', label: '高价值客户', color: 'red' },
    { value: 'active', label: '活跃用户', color: 'blue' },
];

// ==================== 跳转类型选项 ====================

export interface ActionTypeOption {
    value: ActionType;
    label: string;
    description: string;
}

export const ACTION_TYPE_OPTIONS: ActionTypeOption[] = [
    { value: 'none', label: '无跳转', description: '仅展示,不跳转' },
    { value: 'h5', label: 'H5跳转', description: '跳转到H5页面' },
    { value: 'native_schema', label: 'Native Schema', description: '原生页面跳转' },
    { value: 'program', label: '小程序', description: '跳转到小程序' },
];

// ==================== 楼层类型选项 ====================

export interface FloorTypeOption {
    value: FloorType;
    label: string;
    icon: string;
}

export const FLOOR_TYPE_OPTIONS: FloorTypeOption[] = [
    { value: 'banner', label: '轮播广告', icon: '🎠' },
    { value: 'product', label: '产品推荐', icon: '📦' },
    { value: 'ad', label: '营销广告', icon: '📢' },
    { value: 'promotion', label: '促销活动', icon: '🎉' },
];
