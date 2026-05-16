import React, { useEffect, useState } from 'react';
import Chart from '../../components/Chart';
import { Card } from 'antd';
import { getStats } from '../../services/equipment';
import notify from '../../components/Notify';

const Stats: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getStats();
      setData(res || []);
    } catch (e) {
      notify.error('Không tải thống kê');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Card>
        <Chart data={data} />
      </Card>
    </div>
  );
};

export default Stats;
