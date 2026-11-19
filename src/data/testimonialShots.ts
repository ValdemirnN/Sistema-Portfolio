/**
 * Fotos de depoimentos — carregadas das pastas:
 *   src/assets/testimonials/<id-do-sistema>/antes.jpg
 *   src/assets/testimonials/<id-do-sistema>/depois.jpg
 * (png, jpg, jpeg ou webp). Para um novo sistema, crie a pasta com o mesmo id
 * de SYSTEMS e adicione o campo `testimonial` em src/data/profile.ts.
 */
const modules = import.meta.glob('../assets/testimonials/*/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export function getTestimonialShots(systemId: string): { before?: string; after?: string } {
  const find = (name: string) =>
    Object.entries(modules).find(([path]) => path.includes(`/testimonials/${systemId}/${name}.`))?.[1];
  return { before: find('antes'), after: find('depois') };
}
