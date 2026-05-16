import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: 16 }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Thiết bị" value={128} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Yêu cầu đang chờ" value={4} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Đang mượn" value={12} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
