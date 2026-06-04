import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Space } from 'antd';
import { getRequests, approveRequest, cancelRequest } from '../../services/request';
import notify from '../../components/Notify';

const Requests: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

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
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, r: any) => (
        r.status === 'pending' ? (
          <Space>
            <Popconfirm title="Duyệt yêu cầu?" onConfirm={() => onApprove(r.id)}>
              <Button type="primary">Duyệt</Button>
            </Popconfirm>
            <Popconfirm title="Hủy yêu cầu?" onConfirm={() => onCancel(r.id)}>
              <Button danger>Hủy</Button>
            </Popconfirm>
          </Space>
        ) : null
      )
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Table rowKey="id" dataSource={data} columns={columns} />
    </div>
  );
};

export default Requests;