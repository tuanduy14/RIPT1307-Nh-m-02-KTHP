import React from 'react';
import { Card, Table, Button, Select, Typography, Space, Tag } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RequestManagementPage: React.FC = () => {
  // 1. Mock Data giữ nguyên
  const requestData = [
    { key: '1', id: '#YC001', student: 'Nguyễn Văn A', device: 'Máy chiếu', qty: 1, borrowDate: '23/05', returnDate: '26/05', status: 'pending' },
    { key: '2', id: '#YC002', student: 'Trần Thị B', device: 'Loa bluetooth', qty: 2, borrowDate: '24/05', returnDate: '27/05', status: 'pending' },
    { key: '3', id: '#YC003', student: 'Lê Văn C', device: 'Camera Canon', qty: 1, borrowDate: '20/05', returnDate: '22/05', status: 'approved' },
    { key: '4', id: '#YC004', student: 'Phạm Thị D', device: 'Bộ micro', qty: 1, borrowDate: '18/05', returnDate: '20/05', status: 'rejected' },
    { key: '5', id: '#YC005', student: 'Hoàng Văn E', device: 'Màn chiếu', qty: 1, borrowDate: '25/05', returnDate: '28/05', status: 'pending' },
  ];

  // 2. Cấu hình Cột (Xóa bỏ các css màu đen, dùng màu mặc định của Antd)
  const columns = [
    { title: 'Mã YC', dataIndex: 'id', key: 'id', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Sinh viên', dataIndex: 'student', key: 'student' },
    { title: 'Thiết bị', dataIndex: 'device', key: 'device' },
    { title: 'SL', dataIndex: 'qty', key: 'qty', align: 'center' as const },
    { title: 'Mượn', dataIndex: 'borrowDate', key: 'borrowDate' },
    { title: 'Trả', dataIndex: 'returnDate', key: 'returnDate' },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      align: 'center' as const,
      render: (status: string) => {
        let color = '';
        let text = '';
        
        // Sử dụng các màu preset cực đẹp của Ant Design cho Light Mode
        if (status === 'pending') {
          color = 'warning'; text = 'Chờ duyệt';
        } else if (status === 'approved') {
          color = 'success'; text = 'Đã duyệt';
        } else if (status === 'rejected') {
          color = 'error'; text = 'Từ chối';
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
        <Space direction="vertical" size="small">
          {record.status === 'pending' ? (
            <>
              {/* Nút primary (xanh dương) cho hành động tích cực, nút danger (đỏ) cho hành động từ chối */}
              <Button type="primary" size="small" style={{ width: 75, borderRadius: 6 }}>Duyệt</Button>
              <Button danger size="small" style={{ width: 75, borderRadius: 6 }}>Từ chối</Button>
            </>
          ) : (
            <Button size="small" style={{ width: 75, borderRadius: 6 }}>Chi tiết</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    // Đổi background nền tổng thể thành màu xám nhạt (#f0f2f5) đặc trưng của Ant Design Admin
    <div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5' }}>
      
      {/* Header trang */}
      <Title level={2} style={{ margin: '0 0 24px 0' }}>Quản lý yêu cầu mượn</Title>

      {/* Khu vực Lọc (Filter) */}
      <Card bordered={false} style={{ marginBottom: 16 }} bodyStyle={{ padding: '12px 24px' }}>
        <Space size="middle">
          <Button icon={<SearchOutlined />} />
          <Select
            defaultValue="all"
            style={{ width: 200 }}
            options={[
              { value: 'all', label: 'Tất cả trạng thái' },
              { value: 'pending', label: 'Chờ duyệt' },
              { value: 'approved', label: 'Đã duyệt' },
              { value: 'rejected', label: 'Từ chối' },
            ]}
          />
        </Space>
      </Card>

      {/* Khu vực Bảng Dữ Liệu */}
      <Card 
        title={<Text style={{ fontSize: 16, fontWeight: 500 }}>Danh sách yêu cầu mượn</Text>} 
        bordered={false} 
        extra={
          <Button icon={<DownloadOutlined />}>
            Xuất Excel
          </Button>
        }
      >
        <Table 
          dataSource={requestData} 
          columns={columns} 
          pagination={false} 
        />
      </Card>

    </div>
  );
};

export default RequestManagementPage;