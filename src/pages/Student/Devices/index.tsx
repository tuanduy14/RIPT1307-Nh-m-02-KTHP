import React from 'react';
import { Button, Card, Space, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import { StudentBorrowModelState } from '@/models/studentBorrowModel';
import { Device } from '@/types/studentBorrow';
import DeviceTable from '@/components/Student/DeviceTable';
import DeviceDetailModal from '@/components/Student/DeviceDetailModal';
import DeviceFormModal from '@/components/Student/DeviceFormModal';

const { Title, Paragraph } = Typography;

interface DevicesPageProps {
	studentBorrow: StudentBorrowModelState;
	dispatch: any;
}

const DevicesPage: React.FC<DevicesPageProps> = ({ studentBorrow, dispatch }) => {
	const { devices } = studentBorrow;

	const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null);
	const [visibleDetail, setVisibleDetail] = React.useState(false);
	const [visibleAddModal, setVisibleAddModal] = React.useState(false);

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

	const handleAddDevice = (device: Device) => {
		dispatch({
			type: 'studentBorrow/addDevice',
			payload: device,
		});

		setVisibleAddModal(false);
		message.success('Thêm thiết bị mới thành công');
	};

	return (
		<>
			<Space
				style={{
					width: '100%',
					justifyContent: 'space-between',
					alignItems: 'flex-start',
					marginBottom: 16,
				}}
			>
				<div>
					<Title level={3}>Danh sách thiết bị</Title>
					<Paragraph type='secondary'>
						Sinh viên có thể xem thông tin thiết bị, số lượng còn lại và gửi yêu cầu mượn.
					</Paragraph>
				</div>

				<Button type='primary' icon={<PlusOutlined />} onClick={() => setVisibleAddModal(true)}>
					Thêm thiết bị
				</Button>
			</Space>

			<Card>
				<DeviceTable devices={devices} onViewDetail={handleViewDetail} onBorrow={handleBorrow} />
			</Card>

			<DeviceDetailModal
				visible={visibleDetail}
				device={selectedDevice}
				onCancel={() => setVisibleDetail(false)}
				onBorrow={handleBorrow}
			/>

			<DeviceFormModal
				visible={visibleAddModal}
				onCancel={() => setVisibleAddModal(false)}
				onSubmit={handleAddDevice}
			/>
		</>
	);
};

export default connect(({ studentBorrow }: any) => ({
	studentBorrow,
}))(DevicesPage);
