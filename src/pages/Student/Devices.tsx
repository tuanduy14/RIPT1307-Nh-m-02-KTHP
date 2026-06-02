import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, DatePicker, Space, Tag } from 'antd';
import { getEquipments } from '../../services/equipment';
import { createRequest } from '../../services/request';
import notify from '../../components/Notify';

const Devices: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [form] = Form.useForm();

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
    console.log('openRequest called', record); 
    setSelected(record);
    setOpen(true);
    setTimeout(() => {
      form.resetFields();
    }, 0);
  };

  const onFinish = async (values: any) => {
    try {
      const [fromDate, toDate] = values.dateRange;
      await createRequest({
        equipmentId: selected.id,
        amount: values.amount,
        dateRange: [fromDate?.format('YYYY-MM-DD'), toDate?.format('YYYY-MM-DD')],
      });
      notify.success('Tạo yêu cầu thành công');
      setOpen(false);
      form.resetFields();
      fetchList();
    } catch (e) {
      notify.error('Tạo yêu cầu thất bại');
    }
  };

  const columns = [
    { title: 'Tên thiết bị', dataIndex: 'name', key: 'name', width: '40%' },
    { 
      title: 'Số lượng có sẵn', 
      dataIndex: 'quantity', 
      key: 'quantity',
      render: (qty: number) => <Tag color="blue">{qty}</Tag>
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '20%',
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => openRequest(record)}>
          Mượn
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2>Danh sách thiết bị</h2>
      <Table 
        rowKey="id" 
        dataSource={list} 
        columns={columns} 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={open}
        title={`Tạo yêu cầu mượn: ${selected?.name || ''}`}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
        getContainer={document.body}
        zIndex={9999}
      >
        <Form 
          form={form}
          onFinish={onFinish} 
          layout="vertical"
          style={{ marginTop: 24 }}
          initialValues={{
            amount: undefined,
            dateRange: undefined
          }}
        >
          <Form.Item 
            label="Số lượng mượn" 
            name="amount" 
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng' },
              { 
                type: 'number', 
                min: 1, 
                max: selected?.quantity,
                message: `Số lượng không được vượt quá ${selected?.quantity}`
              }
            ]}
          >
            <InputNumber 
              min={1} 
              max={selected?.quantity}
              placeholder="Nhập số lượng"
              style={{ width: '100%' }} 
            />
          </Form.Item>
          
          <Form.Item 
            label="Khoảng thời gian mượn" 
            name="dateRange" 
            rules={[{ required: true, message: 'Vui lòng chọn ngày mượn và hạn trả' }]}
          >
            <DatePicker.RangePicker 
              placeholder={['Ngày mượn', 'Hạn trả']}
              style={{ width: '100%' }} 
            />
          </Form.Item>

          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={() => {
              setOpen(false);
              form.resetFields();
            }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Gửi yêu cầu
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Devices;