import React from 'react';
import { Card, Typography, message } from 'antd';
import { connect } from 'umi';
import { StudentBorrowModelState } from '@/models/studentBorrowModel';
import NotificationList from '@/components/Student/NotificationList';

const { Title, Paragraph } = Typography;

interface NotificationsPageProps {
  studentBorrow: StudentBorrowModelState;
  dispatch: any;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({
  studentBorrow,
  dispatch,
}) => {
  const { notifications } = studentBorrow;

  React.useEffect(() => {
    dispatch({
      type: 'studentBorrow/fetchNotifications',
    });
  }, []);

  const handleReadAll = () => {
    dispatch({
      type: 'studentBorrow/readAllNotifications',
    });

    message.success('Đã đánh dấu tất cả thông báo là đã đọc');
  };

  return (
    <>
      <Title level={3}>Thông báo</Title>
      <Paragraph type="secondary">
        Xem các thông báo liên quan đến yêu cầu mượn, duyệt yêu cầu và hạn trả thiết bị.
      </Paragraph>

      <Card>
        <NotificationList
          notifications={notifications}
          onReadAll={handleReadAll}
        />
      </Card>
    </>
  );
};

export default connect(({ studentBorrow }: any) => ({
  studentBorrow,
}))(NotificationsPage);