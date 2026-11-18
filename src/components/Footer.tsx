import { PROFILE, whatsappLink } from '../data/profile';
import { trackClick } from '../lib/notify';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#060B16]/60 backdrop-blur-sm py-10">
      <div className="mx-auto flex max-w-[90rem] flex-col justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-12 2xl:px-16">
        <div>
          <p className="font-display text-sm font-bold text-white">{PROFILE.name}</p>
          <p className="mt-1 text-xs text-slate-400">{PROFILE.role}</p>
          <p className="mt-1 text-xs text-slate-400">
            <a href={`mailto:${PROFILE.email}`} onClick={() => trackClick('clique-email', 'Rodapé')} className="hover:text-white">{PROFILE.email}</a>
            {' · '}
            <a href={whatsappLink()} onClick={() => trackClick('clique-whatsapp', 'Rodapé')} className="hover:text-white">{PROFILE.phoneDisplay}</a>
            {' · '}
            <a href={PROFILE.linkedin} className="hover:text-white">LinkedIn</a>
            {' · '}
            <a href={PROFILE.github} className="hover:text-white">GitHub</a>
          </p>
        </div>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} {PROFILE.fullName} · {PROFILE.city}
        </p>
      </div>
    </footer>
  );
}
