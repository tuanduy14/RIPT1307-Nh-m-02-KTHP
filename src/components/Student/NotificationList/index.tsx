import React from 'react';
import { Badge, Button, Empty, List, Space, Tag, Typography } from 'antd';
import { StudentNotification } from '@/types/studentBorrow';

const { Text } = Typography;

interface NotificationListProps {
  notifications: StudentNotification[];
  onReadAll: () => void;
}

function getBadgeStatus(type: StudentNotification['type']) {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'processing';
    default:
      return 'default';
  }
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onReadAll,
}) => {
  if (notifications.length === 0) {
    return <Empty description="Chưa có thông báo" />;
  }

  return (
    <>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button onClick={onReadAll}>Đánh dấu tất cả là đã đọc</Button>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Badge status={getBadgeStatus(item.type)} />}
              title={
                <Space>
                  <Text strong={!item.isRead}>{item.title}</Text>
                  {!item.isRead && <Tag color="blue">Mới</Tag>}
                </Space>
              }
              description={
                <Space direction="vertical" size={2}>
                  <Text>{item.content}</Text>
                  <Text type="secondary">
                    {new Date(item.createdAt).toLocaleString('vi-VN')}
                  </Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default NotificationList;