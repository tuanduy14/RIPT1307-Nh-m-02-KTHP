import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber } from 'antd';
import { getEquipments, updateEquipment } from '../../services/equipment';
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

  const onFinish = async (values: any) => {
    try {
      await updateEquipment(selected.id, values);
      notify.success('Cập nhật thành công');
      setOpen(false);
      load();
    } catch (e) {
      notify.error('Cập nhật thất bại');
    }
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Button onClick={() => openEdit(record)}>Chỉnh sửa</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Table rowKey="id" dataSource={list} columns={columns} />

      <Modal
        visible={open}
        title="Chỉnh sửa thiết bị"
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