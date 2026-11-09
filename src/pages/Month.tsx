import { useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import MonthBg from '../components/MonthBg';
import PersonCard from '../components/PersonCard';
import { useStore } from '../lib/store';
import { monthOf, dayOf } from '../lib/utils';

export default function Month() {
  const n = Number(useParams().n);
  const { people, openForm, setMonthPhoto, resetMonthPhoto } = useStore();
  const file = useRef<HTMLInputElement>(null);
  if (!(n >= 1 && n <= 12)) return <Navigate to="/" replace />;
  const list = people.filter(p => monthOf(p.birth) === n).sort((a, b) => dayOf(a.birth) - dayOf(b.birth));
  return (
    <>
      <div className="mhero"><MonthBg n={n} large />
        <Link to="/" className="back">← Все месяцы</Link></div>
      <section className="mpeople">
        {list.length === 0 ? (
          <div className="empty box">
            <p>Пока здесь нет воспоминаний. Может, добавим кого-нибудь?</p>
            <button className="btn" onClick={() => openForm()}>Добавить человека</button>
          </div>
        ) : <div className="plist">{list.map(p => <PersonCard key={p.id} p={p} />)}</div>}
        <div className="row tools">
          <button className="btn ghost" onClick={() => file.current?.click()}>Сменить фото месяца</button>
          <button className="btn ghost" onClick={() => resetMonthPhoto(n)}>Вернуть исходное</button>
          <input ref={file} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) void setMonthPhoto(n, f); e.target.value = ''; }} />
        </div>
      </section>
    </>
  );
}
