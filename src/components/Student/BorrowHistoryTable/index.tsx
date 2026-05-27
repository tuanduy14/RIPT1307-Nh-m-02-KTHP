import React from 'react';
import { Table, Tag, Typography } from 'antd';
import { BorrowRequest, RequestStatus } from '@/types/studentBorrow';

const { Paragraph } = Typography;

interface BorrowHistoryTableProps {
  borrowRequests: BorrowRequest[];
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

const BorrowHistoryTable: React.FC<BorrowHistoryTableProps> = ({
  borrowRequests,
}) => {
  const columns = [
    {
      title: 'Mã yêu cầu',
      dataIndex: 'id',
      key: 'id',
      width: 140,
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
      width: 100,
    },
    {
      title: 'Ngày mượn',
      dataIndex: 'borrowDate',
      key: 'borrowDate',
    },
    {
      title: 'Hạn trả',
      dataIndex: 'expectedReturnDate',
      key: 'expectedReturnDate',
    },
    {
      title: 'Ngày trả thực tế',
      dataIndex: 'actualReturnDate',
      key: 'actualReturnDate',
      render: (value?: string) => value || 'Chưa trả',
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
    <Table
      rowKey="id"
      columns={columns}
      dataSource={borrowRequests}
      pagination={{ pageSize: 5 }}
      expandable={{
        expandedRowRender: (record) => (
          <div>
            <Paragraph>
              <strong>Lý do mượn:</strong> {record.reason}
            </Paragraph>

            {record.rejectReason && (
              <Paragraph type="danger">
                <strong>Lý do từ chối:</strong> {record.rejectReason}
              </Paragraph>
            )}
          </div>
        ),
      }}
    />
  );
};

export default BorrowHistoryTable;