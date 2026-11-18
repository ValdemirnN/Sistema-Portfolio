import type { Shot } from '../components/SystemGallery';

/**
 * Prints dos sistemas — carregados automaticamente das pastas:
 *   src/assets/systems/fisiopulso/
 *   src/assets/systems/luz-letras/
 *   src/assets/systems/ritmo-fit/
 *
 * Basta colocar as imagens (png, jpg, jpeg ou webp) na pasta do sistema.
 * A ordem segue o nome do arquivo e a legenda sai do nome:
 *   01-agenda-de-pacientes.png  ->  "Agenda de pacientes"
 * Pasta vazia = o card aparece sem galeria.
 */
const modules = import.meta.glob('../assets/systems/*/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function captionFromFile(file: string): string {
  const base = file.replace(/\.[^.]+$/, '').replace(/^\d+[\s._-]*/, '');
  const text = base.replace(/[-_]+/g, ' ').trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : 'Tela do sistema';
}

export function getShots(systemId: string): Shot[] {
  const marker = `/systems/${systemId}/`;
  return Object.entries(modules)
    .filter(([path]) => path.includes(marker))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([path, src]) => ({ src, caption: captionFromFile(path.split('/').pop() ?? '') }));
}
