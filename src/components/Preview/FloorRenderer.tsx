import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography } from 'antd';
import type { Floor, Channel } from '../../types';
import { FLOOR_TYPE_OPTIONS } from '../../types';
import './FloorRenderer.css';

const { Text } = Typography;

interface FloorRendererProps {
    floor: Floor;
    channel: Channel;
}

const FloorRenderer: React.FC<FloorRendererProps> = ({ floor }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const floorTypeOption = FLOOR_TYPE_OPTIONS.find((opt) => opt.value === floor.type);

    // 自动轮播
    useEffect(() => {
        if (floor.images.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % floor.images.length);
            }, 3000); // 每3秒切换一次

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [floor.images.length]);

    if (floor.images.length === 0) {
        return (
            <Card
                size="small"
                title={
                    <Text strong>
                        {floorTypeOption?.icon} {floor.name}
                    </Text>
                }
                style={{ marginBottom: 8 }}
            >
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    暂无图片
                </div>
            </Card>
        );
    }

    const currentImage = floor.images[currentImageIndex];

    return (
        <div className="floor-renderer">
            <div className="floor-renderer-carousel">
                <a
                    href={currentImage.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="floor-renderer-link"
                >
                    <img
                        src={currentImage.url}
                        alt={currentImage.alt}
                        className="floor-renderer-image"
                    />
                </a>

                {floor.images.length > 1 && (
                    <div className="floor-renderer-indicators">
                        {floor.images.map((_, index) => (
                            <span
                                key={index}
                                className={`floor-renderer-indicator ${index === currentImageIndex ? 'active' : ''
                                    }`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FloorRenderer;
