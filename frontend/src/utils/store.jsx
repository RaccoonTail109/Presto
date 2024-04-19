import http from './request';

export async function getStore () {
  const { store } = await http.get('/store');
  return store.store;
}

export async function putStore (store) {
  const result = await http.put('/store', { store });
  return result;
}

export async function deleteSlide (id) {
  const store = await getStore();
  delete store[id];
  return putStore(store);
}

export async function getSlideDetails (id) {
  const store = await getStore();
  return store[id];
}
