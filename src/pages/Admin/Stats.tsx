import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Spin } from 'antd';
import dayjs from 'dayjs';
import { getTopBorrowed, getBorrowHistory } from '../../services/equipment';
import notify from '../../components/Notify';

const STATUS_COLOR: Record<string, string> = { returned: 'green', approved: 'blue', pending: 'orange', rejected: 'red' };

const Stats: React.FC = () => {
  const [topList, setTopList] = useState<any[]>([]);
  const [topLoading, setTopLoading] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [histLoading, setHistLoading] = useState(false);

  useEffect(() => {
    const month = dayjs().format('YYYY-MM');
    setTopLoading(true);
    getTopBorrowed(month)
      .then(setTopList)
      .catch(() => notify.error('Không tải được top thiết bị'))
      .finally(() => setTopLoading(false));
  }, []);

  const loadHistory = (item: any) => {
    setSelected(item);
    setHistLoading(true);
    getBorrowHistory(item.id)
      .then(setHistory)
      .catch(() => notify.error('Không tải được lịch sử'))
      .finally(() => setHistLoading(false));
  };

  const totalBorrows = topList.reduce((s, r) => s + Number(r.borrow_count), 0);

  const topCols = [
    { title: 'Tên thiết bị', dataIndex: 'name', render: (t: string, r: any) => <a onClick={() => loadHistory(r)}>{t}</a> },
    { title: 'Lượt mượn', dataIndex: 'borrow_count', align: 'right' as const, width: 110 },
    // total_amount = SUM(r.amount) từ DB — tổng số lượng thiết bị đã mượn
    { title: 'Tổng SL', dataIndex: 'total_amount', align: 'right' as const, width: 90, render: (v: any) => Number(v) },
  ];

  const histCols = [
    { title: 'Tên', dataIndex: 'user_name', width: 130 },
    { title: 'Email', dataIndex: 'user_email', width: 170 },
    { title: 'SL mượn', dataIndex: 'amount', width: 80 },
    { title: 'Ngày mượn', dataIndex: 'from_date', width: 110, render: (v: string) => v ? dayjs(v).format('DD/MM/YYYY') : '—' },
    { title: 'Ngày trả', dataIndex: 'to_date', width: 110, render: (v: string) => v ? dayjs(v).format('DD/MM/YYYY') : '—' },
    { title: 'Trạng thái', dataIndex: 'status', width: 110, render: (s: string) => <Tag color={STATUS_COLOR[s]}>{s}</Tag> },
  ];

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center' }}>
          <div>
            <div style={{ color: '#888', fontSize: 13 }}>Tổng lượt mượn</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{totalBorrows}</div>
          </div>
          <div>
            <div style={{ color: '#888', fontSize: 13 }}>Thiết bị</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{topList.length}</div>
          </div>
          <div>
            <div style={{ color: '#888', fontSize: 13 }}>Tháng hiện tại</div>
            <div style={{ fontSize: 22, fontWeight: 700, paddingTop: 4 }}>{dayjs().format('MM/YYYY')}</div>
          </div>
        </div>
      </Card>

      <Card title={<span>Thiết bị mượn nhiều nhất tháng <small style={{ color: '#888' }}>— click vào hàng để xem chi tiết</small></span>}>
        <Spin spinning={topLoading}>
          <Table dataSource={topList} columns={topCols} rowKey="id" pagination={false} size="small"
            onRow={(r) => ({ onClick: () => loadHistory(r), style: { cursor: 'pointer' } })} />
        </Spin>
      </Card>

      {selected && (
        <Card title={<span>Lịch sử mượn: <span style={{ color: '#4a9eff' }}>{selected.name}</span></span>}>
          <Spin spinning={histLoading}>
            <Table dataSource={history} columns={histCols} rowKey="id" pagination={{ pageSize: 10 }} size="small" />
          </Spin>
        </Card>
      )}
    </div>
  );
};

export default Stats;