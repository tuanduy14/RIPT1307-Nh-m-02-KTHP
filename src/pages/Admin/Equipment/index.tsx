import React from 'react';
import { Card, Table, Button, Typography, Space, Tag, Input, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const EquipmentManagementPage: React.FC = () => {
  // 1. Mock Data được trích xuất y hệt từ ảnh thiết kế của bạn
  const equipmentData = [
    { key: '1', id: 'TB001', name: 'Máy chiếu Epson EB-X41', total: 4, borrowed: 2, stock: 2, status: 'in_stock' },
    { key: '2', id: 'TB002', name: 'Loa bluetooth JBL', total: 6, borrowed: 5, stock: 1, status: 'low_stock' },
    { key: '3', id: 'TB003', name: 'Camera Canon EOS M50', total: 3, borrowed: 1, stock: 2, status: 'in_stock' },
    { key: '4', id: 'TB004', name: 'Bộ micro không dây', total: 5, borrowed: 5, stock: 0, status: 'out_of_stock' },
    { key: '5', id: 'TB005', name: 'Màn chiếu 100 inch', total: 2, borrowed: 0, stock: 2, status: 'in_stock' },
  ];

  // 2. Cấu hình Cột chuẩn Light Mode
  const columns = [
    { title: 'Mã TB', dataIndex: 'id', key: 'id', render: (text: string) => <Text strong>{text}</Text> },
    { title: 'Tên thiết bị', dataIndex: 'name', key: 'name' },
    { title: 'Tổng SL', dataIndex: 'total', key: 'total', align: 'center' as const },
    { title: 'Đang mượn', dataIndex: 'borrowed', key: 'borrowed', align: 'center' as const },
    { title: 'Tồn kho', dataIndex: 'stock', key: 'stock', align: 'center' as const },
    {
      title: 'Tình trạng',
      key: 'status',
      dataIndex: 'status',
      align: 'center' as const,
      render: (status: string) => {
        let color = '';
        let text = '';
        
        // Chuyển đổi trạng thái sang màu sắc chuẩn của Ant Design (Xanh/Cam/Đỏ)
        if (status === 'in_stock') {
          color = 'success'; text = 'Còn hàng';
        } else if (status === 'low_stock') {
          color = 'warning'; text = 'Sắp hết';
        } else if (status === 'out_of_stock') {
          color = 'error'; text = 'Hết hàng';
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
      render: () => (
        // Xếp 3 nút bấm theo chiều dọc giống bản thiết kế
        <Space direction="vertical" size="small">
          <Button size="small" style={{ width: 75, borderRadius: 6 }}>Chi tiết</Button>
          <Button type="primary" ghost size="small" style={{ width: 75, borderRadius: 6 }}>Sửa</Button>
          <Button danger size="small" style={{ width: 75, borderRadius: 6 }}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    // Đồng bộ nền xám nhạt (#f0f2f5) cho toàn hệ thống
    <div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5' }}>
      
      {/* Header & Thanh công cụ (Tìm kiếm, Thêm mới) */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>Quản lý kho thiết bị</Title>
        </Col>
        <Col>
          <Space size="middle">
            <Input 
              placeholder="Tìm thiết bị..." 
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />} 
              style={{ width: 250, borderRadius: 6 }} 
            />
            <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 6 }}>
              Thêm thiết bị
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Khu vực Bảng Danh Sách */}
      <Card 
        title={<Text style={{ fontSize: 16, fontWeight: 500 }}>Danh sách thiết bị trong kho</Text>} 
        bordered={false} 
      >
        <Table 
          dataSource={equipmentData} 
          columns={columns} 
          pagination={false} 
        />
      </Card>
    </div>
  );
};

export default EquipmentManagementPage;