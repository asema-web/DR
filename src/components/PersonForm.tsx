import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';

export default function PersonForm() {
  const { form, closeForm, people, addPerson, updatePerson } = useStore();
  const nav = useNavigate();
  const editing = people.find(p => p.id === form.editId);
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [note, setNote] = useState('');
  const [child, setChild] = useState<File[]>([]);
  const [extra, setExtra] = useState<File[]>([]);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!form.open) return;
    setName(editing?.name ?? ''); setBirth(editing?.birth ?? ''); setNote(editing?.note ?? '');
    setChild([]); setExtra([]); setErr('');
  }, [form.open, form.editId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!form.open) return null;

  async function submit() {
    if (!name.trim()) return setErr('Укажи имя.');
    if (!birth) return setErr('Выбери дату рождения.');
    setBusy(true);
    try {
      const d = { name: name.trim(), birth, note: note.trim() };
      if (editing) { await updatePerson(editing.id, d, child, extra); closeForm(); }
      else { const id = await addPerson(d, child, extra); closeForm(); nav(`/person/${id}`); }
    } catch { setErr('Не удалось сохранить. Попробуй ещё раз.'); }
    setBusy(false);
  }

  return (
    <div className="modal" onClick={closeForm}>
      <div className="sheet" onClick={e => e.stopPropagation()} role="dialog" aria-label="Карточка человека">
        <h2>{editing ? 'Изменить' : 'Новый именинник'}</h2>
        <label>Имя<input value={name} onChange={e => setName(e.target.value)} placeholder="Например, Айдана" /></label>
        <label>Дата рождения<input type="date" value={birth} max={new Date().toISOString().slice(0, 10)} onChange={e => setBirth(e.target.value)} /></label>
        <label>Заметка<textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Воспоминание или пара тёплых слов" /></label>
        <label>Детские фото<input type="file" accept="image/*" multiple onChange={e => setChild(Array.from(e.target.files ?? []))} />
          {child.length > 0 && <small>Выбрано: {child.length}</small>}</label>
        <label>Другие фото<input type="file" accept="image/*" multiple onChange={e => setExtra(Array.from(e.target.files ?? []))} />
          {extra.length > 0 && <small>Выбрано: {extra.length}</small>}</label>
        {err && <p className="err">{err}</p>}
        <div className="row">
          <button className="btn ghost" onClick={closeForm}>Отмена</button>
          <button className="btn" onClick={submit} disabled={busy}>{busy ? 'Сохраняю…' : 'Сохранить'}</button>
        </div>
      </div>
    </div>
  );
}
