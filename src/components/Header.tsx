import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PROFILE } from '../data/profile';

const NAV_LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#sistemas', label: 'Sistemas' },
  { href: '#trajetoria', label: 'Trajetória' },
  { href: '#contato', label: 'Contato' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#060B16]/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-8 px-4 sm:px-6 lg:px-12 2xl:px-16">
        <a href="#topo" className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
          {PROFILE.name}
        </a>

        <nav aria-label="Navegação principal" className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="whitespace-nowrap py-1 transition-colors hover:text-white hover:underline hover:underline-offset-4">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contato"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 whitespace-nowrap"
          >
            Solicitar orçamento
          </a>
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            aria-expanded={open}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-200 md:hidden hover:bg-slate-900 cursor-pointer"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-800 bg-[#0B1221]/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-slate-200">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="py-2 hover:text-blue-400">
                {link.label}
              </a>
            ))}
            <a
              href="#contato"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Solicitar orçamento
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
