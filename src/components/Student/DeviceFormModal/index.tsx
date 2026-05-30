import React from 'react';
import { Form, Input, InputNumber, Modal, Select, message } from 'antd';
import { Device } from '@/types/studentBorrow';

interface DeviceFormModalProps {
	visible: boolean;
	onCancel: () => void;
	onSubmit: (device: Device) => void;
}

const DeviceFormModal: React.FC<DeviceFormModalProps> = ({ visible, onCancel, onSubmit }) => {
	const [form] = Form.useForm();

	const handleOk = async () => {
		try {
			const values = await form.validateFields();

			if (values.availableQuantity > values.totalQuantity) {
				message.error('Số lượng còn không được lớn hơn tổng số lượng');
				return;
			}

			const newDevice: Device = {
				id: `TB${Date.now()}`,
				name: values.name,
				category: values.category,
				condition: values.condition,
				totalQuantity: values.totalQuantity,
				availableQuantity: values.availableQuantity,
				description: values.description,
			};

			onSubmit(newDevice);
			form.resetFields();
		} catch {
			message.error('Vui lòng kiểm tra lại thông tin thiết bị');
		}
	};

	const handleCancel = () => {
		form.resetFields();
		onCancel();
	};

	return (
		<Modal
			title='Thêm thiết bị mới'
			visible={visible}
			onCancel={handleCancel}
			onOk={handleOk}
			okText='Thêm thiết bị'
			cancelText='Hủy'
			destroyOnClose
		>
			<Form
				form={form}
				layout='vertical'
				initialValues={{
					condition: 'Tốt',
					totalQuantity: 1,
					availableQuantity: 1,
				}}
			>
				<Form.Item label='Tên thiết bị' name='name' rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị' }]}>
					<Input placeholder='Ví dụ: Máy chiếu Epson' />
				</Form.Item>

				<Form.Item
					label='Loại thiết bị'
					name='category'
					rules={[{ required: true, message: 'Vui lòng nhập loại thiết bị' }]}
				>
					<Input placeholder='Ví dụ: Trình chiếu, Âm thanh, Phụ kiện...' />
				</Form.Item>

				<Form.Item
					label='Tình trạng'
					name='condition'
					rules={[{ required: true, message: 'Vui lòng chọn tình trạng' }]}
				>
					<Select placeholder='Chọn tình trạng'>
						<Select.Option value='Tốt'>Tốt</Select.Option>
						<Select.Option value='Hỏng nhẹ'>Hỏng nhẹ</Select.Option>
						<Select.Option value='Đang bảo trì'>Đang bảo trì</Select.Option>
						<Select.Option value='Đang được mượn'>Đang được mượn</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item
					label='Tổng số lượng'
					name='totalQuantity'
					rules={[{ required: true, message: 'Vui lòng nhập tổng số lượng' }]}
				>
					<InputNumber min={1} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Số lượng còn'
					name='availableQuantity'
					rules={[{ required: true, message: 'Vui lòng nhập số lượng còn' }]}
				>
					<InputNumber min={0} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item
					label='Mô tả'
					name='description'
					rules={[{ required: true, message: 'Vui lòng nhập mô tả thiết bị' }]}
				>
					<Input.TextArea rows={4} placeholder='Nhập mô tả ngắn về thiết bị' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default DeviceFormModal;
