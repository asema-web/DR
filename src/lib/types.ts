export type PhotoKind = 'child' | 'extra';
export interface Photo { id: string; kind: PhotoKind }
export interface Person {
  id: string; name: string; birth: string; note: string;
  photos: Photo[]; mainId?: string;
}
export interface PersonData { name: string; birth: string; note: string }
