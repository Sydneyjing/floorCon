import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    Floor,
    FloorFormData,
    FloorImage,
    FloorImageFormData,
    Channel,
    CustomerSegment,
    PageConfig,
} from '../types';
import {
    generateId,
    getCurrentTimeString,
    reorderItems,
    sortByPriority,
    sortByOrder,
} from '../utils/dataTransform';
import dayjs from 'dayjs';

interface FloorState {
    // 页面配置
    pageConfigs: PageConfig[];

    // 获取指定渠道的页面配置
    getPageConfig: (channel: Channel) => PageConfig | undefined;

    // 获取指定渠道的楼层列表
    getFloors: (channel: Channel) => Floor[];

    // 根据客群筛选楼层
    getFloorsBySegment: (channel: Channel, segment: CustomerSegment) => Floor[];

    // 添加楼层
    addFloor: (channel: Channel, data: FloorFormData) => void;

    // 更新楼层
    updateFloor: (channel: Channel, floorId: string, data: FloorFormData) => void;

    // 删除楼层
    deleteFloor: (channel: Channel, floorId: string) => void;

    // 复制楼层
    duplicateFloor: (channel: Channel, floorId: string) => void;

    // 重新排序楼层
    reorderFloors: (channel: Channel, floorIds: string[]) => void;

    // 添加图片到楼层
    addImageToFloor: (
        channel: Channel,
        floorId: string,
        imageData: FloorImageFormData
    ) => void;

    // 更新楼层中的图片
    updateFloorImage: (
        channel: Channel,
        floorId: string,
        imageId: string,
        imageData: FloorImageFormData
    ) => void;

    // 删除楼层中的图片
    deleteFloorImage: (channel: Channel, floorId: string, imageId: string) => void;

    // 重新排序楼层中的图片
    reorderFloorImages: (channel: Channel, floorId: string, imageIds: string[]) => void;

    // 根据 ID 获取楼层
    getFloorById: (channel: Channel, floorId: string) => Floor | undefined;
}

// 创建初始页面配置
const createInitialPageConfig = (channel: Channel): PageConfig => ({
    id: generateId(),
    channel,
    pageName: channel === 'mobile' ? '手机银行首页' : '网上银行首页',
    floors: [
        {
            id: generateId(),
            name: channel === 'mobile' ? '春节大促' : '理财产品推荐',
            type: 'banner',
            images: [
                {
                    id: generateId(),
                    url: `https://via.placeholder.com/${channel === 'mobile' ? '800x400' : '1200x400'}?text=${channel === 'mobile' ? 'Mobile+Banner' : 'Web+Banner'}`,
                    linkUrl: 'https://example.com/promotion',
                    alt: '促销活动',
                    order: 1,
                },
            ],
            customerSegments: ['all'],
            priority: 1,
            startTime: getCurrentTimeString(),
            endTime: dayjs().add(30, 'day').format('YYYY-MM-DD HH:mm:ss'),
            status: 'active',
            createdAt: getCurrentTimeString(),
            updatedAt: getCurrentTimeString(),
        },
    ],
    createdAt: getCurrentTimeString(),
    updatedAt: getCurrentTimeString(),
});

