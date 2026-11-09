import { useState } from 'react';
import { useStore } from '../lib/store';
import PersonCard from '../components/PersonCard';
import { daysUntil, monthOf, dayOf } from '../lib/utils';

type Sort = 'month' | 'next' | 'name';
export default function People() {
  const { people, openForm } = useStore();
  const [sort, setSort] = useState<Sort>('month');
  const list = [...people].sort((a, b) =>
    sort === 'name' ? a.name.localeCompare(b.name, 'ru')
    : sort === 'next' ? daysUntil(a.birth) - daysUntil(b.birth)
    : monthOf(a.birth) - monthOf(b.birth) || dayOf(a.birth) - dayOf(b.birth));
  return (
    <section className="listpage">
      <h1 className="script">Все именинники</h1>
      <div className="row tools">
        {([['month', 'По месяцам'], ['next', 'Ближайшие'], ['name', 'По имени']] as [Sort, string][]).map(([k, t]) =>
          <button key={k} className={'chip' + (sort === k ? ' on' : '')} onClick={() => setSort(k)}>{t}</button>)}
        <button className="btn" onClick={() => openForm()}>Добавить</button>
      </div>
      {list.length === 0 ? <p className="empty">Пока здесь нет воспоминаний. Может, добавим кого-нибудь?</p>
        : <div className="plist">{list.map(p => <PersonCard key={p.id} p={p} />)}</div>}
    </section>
  );
}
