import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Person, PersonData, Photo, PhotoKind } from './types';
import { putBlob, getBlob, delBlob } from './db';
import { uid } from './utils';

const KEY = 'mc_people_v1';
const SEED: Person[] = [
  { id: 'aseka', name: 'Асека', birth: '2010-07-15', note: '', mainId: 'seed-aseka', photos: [{ id: 'seed-aseka', kind: 'child' }] },
  { id: 'diyana', name: 'Дияна', birth: '2009-11-24', note: '', mainId: 'seed-diyana', photos: [{ id: 'seed-diyana', kind: 'child' }] },
];
function load(): Person[] {
  try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) as Person[]; } catch { /* use seed */ }
  return SEED;
}
async function saveFiles(files: File[], kind: PhotoKind): Promise<Photo[]> {
  const out: Photo[] = [];
  for (const f of files) { const id = uid(); await putBlob(id, f); out.push({ id, kind }); }
  return out;
}

interface Ctx {
  people: Person[]; ver: number;
  form: { open: boolean; editId?: string };
  openForm: (editId?: string) => void; closeForm: () => void;
  addPerson: (d: PersonData, child: File[], extra: File[]) => Promise<string>;
  updatePerson: (id: string, d: PersonData, child: File[], extra: File[]) => Promise<void>;
  deletePerson: (id: string) => void;
  addPhotos: (id: string, files: File[], kind: PhotoKind) => Promise<void>;
  removePhoto: (pid: string, photoId: string) => void;
  setMain: (pid: string, photoId: string) => void;
  setMonthPhoto: (n: number, file: File) => Promise<void>;
  resetMonthPhoto: (n: number) => Promise<void>;
}
const C = createContext<Ctx>(null as unknown as Ctx);
export const useStore = () => useContext(C);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>(load);
  const [ver, setVer] = useState(0);
  const [form, setForm] = useState<{ open: boolean; editId?: string }>({ open: false });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(people)); }, [people]);

  useEffect(() => {
    if (localStorage.getItem('mc_seeded')) return;
    (async () => {
      try {
        const base = import.meta.env.BASE_URL;
        for (const [k, f] of [['seed-aseka', 'aseka.jpg'], ['seed-diyana', 'diyana.jpg']]) {
          const r = await fetch(base + f);
          if (!r.ok) throw new Error('seed photo missing');
          await putBlob(k, await r.blob());
        }
        localStorage.setItem('mc_seeded', '1');
        setVer(v => v + 1);
      } catch { /* retried on next launch */ }
    })();
  }, []);

  const value: Ctx = {
    people, ver, form,
    openForm: editId => setForm({ open: true, editId }),
    closeForm: () => setForm({ open: false }),
    addPerson: async (d, child, extra) => {
      const photos = [...(await saveFiles(child, 'child')), ...(await saveFiles(extra, 'extra'))];
      const p: Person = { id: uid(), ...d, photos, mainId: photos[0]?.id };
      setPeople(s => [...s, p]);
      return p.id;
    },
    updatePerson: async (id, d, child, extra) => {
      const photos = [...(await saveFiles(child, 'child')), ...(await saveFiles(extra, 'extra'))];
      setPeople(s => s.map(p => p.id === id ? { ...p, ...d, photos: [...p.photos, ...photos], mainId: p.mainId ?? photos[0]?.id } : p));
    },
    deletePerson: id => {
      people.find(p => p.id === id)?.photos.forEach(x => { void delBlob(x.id); });
      setPeople(s => s.filter(p => p.id !== id));
    },
    addPhotos: async (id, files, kind) => {
      const photos = await saveFiles(files, kind);
      setPeople(s => s.map(p => p.id === id ? { ...p, photos: [...p.photos, ...photos], mainId: p.mainId ?? photos[0]?.id } : p));
    },
    removePhoto: (pid, photoId) => {
      void delBlob(photoId);
      setPeople(s => s.map(p => {
        if (p.id !== pid) return p;
        const photos = p.photos.filter(x => x.id !== photoId);
        return { ...p, photos, mainId: p.mainId === photoId ? photos[0]?.id : p.mainId };
      }));
    },
    setMain: (pid, photoId) => setPeople(s => s.map(p => p.id === pid ? { ...p, mainId: photoId } : p)),
    setMonthPhoto: async (n, file) => { await putBlob('month-' + n, file); setVer(v => v + 1); },
    resetMonthPhoto: async n => { await delBlob('month-' + n); setVer(v => v + 1); },
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useBlobUrl(key?: string | null) {
  const { ver } = useStore();
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let u: string | null = null, dead = false;
    if (!key) { setUrl(null); return; }
    getBlob(key).then(b => {
      if (dead) return;
      if (b) { u = URL.createObjectURL(b); setUrl(u); } else setUrl(null);
    }).catch(() => { if (!dead) setUrl(null); });
    return () => { dead = true; if (u) URL.revokeObjectURL(u); };
  }, [key, ver]);
  return url;
}
