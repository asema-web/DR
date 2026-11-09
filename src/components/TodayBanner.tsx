import { useStore } from '../lib/store';
import { ageOf, ageText, dayOf, monthOf } from '../lib/utils';

export default function TodayBanner() {
  const { people } = useStore();
  const t = new Date();
  const list = people.filter(p => monthOf(p.birth) === t.getMonth() + 1 && dayOf(p.birth) === t.getDate());
  if (!list.length) return null;
  return (
    <section className="today">
      {list.map(p => (
        <p key={p.id}><span className="script">С днём рождения, {p.name}!</span><br />
          Сегодня тебе исполняется {ageText(ageOf(p.birth))}. Пусть этот год будет светлым.</p>
      ))}
    </section>
  );
}
