// ==================== 基础类型 ====================

// 渠道类型
export type Channel = 'mobile' | 'web';

// 客群类型
export type CustomerSegment = 'all' | 'vip' | 'regular' | 'new' | 'custom';

// 楼层类型
export type FloorType = 'banner' | 'product' | 'ad' | 'promotion';

// 状态类型
export type Status = 'active' | 'inactive';

// ==================== 图片相关 ====================

// 楼层图片项
export interface FloorImage {
    id: string;
    url: string;
    linkUrl: string;
    alt: string;
    order: number;
}

// 图片表单数据
export interface FloorImageFormData {
    url: string;
    linkUrl: string;
    alt: string;
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
