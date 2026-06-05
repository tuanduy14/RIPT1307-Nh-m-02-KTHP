import React, { useEffect, useState } from 'react';
import { Progress, Tag } from 'antd';
import { AppstoreOutlined, SendOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getEquipments } from '../../services/equipment';
import { getMyRequests } from '../../services/request';
import { getCurrentUser } from '../../services/user';
import notify from '../../components/Notify';

const STATUS: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Chờ duyệt', color: 'orange' },
  approved:  { label: 'Đang mượn', color: 'blue'   },
  returned:  { label: 'Đã trả',    color: 'green'   },
  rejected:  { label: 'Từ chối',   color: 'red'     },
  cancelled: { label: 'Đã hủy',    color: 'default' },
};

const Dashboard: React.FC = () => {
  const user = getCurrentUser();
  const [equipments, setEquipments] = useState<any[]>([]);
  const [requests, setRequests]     = useState<any[]>([]);

  useEffect(() => {
    Promise.all([getEquipments(), getMyRequests(user?.id)])
      .then(([eq, req]) => { setEquipments(eq || []); setRequests(req || []); })
      .catch(() => notify.error('Không tải được dữ liệu'));
  }, []);

  const available   = equipments.filter((e: any) => e.quantity > 0).length;
  const totalQty    = equipments.reduce((s: number, e: any) => s + (e.quantity || 0), 0);
  const availablePct = equipments.length ? Math.round((available / equipments.length) * 100) : 0;

  const pending   = requests.filter((r: any) => r.status === 'pending').length;
  const borrowing = requests.filter((r: any) => r.status === 'approved').length;
  const returned  = requests.filter((r: any) => r.status === 'returned').length;
  const recent    = requests.slice(0, 5);

  const cards = [
    { icon: <AppstoreOutlined />, iconBg: '#e8f0fe', iconColor: '#4285f4', label: 'Thiết bị có thể mượn', value: `${available} loại` },
    { icon: <SendOutlined />,     iconBg: '#fff4e5', iconColor: '#fa8c16', label: 'Yêu cầu chờ duyệt',   value: `${pending} yêu cầu` },
    { icon: <ClockCircleOutlined />, iconBg: '#e6fff0', iconColor: '#52c41a', label: 'Đang mượn', value: `${borrowing} lượt`, sub: `Đã trả: ${returned} lượt` },
  ];

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Hero */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div>
          <div style={{ color: '#888', fontSize: 13 }}>Xin chào,</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#111', margin: '4px 0 8px' }}>{user?.name}</div>
          <div style={{ color: '#999', fontSize: 13 }}>Theo dõi nhanh tình trạng mượn thiết bị và yêu cầu đang chờ duyệt.</div>
        </div>
        <div style={{ border: '1px solid #f0f0f0', borderRadius: 10, padding: '16px 20px', minWidth: 230 }}>
          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Tình trạng kho thiết bị</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Progress percent={availablePct} strokeColor="#e53935" trailColor="#f0f0f0" showInfo={false} style={{ flex: 1 }} />
            <span style={{ fontSize: 13, color: '#555', whiteSpace: 'nowrap' }}>{availablePct}%</span>
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>Còn {available}/{equipments.length} loại ({totalQty} cái) có thể mượn</div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: c.iconColor, marginBottom: 12 }}>
              {c.icon}
            </div>
            <div style={{ color: '#888', fontSize: 12, marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#111' }}>{c.value}</div>
            {c.sub && <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>{c.sub}</div>}
          </div>
        ))}
      </div>

      {/* Recent requests */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Yêu cầu gần đây</div>
        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#bbb', fontSize: 13 }}>Bạn chưa có yêu cầu mượn nào</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ color: '#888', borderBottom: '1px solid #f0f0f0' }}>
                {['Thiết bị', 'SL', 'Ngày mượn', 'Ngày trả', 'Trạng thái'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((r: any) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #fafafa' }}>
                  <td style={{ padding: '10px 8px', fontWeight: 500 }}>{r.equipmentName}</td>
                  <td style={{ padding: '10px 8px', color: '#555' }}>{r.amount}</td>
                  <td style={{ padding: '10px 8px', color: '#888' }}>{r.from ? new Date(r.from).toLocaleDateString('vi-VN') : '—'}</td>
                  <td style={{ padding: '10px 8px', color: '#888' }}>{r.to   ? new Date(r.to).toLocaleDateString('vi-VN')   : '—'}</td>
                  <td style={{ padding: '10px 8px' }}>
                    <Tag color={STATUS[r.status]?.color}>{STATUS[r.status]?.label ?? r.status}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;