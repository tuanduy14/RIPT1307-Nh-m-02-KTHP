import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Popconfirm, Space } from 'antd';
import { getEquipments, updateEquipment, createEquipment, deleteEquipment } from '../../services/equipment';
import notify from '../../components/Notify';

const DevicesAdmin: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [form] = Form.useForm();

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getEquipments();
      setList(res || []);
    } catch (e) {
      notify.error('Không tải được thiết bị');
    }
  };

  const openEdit = (record: any) => {
    setSelected(record);
    form.setFieldsValue({ name: record.name, quantity: record.quantity });
    setOpen(true);
  };

  const openAdd = () => {
    setSelected(null);
    form.resetFields();
    setOpen(true);
  };

  const onFinish = async (values: any) => {
    try {
      if (selected) {
        await updateEquipment(selected.id, values);
        notify.success('Cập nhật thành công');
      } else {
        await createEquipment(values);
        notify.success('Thêm thiết bị thành công');
      }
      setOpen(false);
      load();
    } catch (e) {
      notify.error(selected ? 'Cập nhật thất bại' : 'Thêm thất bại');
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteEquipment(id);
      notify.success('Xóa thiết bị thành công');
      load();
    } catch (e) {
      notify.error('Xóa thất bại');
    }
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => openEdit(record)}>Chỉnh sửa</Button>
          <Popconfirm title="Xóa thiết bị?" onConfirm={() => onDelete(record.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" onClick={openAdd}>Thêm thiết bị</Button>
      </div>
      <Table rowKey="id" dataSource={list} columns={columns} />

      <Modal
        visible={open}
        title={selected ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị'}
        onCancel={() => setOpen(false)}
        footer={null}
        zIndex={10000}
      >
        <Form form={form} onFinish={onFinish} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Tên thiết bị" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input placeholder="Nhập tên thiết bị" />
          </Form.Item>
          <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setOpen(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit">Lưu</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DevicesAdmin;