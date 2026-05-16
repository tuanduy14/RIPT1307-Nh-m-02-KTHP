import { request } from 'umi';

export const equipmentsModel = {
  namespace: 'equipments',
  state: {
    list: [] as any[],
  },
  effects: {
    *fetch(_, { call, put }: any) {
      const res = yield call(() => request('/api/equipments'));
      yield put({ type: 'save', payload: res });
    },
  },
  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, list: payload };
    },
  },
};

export default equipmentsModel;
