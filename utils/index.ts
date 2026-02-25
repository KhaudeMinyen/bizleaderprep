// Provides createPageUrl for the AnimalStax game components.
// Maps Base44 page names to actual SPA routes within this app.
export function createPageUrl(pageName: string): string {
  const [page, queryString] = pageName.split('?');
  const base = '/fblaprephub/animalstax';

  if (page.toLowerCase() === 'game') {
    return `${base}/game${queryString ? '?' + queryString : ''}`;
  }
  if (page.toLowerCase() === 'home') {
    return base;
  }
  return `${base}/${page.toLowerCase()}`;
}
