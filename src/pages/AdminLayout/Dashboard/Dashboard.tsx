import { Card, Typography } from 'antd';

const { Title } = Typography;

const Dashboard = () => {
    return (
        <Card>
            <Title level={4}>系统概览</Title>
            <p>这里是网站监控数据的概览页面...</p>
        </Card>
    );
};

export default Dashboard;