import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { getMyRequests, returnRequest } from '../../services/request';
import { getCurrentUser } from '../../services/user';
import notify from '../../components/Notify';

const History: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const user = getCurrentUser();
      const res = await getMyRequests(user?.id);
      setData(res || []);
    } catch (e) {
      notify.error('Không tải được lịch sử');
    }
  };

  const onReturn = async (id: number) => {
    try {
      await returnRequest(id);
      notify.success('Trả thiết bị thành công');
      load();
    } catch (e) {
      notify.error('Trả thiết bị thất bại');
    }
  };

  const columns = [
    { title: 'Thiết bị', dataIndex: 'equipmentName', key: 'equipmentName' },
    { title: 'Số lượng', dataIndex: 'amount', key: 'amount' },
    { title: 'Ngày mượn', dataIndex: 'from', key: 'from' },
    { title: 'Ngày trả', dataIndex: 'to', key: 'to' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) =>
        record.status === 'approved' ? (
          <Popconfirm title="Trả thiết bị?" onConfirm={() => onReturn(record.id)}>
            <Button type="primary">Trả</Button>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Table rowKey="id" dataSource={data} columns={columns} />
    </div>
  );
};

export default History;
