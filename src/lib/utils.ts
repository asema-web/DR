export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const MONTHS_RU = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
export const monthOf = (birth: string) => Number(birth.split('-')[1]);
export const dayOf = (birth: string) => Number(birth.split('-')[2]);
export const fmtDate = (birth: string) => `${dayOf(birth)} ${MONTHS_RU[monthOf(birth) - 1]} ${birth.split('-')[0]}`;
export function ageOf(birth: string, now = new Date()) {
  const [y, m, d] = birth.split('-').map(Number);
  let a = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) a--;
  return a;
}
export function daysUntil(birth: string, now = new Date()) {
  const m = monthOf(birth), d = dayOf(birth);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let next = new Date(today.getFullYear(), m - 1, d);
  if (next < today) next = new Date(today.getFullYear() + 1, m - 1, d);
  return Math.round((next.getTime() - today.getTime()) / 864e5);
}
export function plural(n: number, f: [string, string, string]) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return f[2];
  if (b > 1 && b < 5) return f[1];
  if (b === 1) return f[0];
  return f[2];
}
export const ageText = (n: number) => `${n} ${plural(n, ['год', 'года', 'лет'])}`;
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
