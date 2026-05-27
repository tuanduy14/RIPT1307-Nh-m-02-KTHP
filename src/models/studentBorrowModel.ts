import {
  BorrowRequest,
  Device,
  StudentNotification,
  StudentUser,
} from '@/types/studentBorrow';
import {
  createBorrowRequest,
  getBorrowRequests,
  getCurrentStudent,
  getDevices,
  getNotifications,
  loginStudent,
  logoutStudent,
  markAllNotificationsAsRead,
  resetStudentDemoData,
} from '@/services/studentBorrowService';

export interface StudentBorrowModelState {
  currentUser: StudentUser | null;
  devices: Device[];
  borrowRequests: BorrowRequest[];
  notifications: StudentNotification[];
}

export default {
  namespace: 'studentBorrow',

  state: {
    currentUser: getCurrentStudent(),
    devices: getDevices(),
    borrowRequests: getBorrowRequests(),
    notifications: getNotifications(),
  },

  reducers: {
    save(
      state: StudentBorrowModelState,
      { payload }: { payload: Partial<StudentBorrowModelState> },
    ) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  effects: {
    *login(
      { payload }: { payload: { email: string; password: string } },
      { put }: any,
    ) {
      const user = loginStudent(payload.email, payload.password);

      yield put({
        type: 'save',
        payload: {
          currentUser: user,
        },
      });
    },

    *logout(_: any, { put }: any) {
      logoutStudent();

      yield put({
        type: 'save',
        payload: {
          currentUser: null,
        },
      });
    },

    *fetchDevices(_: any, { put }: any) {
      yield put({
        type: 'save',
        payload: {
          devices: getDevices(),
        },
      });
    },

    *fetchBorrowRequests(_: any, { put }: any) {
      yield put({
        type: 'save',
        payload: {
          borrowRequests: getBorrowRequests(),
        },
      });
    },

    *submitBorrowRequest(
      { payload }: { payload: BorrowRequest },
      { put }: any,
    ) {
      createBorrowRequest(payload);

      yield put({
        type: 'save',
        payload: {
          borrowRequests: getBorrowRequests(),
          notifications: getNotifications(),
        },
      });
    },

    *fetchNotifications(_: any, { put }: any) {
      yield put({
        type: 'save',
        payload: {
          notifications: getNotifications(),
        },
      });
    },

    *readAllNotifications(_: any, { put }: any) {
      markAllNotificationsAsRead();

      yield put({
        type: 'save',
        payload: {
          notifications: getNotifications(),
        },
      });
    },

    *resetDemoData(_: any, { put }: any) {
      resetStudentDemoData();

      yield put({
        type: 'save',
        payload: {
          devices: getDevices(),
          borrowRequests: getBorrowRequests(),
          notifications: getNotifications(),
        },
      });
    },
  },
};