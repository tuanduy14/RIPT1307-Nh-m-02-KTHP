import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { getMyRequests } from '../../services/request';
import notify from '../../components/Notify';

const History: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getMyRequests();
      setData(res || []);
    } catch (e) {
      notify.error('Không tải được lịch sử');
    }
  };

  const columns = [
    { title: 'Thiết bị', dataIndex: 'equipmentName', key: 'equipmentName' },
    { title: 'Số lượng', dataIndex: 'amount', key: 'amount' },
    { title: 'Ngày mượn', dataIndex: 'from', key: 'from' },
    { title: 'Ngày trả', dataIndex: 'to', key: 'to' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Table rowKey="id" dataSource={data} columns={columns} />
    </div>
  );
};

export default History;
