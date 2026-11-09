import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Photo from '../components/Photo';
import Lightbox from '../components/Lightbox';
import { useStore } from '../lib/store';
import { ageOf, ageText, fmtDate, monthOf, MONTHS } from '../lib/utils';
import { PhotoKind } from '../lib/types';

export default function Person() {
  const id = useParams().id;
  const { people, openForm, deletePerson, addPhotos, removePhoto, setMain } = useStore();
  const nav = useNavigate();
  const [lb, setLb] = useState<number | null>(null);
  const childIn = useRef<HTMLInputElement>(null), extraIn = useRef<HTMLInputElement>(null);
  const p = people.find(x => x.id === id);
  if (!p) return <section className="empty box"><p>Эта карточка не найдена.</p><Link className="btn" to="/people">К списку</Link></section>;
  const ids = p.photos.map(x => x.id);
  const pick = (kind: PhotoKind) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = Array.from(e.target.files ?? []); if (f.length) void addPhotos(p.id, f, kind); e.target.value = '';
  };
  return (
    <section className="person">
      <Link to={`/month/${monthOf(p.birth)}`} className="back dark">← {MONTHS[monthOf(p.birth) - 1]}</Link>
      <div className="phead">
        <div className="pmain">{p.mainId ? <Photo id={p.mainId} alt={p.name} /> : <div className="ph-empty"><span>Здесь будет фото</span></div>}</div>
        <div>
          <h1 className="script">{p.name}</h1>
          <p className="date">{fmtDate(p.birth)}</p>
          <p className="age">Сейчас {ageText(ageOf(p.birth))}</p>
          {p.note && <p className="note">{p.note}</p>}
          <div className="row">
            <button className="btn" onClick={() => openForm(p.id)}>Изменить</button>
            <button className="btn ghost" onClick={() => { if (confirm(`Удалить «${p.name}» вместе с фотографиями?`)) { deletePerson(p.id); nav('/people'); } }}>Удалить</button>
          </div>
        </div>
      </div>
      <div className="row tools">
        <button className="btn ghost" onClick={() => childIn.current?.click()}>+ Детские фото</button>
        <button className="btn ghost" onClick={() => extraIn.current?.click()}>+ Другие фото</button>
        <input ref={childIn} type="file" accept="image/*" multiple hidden onChange={pick('child')} />
        <input ref={extraIn} type="file" accept="image/*" multiple hidden onChange={pick('extra')} />
      </div>
      {p.photos.length === 0 ? <p className="empty">Фотографий пока нет. Добавь первую, и она появится здесь.</p> : (
        <div className="masonry">
          {p.photos.map((ph, i) => (
            <figure key={ph.id}>
              <button onClick={() => setLb(i)} aria-label="Открыть фото"><Photo id={ph.id} /></button>
              <figcaption>
                <span>{ph.kind === 'child' ? 'Детство' : 'Ещё'}{ph.id === p.mainId ? ' · главное' : ''}</span>
                {ph.id !== p.mainId && <button onClick={() => setMain(p.id, ph.id)}>Сделать главным</button>}
                <button onClick={() => { if (confirm('Удалить это фото?')) removePhoto(p.id, ph.id); }}>Удалить</button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {lb !== null && <Lightbox ids={ids} start={lb} onClose={() => setLb(null)} />}
    </section>
  );
}
