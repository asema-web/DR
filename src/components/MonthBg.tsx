import { useEffect, useState } from 'react';
import { useBlobUrl } from '../lib/store';
import { MONTHS } from '../lib/utils';

// Seasonal fallbacks, used until a photo is available for the month.
const GRADS = [
  'linear-gradient(160deg,#dfe8f0,#8fa3b8 60%,#4b5b70)',
  'linear-gradient(160deg,#f2dfe3,#c79aa6 60%,#7a5666)',
  'linear-gradient(160deg,#e9eadb,#b4bf9a 60%,#6f7d58)',
  'linear-gradient(160deg,#f6e3e8,#e1a9bb 55%,#9a8f6a)',
  'linear-gradient(160deg,#e6efd4,#9fc07a 60%,#4f7545)',
  'linear-gradient(160deg,#dff1f2,#6fb6c4 55%,#2d6580)',
  'linear-gradient(160deg,#f7e7b5,#e0b45a 55%,#8a6a2e)',
  'linear-gradient(160deg,#f6d6b0,#e08d5c 55%,#6a3f45)',
  'linear-gradient(160deg,#efe0c4,#c39a5e 55%,#6b5238)',
  'linear-gradient(160deg,#f1cf93,#c4702f 55%,#5e2f1c)',
  'linear-gradient(160deg,#cfc6bb,#8c7660 55%,#3b3128)',
  'linear-gradient(160deg,#e3e9f2,#7d90b3 55%,#27324d)',
];
// Photos that already contain the month name in their own lettering.
const BAKED = [7, 11];

export default function MonthBg({ n, large = false }: { n: number; large?: boolean }) {
  const custom = useBlobUrl('month-' + n);
  const [bad, setBad] = useState(false);
  const src = custom ?? `${import.meta.env.BASE_URL}months/${String(n).padStart(2, '0')}.jpg`;
  useEffect(() => setBad(false), [src]);
  const baked = !custom && !bad && BAKED.includes(n);
  return (
    <div className={'mbg' + (large ? ' large' : '')} style={{ background: GRADS[n - 1] }}>
      {!bad && <img src={src} alt="" loading="lazy" onError={() => setBad(true)} />}
      <div className="shade" />
      {!baked && <span className="mname">{MONTHS[n - 1]}</span>}
    </div>
  );
}
