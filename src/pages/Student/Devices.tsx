import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputNumber } from 'antd';
import MyDatepicker from '../../components/MyDatepicker';
import { getEquipments } from '../../services/equipment';
import { createRequest } from '../../services/request';
import notify from '../../components/Notify';

const Devices: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await getEquipments();
      setList(res || []);
    } catch (e) {
      notify.error('Lỗi khi tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  const openRequest = (record: any) => {
    setSelected(record);
    setOpen(true);
  };

  const onFinish = async (values: any) => {
    try {
      await createRequest({ equipmentId: selected.id, ...values });
      notify.success('Tạo yêu cầu thành công');
      setOpen(false);
      fetchList();
    } catch (e) {
      notify.error('Tạo yêu cầu thất bại');
    }
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Hành động', key: 'action', render: (_: any, record: any) => (
      <Button onClick={() => openRequest(record)}>Mượn</Button>
    ) },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Table rowKey="id" dataSource={list} columns={columns} loading={loading} />

      <Modal visible={open} title="Tạo yêu cầu mượn" onCancel={() => setOpen(false)} footer={null}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item label="Số lượng" name="amount" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item label="Ngày mượn - trả" name="dateRange" rules={[{ required: true }]}>
            <MyDatepicker.RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Gửi yêu cầu</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Devices;
