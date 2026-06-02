import React, { useEffect, useState } from 'react';
import { ColumnChart } from '../../components/Chart';
import { Card } from 'antd';
import { getStats } from '../../services/equipment';
import notify from '../../components/Notify';

const Stats: React.FC = () => {
  const [xAxis, setXAxis] = useState<string[]>([]);
  const [yAxis, setYAxis] = useState<number[][]>([[]]);
  const [yLabel, setYLabel] = useState<string[]>(['Số lượng']);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await getStats();
      if (res?.xAxis) {
        setXAxis(res.xAxis);
        setYAxis(res.yAxis);
        setYLabel(res.yLabel);
      }
    } catch (e) {
      notify.error('Không tải thống kê');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <Card title="Thống kê thiết bị">
        <ColumnChart
          xAxis={xAxis}
          yAxis={yAxis}
          yLabel={yLabel}
          height={400}
        />
      </Card>
    </div>
  );
};

export default Stats;