import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Select, message, Popconfirm, Drawer, Descriptions } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;

const RequestPage: React.FC = () => {
  // 1. Dữ liệu giả (Mock Data)
  const [data, setData] = useState([
    { id: 'YC001', student: 'Nguyễn Văn A (B21DCCN001)', equipment: 'Máy chiếu Epson', borrowDate: '23/05/2026', status: 'pending' },
    { id: 'YC002', student: 'Trần Thị B (B21DCCN002)', equipment: 'Loa bluetooth JBL', borrowDate: '24/05/2026', status: 'pending' },
    { id: 'YC003', student: 'Lê Văn C (B21DCCN003)', equipment: 'Camera Sony', borrowDate: '25/05/2026', status: 'approved' },
    { id: 'YC004', student: 'Phạm Thị D (B21DCCN004)', equipment: 'Bộ micro không dây', borrowDate: '26/05/2026', status: 'rejected' },
  ]);

  // Các State quản lý giao diện
  const [filterStatus, setFilterStatus] = useState('all');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // 2. Hàm xử lý logic (Duyệt / Từ chối / Xem chi tiết)
  const handleApprove = (id: string) => {
    setData(data.map(item => item.id === id ? { ...item, status: 'approved' } : item));
    message.success(`Đã DUYỆT yêu cầu mượn đồ ${id}!`);
  };

  const handleReject = (id: string) => {
    setData(data.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
    message.warning(`Đã TỪ CHỐI yêu cầu mượn đồ ${id}!`);
  };

  const showDetails = (record: any) => {
    setSelectedRequest(record);
    setIsDrawerVisible(true);
  };

  // 3. Cấu hình Cột cho Bảng
  const columns = [
    { title: 'Mã YC', dataIndex: 'id', key: 'id', width: 100 },
    { title: 'Sinh viên', dataIndex: 'student', key: 'student' },
    { title: 'Thiết bị', dataIndex: 'equipment', key: 'equipment' },
    { title: 'Ngày mượn', dataIndex: 'borrowDate', key: 'borrowDate' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'orange';
        let text = 'Chờ duyệt';
        if (status === 'approved') { color = 'green'; text = 'Đã duyệt'; }
        if (status === 'rejected') { color = 'red'; text = 'Từ chối'; }
        return <Tag color={color} style={{ borderRadius: 12, padding: '2px 10px' }}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          {/* Nếu đang Chờ duyệt thì hiện 2 nút Duyệt/Từ chối */}
          {record.status === 'pending' ? (
            <>
              <Popconfirm title="Xác nhận duyệt yêu cầu này?" onConfirm={() => handleApprove(record.id)} okText="Duyệt" cancelText="Hủy">
                <Button type="primary" size="small" icon={<CheckOutlined />} style={{ background: '#52c41a', borderColor: '#52c41a' }}>
                  Duyệt
                </Button>
              </Popconfirm>
              <Popconfirm title="Lý do từ chối? Xác nhận từ chối yêu cầu này?" onConfirm={() => handleReject(record.id)} okText="Từ chối" cancelText="Hủy">
                <Button type="primary" danger size="small" icon={<CloseOutlined />}>
                  Từ chối
                </Button>
              </Popconfirm>
            </>
          ) : (
            /* Nếu đã duyệt/từ chối rồi thì chỉ hiện nút Chi tiết */
            <Button type="default" size="small" icon={<EyeOutlined />} onClick={() => showDetails(record)}>
              Chi tiết
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // 4. Lọc dữ liệu theo trạng thái
  const filteredData = filterStatus === 'all' 
    ? data 
    : data.filter(item => item.status === filterStatus);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card 
        title={<span style={{ fontSize: 18, fontWeight: 600 }}>Quản lý Yêu cầu mượn thiết bị</span>}
        extra={
          <Select 
            defaultValue="all" 
            style={{ width: 160 }} 
            onChange={(value) => setFilterStatus(value)}
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="pending">Chờ duyệt</Option>
            <Option value="approved">Đã duyệt</Option>
            <Option value="rejected">Từ chối</Option>
          </Select>
        }
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
      >
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          pagination={{ pageSize: 5 }} 
        />
      </Card>

      {/* 5. DRAWER: Bảng trượt từ bên phải để xem thông tin chi tiết */}
      <Drawer
        title={<span style={{ fontWeight: 600 }}>Chi tiết yêu cầu</span>}
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
        width={400}
      >
        {selectedRequest && (
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Mã YC"><b>{selectedRequest.id}</b></Descriptions.Item>
            <Descriptions.Item label="Sinh viên">{selectedRequest.student}</Descriptions.Item>
            <Descriptions.Item label="Thiết bị">{selectedRequest.equipment}</Descriptions.Item>
            <Descriptions.Item label="Ngày mượn">{selectedRequest.borrowDate}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {selectedRequest.status === 'approved' 
                ? <Tag color="green">Đã duyệt</Tag> 
                : <Tag color="red">Từ chối</Tag>}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default RequestPage;