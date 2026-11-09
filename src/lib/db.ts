const DB = 'memory-calendar', ST = 'blobs';
function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(ST);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
export async function putBlob(key: string, blob: Blob) {
  const db = await open();
  return new Promise<void>((res, rej) => {
    const t = db.transaction(ST, 'readwrite');
    t.objectStore(ST).put(blob, key);
    t.oncomplete = () => res();
    t.onerror = () => rej(t.error);
  });
}
export async function getBlob(key: string) {
  const db = await open();
  return new Promise<Blob | undefined>((res, rej) => {
    const q = db.transaction(ST).objectStore(ST).get(key);
    q.onsuccess = () => res(q.result as Blob | undefined);
    q.onerror = () => rej(q.error);
  });
}
export async function delBlob(key: string) {
  const db = await open();
  return new Promise<void>((res, rej) => {
    const t = db.transaction(ST, 'readwrite');
    t.objectStore(ST).delete(key);
    t.oncomplete = () => res();
    t.onerror = () => rej(t.error);
  });
}
