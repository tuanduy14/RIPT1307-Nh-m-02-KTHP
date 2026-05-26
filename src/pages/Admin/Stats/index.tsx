import React from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, Divider, Space } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StatsPage: React.FC = () => {
  // Dữ liệu Mock thống kê
  const topDevices = [
    { name: 'Máy chiếu', count: 18, percent: 100 },
    { name: 'Loa bluetooth', count: 14, percent: 77 },
    { name: 'Camera', count: 11, percent: 61 },
    { name: 'Bộ micro', count: 8, percent: 44 },
    { name: 'Màn chiếu', count: 5, percent: 27 },
  ];

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: '#f0f2f5' }}>
      <Title level={2} style={{ margin: '0 0 24px 0' }}>Thống kê</Title>

      {/* HÀNG 1: THẺ SỐ LIỆU NHANH */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic 
              title={<Text type="secondary">Tổng lượt mượn T5</Text>} 
              value={42} 
              valueStyle={{ fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic 
              title={<Text type="secondary">Đã hoàn trả</Text>} 
              value={36} 
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic 
              title={<Text type="secondary">Đang mượn</Text>} 
              value={18} 
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic 
              title={<Text type="secondary">Tỉ lệ quá hạn</Text>} 
              value={7} 
              suffix="%" 
              valueStyle={{ color: '#f5222d', fontWeight: 'bold' }} 
            />
          </Card>
        </Col>
      </Row>

      {/* HÀNG 2: BIỂU ĐỒ & PHÂN BỔ */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Cột trái: Top thiết bị */}
        <Col span={12}>
          <Card 
            title={<Text strong style={{ fontSize: 16 }}>Top thiết bị mượn nhiều — Tháng 5</Text>} 
            bordered={false}
            style={{ height: '100%' }}
          >
            {topDevices.map((device, index) => (
              <Row key={index} style={{ marginBottom: 16, alignItems: 'center' }}>
                <Col span={6}>
                  <Text type="secondary">{device.name}</Text>
                </Col>
                <Col span={15}>
                  <Progress percent={device.percent} showInfo={false} strokeColor="#1890ff" />
                </Col>
                <Col span={3} style={{ textAlign: 'right' }}>
                  <Text strong>{device.count}</Text>
                </Col>
              </Row>
            ))}
          </Card>
        </Col>

        {/* Cột phải: Phân bổ trạng thái */}
        <Col span={12}>
          <Card 
            title={<Text strong style={{ fontSize: 16 }}>Phân bổ trạng thái thiết bị</Text>} 
            bordered={false}
            style={{ height: '100%' }}
          >
            <div style={{ marginBottom: 12 }}>
              <Row justify="space-between">
                <Text type="secondary">Có sẵn trong kho</Text>
                <Text strong>61%</Text>
              </Row>
              <Progress percent={61} showInfo={false} strokeColor="#52c41a" size="small" />
            </div>

            <div style={{ marginBottom: 12 }}>
              <Row justify="space-between">
                <Text type="secondary">Đang cho mượn</Text>
                <Text strong>38%</Text>
              </Row>
              <Progress percent={38} showInfo={false} strokeColor="#1890ff" size="small" />
            </div>

            <div style={{ marginBottom: 12 }}>
              <Row justify="space-between">
                <Text type="secondary">Quá hạn chưa trả</Text>
                <Text strong>7%</Text>
              </Row>
              <Progress percent={7} showInfo={false} strokeColor="#f5222d" size="small" />
            </div>

            <Divider style={{ margin: '20px 0 16px 0' }} />

            <Text strong style={{ display: 'block', marginBottom: 12 }}>So sánh tháng trước</Text>
            <Row>
              <Col span={12}>
                <Statistic 
                  title={<Text type="secondary">T4</Text>} 
                  value={35} 
                  suffix="lượt" 
                  valueStyle={{ fontSize: 16 }}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title={<Text type="secondary">T5</Text>} 
                  value={42} 
                  suffix={
                    <Space size={4} style={{ color: '#52c41a', fontSize: 14, marginLeft: 8 }}>
                      <ArrowUpOutlined />
                      <span>20%</span>
                    </Space>
                  } 
                  valueStyle={{ fontSize: 16, fontWeight: 'bold' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatsPage;