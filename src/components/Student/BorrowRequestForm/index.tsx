import React from 'react';
import { Button, Card, DatePicker, Form, Input, InputNumber, Select, message } from 'antd';
import moment from 'moment';
import { BorrowRequest, Device, StudentUser } from '@/types/studentBorrow';

const { TextArea } = Input;

interface BorrowRequestFormProps {
	devices: Device[];
	currentUser: StudentUser;
	selectedDeviceId?: string;
	onSubmit: (request: BorrowRequest) => void;
}

const BorrowRequestForm: React.FC<BorrowRequestFormProps> = ({ devices, currentUser, selectedDeviceId, onSubmit }) => {
	const [form] = Form.useForm();

	const selectedDeviceValue = Form.useWatch('deviceId', form);

	const selectedDevice = devices.find((item) => item.id === selectedDeviceValue);

	React.useEffect(() => {
		if (selectedDeviceId) {
			form.setFieldsValue({
				deviceId: selectedDeviceId,
			});
		}
	}, [selectedDeviceId, form]);

	const disabledBorrowDate = (current: moment.Moment) => {
		return current && current < moment().startOf('day');
	};

	const disabledReturnDate = (current: moment.Moment) => {
		const borrowDate = form.getFieldValue('borrowDate');

		if (!borrowDate) {
			return current && current < moment().startOf('day');
		}

		return current && current <= borrowDate.startOf('day');
	};

	const handleFinish = (values: any) => {
		const device = devices.find((item) => item.id === values.deviceId);

		if (!device) {
			message.error('Thiết bị không tồn tại');
			return;
		}

		if (device.availableQuantity <= 0) {
			message.error('Thiết bị này hiện đã hết hàng');
			return;
		}

		if (values.quantity > device.availableQuantity) {
			message.error('Số lượng mượn không được vượt quá số lượng còn trong kho');
			return;
		}

		if (!values.expectedReturnDate.isAfter(values.borrowDate, 'day')) {
			message.error('Ngày trả dự kiến phải sau ngày mượn');
			return;
		}

		const newRequest: BorrowRequest = {
			id: `YC${Date.now()}`,
			studentId: currentUser.id,
			studentName: currentUser.fullName,
			studentEmail: currentUser.email,
			deviceId: device.id,
			deviceName: device.name,
			quantity: values.quantity,
			borrowDate: values.borrowDate.format('YYYY-MM-DD'),
			expectedReturnDate: values.expectedReturnDate.format('YYYY-MM-DD'),
			reason: values.reason,
			status: 'Chờ duyệt',
			createdAt: new Date().toISOString(),
		};

		onSubmit(newRequest);

		form.resetFields();

		form.setFieldsValue({
			quantity: 1,
			borrowDate: moment(),
			expectedReturnDate: moment().add(3, 'days'),
		});

		message.success('Gửi yêu cầu mượn thành công');
	};

	return (
		<Card title='Gửi yêu cầu mượn thiết bị'>
			<Form
				form={form}
				layout='vertical'
				onFinish={handleFinish}
				initialValues={{
					quantity: 1,
					borrowDate: moment(),
					expectedReturnDate: moment().add(3, 'days'),
				}}
			>
				<Form.Item
					label='Thiết bị muốn mượn'
					name='deviceId'
					rules={[{ required: true, message: 'Vui lòng chọn thiết bị' }]}
				>
					<Select placeholder='Chọn thiết bị'>
						{devices.map((device) => (
							<Select.Option
								key={device.id}
								value={device.id}
								disabled={device.availableQuantity <= 0 || device.condition === 'Đang bảo trì'}
							>
								{device.name} - còn {device.availableQuantity}/{device.totalQuantity}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				{selectedDevice && (
					<Card size='small' style={{ marginBottom: 16, background: '#fafafa' }}>
						<p>
							<strong>Loại:</strong> {selectedDevice.category}
						</p>
						<p>
							<strong>Tình trạng:</strong> {selectedDevice.condition}
						</p>
						<p>
							<strong>Số lượng còn:</strong> {selectedDevice.availableQuantity}/{selectedDevice.totalQuantity}
						</p>
					</Card>
				)}

				<Form.Item
					label='Số lượng mượn'
					name='quantity'
					rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
				>
					<InputNumber min={1} max={selectedDevice?.availableQuantity || 1} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item label='Ngày mượn' name='borrowDate' rules={[{ required: true, message: 'Vui lòng chọn ngày mượn' }]}>
					<DatePicker
						style={{ width: '100%' }}
						format='DD/MM/YYYY'
						placeholder='Chọn ngày mượn'
						disabledDate={disabledBorrowDate}
						onChange={() => {
							form.setFieldsValue({
								expectedReturnDate: undefined,
							});
						}}
					/>
				</Form.Item>

				<Form.Item
					label='Ngày trả dự kiến'
					name='expectedReturnDate'
					rules={[{ required: true, message: 'Vui lòng chọn ngày trả dự kiến' }]}
				>
					<DatePicker
						style={{ width: '100%' }}
						format='DD/MM/YYYY'
						placeholder='Chọn ngày trả dự kiến'
						disabledDate={disabledReturnDate}
					/>
				</Form.Item>

				<Form.Item label='Lý do mượn' name='reason' rules={[{ required: true, message: 'Vui lòng nhập lý do mượn' }]}>
					<TextArea rows={4} placeholder='Ví dụ: Mượn máy chiếu để phục vụ buổi thuyết trình của câu lạc bộ' />
				</Form.Item>

				<Button type='primary' htmlType='submit'>
					Gửi yêu cầu
				</Button>
			</Form>
		</Card>
	);
};

export default BorrowRequestForm;
