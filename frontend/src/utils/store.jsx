import http from './request';

export async function getStore () {
  const { store } = await http.get('/store');
  return store.store;
}

export async function putStore (store) {
  const result = await http.put('/store', { store });
  return result;
}
