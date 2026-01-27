import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Button,
    Space,
    Input,
    Image,
    Popconfirm,
    Empty,
    message,
    Card,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    HolderOutlined,
    SaveOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import { useFloorStore } from '../../../store/useFloorStore';
import type { Channel, FloorImage, FloorImageFormData } from '../../../types';

interface ImageManagerProps {
    channel: Channel;
    floorId: string;
}

interface ImageItemProps {
    image: FloorImage;
    onEdit: (image: FloorImage) => void;
    onDelete: (imageId: string) => void;
}

const ImageItem: React.FC<ImageItemProps> = ({ image, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`image-manager-item ${isDragging ? 'dragging' : ''}`}
        >
            <div
                className="floor-item-drag-handle"
                {...attributes}
                {...listeners}
            >
                <HolderOutlined />
            </div>
            <Image
                src={image.url}
                alt={image.alt}
                className="image-manager-item-preview"
                preview={{
                    mask: <div>预览</div>,
                }}
            />
            <div className="image-manager-item-info">
                <div style={{ marginBottom: 4 }}>
                    <strong>链接:</strong> {image.linkUrl}
                </div>
                <div style={{ color: '#999', fontSize: 12 }}>
                    {image.alt || '无描述'}
                </div>
            </div>
            <div className="image-manager-item-actions">
                <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(image)}
                >
                    编辑
                </Button>
                <Popconfirm
                    title="确定删除此图片吗？"
                    onConfirm={() => onDelete(image.id)}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                    >
                        删除
                    </Button>
                </Popconfirm>
            </div>
        </div>
    );
};

const ImageManager: React.FC<ImageManagerProps> = ({ channel, floorId }) => {
    const {
        getFloorById,
        addImageToFloor,
        updateFloorImage,
        deleteFloorImage,
        reorderFloorImages,
    } = useFloorStore();

    const floor = getFloorById(channel, floorId);
    const images = floor?.images || [];

    const [isAdding, setIsAdding] = useState(false);
    const [editingImage, setEditingImage] = useState<FloorImage | null>(null);
    const [formData, setFormData] = useState<FloorImageFormData>({
        url: '',
        linkUrl: '',
        alt: '',
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = images.findIndex((img) => img.id === active.id);
            const newIndex = images.findIndex((img) => img.id === over.id);

            const reorderedImages = arrayMove(images, oldIndex, newIndex);
            const imageIds = reorderedImages.map((img) => img.id);
            reorderFloorImages(channel, floorId, imageIds);
        }
    };

    const handleAdd = () => {
        setIsAdding(true);
        setEditingImage(null);
        setFormData({ url: '', linkUrl: '', alt: '' });
    };

    const handleEdit = (image: FloorImage) => {
        setEditingImage(image);
        setIsAdding(false);
        setFormData({
            url: image.url,
            linkUrl: image.linkUrl,
            alt: image.alt,
        });
    };

    const handleSave = () => {
        if (!formData.url || !formData.linkUrl) {
            message.error('请填写图片地址和链接地址');
            return;
        }

        if (editingImage) {
            updateFloorImage(channel, floorId, editingImage.id, formData);
            message.success('更新成功');
        } else {
            addImageToFloor(channel, floorId, formData);
            message.success('添加成功');
        }

        setIsAdding(false);
        setEditingImage(null);
        setFormData({ url: '', linkUrl: '', alt: '' });
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingImage(null);
        setFormData({ url: '', linkUrl: '', alt: '' });
    };

    const handleDelete = (imageId: string) => {
        deleteFloorImage(channel, floorId, imageId);
        message.success('删除成功');
    };

    return (
        <div className="image-manager">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {(isAdding || editingImage) && (
                    <Card size="small" title={editingImage ? '编辑图片' : '添加图片'}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Input
                                placeholder="图片地址 (https://...)"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            />
                            <Input
                                placeholder="链接地址 (https://...)"
                                value={formData.linkUrl}
                                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                            />
                            <Input
                                placeholder="图片描述（可选）"
                                value={formData.alt}
                                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                            />
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    onClick={handleSave}
                                >
                                    保存
                                </Button>
                                <Button icon={<CloseOutlined />} onClick={handleCancel}>
                                    取消
                                </Button>
                            </Space>
                        </Space>
                    </Card>
                )}

                {!isAdding && !editingImage && (
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        block
                    >
                        添加图片
                    </Button>
                )}

                {images.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={images.map((img) => img.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="image-manager-list">
                                {images.map((image) => (
                                    <ImageItem
                                        key={image.id}
                                        image={image}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    !isAdding && <Empty description="暂无图片" />
                )}
            </Space>
        </div>
    );
};

export default ImageManager;
