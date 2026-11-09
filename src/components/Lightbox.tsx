import { useEffect, useState } from 'react';
import { useBlobUrl } from '../lib/store';

export default function Lightbox({ ids, start = 0, onClose }: { ids: string[]; start?: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const url = useBlobUrl(ids[i]);
  const go = (d: number) => setI(x => (x + d + ids.length) % ids.length);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });
  if (!ids.length) return null;
  return (
    <div className="lb" onClick={onClose} role="dialog" aria-label="Просмотр фото">
      {url && <img src={url} alt="" onClick={e => e.stopPropagation()} />}
      <button className="lb-x" onClick={onClose} aria-label="Закрыть">×</button>
      {ids.length > 1 && <>
        <button className="lb-n prev" onClick={e => { e.stopPropagation(); go(-1); }} aria-label="Назад">‹</button>
        <button className="lb-n next" onClick={e => { e.stopPropagation(); go(1); }} aria-label="Вперёд">›</button>
        <span className="lb-c">{i + 1} / {ids.length}</span>
      </>}
    </div>
  );
}
