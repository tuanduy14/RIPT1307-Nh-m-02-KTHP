import React from 'react';
import { Button, Space, Table, Tag } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { Device, DeviceStatus } from '@/types/studentBorrow';

interface DeviceTableProps {
	devices: Device[];
	onViewDetail: (device: Device) => void;
	onBorrow: (device: Device) => void;
}

function getConditionColor(condition: DeviceStatus, availableQuantity: number) {
	if (availableQuantity <= 0) {
		return 'red';
	}

	if (condition === 'Tốt') {
		return 'green';
	}

	if (condition === 'Hỏng nhẹ') {
		return 'orange';
	}

	if (condition === 'Đang bảo trì') {
		return 'default';
	}

	return 'blue';
}

const DeviceTable: React.FC<DeviceTableProps> = ({ devices, onViewDetail, onBorrow }) => {
	const columns = [
		{
			title: 'Mã thiết bị',
			dataIndex: 'id',
			key: 'id',
			width: 120,
		},
		{
			title: 'Tên thiết bị',
			dataIndex: 'name',
			key: 'name',
			render: (text: string, record: Device) => (
				<Button type='link' style={{ padding: 0 }} onClick={() => onViewDetail(record)}>
					{text}
				</Button>
			),
		},
		{
			title: 'Loại',
			dataIndex: 'category',
			key: 'category',
		},
		{
			title: 'Tình trạng',
			dataIndex: 'condition',
			key: 'condition',
			render: (condition: DeviceStatus, record: Device) => (
				<Tag color={getConditionColor(condition, record.availableQuantity)}>
					{record.availableQuantity <= 0 ? 'Hết hàng' : condition}
				</Tag>
			),
		},
		{
			title: 'Số lượng còn',
			dataIndex: 'availableQuantity',
			key: 'availableQuantity',
			align: 'center' as const,
			render: (value: number, record: Device) => (
				<strong>
					{value}/{record.totalQuantity}
				</strong>
			),
		},
		{
			title: 'Thao tác',
			key: 'action',
			align: 'right' as const,
			render: (_: unknown, record: Device) => (
				<Space>
					<Button onClick={() => onViewDetail(record)}>Chi tiết</Button>

					<Button
						type='primary'
						icon={<SendOutlined />}
						disabled={record.availableQuantity <= 0 || record.condition === 'Đang bảo trì'}
						onClick={() => onBorrow(record)}
					>
						Mượn
					</Button>
				</Space>
			),
		},
	];

	return <Table rowKey='id' columns={columns} dataSource={devices} pagination={{ pageSize: 5 }} />;
};

export default DeviceTable;
