import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '../data/profile';
import { trackClick } from '../lib/notify';

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      onClick={() => trackClick('clique-whatsapp', 'Botão flutuante')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com Valdemir no WhatsApp"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-900/40 transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
    >
      <span className="wa-ping absolute inset-0 rounded-full bg-[#25D366]" aria-hidden="true" />
      <MessageCircle className="relative h-7 w-7" aria-hidden="true" />
    </a>
  );
}