export const useFloorStore = create<FloorState>()(
    persist(
        (set, get) => ({
            pageConfigs: [
                createInitialPageConfig('mobile'),
                createInitialPageConfig('web'),
            ],

            getPageConfig: (channel) => {
                return get().pageConfigs.find((config) => config.channel === channel);
            },

            getFloors: (channel) => {
                const config = get().getPageConfig(channel);
                return config ? sortByPriority(config.floors) : [];
            },

            getFloorsBySegment: (channel, segment) => {
                const floors = get().getFloors(channel);
                if (segment === 'all') {
                    return floors;
                }
                return floors.filter((floor) =>
                    floor.customerSegments.includes(segment) ||
                    floor.customerSegments.includes('all')
                );
            },

            addFloor: (channel, data) => {
                const newFloor: Floor = {
                    id: generateId(),
                    name: data.name,
                    type: data.type,
                    images: [],
                    customerSegments: data.customerSegments,
                    priority: get().getFloors(channel).length + 1,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    status: data.status,
                    createdAt: getCurrentTimeString(),
                    updatedAt: getCurrentTimeString(),
                };

                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: [...config.floors, newFloor],
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            updateFloor: (channel, floorId, data) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: config.floors.map((floor) =>
                                    floor.id === floorId
                                        ? {
                                            ...floor,
                                            name: data.name,
                                            type: data.type,
                                            customerSegments: data.customerSegments,
                                            startTime: data.startTime,
                                            endTime: data.endTime,
                                            status: data.status,
                                            updatedAt: getCurrentTimeString(),
                                        }
                                        : floor
                                ),
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            deleteFloor: (channel, floorId) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: config.floors.filter((floor) => floor.id !== floorId),
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            duplicateFloor: (channel, floorId) => {
                const floor = get().getFloorById(channel, floorId);
                if (!floor) return;

                const duplicatedFloor: Floor = {
                    ...floor,
                    id: generateId(),
                    name: `${floor.name} (副本)`,
                    images: floor.images.map((img) => ({
                        ...img,
                        id: generateId(),
                    })),
                    priority: get().getFloors(channel).length + 1,
                    createdAt: getCurrentTimeString(),
                    updatedAt: getCurrentTimeString(),
                };

                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: [...config.floors, duplicatedFloor],
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            reorderFloors: (channel, floorIds) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) => {
                        if (config.channel !== channel) return config;

                        const floorsMap = new Map(config.floors.map((f) => [f.id, f]));
                        const reorderedFloors = floorIds
                            .map((id) => floorsMap.get(id))
                            .filter((f): f is Floor => f !== undefined)
                            .map((floor, index) => ({
                                ...floor,
                                priority: index + 1,
                                updatedAt: getCurrentTimeString(),
                            }));

                        return {
                            ...config,
                            floors: reorderedFloors,
                            updatedAt: getCurrentTimeString(),
                        };
                    }),
                }));
            },

            addImageToFloor: (channel, floorId, imageData) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: config.floors.map((floor) => {
                                    if (floor.id !== floorId) return floor;

                                    const newImage: FloorImage = {
                                        id: generateId(),
                                        url: imageData.url,
                                        linkUrl: imageData.linkUrl,
                                        alt: imageData.alt,
                                        order: floor.images.length + 1,
                                    };

                                    return {
                                        ...floor,
                                        images: [...floor.images, newImage],
                                        updatedAt: getCurrentTimeString(),
                                    };
                                }),
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            updateFloorImage: (channel, floorId, imageId, imageData) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: config.floors.map((floor) => {
                                    if (floor.id !== floorId) return floor;

                                    return {
                                        ...floor,
                                        images: floor.images.map((img) =>
                                            img.id === imageId
                                                ? {
                                                    ...img,
                                                    url: imageData.url,
                                                    linkUrl: imageData.linkUrl,
                                                    alt: imageData.alt,
                                                }
                                                : img
                                        ),
                                        updatedAt: getCurrentTimeString(),
                                    };
                                }),
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            deleteFloorImage: (channel, floorId, imageId) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: config.floors.map((floor) => {
                                    if (floor.id !== floorId) return floor;

                                    const updatedImages = floor.images.filter(
                                        (img) => img.id !== imageId
                                    );

                                    return {
                                        ...floor,
                                        images: reorderItems(updatedImages),
                                        updatedAt: getCurrentTimeString(),
                                    };
                                }),
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            reorderFloorImages: (channel, floorId, imageIds) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) => {
                        if (config.channel !== channel) return config;

                        return {
                            ...config,
                            floors: config.floors.map((floor) => {
                                if (floor.id !== floorId) return floor;

                                const imagesMap = new Map(floor.images.map((img) => [img.id, img]));
                                const reorderedImages = imageIds
                                    .map((id) => imagesMap.get(id))
                                    .filter((img): img is FloorImage => img !== undefined);

                                return {
                                    ...floor,
                                    images: reorderItems(reorderedImages),
                                    updatedAt: getCurrentTimeString(),
                                };
                            }),
                            updatedAt: getCurrentTimeString(),
                        };
                    }),
                }));
            },

            getFloorById: (channel, floorId) => {
                const config = get().getPageConfig(channel);
                return config?.floors.find((floor) => floor.id === floorId);
            },
        }),
        {
            name: 'floor-storage',
        }
    )
);
