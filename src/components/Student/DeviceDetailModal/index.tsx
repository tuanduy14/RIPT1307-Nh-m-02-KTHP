import React from 'react';
import { Button, Descriptions, Modal, Tag } from 'antd';
import { Device } from '@/types/studentBorrow';

interface DeviceDetailModalProps {
	visible: boolean;
	device: Device | null;
	onCancel: () => void;
	onBorrow: (device: Device) => void;
}

const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({ visible, device, onCancel, onBorrow }) => {
	return (
		<Modal
			title='Chi tiết thiết bị'
			visible={visible}
			onCancel={onCancel}
			footer={
				device
					? [
							<Button key='close' onClick={onCancel}>
								Đóng
							</Button>,
							<Button
								key='borrow'
								type='primary'
								disabled={device.availableQuantity <= 0 || device.condition === 'Đang bảo trì'}
								onClick={() => onBorrow(device)}
							>
								Gửi yêu cầu mượn
							</Button>,
					  ]
					: null
			}
		>
			{device && (
				<Descriptions bordered column={1} size='small'>
					<Descriptions.Item label='Mã thiết bị'>{device.id}</Descriptions.Item>

					<Descriptions.Item label='Tên thiết bị'>{device.name}</Descriptions.Item>

					<Descriptions.Item label='Loại thiết bị'>{device.category}</Descriptions.Item>

					<Descriptions.Item label='Tình trạng'>
						<Tag color={device.availableQuantity > 0 ? 'green' : 'red'}>
							{device.availableQuantity > 0 ? device.condition : 'Hết hàng'}
						</Tag>
					</Descriptions.Item>

					<Descriptions.Item label='Tổng số lượng'>{device.totalQuantity}</Descriptions.Item>

					<Descriptions.Item label='Số lượng còn'>{device.availableQuantity}</Descriptions.Item>

					<Descriptions.Item label='Mô tả'>{device.description}</Descriptions.Item>
				</Descriptions>
			)}
		</Modal>
	);
};

export default DeviceDetailModal;
