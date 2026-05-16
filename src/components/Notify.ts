import { notification } from 'antd';

const notify = {
  success: (msg: string) => notification.success({ message: msg }),
  error: (msg: string) => notification.error({ message: msg }),
  info: (msg: string) => notification.info({ message: msg }),
};

export default notify;
