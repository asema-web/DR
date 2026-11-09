import { useState } from 'react';
import { Link } from 'react-router-dom';
import Photo from '../components/Photo';
import Lightbox from '../components/Lightbox';
import { useStore } from '../lib/store';

export default function Gallery() {
  const { people } = useStore();
  const [lb, setLb] = useState<number | null>(null);
  const all = people.flatMap(p => p.photos.map(ph => ({ ...ph, owner: p.name, pid: p.id })));
  return (
    <section className="listpage">
      <h1 className="script">Галерея воспоминаний</h1>
      {all.length === 0 ? <p className="empty">В галерее пока пусто. Фотографии появятся здесь после загрузки.</p> : (
        <div className="masonry">
          {all.map((ph, i) => (
            <figure key={ph.id}>
              <button onClick={() => setLb(i)} aria-label="Открыть фото"><Photo id={ph.id} /></button>
              <figcaption><Link to={`/person/${ph.pid}`}>{ph.owner}</Link></figcaption>
            </figure>
          ))}
        </div>
      )}
      {lb !== null && <Lightbox ids={all.map(a => a.id)} start={lb} onClose={() => setLb(null)} />}
    </section>
  );
}
