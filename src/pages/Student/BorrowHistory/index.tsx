import React from 'react';
import { Card, Typography } from 'antd';
import { connect } from 'umi';
import { StudentBorrowModelState } from '@/models/studentBorrowModel';
import BorrowHistoryTable from '@/components/Student/BorrowHistoryTable';

const { Title, Paragraph } = Typography;

interface BorrowHistoryPageProps {
  studentBorrow: StudentBorrowModelState;
  dispatch: any;
}

const BorrowHistoryPage: React.FC<BorrowHistoryPageProps> = ({
  studentBorrow,
  dispatch,
}) => {
  const { borrowRequests, currentUser } = studentBorrow;

  React.useEffect(() => {
    dispatch({
      type: 'studentBorrow/fetchBorrowRequests',
    });
  }, []);

  const myRequests = currentUser
    ? borrowRequests.filter((item) => item.studentId === currentUser.id)
    : [];

  return (
    <>
      <Title level={3}>Lịch sử mượn của tôi</Title>
      <Paragraph type="secondary">
        Theo dõi các yêu cầu đã gửi, thiết bị đang mượn, hạn trả và trạng thái xử lý.
      </Paragraph>

      <Card>
        <BorrowHistoryTable borrowRequests={myRequests} />
      </Card>
    </>
  );
};

export default connect(({ studentBorrow }: any) => ({
  studentBorrow,
}))(BorrowHistoryPage);