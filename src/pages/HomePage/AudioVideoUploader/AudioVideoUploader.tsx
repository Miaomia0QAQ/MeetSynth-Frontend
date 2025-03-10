import { Upload, Card, Typography, Button, Row, Col } from 'antd';
import { InboxOutlined, CheckCircleFilled } from '@ant-design/icons';
import styles from './AudioVideoUploader.module.css';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const AudioVideoUploader = () => {
    return (
        <div className={styles.container}>
            {/* 标题部分 */}
            <Title level={2} className={styles.title}>
                <span className={styles.titleHighlight}>导入音视频</span>
                #录音转文字更高效
            </Title>

            {/* 拖拽上传区域 */}
            <Dragger
                className={styles.uploadDragger}
                accept="audio/*,video/*"
                multiple
                style={{
                    maxWidth: 800,
                    margin: '0 auto 48px',
                    backgroundColor: '#fff',
                    borderColor: '#FFE0B2'
                }}
            >
                <div style={{ padding: 24 }}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <Title level={4} className={styles.uploadText}>
                        点击或拖拽文件到此区域上传
                    </Title>
                    <Text type="secondary">支持MP3/WAV/MP4等格式</Text>
                </div>
            </Dragger>

            {/* 功能特性展示 */}
            <Row gutter={24} className={styles.featuresRow}>
                <Col xs={24} md={8}>
                    <Card className={styles.featuresCard}>
                        <CheckCircleFilled className={styles.iconAccent} />
                        <Title level={4} style={{ margin: '16px 0' }}>准确度高</Title>
                        <Text type="secondary">快写准确率最高可达98%</Text>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card className={styles.featuresCard}>
                        <CheckCircleFilled className={styles.iconAccent} />
                        <Title level={4} style={{ margin: '16px 0' }}>出稿快</Title>
                        <Text type="secondary">1小时音频最快5分钟出稿</Text>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card className={styles.featuresCard}>
                        <CheckCircleFilled className={styles.iconAccent} />
                        <Title level={4} style={{ margin: '10px 0' }}>多语言支持</Title>
                        <div>
                            <Button shape="round" className={styles.languageButton}>English</Button>
                            <Button shape="round" className={styles.languageButton}>日本語</Button>
                            <Button shape="round" className={styles.languageButton}>中文</Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* 操作按钮 */}
            <div className={styles.actionButtonWrap}>
                <Button
                    type="primary"
                    size="large"
                    className={styles.actionButton}
                >
                    立即体验
                </Button>
            </div>
        </div>
    );
};

export default AudioVideoUploader;