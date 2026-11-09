import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Person } from '../lib/types';
import { ageOf, ageText, fmtDate } from '../lib/utils';
import Photo from './Photo';
import Lightbox from './Lightbox';

export default function PersonCard({ p }: { p: Person }) {
  const [open, setOpen] = useState(false);
  const ids = p.mainId ? [p.mainId, ...p.photos.map(x => x.id).filter(x => x !== p.mainId)] : [];
  return (
    <article className="pcard">
      <button className="pcard-ph" onClick={() => ids.length && setOpen(true)} aria-label={`Открыть фото: ${p.name}`}>
        <Photo id={p.mainId} alt={p.name} />
      </button>
      <Link to={`/person/${p.id}`} className="pcard-t">
        <h3>{p.name}</h3>
        <p className="date">{fmtDate(p.birth)}</p>
        <p className="age">Сейчас {ageText(ageOf(p.birth))}</p>
      </Link>
      {open && <Lightbox ids={ids} onClose={() => setOpen(false)} />}
    </article>
  );
}
