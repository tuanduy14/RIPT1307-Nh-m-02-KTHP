import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { getEquipments } from '../../services/equipment';
import notify from '../../components/Notify';

const DevicesAdmin: React.FC = () => {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getEquipments();
      setList(res || []);
    } catch (e) {
      notify.error('Không tải được thiết bị');
    }
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Hành động', key: 'action', render: () => (<Button>Chỉnh sửa</Button>) },
  ];

  return (
    <div style={{ padding: 16 }}>
      <Table rowKey="id" dataSource={list} columns={columns} />
    </div>
  );
};

export default DevicesAdmin;
