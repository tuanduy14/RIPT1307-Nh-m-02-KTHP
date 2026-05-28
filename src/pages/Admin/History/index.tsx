import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Input, Drawer, Descriptions } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';

const HistoryPage: React.FC = () => {
  // 1. Mock Data: Thêm nhiều trường thông tin chi tiết hơn
  const [data] = useState([
    { 
      id: 'LS001', 
      student: 'Nguyễn Văn A', 
      studentId: 'B21DCCN001',
      equipment: 'Máy chiếu Epson', 
      borrowDate: '20/05/2026', 
      returnDate: '21/05/2026',
      status: 'returned', 
      conditionBefore: 'Hoạt động tốt',
      conditionAfter: 'Hoạt động tốt',
      note: 'Không có ghi chú'
    },
    { 
      id: 'LS002', 
      student: 'Trần Thị B', 
      studentId: 'B21DCCN002',
      equipment: 'Loa bluetooth JBL', 
      borrowDate: '24/05/2026', 
      returnDate: 'Chưa trả',
      status: 'borrowing',
      conditionBefore: 'Pin 80%',
      conditionAfter: '...',
      note: 'Đang mượn phục vụ sự kiện CLB'
    },
    { 
      id: 'LS003', 
      student: 'Phạm Văn D', 
      studentId: 'B20DCCN105',
      equipment: 'Bộ micro không dây', 
      borrowDate: '15/05/2026', 
      returnDate: 'Quá hạn 3 ngày',
      status: 'overdue',
      conditionBefore: 'Đầy đủ phụ kiện',
      conditionAfter: '...',
      note: 'Đã gửi email nhắc nhở lần 1'
    },
  ]);

  // 2. States quản lý
  const [searchText, setSearchText] = useState('');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // 3. Logic Tìm kiếm (Tìm theo Tên SV, Mã SV hoặc Tên thiết bị)
  const filteredData = data.filter(item => 
    item.student.toLowerCase().includes(searchText.toLowerCase()) ||
    item.equipment.toLowerCase().includes(searchText.toLowerCase()) ||
    item.studentId.toLowerCase().includes(searchText.toLowerCase())
  );

  // Mở bảng chi tiết
  const showDetails = (record: any) => {
    setSelectedRecord(record);
    setIsDrawerVisible(true);
  };

  // 4. Cấu hình cột cho bảng chính
  const columns = [
    { title: 'Mã LS', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Sinh viên', dataIndex: 'student', key: 'student' },
    { title: 'Thiết bị', dataIndex: 'equipment', key: 'equipment' },
    { title: 'Ngày mượn', dataIndex: 'borrowDate', key: 'borrowDate' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        let text = 'Đang mượn';
        if (status === 'returned') { color = 'green'; text = 'Đã trả'; }
        if (status === 'overdue') { color = 'red'; text = 'Quá hạn'; }
        return <Tag color={color} style={{ borderRadius: 12, padding: '2px 10px' }}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Button 
          type="text" 
          style={{ color: '#1890ff' }} 
          icon={<EyeOutlined />} 
          onClick={() => showDetails(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card 
        title={<span style={{ fontSize: 18, fontWeight: 600 }}>Lịch sử mượn/trả thiết bị</span>}
        extra={
          // Thanh tìm kiếm cực mượt
          <Input 
            placeholder="Tìm theo tên, mã SV, thiết bị..." 
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, borderRadius: 6 }}
            allowClear
          />
        }
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
      >
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          pagination={{ pageSize: 6 }} 
        />
      </Card>

      {/* 5. DRAWER: Bảng thông số chi tiết trượt từ bên phải */}
      <Drawer
        title={<span style={{ fontWeight: 600, fontSize: 16 }}>Bảng thông số chi tiết</span>}
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
        width={450} // Mở rộng Drawer một chút để nhìn bảng cho đẹp
      >
        {selectedRecord && (
          // Component Descriptions (bordered) tạo ra một bảng thông số cực kỳ chuyên nghiệp
          <Descriptions column={1} bordered size="small" labelStyle={{ width: 140, fontWeight: 500 }}>
            <Descriptions.Item label="Mã giao dịch"><b>{selectedRecord.id}</b></Descriptions.Item>
            <Descriptions.Item label="Sinh viên mượn">{selectedRecord.student} ({selectedRecord.studentId})</Descriptions.Item>
            <Descriptions.Item label="Tên thiết bị">{selectedRecord.equipment}</Descriptions.Item>
            
            <Descriptions.Item label="Trạng thái">
              {selectedRecord.status === 'returned' && <Tag color="green">Đã trả</Tag>}
              {selectedRecord.status === 'borrowing' && <Tag color="blue">Đang mượn</Tag>}
              {selectedRecord.status === 'overdue' && <Tag color="red">Quá hạn</Tag>}
            </Descriptions.Item>

            <Descriptions.Item label="Ngày lấy đồ">{selectedRecord.borrowDate}</Descriptions.Item>
            <Descriptions.Item label="Ngày trả đồ">
              <span style={{ color: selectedRecord.status === 'overdue' ? 'red' : 'inherit' }}>
                {selectedRecord.returnDate}
              </span>
            </Descriptions.Item>
            
            <Descriptions.Item label="Tình trạng lúc giao">{selectedRecord.conditionBefore}</Descriptions.Item>
            <Descriptions.Item label="Tình trạng lúc thu">{selectedRecord.conditionAfter}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú thêm">{selectedRecord.note}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default HistoryPage;