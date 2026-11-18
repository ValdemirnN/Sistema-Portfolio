import { PROFILE, whatsappLink } from '../data/profile';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#060B16]/60 backdrop-blur-sm py-10">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <p className="font-display text-sm font-bold text-white">{PROFILE.name}</p>
          <p className="mt-1 text-xs text-slate-400">{PROFILE.role}</p>
          <p className="mt-1 text-xs text-slate-400">
            <a href={`mailto:${PROFILE.email}`} className="hover:text-white">{PROFILE.email}</a>
            {' · '}
            <a href={whatsappLink()} className="hover:text-white">{PROFILE.phoneDisplay}</a>
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
