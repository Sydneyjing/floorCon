import React from 'react';
import { Typography, Space, Tag, Divider } from 'antd';
import { useFloorStore } from '../../../store/useFloorStore';
import type { Channel, CustomerSegment } from '../../../types';
import FloorRenderer from '../../../components/Preview/FloorRenderer';

const { Title, Text } = Typography;

interface PreviewPanelProps {
    channel: Channel;
    selectedSegment: CustomerSegment;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ channel, selectedSegment }) => {
    const { getFloorsBySegment } = useFloorStore();
    const floors = getFloorsBySegment(channel, selectedSegment);

    return (
        <div className="preview-panel">
            <div className="preview-panel-header">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Title level={4} style={{ margin: 0 }}>
                        实时预览
                    </Title>
                    <Space>
                        <Text type="secondary">渠道:</Text>
                        <Tag color={channel === 'mobile' ? 'blue' : 'green'}>
                            {channel === 'mobile' ? '手机银行' : '网上银行'}
                        </Tag>
                        <Text type="secondary">客群:</Text>
                        <Tag color="purple">{selectedSegment}</Tag>
                    </Space>
                </Space>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div className="preview-panel-content">
                <div className={`preview-device-frame ${channel}`}>
                    {floors.length > 0 ? (
                        floors.map((floor) => (
                            <div key={floor.id} className="preview-floor">
                                <FloorRenderer floor={floor} channel={channel} />
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                            暂无楼层配置
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;
