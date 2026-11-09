import { useBlobUrl } from '../lib/store';

export default function Photo({ id, alt = '', className }: { id?: string | null; alt?: string; className?: string }) {
  const url = useBlobUrl(id);
  if (!url) return <div className={'ph-empty ' + (className ?? '')}><span>Здесь будет фото</span></div>;
  return <img className={className} src={url} alt={alt} />;
}
