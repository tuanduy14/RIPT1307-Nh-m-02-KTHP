import React from 'react';
import { Typography } from 'antd';
import { connect, history } from 'umi';
import { StudentBorrowModelState } from '@/models/studentBorrowModel';
import BorrowRequestForm from '@/components/Student/BorrowRequestForm';
import { BorrowRequest } from '@/types/studentBorrow';

const { Title, Paragraph } = Typography;

interface BorrowRequestPageProps {
  studentBorrow: StudentBorrowModelState;
  dispatch: any;
  location: {
    query?: {
      deviceId?: string;
    };
  };
}

const BorrowRequestPage: React.FC<BorrowRequestPageProps> = ({
  studentBorrow,
  dispatch,
  location,
}) => {
  const { devices, currentUser } = studentBorrow;

  React.useEffect(() => {
    dispatch({
      type: 'studentBorrow/fetchDevices',
    });
  }, []);

  const handleSubmit = (request: BorrowRequest) => {
    dispatch({
      type: 'studentBorrow/submitBorrowRequest',
      payload: request,
    });

    history.push('/student/history');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Title level={3}>Gửi yêu cầu mượn thiết bị</Title>
      <Paragraph type="secondary">
        Vui lòng chọn thiết bị, nhập số lượng, ngày mượn, ngày trả dự kiến và lý do mượn.
      </Paragraph>

      <BorrowRequestForm
        devices={devices}
        currentUser={currentUser}
        selectedDeviceId={location.query?.deviceId}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default connect(({ studentBorrow }: any) => ({
  studentBorrow,
}))(BorrowRequestPage);