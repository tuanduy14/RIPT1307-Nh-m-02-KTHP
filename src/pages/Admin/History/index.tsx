import React from 'react';
import { Card, Table, Button, Input, DatePicker, Space, Tag, Typography, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const HistoryPage: React.FC = () => {
  // 1. Mock Data chuẩn khớp với ảnh thiết kế
  const historyData = [
    { key: '1', id: '#YC003', student: 'Lê Văn C', device: 'Camera Canon', borrowDate: '20/05', dueDate: '22/05', returnDate: '22/05', status: 'returned' },
    { key: '2', id: '#YC006', student: 'Phạm Văn D', device: 'Máy chiếu', borrowDate: '17/05', dueDate: '20/05', returnDate: '—', status: 'overdue' },
    { key: '3', id: '#YC007', student: 'Hoàng Thị E', device: 'Loa JBL', borrowDate: '19/05', dueDate: '22/05', returnDate: '—', status: 'overdue' },
    { key: '4', id: '#YC008', student: 'Võ Thị G', device: 'Bộ micro', borrowDate: '21/05', dueDate: '23/05', returnDate: '—', status: 'borrowing' },
  ];

  // 2. Cấu hình Cột với chuẩn Light Mode
  const columns = [
    { title: 'Mã', dataIndex: 'id', key: 'id', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Sinh viên', dataIndex: 'student', key: 'student' },
    { title: 'Thiết bị', dataIndex: 'device', key: 'device' },
    { title: 'Ngày mượn', dataIndex: 'borrowDate', key: 'borrowDate', align: 'center' as const },
    { title: 'Hạn trả', dataIndex: 'dueDate', key: 'dueDate', align: 'center' as const },
    { title: 'Ngày trả thực tế', dataIndex: 'returnDate', key: 'returnDate', align: 'center' as const },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      align: 'center' as const,
      render: (status: string) => {
        let color = '';
        let text = '';
        
        if (status === 'returned') { 
          color = 'success'; text = 'Đã trả'; 
        } else if (status === 'overdue') { 
          color = 'error'; text = 'Quá hạn'; 
        } else if (status === 'borrowing') { 
          color = 'processing'; text = 'Đang mượn'; 
        }

        return (
          <Tag color={color} style={{ borderRadius: 12, padding: '2px 10px' }}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      render: (_, record: any) => (
        <Space>
          {record.status === 'returned' ? (
            <Button size="small" style={{ borderRadius: 6, width: 95 }}>Chi tiết</Button>
          ) : (
            <Button type="primary" size="small" style={{ borderRadius: 6, width: 95 }}>Ghi nhận trả</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    // Đồng bộ nền xám nhạt (#f0f2f5) cho toàn hệ thống
    <div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5' }}>
      
      <Title level={2} style={{ margin: '0 0 24px 0' }}>Lịch sử mượn / trả</Title>

      {/* Khu vực Lọc (Filters) */}
      <Card bordered={false} style={{ marginBottom: 16 }} bodyStyle={{ padding: '16px 24px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Input 
              placeholder="Tìm theo sinh viên" 
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
              style={{ borderRadius: 6 }}
            />
          </Col>
          <Col span={8}>
            <DatePicker 
              placeholder="Từ ngày" 
              style={{ width: '100%', borderRadius: 6 }} 
              format="DD/MM/YYYY" 
            />
          </Col>
          <Col span={8}>
            <DatePicker 
              placeholder="Đến ngày" 
              style={{ width: '100%', borderRadius: 6 }} 
              format="DD/MM/YYYY" 
            />
          </Col>
        </Row>
      </Card>

      {/* Khu vực Bảng Danh Sách */}
      <Card 
        title={<Text style={{ fontSize: 16, fontWeight: 500 }}>Lịch sử mượn / trả</Text>} 
        bordered={false} 
      >
        <Table 
          dataSource={historyData} 
          columns={columns} 
          pagination={false} 
        />
      </Card>
    </div>
  );
};

export default HistoryPage;