import React from 'react';
import { Card, Typography } from 'antd';
import { connect, history } from 'umi';
import { StudentBorrowModelState } from '@/models/studentBorrowModel';
import { Device } from '@/types/studentBorrow';
import DeviceTable from '@/components/Student/DeviceTable';
import DeviceDetailModal from '@/components/Student/DeviceDetailModal';

const { Title, Paragraph } = Typography;

interface DevicesPageProps {
  studentBorrow: StudentBorrowModelState;
  dispatch: any;
}

const DevicesPage: React.FC<DevicesPageProps> = ({
  studentBorrow,
  dispatch,
}) => {
  const { devices } = studentBorrow;

  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null);
  const [openDetail, setOpenDetail] = React.useState(false);

  React.useEffect(() => {
    dispatch({
      type: 'studentBorrow/fetchDevices',
    });
  }, []);

  const handleViewDetail = (device: Device) => {
    setSelectedDevice(device);
    setOpenDetail(true);
  };

  const handleBorrow = (device: Device) => {
    history.push(`/student/borrow-request?deviceId=${device.id}`);
  };

  return (
    <>
      <Title level={3}>Danh sách thiết bị</Title>
      <Paragraph type="secondary">
        Sinh viên có thể xem thông tin thiết bị, số lượng còn lại và gửi yêu cầu mượn.
      </Paragraph>

      <Card>
        <DeviceTable
          devices={devices}
          onViewDetail={handleViewDetail}
          onBorrow={handleBorrow}
        />
      </Card>

      <DeviceDetailModal
        open={openDetail}
        device={selectedDevice}
        onCancel={() => setOpenDetail(false)}
        onBorrow={handleBorrow}
      />
    </>
  );
};

export default connect(({ studentBorrow }: any) => ({
  studentBorrow,
}))(DevicesPage);