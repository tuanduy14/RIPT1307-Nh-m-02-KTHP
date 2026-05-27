import React from 'react';
import { Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd';
import {
  AppstoreOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { connect } from 'umi';
import dayjs from 'dayjs';
import { StudentBorrowModelState } from '@/models/studentBorrowModel';
import { RequestStatus } from '@/types/studentBorrow';

const { Title, Paragraph } = Typography;

interface DashboardPageProps {
  studentBorrow: StudentBorrowModelState;
}

function getStatusColor(status: RequestStatus) {
  switch (status) {
    case 'Chờ duyệt':
      return 'blue';
    case 'Đã duyệt':
      return 'green';
    case 'Bị từ chối':
      return 'red';
    case 'Đã trả':
      return 'default';
    case 'Quá hạn':
      return 'volcano';
    default:
      return 'default';
  }
}

const DashboardPage: React.FC<DashboardPageProps> = ({ studentBorrow }) => {
  const { devices, borrowRequests } = studentBorrow;

  const availableDevices = devices.filter((item) => item.availableQuantity > 0);

  const pendingRequests = borrowRequests.filter(
    (item) => item.status === 'Chờ duyệt',
  );

  const activeBorrowing = borrowRequests.filter(
    (item) => item.status === 'Đã duyệt' || item.status === 'Quá hạn',
  );

  const expiringSoon = activeBorrowing.filter((item) => {
    const diff = dayjs(item.expectedReturnDate).diff(dayjs(), 'day');
    return diff >= 0 && diff <= 1;
  });

  const columns = [
    {
      title: 'Mã yêu cầu',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Thiết bị',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
    },
    {
      title: 'Hạn trả',
      dataIndex: 'expectedReturnDate',
      key: 'expectedReturnDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: RequestStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
  ];

  return (
    <>
      <Title level={3}>Tổng quan sinh viên</Title>
      <Paragraph type="secondary">
        Theo dõi nhanh tình trạng mượn thiết bị, yêu cầu đang chờ duyệt và thiết bị sắp đến hạn trả.
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Thiết bị có thể mượn"
              value={availableDevices.length}
              suffix="loại"
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Yêu cầu chờ duyệt"
              value={pendingRequests.length}
              suffix="yêu cầu"
              prefix={<SendOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Đang mượn"
              value={activeBorrowing.length}
              suffix="lượt"
              prefix={<HistoryOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Sắp đến hạn"
              value={expiringSoon.length}
              suffix="lượt"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Các yêu cầu gần đây">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={borrowRequests.slice(0, 5)}
          pagination={false}
        />
      </Card>
    </>
  );
};

export default connect(({ studentBorrow }: any) => ({
  studentBorrow,
}))(DashboardPage);