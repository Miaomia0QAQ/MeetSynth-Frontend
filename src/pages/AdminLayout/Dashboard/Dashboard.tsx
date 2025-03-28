import { useState, useMemo, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Select, Typography, Space, Spin } from 'antd';
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
  ResponsiveContainer,
  XAxis
} from 'recharts';
import dayjs from 'dayjs';
import { getMetricsAPI, getUserActivityTrendsAPI } from '../../../apis/system';
import { useDebounce } from 'use-debounce';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟数据生成器
const generateMockData = () => {
  // // 用户增长数据
  // const userActivityTrends = Array.from({ length: 7 }).map((_, i) => ({
  //   date: dayjs().subtract(30 - i, 'day').format('YYYY/MM/DD'),
  //   count: Math.floor(Math.random() * 100) + 50,
  // }));
  // console.log(JSON.stringify(userActivityTrends));

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

  return { meetingData, performanceData };
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    MeetingCount: 0,
    newUsersToday: 0,
    online: 0,
  });
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(1, 'week'),
    dayjs(),
  ]);
  const [userActivityData, setUserActivityData] = useState<Array<{ date: string, count: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedDateRange] = useDebounce(dateRange, 300);

  // 日期格式化工具
  const formatDate = (date: dayjs.Dayjs) => date.format('YYYY-MM-DD');
  const parseDate = (dateStr: string) => dayjs(dateStr.replace(/\//g, '-'));

  // 获取关键指标数据
  useEffect(() => {
    getMetricsAPI().then((res) => {
      if (res.code === 1) {
        setMetrics({
          totalUsers: res.data.totalUsers,
          MeetingCount: res.data.meetingCount,
          newUsersToday: res.data.newUsersToday,
          online: res.data.online,
        });
      }
    });
  }, []);

  // 获取用户活跃度数据
  useEffect(() => {
    const fetchActivityData = async () => {
      setLoading(true);
      try {
        const [start, end] = debouncedDateRange;
        const res = await getUserActivityTrendsAPI(
          formatDate(start),
          formatDate(end)
        );

        if (res.code === 1) {
          const formattedData = res.data.map((item: any) => ({
            ...item,
            date: parseDate(item.date).format('MM/DD') // 格式化显示
          }));
          setUserActivityData(formattedData);
        }
      } catch (error) {
        console.error('获取活跃度数据失败', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [debouncedDateRange]);

  // 处理时间范围切换
  const handleTimeRangeChange = (value: 'week' | 'month') => {
    const now = dayjs();
    setTimeRange(value);
    setDateRange([
      now.subtract(value === 'week' ? 1 : 1, value),
      now
    ]);
  };

  // 处理自定义日期选择
  const handleDateChange = (dates: any) => {
    if (dates) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  // 禁用未来日期
  const disabledDate = (current: dayjs.Dayjs) => {
    return current > dayjs().endOf('day');
  };

  // 生成模拟数据
  const { meetingData, performanceData } = useMemo(
    generateMockData,
    [timeRange, dateRange]
  );

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={4} style={{ margin: 0 }}>
          <DashboardOutlined /> 系统概览
        </Title>
        <Space>
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            style={{ width: 120 }}
          >
            <Option value="week">本周</Option>
            <Option value="month">本月</Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            disabledDate={disabledDate}
            allowClear={false}
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
              title="会议总数"
              value={metrics.MeetingCount}
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
              title="在线人数"
              value={metrics.online}
              suffix="人"
            />
          </Card>
        </Col>
      </Row>

      {/* 数据可视化区域 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="用户活跃度趋势">
              <Spin spinning={loading}>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userActivityData}>
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#7265e6"
                        strokeWidth={2}
                        name="活跃用户数"
                      />
                      <Tooltip
                        labelFormatter={(value) => `日期: ${value}`}
                        formatter={(value) => [`${value} 人`, '活跃数']}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Spin>
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