import { request } from 'umi';

export const authModel = {
  namespace: 'auth',
  state: { user: null as any | null },
  effects: {
    *fetch(_, { call, put }: any) {
      const res = yield call(() => request('/api/me'));
      yield put({ type: 'save', payload: res });
    },
  },
  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, user: payload };
    },
  },
};

export default authModel;
