export const resorts = [
  { id: 1, name: 'Val Thorens' },
  { id: 2, name: 'Courchevel' },
  { id: 3, name: 'Tignes' },
  { id: 4, name: 'La Plagne' },
  { id: 5, name: 'Chamonix' }
];

export const resortMap: Record<number, string> = Object.fromEntries(
  resorts.map(resort => [resort.id, resort.name])
);

export function getResortNameById(id: number): string {
  return resortMap[id] || '';
}
