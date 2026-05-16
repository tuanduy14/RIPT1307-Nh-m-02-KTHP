import { request } from 'umi';

export const requestsModel = {
  namespace: 'requests',
  state: { list: [] as any[] },
  effects: {
    *fetch(_, { call, put }: any) {
      const res = yield call(() => request('/api/requests'));
      yield put({ type: 'save', payload: res });
    },
  },
  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, list: payload };
    },
  },
};

export default requestsModel;
