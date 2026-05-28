import React from 'react';
import { Row, Col, Card, Typography, Table, List, Button, Progress } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { history } from 'umi';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  // Hàm xử lý chuyển hướng khi click vào các ô thống kê
  const navigateTo = (path: string) => {
    history.push(path);
  };

  // Mock data cho Bảng Yêu cầu chờ duyệt
  const requestColumns = [
    { title: 'Sinh viên', dataIndex: 'student', key: 'student' },
    { title: 'Thiết bị', dataIndex: 'equipment', key: 'equipment' },
    { title: 'Ngày mượn', dataIndex: 'date', key: 'date' },
    {
      title: '',
      key: 'action',
      render: () => <Button type="primary" danger size="small" style={{ borderRadius: 4 }}>Duyệt</Button>,
    },
  ];

  const requestData = [
    { key: '1', student: 'Nguyễn Văn A', equipment: 'Máy chiếu', date: '23/05' },
    { key: '2', student: 'Trần Thị B', equipment: 'Loa bluetooth', date: '24/05' },
    { key: '3', student: 'Lê Văn C', equipment: 'Camera', date: '25/05' },
  ];

  // Mock data cho Danh sách thiết bị quá hạn
  const overdueData = [
    { title: 'Máy chiếu Epson', desc: 'Phạm Văn D', overdue: '+3 ngày', color: '#ff4d4f' },
    { title: 'Loa JBL', desc: 'Hoàng Thị E', overdue: '+1 ngày', color: '#ff4d4f' },
    { title: 'Bộ micro', desc: 'Ngô Văn F', overdue: 'Hôm nay', color: '#faad14' },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* CSS Nhúng để tạo hiệu ứng hover (nổi lên) cho các ô thống kê */}
      <style>{`
        .clickable-card {
          transition: all 0.3s ease;
          cursor: pointer;
          border-radius: 8px;
        }
        .clickable-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
        }
      `}</style>

      <Title level={2} style={{ marginBottom: 24, fontWeight: 600 }}>Dashboard</Title>

      {/* HÀNG 1: 4 Ô THỐNG KÊ (ĐÃ ĐƯỢC GẮN LINK CLICK) */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card className="clickable-card" bordered={false} onClick={() => navigateTo('/admin/equipments')}>
            <Text type="secondary">Tổng thiết bị</Text>
            <Title level={2} style={{ margin: '8px 0' }}>47</Title>
            <Text type="secondary">12 loại khác nhau</Text>
          </Card>
        </Col>
        
        <Col span={6}>
          <Card className="clickable-card" bordered={false} onClick={() => navigateTo('/admin/history')}>
            <Text type="secondary">Đang cho mượn</Text>
            <Title level={2} style={{ margin: '8px 0', color: '#1890ff' }}>18</Title>
            <Text style={{ color: '#1890ff' }}>38% tổng kho</Text>
          </Card>
        </Col>
        
        <Col span={6}>
          <Card className="clickable-card" bordered={false} onClick={() => navigateTo('/admin/requests')}>
            <Text type="secondary">Yêu cầu chờ duyệt</Text>
            <Title level={2} style={{ margin: '8px 0', color: '#faad14' }}>6</Title>
            <Text type="warning">Cần xử lý</Text>
          </Card>
        </Col>
        
        <Col span={6}>
          <Card className="clickable-card" bordered={false} onClick={() => navigateTo('/admin/alerts')}>
            <Text type="secondary">Quá hạn trả</Text>
            <Title level={2} style={{ margin: '8px 0', color: '#f5222d' }}>3</Title>
            <Text type="danger">Cần cảnh báo</Text>
          </Card>
        </Col>
      </Row>

      {/* HÀNG 2: BẢNG YÊU CẦU & DANH SÁCH QUÁ HẠN */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card 
            title={<span style={{ fontWeight: 600 }}>Yêu cầu chờ duyệt</span>} 
            extra={<Button type="text" danger style={{ border: '1px solid #ff4d4f' }} onClick={() => navigateTo('/admin/requests')}>Xem tất cả</Button>}
            bordered={false} 
            style={{ borderRadius: 8 }}
          >
            <Table columns={requestColumns} dataSource={requestData} pagination={false} size="middle" />
          </Card>
        </Col>
        
        <Col span={8}>
          <Card 
            title={<span><WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />Thiết bị quá hạn</span>} 
            bordered={false} 
            style={{ borderRadius: 8, height: '100%' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={overdueData}
              renderItem={item => (
                <List.Item
                  extra={<span style={{ color: item.color, border: `1px solid ${item.color}`, padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{item.overdue}</span>}
                >
                  <List.Item.Meta
                    title={<span style={{ fontWeight: 600 }}>{item.title}</span>}
                    description={item.desc}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* HÀNG 3: BIỂU ĐỒ TIẾN TRÌNH */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title={<span style={{ fontWeight: 600 }}>Thiết bị mượn nhiều nhất tháng 5</span>} bordered={false} style={{ borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ width: 120 }}>Máy chiếu</span>
              <Progress percent={85} showInfo={false} strokeColor="#1890ff" style={{ flex: 1, margin: '0 16px' }} />
              <span style={{ fontWeight: 'bold' }}>18</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: 120 }}>Loa Bluetooth</span>
              <Progress percent={60} showInfo={false} strokeColor="#1890ff" style={{ flex: 1, margin: '0 16px' }} />
              <span style={{ fontWeight: 'bold' }}>12</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;