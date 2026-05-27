import React, { useState } from 'react';
import { Card, Table, Button, Tag, Space, Modal, Form, Input, InputNumber, Select, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const EquipmentPage: React.FC = () => {
  const [form] = Form.useForm();
  
  // 1. Dữ liệu giả (Mock Data) lưu trong State để có thể Thêm/Sửa/Xóa trực tiếp trên giao diện
  const [data, setData] = useState([
    { id: 1, name: 'Loa bluetooth JBL', total: 6, available: 1, status: 'warning', statusText: 'Sắp hết' },
    { id: 2, name: 'Bộ micro không dây', total: 5, available: 0, status: 'error', statusText: 'Hết hàng' },
    { id: 3, name: 'Máy chiếu Epson', total: 10, available: 8, status: 'success', statusText: 'Còn hàng' },
  ]);

  // Các State quản lý Modal Form
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); // Lưu thông tin thiết bị đang được sửa

  // 2. Định nghĩa các cột của Bảng (Table)
  const columns = [
    { title: 'Mã TB', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tên thiết bị', dataIndex: 'name', key: 'name' },
    { title: 'Tổng số lượng', dataIndex: 'total', key: 'total', align: 'center' as const },
    { title: 'Sẵn sàng cho mượn', dataIndex: 'available', key: 'available', align: 'center' as const },
    {
      title: 'Tình trạng kho',
      key: 'status',
      dataIndex: 'statusText',
      render: (text: string, record: any) => (
        <Tag color={record.status} style={{ borderRadius: 12, padding: '2px 10px' }}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          {/* Nút Sửa */}
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: '#1890ff' }} />} 
            onClick={() => handleOpenModal(record)}
          />
          {/* Nút Xóa kèm xác nhận */}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thiết bị này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 3. Các hàm xử lý Logic
  // Mở Form (Dùng chung cho cả Thêm mới và Sửa)
  const handleOpenModal = (record: any = null) => {
    setEditingItem(record);
    if (record) {
      form.setFieldsValue(record); // Đổ dữ liệu cũ vào form nếu là chế độ Sửa
    } else {
      form.resetFields(); // Làm sạch form nếu là chế độ Thêm mới
    }
    setIsModalVisible(true);
  };

  // Đóng Form
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingItem(null);
  };

  // Lưu thông tin từ Form
  const handleSave = (values: any) => {
    // Tự động set màu trạng thái dựa trên số lượng sẵn sàng (available)
    let status = 'success';
    let statusText = 'Còn hàng';
    if (values.available === 0) {
      status = 'error';
      statusText = 'Hết hàng';
    } else if (values.available <= 2) {
      status = 'warning';
      statusText = 'Sắp hết';
    }

    const newDataItem = { ...values, status, statusText };

    if (editingItem) {
      // Logic Sửa: Tìm và cập nhật thiết bị cũ
      const updatedData = data.map(item => item.id === editingItem.id ? { ...item, ...newDataItem } : item);
      setData(updatedData);
      message.success('Cập nhật thông tin thiết bị thành công!');
    } else {
      // Logic Thêm: Tạo ID mới và đưa vào danh sách
      newDataItem.id = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
      setData([...data, newDataItem]);
      message.success('Thêm thiết bị mới thành công!');
    }
    handleCloseModal();
  };

  // Logic Xóa
  const handleDelete = (id: number) => {
    const newData = data.filter(item => item.id !== id);
    setData(newData);
    message.success('Đã xóa thiết bị khỏi hệ thống!');
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card
        title={<span style={{ fontSize: 18, fontWeight: 600 }}>Quản lý Kho thiết bị</span>}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => handleOpenModal()}
          >
            Thêm thiết bị
          </Button>
        }
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
      >
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          pagination={{ pageSize: 5 }} 
        />
      </Card>

      {/* 4. MODAL FORM: Khung điền thông tin ẩn/hiện */}
      <Modal
        title={editingItem ? "Sửa thông tin thiết bị" : "Thêm thiết bị mới"}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        onOk={() => form.submit()} // Liên kết nút OK của Modal với nút Submit của Form
        okText="Lưu lại"
        cancelText="Hủy bỏ"
        destroyOnClose // Xóa sạch dữ liệu trong form khi đóng
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{ total: 1, available: 1 }} // Giá trị mặc định khi thêm mới
        >
          <Form.Item
            name="name"
            label="Tên thiết bị"
            rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị!' }]}
          >
            <Input placeholder="Ví dụ: Máy chiếu Panasonic" />
          </Form.Item>

          <Space style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <Form.Item
              name="total"
              label="Tổng số lượng kho"
              rules={[{ required: true, message: 'Nhập số lượng!' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="available"
              label="Sẵn sàng cho mượn"
              rules={[{ required: true, message: 'Nhập số lượng!' }]}
            >
              {/* Số lượng sẵn sàng không được vượt quá Tổng số lượng */}
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default EquipmentPage;