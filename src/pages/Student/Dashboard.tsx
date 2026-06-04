import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { getEquipments } from '../../services/equipment';
import { getMyRequests } from '../../services/request';
import { getCurrentUser } from '../../services/user';
import notify from '../../components/Notify';

const Dashboard: React.FC = () => {
  const [equipmentCount, setEquipmentCount] = useState(0);
  const [pending, setPending] = useState(0);
  const [borrowing, setBorrowing] = useState(0);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const user = getCurrentUser();
      const [equipments, requests] = await Promise.all([
        getEquipments(),
        getMyRequests(user?.id),
      ]);
      setEquipmentCount(equipments?.length || 0);
      setPending(requests?.filter((r: any) => r.status === 'pending').length || 0);
      setBorrowing(requests?.filter((r: any) => r.status === 'approved').length || 0);
    } catch (e) {
      notify.error('Không tải được dữ liệu');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng thiết bị" value={equipmentCount} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Yêu cầu đang chờ" value={pending} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Đang mượn" value={borrowing} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;