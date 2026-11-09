import { Link } from 'react-router-dom';
import MonthBg from '../components/MonthBg';
import TodayBanner from '../components/TodayBanner';
import { useStore } from '../lib/store';
import { MONTHS, daysUntil, fmtDate, monthOf, plural } from '../lib/utils';

export default function Home() {
  const { people } = useStore();
  const counts = Array.from({ length: 12 }, (_, i) => people.filter(p => monthOf(p.birth) === i + 1).map(p => p.name));
  const next = [...people].sort((a, b) => daysUntil(a.birth) - daysUntil(b.birth)).slice(0, 5);
  return (
    <>
      <section className="hero">
        <h1 className="script">Memory Calendar</h1>
        <p>Дни рождения, детские фотографии и маленькие воспоминания. Двенадцать месяцев, собранные в один альбом.</p>
      </section>
      <TodayBanner />
      <section className="grid">
        {MONTHS.map((m, i) => (
          <Link key={m} to={`/month/${i + 1}`} className="mcard" aria-label={m}>
            <MonthBg n={i + 1} />
            {counts[i].length > 0 && <span className="mtag">{counts[i].join(' · ')}</span>}
          </Link>
        ))}
      </section>
      <section className="upcoming">
        <h2 className="script">Ближайшие дни рождения</h2>
        {next.length === 0 ? <p className="empty">Пока здесь нет воспоминаний. Может, добавим кого-нибудь?</p> : (
          <ul>
            {next.map(p => {
              const d = daysUntil(p.birth);
              return (
                <li key={p.id}>
                  <Link to={`/person/${p.id}`}><b>{p.name}</b><span>{fmtDate(p.birth).replace(/ \d{4}$/, '')}</span></Link>
                  <em>{d === 0 ? 'сегодня' : d === 1 ? 'завтра' : `через ${d} ${plural(d, ['день', 'дня', 'дней'])}`}</em>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
