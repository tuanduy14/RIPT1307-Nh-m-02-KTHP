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

const DevicesPage: React.FC<DevicesPageProps> = ({ studentBorrow, dispatch }) => {
	const { devices } = studentBorrow;

	const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null);

	const [visibleDetail, setVisibleDetail] = React.useState(false);

	React.useEffect(() => {
		dispatch({
			type: 'studentBorrow/fetchDevices',
		});
	}, [dispatch]);

	const handleViewDetail = (device: Device) => {
		setSelectedDevice(device);
		setVisibleDetail(true);
	};

	const handleBorrow = (device: Device) => {
		history.push(`/student/borrow-request?deviceId=${device.id}`);
	};

	return (
		<>
			<div style={{ marginBottom: 24 }}>
				<Title level={3} style={{ marginBottom: 8 }}>
					Danh sách thiết bị
				</Title>

				<Paragraph type='secondary' style={{ marginBottom: 0 }}>
					Sinh viên có thể xem thông tin thiết bị, số lượng còn lại và gửi yêu cầu mượn.
				</Paragraph>
			</div>

			<Card>
				<DeviceTable devices={devices} onViewDetail={handleViewDetail} onBorrow={handleBorrow} />
			</Card>

			<DeviceDetailModal
				visible={visibleDetail}
				device={selectedDevice}
				onCancel={() => setVisibleDetail(false)}
				onBorrow={handleBorrow}
			/>
		</>
	);
};

export default connect(({ studentBorrow }: any) => ({
	studentBorrow,
}))(DevicesPage);
