import React from 'react';
import { Card, List, Button, Typography, Tag, Avatar, Space, message } from 'antd';
import { 
  ClockCircleOutlined, 
  InboxOutlined, 
  MailOutlined, 
  WarningOutlined,
  BellOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AlertsPage: React.FC = () => {
  // Dữ liệu Mock: Cảnh báo quá hạn
  const overdueAlerts = [
    {
      id: 1,
      device: 'Máy chiếu Epson',
      student: 'Phạm Văn D (SV2021001)',
      dueDate: '20/05/2026',
      overdueDays: 3,
      statusText: 'Đã quá hạn 3 ngày',
    },
    {
      id: 2,
      device: 'Loa JBL',
      student: 'Hoàng Thị E (SV2021042)',
      dueDate: '22/05/2026',
      overdueDays: 1,
      statusText: 'Đã quá hạn 1 ngày',
    },
    {
      id: 3,
      device: 'Bộ micro',
      student: 'Ngô Văn F (SV2022015)',
      dueDate: '23/05/2026',
      overdueDays: 0,
      statusText: 'Hết hạn hôm nay',
    },
  ];

  // Dữ liệu Mock: Cảnh báo tồn kho thấp
  const lowStockAlerts = [
    {
      id: 1,
      device: 'Loa bluetooth JBL',
      remaining: 1,
      total: 6,
      borrowed: 5,
      status: 'warning',
      statusText: 'Sắp hết',
    },
    {
      id: 2,
      device: 'Bộ micro không dây',
      remaining: 0,
      total: 5,
      borrowed: 5,
      status: 'error',
      statusText: 'Hết hàng',
    },
  ];

  // Hàm xử lý giả lập gửi email
  const handleSendEmail = (studentName?: string) => {
    if (studentName) {
      message.success(`Đã gửi email nhắc nhở đến sinh viên: ${studentName}`);
    } else {
      message.success('Đã gửi email nhắc nhở đến TẤT CẢ sinh viên quá hạn!');
    }
  };

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5' }}>
      <Title level={2} style={{ margin: '0 0 24px 0' }}>Cảnh báo hệ thống</Title>

      {/* KHỐI 1: CẢNH BÁO QUÁ HẠN */}
      <Card 
        title={
          <Space>
            <WarningOutlined style={{ color: '#f5222d' }} />
            <Text strong style={{ fontSize: 16 }}>Cảnh báo quá hạn</Text>
          </Space>
        }
        extra={
          <Button 
            type="default" 
            icon={<MailOutlined />} 
            onClick={() => handleSendEmail()}
          >
            Gửi email tất cả
          </Button>
        }
        style={{ marginBottom: 24, borderRadius: 8 }}
      >
        <List
          itemLayout="horizontal"
          dataSource={overdueAlerts}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button key="email" onClick={() => handleSendEmail(item.student)}>
                  Gửi email
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={<ClockCircleOutlined />} 
                    style={{ backgroundColor: '#fff1f0', color: '#f5222d' }} 
                  />
                }
                title={<Text strong>{item.device} — {item.student}</Text>}
                description={
                  <Text type="secondary">
                    Hạn trả: {item.dueDate} · <Text type={item.overdueDays > 0 ? "danger" : "warning"}>{item.statusText}</Text>
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* KHỐI 2: CẢNH BÁO TỒN KHO THẤP */}
      <Card 
        title={
          <Space>
            <BellOutlined style={{ color: '#fa8c16' }} />
            <Text strong style={{ fontSize: 16 }}>Cảnh báo tồn kho thấp</Text>
          </Space>
        }
        style={{ borderRadius: 8 }}
      >
        <List
          itemLayout="horizontal"
          dataSource={lowStockAlerts}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Tag color={item.status} style={{ padding: '4px 12px', fontSize: 14, borderRadius: 16 }}>
                  {item.statusText}
                </Tag>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    icon={<InboxOutlined />} 
                    style={{ backgroundColor: item.status === 'error' ? '#fff1f0' : '#fff7e6', color: item.status === 'error' ? '#f5222d' : '#fa8c16' }} 
                  />
                }
                title={<Text strong>{item.device}</Text>}
                description={
                  <Text type="secondary">
                    Chỉ còn {item.remaining}/{item.total} cái · {item.borrowed} đang cho mượn
                  </Text>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default AlertsPage;