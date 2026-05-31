import React from 'react';
import { Card, Col, Row, Statistic, Table, Tag, Typography, Space, Button, Empty, Progress, Divider } from 'antd';
import {
	AppstoreOutlined,
	ClockCircleOutlined,
	HistoryOutlined,
	SendOutlined,
	BellOutlined,
	ArrowRightOutlined,
} from '@ant-design/icons';
import { connect, history } from 'umi';
import moment from 'moment';
import { StudentBorrowModelState } from '@/models/studentBorrowModel';
import { RequestStatus } from '@/types/studentBorrow';

const { Title, Paragraph, Text } = Typography;

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
	const { devices, borrowRequests, notifications, currentUser } = studentBorrow;

	const availableDevices = devices.filter((item) => item.availableQuantity > 0);

	const pendingRequests = borrowRequests.filter((item) => item.status === 'Chờ duyệt');

	const activeBorrowing = borrowRequests.filter((item) => item.status === 'Đã duyệt' || item.status === 'Quá hạn');

	const returnedRequests = borrowRequests.filter((item) => item.status === 'Đã trả');

	const expiringSoon = activeBorrowing.filter((item) => {
		const diff = moment(item.expectedReturnDate).diff(moment(), 'day');
		return diff >= 0 && diff <= 1;
	});

	const unreadNotifications = notifications.filter((item) => !item.isRead);

	const totalDeviceQuantity = devices.reduce((sum, item) => sum + item.totalQuantity, 0);

	const totalAvailableQuantity = devices.reduce((sum, item) => sum + item.availableQuantity, 0);

	const availablePercent =
		totalDeviceQuantity > 0 ? Math.round((totalAvailableQuantity / totalDeviceQuantity) * 100) : 0;

	const recentRequests = borrowRequests.slice(0, 5);

	const columns = [
		{
			title: 'Mã yêu cầu',
			dataIndex: 'id',
			key: 'id',
			width: 150,
			ellipsis: true,
		},
		{
			title: 'Thiết bị',
			dataIndex: 'deviceName',
			key: 'deviceName',
			ellipsis: true,
		},
		{
			title: 'SL',
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'center' as const,
			width: 70,
		},
		{
			title: 'Hạn trả',
			dataIndex: 'expectedReturnDate',
			key: 'expectedReturnDate',
			width: 115,
			render: (value: string) => moment(value).format('DD/MM/YYYY'),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			width: 110,
			align: 'center' as const,
			render: (status: RequestStatus) => <Tag color={getStatusColor(status)}>{status}</Tag>,
		},
	];

	return (
		<div>
			<Card
				style={{
					borderRadius: 12,
					marginBottom: 20,
				}}
				bodyStyle={{ padding: 24 }}
			>
				<Row gutter={[24, 24]} align='middle'>
					<Col xs={24} lg={16}>
						<Text type='secondary'>Xin chào,</Text>

						<Title level={2} style={{ margin: '6px 0 8px' }}>
							{currentUser?.fullName || 'Sinh viên'}
						</Title>

						<Paragraph type='secondary' style={{ marginBottom: 0, fontSize: 15 }}>
							Theo dõi nhanh tình trạng mượn thiết bị, yêu cầu đang chờ duyệt, thiết bị sắp đến hạn trả và thông báo
							mới.
						</Paragraph>
					</Col>

					<Col xs={24} lg={8}>
						<Card size='small' style={{ borderRadius: 10 }} bodyStyle={{ padding: 18 }}>
							<Space direction='vertical' size={10} style={{ width: '100%' }}>
								<Text strong>Tình trạng kho thiết bị</Text>

								<Progress percent={availablePercent} status={availablePercent <= 20 ? 'exception' : 'active'} />

								<Text type='secondary'>
									Còn {totalAvailableQuantity}/{totalDeviceQuantity} thiết bị có thể mượn
								</Text>
							</Space>
						</Card>
					</Col>
				</Row>
			</Card>

			<Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card bordered={false} style={{ borderRadius: 12, height: '100%' }}>
						<Space direction='vertical' size={12} style={{ width: '100%' }}>
							<Space
								style={{
									width: 44,
									height: 44,
									borderRadius: 10,
									background: '#e6f4ff',
									color: '#1677ff',
									justifyContent: 'center',
									fontSize: 20,
								}}
							>
								<AppstoreOutlined />
							</Space>

							<Statistic title='Thiết bị có thể mượn' value={availableDevices.length} suffix='loại' />

							<Button type='link' style={{ padding: 0 }} onClick={() => history.push('/student/devices')}>
								Xem danh sách <ArrowRightOutlined />
							</Button>
						</Space>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card bordered={false} style={{ borderRadius: 12, height: '100%' }}>
						<Space direction='vertical' size={12} style={{ width: '100%' }}>
							<Space
								style={{
									width: 44,
									height: 44,
									borderRadius: 10,
									background: '#fff7e6',
									color: '#fa8c16',
									justifyContent: 'center',
									fontSize: 20,
								}}
							>
								<SendOutlined />
							</Space>

							<Statistic title='Yêu cầu chờ duyệt' value={pendingRequests.length} suffix='yêu cầu' />

							<Button type='link' style={{ padding: 0 }} onClick={() => history.push('/student/history')}>
								Xem lịch sử <ArrowRightOutlined />
							</Button>
						</Space>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card bordered={false} style={{ borderRadius: 12, height: '100%' }}>
						<Space direction='vertical' size={12} style={{ width: '100%' }}>
							<Space
								style={{
									width: 44,
									height: 44,
									borderRadius: 10,
									background: '#f6ffed',
									color: '#52c41a',
									justifyContent: 'center',
									fontSize: 20,
								}}
							>
								<HistoryOutlined />
							</Space>

							<Statistic title='Đang mượn' value={activeBorrowing.length} suffix='lượt' />

							<Text type='secondary'>Đã trả: {returnedRequests.length} lượt</Text>
						</Space>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card bordered={false} style={{ borderRadius: 12, height: '100%' }}>
						<Space direction='vertical' size={12} style={{ width: '100%' }}>
							<Space
								style={{
									width: 44,
									height: 44,
									borderRadius: 10,
									background: '#fff1f0',
									color: '#cf1322',
									justifyContent: 'center',
									fontSize: 20,
								}}
							>
								<ClockCircleOutlined />
							</Space>

							<Statistic title='Sắp đến hạn' value={expiringSoon.length} suffix='lượt' />

							<Text type='secondary'>Thông báo mới: {unreadNotifications.length}</Text>
						</Space>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} align='stretch'>
				<Col xs={24} xl={17}>
					<Card
						title='Các yêu cầu gần đây'
						extra={
							<Button type='link' onClick={() => history.push('/student/history')}>
								Xem tất cả
							</Button>
						}
						style={{
							borderRadius: 12,
							height: '100%',
							minHeight: 360,
						}}
						bodyStyle={{
							padding: 16,
						}}
					>
						{recentRequests.length > 0 ? (
							<Table rowKey='id' columns={columns} dataSource={recentRequests} pagination={false} tableLayout='fixed' />
						) : (
							<Empty description='Bạn chưa có yêu cầu mượn nào' />
						)}
					</Card>
				</Col>

				<Col xs={24} xl={7}>
					<Card
						title='Thao tác nhanh'
						style={{
							borderRadius: 12,
							height: '100%',
							minHeight: 360,
						}}
						bodyStyle={{
							padding: 20,
						}}
					>
						<Space direction='vertical' size={14} style={{ width: '100%' }}>
							<Button
								block
								type='primary'
								icon={<SendOutlined />}
								onClick={() => history.push('/student/borrow-request')}
							>
								Gửi yêu cầu mượn mới
							</Button>

							<Button block icon={<AppstoreOutlined />} onClick={() => history.push('/student/devices')}>
								Xem thiết bị có sẵn
							</Button>

							<Button block icon={<BellOutlined />} onClick={() => history.push('/student/notifications')}>
								Xem thông báo
							</Button>
						</Space>

						<Divider />

						<Title level={5} style={{ marginBottom: 16 }}>
							Tóm tắt tài khoản
						</Title>

						<Space direction='vertical' size={10} style={{ width: '100%' }}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									gap: 12,
								}}
							>
								<Text type='secondary'>Sinh viên</Text>
								<Text strong>{currentUser?.fullName || 'Chưa xác định'}</Text>
							</div>

							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									gap: 12,
								}}
							>
								<Text type='secondary'>Tổng yêu cầu</Text>
								<Text strong>{borrowRequests.length}</Text>
							</div>

							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									gap: 12,
								}}
							>
								<Text type='secondary'>Chờ duyệt</Text>
								<Text strong>{pendingRequests.length}</Text>
							</div>

							<div
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									gap: 12,
								}}
							>
								<Text type='secondary'>Thông báo chưa đọc</Text>
								<Text strong>{unreadNotifications.length}</Text>
							</div>
						</Space>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default connect(({ studentBorrow }: any) => ({
	studentBorrow,
}))(DashboardPage);
