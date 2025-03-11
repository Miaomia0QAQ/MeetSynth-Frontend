import { Upload, Card, Typography, Button } from 'antd';
import { InboxOutlined, CheckCircleFilled } from '@ant-design/icons';
import './AudioVideoUploader.css';
import { useEffect, useState } from 'react';

const { Dragger } = Upload;
const { Title, Text } = Typography;

interface AudioVideoUploaderProps {
    activeSection: string;
}
const AudioVideoUploader = ({ activeSection }: AudioVideoUploaderProps) => {
    const [isAnimateIn, setIsAnimateIn] = useState(false);

    useEffect(() => {
        if (activeSection === 'upload') {
            setIsAnimateIn(true);
        } else {
            setIsAnimateIn(false);
        }
    }, [activeSection]);

    return (
        <div className="audio-uploader-container">
            {/* 标题部分 */}
            <h2 className={`audio-uploader-title ${isAnimateIn ? 'animate-in' : ''}`}>
                <span className="title-highlight">导入音视频</span>
                #录音转文字更高效
            </h2>

            <div className="cardListContainer">
                {/* 卡片1 - 准确度高 */}
                <div key="accuracy" className={`cardListItem ${isAnimateIn ? 'animate-in' : ''}`}>
                    <Card className="featuresCard">
                        <CheckCircleFilled className="iconAccent" />
                        <Title level={4} style={{ margin: '16px 0', color: 'white' }}>准确度高</Title>
                        <Text type="secondary" style={{ color: 'white' }}>快写准确率最高可达98%</Text>
                    </Card>
                </div>

                {/* 卡片2 - 出稿快 */}
                <div key="speed" className={`cardListItem ${isAnimateIn ? 'animate-in' : ''}`}>
                    <Card className="featuresCard">
                        <CheckCircleFilled className="iconAccent" />
                        <Title level={4} style={{ margin: '16px 0', color: 'white' }}>出稿快</Title>
                        <Text type="secondary" style={{ color: 'white' }}>1小时音频最快5分钟出稿</Text>
                    </Card>
                </div>

                {/* 卡片3 - 拖拽上传 */}
                <div key="language" className={`cardListItem ${isAnimateIn ? 'animate-in' : ''}`}>
                    <Card
                        className="featuresCard"
                        style={{
                            padding: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Dragger
                            className="uploadDragger"
                            accept="audio/*,video/*"
                            multiple
                            style={{
                                maxWidth: 800,
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                        >
                            <div style={{ padding: 24 }}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <Title level={4} className="uploadText" style={{ color: 'white' }}>
                                    点击或拖拽文件到此区域上传
                                </Title>
                                <Text type="secondary" style={{ color: 'white' }}>支持MP3/WAV/MP4等格式</Text>
                            </div>
                        </Dragger>
                    </Card>
                </div>

                {/* 卡片4 - 智能识别 */}
                <div key="speed" className={`cardListItem ${isAnimateIn ? 'animate-in' : ''}`}>
                    <Card className="featuresCard">
                        <CheckCircleFilled className="iconAccent" />
                        <Title level={4} style={{ margin: '16px 0', color: 'white' }}>智能识别</Title>
                        <Text type="secondary" style={{ color: 'white' }}>精准识别说话人</Text>
                    </Card>
                </div>

                {/* 卡片5 - 多语言支持 */}
                <div key="language" className={`cardListItem ${isAnimateIn ? 'animate-in' : ''}`}>
                    <Card className="featuresCard">
                        <CheckCircleFilled className="iconAccent" />
                        <Title level={4} style={{ margin: '10px 0', color: 'white' }}>多语言支持</Title>
                        <div>
                            <Button shape="round" className="languageButton">English</Button>
                            <Button shape="round" className="languageButton">日本語</Button>
                            <Button shape="round" className="languageButton">中文</Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* 操作按钮 */}
            <div className="actionButtonWrap">
                <Button
                    type="primary"
                    size="large"
                    className="actionButton"
                >
                    立即体验
                </Button>
            </div>
        </div>
    );
};

export default AudioVideoUploader;