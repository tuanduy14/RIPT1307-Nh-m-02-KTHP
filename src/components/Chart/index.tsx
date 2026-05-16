import React from 'react';
import { Column } from '@ant-design/charts';

const Chart: React.FC<{ data?: any[] }> = ({ data = [] }) => {
  const cfg = {
    data,
    xField: 'month',
    yField: 'count',
  };
  return <Column {...cfg} />;
};

export default Chart;
