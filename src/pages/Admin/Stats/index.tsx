import React, { useState } from 'react';
import { Card, Row, Col, Typography, Progress, Modal, Table, Tag, Space, Divider } from 'antd';
import { BarChartOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StatsPage: React.FC = () => {
  // 1. Quản lý trạng thái Modal (Bảng chi tiết)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  // 2. Dữ liệu giả (Mock Data) cho từng hạng mục thống kê
  const totalBorrowsData = [
    { key: '1', id: 'LS001', student: 'Nguyễn Văn A', equipment: 'Máy chiếu Epson', date: '01/05/2026' },
    { key: '2', id: 'LS002', student: 'Trần Thị B', equipment: 'Loa JBL', date: '02/05/2026' },
    { key: '3', id: 'LS003', student: 'Lê Văn C', equipment: 'Bộ micro', date: '05/05/2026' },
    { key: '4', id: 'LS004', student: 'Phạm Văn D', equipment: 'Đèn LED trợ sáng', date: '10/05/2026' },
  ];

  const maintenanceData = [
    { key: '1', equipment: 'Camera Sony', issue: 'Hỏng ống kính', status: 'Đang sửa' },
    { key: '2', equipment: 'Micro không dây', issue: 'Chai pin', status: 'Chờ linh kiện' },
  ];

  const rejectedData = [
    { key: '1', student: 'Hoàng Thị E', equipment: 'Máy chiếu Epson', reason: 'Thiết bị đã được đặt trước' },
    { key: '2', student: 'Ngô Văn F', equipment: 'Loa kéo', reason: 'Sinh viên đang bị phạt thẻ vàng' },
  ];

  const overdueData = [
    { key: '1', student: 'Nguyễn Văn G', equipment: 'Đèn Flash', overdue: '3 ngày' },
    { key: '2', student: 'Trần Văn H', equipment: 'Chân máy ảnh', overdue: '1 ngày' },
  ];

  // 3. Hàm xử lý khi click vào các ô thống kê
  const handleCardClick = (type: string) => {
    setIsModalVisible(true);
    switch (type) {
      case 'borrows':
        setModalTitle('Chi tiết: Tổng lượt mượn trong tháng');
        setTableColumns([
          { title: 'Mã LS', dataIndex: 'id', key: 'id' },
          { title: 'Sinh viên', dataIndex: 'student', key: 'student' },
          { title: 'Thiết bị', dataIndex: 'equipment', key: 'equipment' },
          { title: 'Ngày mượn', dataIndex: 'date', key: 'date' },
        ]);
        setTableData(totalBorrowsData);
        break;
      case 'maintenance':
        setModalTitle('Chi tiết: Thiết bị đang bảo trì');
        setTableColumns([
          { title: 'Thiết bị', dataIndex: 'equipment', key: 'equipment' },
          { title: 'Tình trạng lỗi', dataIndex: 'issue', key: 'issue', render: (text: string) => <Text type="danger">{text}</Text> },
          { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (text: string) => <Tag color="warning">{text}</Tag> },
        ]);
        setTableData(maintenanceData);
        break;
      case 'rejected':
        setModalTitle('Chi tiết: Yêu cầu bị từ chối');
        setTableColumns([
          { title: 'Sinh viên', dataIndex: 'student', key: 'student' },
          { title: 'Thiết bị', dataIndex: 'equipment', key: 'equipment' },
          { title: 'Lý do từ chối', dataIndex: 'reason', key: 'reason' },
        ]);
        setTableData(rejectedData);
        break;
      case 'overdue':
        setModalTitle('Chi tiết: Lượt mượn quá hạn');
        setTableColumns([
          { title: 'Sinh viên', dataIndex: 'student', key: 'student' },
          { title: 'Thiết bị', dataIndex: 'equipment', key: 'equipment' },
          { title: 'Số ngày trễ', dataIndex: 'overdue', key: 'overdue', render: (text: string) => <Tag color="red">{text}</Tag> },
        ]);
        setTableData(overdueData);
        break;
    }
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Thêm CSS hiệu ứng nổi lên khi hover chuột vào Card */}
      <style>{`
        .stat-card {
          transition: all 0.3s ease;
          cursor: pointer;
          border-radius: 8px;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
        }
      `}</style>

      <Title level={2} style={{ marginBottom: 24, fontWeight: 600 }}>
        <BarChartOutlined style={{ marginRight: 8, color: '#1890ff' }} />
        Thống kê Hệ thống
      </Title>

      {/* HÀNG 1: CÁC Ô THỐNG KÊ (CÓ THỂ CLICK) */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card className="stat-card" bordered={false} onClick={() => handleCardClick('borrows')}>
            <Space>
              <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <Text type="secondary">Tổng lượt mượn tháng</Text>
            </Space>
            <Title level={2} style={{ margin: '12px 0 0 0' }}>128</Title>
            <Text style={{ color: '#52c41a', fontSize: 12 }}>+12% so với tháng trước</Text>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card" bordered={false} onClick={() => handleCardClick('maintenance')}>
            <Space>
              <WarningOutlined style={{ fontSize: 24, color: '#faad14' }} />
              <Text type="secondary">Thiết bị đang bảo trì</Text>
            </Space>
            <Title level={2} style={{ margin: '12px 0 0 0' }}>5</Title>
            <Text style={{ color: '#faad14', fontSize: 12 }}>Cần kiểm tra kho</Text>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card" bordered={false} onClick={() => handleCardClick('rejected')}>
            <Space>
              <CloseCircleOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
              <Text type="secondary">Yêu cầu từ chối</Text>
            </Space>
            <Title level={2} style={{ margin: '12px 0 0 0' }}>12</Title>
            <Text type="secondary" style={{ fontSize: 12 }}>Đã gửi thông báo</Text>
          </Card>
        </Col>

        <Col span={6}>
          <Card className="stat-card" bordered={false} onClick={() => handleCardClick('overdue')}>
            <Space>
              <WarningOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
              <Text type="secondary">Lượt mượn trễ hạn</Text>
            </Space>
            <Title level={2} style={{ margin: '12px 0 0 0' }}>3</Title>
            <Text style={{ color: '#ff4d4f', fontSize: 12 }}>Đã gửi email nhắc nhở</Text>
          </Card>
        </Col>
      </Row>

      {/* HÀNG 2: BIỂU ĐỒ HOẠT ĐỘNG (MINH HỌA BẰNG PROGRESS) */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title={<span style={{ fontWeight: 600 }}>Tần suất sử dụng thiết bị (Top 3)</span>} bordered={false} style={{ borderRadius: 8 }}>
            <div style={{ marginBottom: 16 }}>
              <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 4 }}>
                <Text strong>1. Máy chiếu Epson</Text>
                <Text>85 lượt (65%)</Text>
              </Space>
              <Progress percent={65} status="active" strokeColor="#1890ff" showInfo={false} />
            </div>

            <Divider dashed />

            <div style={{ marginBottom: 16 }}>
              <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 4 }}>
                <Text strong>2. Loa Bluetooth JBL</Text>
                <Text>45 lượt (35%)</Text>
              </Space>
              <Progress percent={35} status="active" strokeColor="#52c41a" showInfo={false} />
            </div>

            <Divider dashed />

            <div>
              <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 4 }}>
                <Text strong>3. Micro không dây</Text>
                <Text>20 lượt (15%)</Text>
              </Space>
              <Progress percent={15} status="active" strokeColor="#faad14" showInfo={false} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 4. MODAL: KHUNG BẢNG CHI TIẾT NỔI LÊN KHI CLICK VÀO CARD */}
      <Modal
        title={<span style={{ fontSize: 18, color: '#1890ff' }}>{modalTitle}</span>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null} // Tắt các nút OK/Cancel ở dưới cùng
        width={700} // Mở rộng Modal cho đẹp
        centered // Căn giữa màn hình
      >
        <Table
          columns={tableColumns}
          dataSource={tableData}
          pagination={{ pageSize: 5 }}
          size="middle"
          bordered
        />
      </Modal>
    </div>
  );
};

export default StatsPage;