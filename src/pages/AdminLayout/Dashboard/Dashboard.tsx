// src/pages/Dashboard.tsx
import { useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Select, Typography, Space } from 'antd';
import { 
  UserOutlined, 
  VideoCameraOutlined, 
  RiseOutlined, 
  DashboardOutlined 
} from '@ant-design/icons';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟数据生成器
const generateMockData = () => {
  // 用户增长数据
  const userGrowth = Array.from({ length: 30 }).map((_, i) => ({
    date: dayjs().subtract(30 - i, 'day').format('YYYY-MM-DD'),
    count: Math.floor(Math.random() * 100) + 50,
  }));

  // 会议统计数据
  const meetingData = [
    { type: '视频会议', value: 65 },
    { type: '语音会议', value: 25 },
    { type: '文字会议', value: 10 },
  ];

  // 系统性能数据
  const performanceData = [
    { metric: 'CPU使用率', value: 45 },
    { metric: '内存使用率', value: 65 },
    { metric: '网络延迟', value: 28 },
  ];

  return { userGrowth, meetingData, performanceData };
};

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(1, 'week'),
    dayjs(),
  ]);

  // 生成模拟数据
  const { userGrowth, meetingData, performanceData } = useMemo(
    generateMockData,
    [timeRange, dateRange]
  );

  // 关键指标数据
  const metrics = {
    totalUsers: 2458,
    activeMeetings: 23,
    newUsersToday: 89,
    systemLoad: 72.5,
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={4} style={{ margin: 0 }}>
          <DashboardOutlined /> 系统概览
        </Title>
        <Space>
          <Select
            value={timeRange}
            onChange={(v) => setTimeRange(v)}
            style={{ width: 120 }}
          >
            <Option value="day">本日</Option>
            <Option value="week">本周</Option>
            <Option value="month">本月</Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange([dates[0]!, dates[1]!])}
          />
        </Space>
      </div>

      {/* 关键指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={metrics.totalUsers}
              prefix={<UserOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="进行中会议"
              value={metrics.activeMeetings}
              prefix={<VideoCameraOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="今日新增用户"
              value={metrics.newUsersToday}
              prefix={<RiseOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="系统负载"
              value={metrics.systemLoad}
              precision={1}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 数据可视化区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="用户增长趋势">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowth}>
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#7265e6" 
                    strokeWidth={2}
                  />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="会议类型分布">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={meetingData}
                    dataKey="value"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#7265e6"
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="系统性能指标">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <Bar 
                    dataKey="value" 
                    fill="#7265e6" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;