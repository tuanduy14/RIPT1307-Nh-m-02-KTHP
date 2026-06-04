import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, DatePicker, Space, Tag, Typography } from 'antd';
import { CalendarOutlined, InboxOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { getEquipments } from '../../services/equipment';
import { createRequest } from '../../services/request';
import { getCurrentUser } from '../../services/user';
import notify from '../../components/Notify';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const Devices: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
    setSelected(record);
    form.resetFields();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const [fromDate, toDate] = values.dateRange as [Dayjs, Dayjs];
      const user = getCurrentUser();
      await createRequest({
        equipmentId: selected.id,
        amount: values.amount,
        dateRange: [fromDate.format('YYYY-MM-DD'), toDate.format('YYYY-MM-DD')],
        userId: user?.id,
      });
      notify.success('Tạo yêu cầu mượn thành công!');
      handleClose();
      fetchList();
    } catch (e) {
      notify.error('Tạo yêu cầu thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Không cho chọn ngày trong quá khứ
  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  const columns = [
    {
      title: 'Tên thiết bị',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng có sẵn',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      width: 160,
      render: (qty: number) => (
        <Tag color={qty > 0 ? 'blue' : 'red'} style={{ fontSize: 13, padding: '2px 10px' }}>
          {qty > 0 ? qty : 'Hết hàng'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 140,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Button
          type="primary"
          size="small"
          icon={<ShoppingCartOutlined />}
          disabled={record.quantity <= 0}
          onClick={() => openRequest(record)}
        >
          Mượn
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: 16 }}>Danh sách thiết bị</h2>
      <Table
        rowKey="id"
        dataSource={list}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        visible={open}
        title={
          <Space>
            <ShoppingCartOutlined style={{ color: '#1890ff' }} />
            <span>Tạo yêu cầu mượn thiết bị</span>
          </Space>
        }
        onCancel={handleClose}
        footer={null}
        width={480}
        destroyOnClose
        // Quan trọng: render popup calendar bên trong Modal thay vì body
        getContainer={false}
        style={{ top: 80 }}
      >
        {selected && (
          <>
            {/* Thông tin thiết bị được chọn */}
            <div
              style={{
                background: '#f0f7ff',
                border: '1px solid #91caff',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <InboxOutlined style={{ fontSize: 20, color: '#1890ff' }} />
              <div>
                <Text strong style={{ fontSize: 14 }}>{selected.name}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Còn lại: <Text strong style={{ color: '#1890ff' }}>{selected.quantity}</Text> thiết bị
                </Text>
              </div>
            </div>

            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                label="Số lượng mượn"
                name="amount"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng' },
                  {
                    type: 'number',
                    min: 1,
                    max: selected.quantity,
                    message: `Số lượng từ 1 đến ${selected.quantity}`,
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  max={selected.quantity}
                  placeholder={`Tối đa ${selected.quantity}`}
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label={
                  <Space>
                    <CalendarOutlined />
                    <span>Khoảng thời gian mượn</span>
                  </Space>
                }
                name="dateRange"
                rules={[{ required: true, message: 'Vui lòng chọn ngày mượn và hạn trả' }]}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  size="large"
                  placeholder={['Ngày mượn', 'Hạn trả']}
                  disabledDate={disabledDate}
                  format="DD/MM/YYYY"
                  // Render popup ngay trong modal, tránh tràn ra ngoài
                  getPopupContainer={(trigger) => trigger.parentElement || document.body}
                  allowClear
                />
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <Button onClick={handleClose}>Hủy</Button>
                <Button type="primary" htmlType="submit" loading={submitting} icon={<ShoppingCartOutlined />}>
                  Gửi yêu cầu
                </Button>
              </div>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Devices;