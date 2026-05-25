import React from 'react';
import { Row, Col, Card, Statistic, Table, Button, List, Typography, Progress } from 'antd';

const { Title, Text } = Typography;

const DashboardPage: React.FC = () => {
  // 1. Mock Data cho Bảng Yêu cầu chờ duyệt (Giữ nguyên)
  const pendingRequests = [
    { key: '1', student: 'Nguyễn Văn A', device: 'Máy chiếu', date: '23/05' },
    { key: '2', student: 'Trần Thị B', device: 'Loa bluetooth', date: '24/05' },
    { key: '3', student: 'Lê Văn C', device: 'Camera', date: '25/05' },
  ];

  const requestColumns = [
    { title: 'Sinh viên', dataIndex: 'student', key: 'student' },
    { title: 'Thiết bị', dataIndex: 'device', key: 'device' },
    { title: 'Ngày mượn', dataIndex: 'date', key: 'date' },
    {
      title: '',
      key: 'action',
      render: () => <Button type="primary" size="small" style={{ borderRadius: 6 }}>Duyệt</Button>,
    },
  ];

  // 2. Mock Data cho Danh sách Quá hạn (Giữ nguyên)
  const overdueItems = [
    { title: 'Máy chiếu Epson', user: 'Phạm Văn D', overDue: '+3 ngày', color: '#ff4d4f' },
    { title: 'Loa JBL', user: 'Hoàng Thị E', overDue: '+1 ngày', color: '#ff4d4f' },
    { title: 'Bộ micro', user: 'Ngô Văn F', overDue: 'Hôm nay', color: '#faad14' },
  ];

  // 3. Mock Data cho Biểu đồ mượn nhiều nhất (Giữ nguyên)
  const topDevices = [
    { name: 'Máy chiếu', count: 18, percent: 100 },
    { name: 'Loa bluetooth', count: 14, percent: 77 },
    { name: 'Camera Canon', count: 11, percent: 61 },
    { name: 'Bộ micro', count: 8, percent: 44 },
    { name: 'Màn chiếu', count: 5, percent: 27 },
  ];

  return (
    // Sử dụng màu nền xám nhạt (#f0f2f5) đặc trưng của Ant Design Admin
    <div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5' }}>

      <Title level={2} style={{ margin: '0 0 24px 0' }}>Dashboard</Title>

      {/* Hàng 1: Các thẻ thống kê */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic title="Tổng thiết bị" value={47} />
            <Text type="secondary">12 loại khác nhau</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic title="Đang cho mượn" value={18} valueStyle={{ color: '#1890ff' }} />
            <Text style={{ color: '#1890ff' }}>38% tổng kho</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic title="Yêu cầu chờ duyệt" value={6} valueStyle={{ color: '#faad14' }} />
            <Text style={{ color: '#faad14' }}>Cần xử lý</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic title="Quá hạn trả" value={3} valueStyle={{ color: '#ff4d4f' }} />
            <Text style={{ color: '#ff4d4f' }}>Cần cảnh báo</Text>
          </Card>
        </Col>
      </Row>

      {/* Hàng 2: Bảng yêu cầu & Danh sách quá hạn */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Cột trái: Yêu cầu chờ duyệt */}
        <Col span={16}>
          <Card 
            title={<Text style={{ fontSize: 16, fontWeight: 500 }}>Yêu cầu chờ duyệt</Text>} 
            bordered={false} 
            style={{ height: '100%' }}
            extra={<Button size="small">Xem tất cả</Button>}
          >
            <Table 
              dataSource={pendingRequests} 
              columns={requestColumns} 
              pagination={false} 
            />
          </Card>
        </Col>

        {/* Cột phải: Thiết bị quá hạn */}
        <Col span={8}>
          <Card 
            title={<Text style={{ color: '#ff4d4f', fontSize: 16, fontWeight: 500 }}>⚠ Thiết bị quá hạn</Text>} 
            bordered={false} 
            style={{ height: '100%' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={overdueItems}
              renderItem={item => (
                <List.Item extra={<Text style={{ color: item.color, background: '#fff1f0', padding: '2px 8px', borderRadius: 4, fontSize: 12, border: `1px solid ${item.color}` }}>{item.overDue}</Text>}>
                  <List.Item.Meta
                    title={<Text strong>{item.title}</Text>}
                    description={<Text type="secondary">{item.user}</Text>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Hàng 3: Biểu đồ thiết bị mượn nhiều nhất */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card 
            title={<Text style={{ fontSize: 16, fontWeight: 500 }}>Thiết bị mượn nhiều nhất tháng 5</Text>} 
            bordered={false} 
          >
            {topDevices.map((device, index) => (
              <Row key={index} style={{ marginBottom: 12, alignItems: 'center' }}>
                <Col span={4}><Text>{device.name}</Text></Col>
                <Col span={18}>
                  {/* Chuyển thanh Progress về màu xanh dương mặc định của Ant Design */}
                  <Progress percent={device.percent} showInfo={false} strokeColor="#1890ff" />
                </Col>
                <Col span={2} style={{ textAlign: 'right' }}>
                  <Text strong>{device.count}</Text>
                </Col>
              </Row>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;