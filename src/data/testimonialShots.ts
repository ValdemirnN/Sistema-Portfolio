/**
 * Fotos de depoimentos — carregadas das pastas:
 *   src/assets/testimonials/<id-do-sistema>/antes.jpg
 *   src/assets/testimonials/<id-do-sistema>/depois.jpg
 *   src/assets/testimonials/<id-do-sistema>/print-1.png   (opcional: print original da conversa, parte 1)
 *   src/assets/testimonials/<id-do-sistema>/print-2.png   (opcional: print original da conversa, parte 2)
 * (png, jpg, jpeg ou webp). Para um novo sistema, crie a pasta com o mesmo id
 * de SYSTEMS e adicione o campo `testimonial` em src/data/profile.ts.
 */
const modules = import.meta.glob('../assets/testimonials/*/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export interface TestimonialShots {
  before?: string;
  after?: string;
  printTop?: string;
  printBottom?: string;
}

export function getTestimonialShots(systemId: string): TestimonialShots {
  const find = (name: string) =>
    Object.entries(modules).find(([path]) => path.includes(`/testimonials/${systemId}/${name}.`))?.[1];
  return {
    before: find('antes'),
    after: find('depois'),
    printTop: find('print-1'),
    printBottom: find('print-2'),
  };
}
