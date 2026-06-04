import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Space, Modal, Descriptions, Tag } from 'antd';
import { getRequests, approveRequest, cancelRequest } from '../../services/request';
import notify from '../../components/Notify';

const statusColor: Record<string, string> = {
  pending: 'orange',
  approved: 'blue',
  returned: 'green',
  rejected: 'red',
};

const statusLabel: Record<string, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đang mượn',
  returned: 'Đã trả',
  rejected: 'Đã hủy',
};

const Requests: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [detail, setDetail] = useState<any | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getRequests();
      setData(res || []);
    } catch (e) {
      notify.error('Không tải yêu cầu');
    }
  };

  const onApprove = async (id: number) => {
    try {
      await approveRequest(id);
      notify.success('Đã duyệt yêu cầu');
      load();
    } catch (e) {
      notify.error('Duyệt thất bại');
    }
  };

  const onCancel = async (id: number) => {
    try {
      await cancelRequest(id);
      notify.success('Đã hủy yêu cầu');
      load();
    } catch (e) {
      notify.error('Hủy thất bại');
    }
  };

  const columns = [
    { title: 'Người yêu cầu', dataIndex: 'userName', key: 'userName' },
    { title: 'Thiết bị', dataIndex: 'equipmentName', key: 'equipmentName' },
    { title: 'Số lượng', dataIndex: 'amount', key: 'amount' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <Tag color={statusColor[s]}>{statusLabel[s] || s}</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, r: any) => (
        <Space>
          <Button onClick={() => setDetail(r)}>Chi tiết</Button>
          {r.status === 'pending' && (
            <>
              <Popconfirm title="Duyệt yêu cầu?" onConfirm={() => onApprove(r.id)}>
                <Button type="primary">Duyệt</Button>
              </Popconfirm>
              <Popconfirm title="Hủy yêu cầu?" onConfirm={() => onCancel(r.id)}>
                <Button danger>Hủy</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Table rowKey="id" dataSource={data} columns={columns} />

      <Modal
        visible={!!detail}
        title="Chi tiết yêu cầu"
        onCancel={() => setDetail(null)}
        footer={<Button onClick={() => setDetail(null)}>Đóng</Button>}
        zIndex={10000}
      >
        {detail && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Người yêu cầu">{detail.userName || '—'}</Descriptions.Item>
            <Descriptions.Item label="Email">{detail.email || '—'}</Descriptions.Item>
            <Descriptions.Item label="Thiết bị">{detail.equipmentName}</Descriptions.Item>
            <Descriptions.Item label="Số lượng">{detail.amount}</Descriptions.Item>
            <Descriptions.Item label="Ngày mượn">{detail.from?.slice(0, 10)}</Descriptions.Item>
            <Descriptions.Item label="Ngày trả">{detail.to?.slice(0, 10)}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={statusColor[detail.status]}>{statusLabel[detail.status] || detail.status}</Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Requests;