import { useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { ExperienceSection } from './components/ExperienceSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { StackSection } from './components/StackSection';
import { SystemsSection } from './components/SystemsSection';

export default function App() {
  const [reference, setReference] = useState('');

  const handleRequest = (text: string) => {
    setReference(text);
    document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#060B16] text-slate-100">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <SystemsSection onRequest={handleRequest} />
        <ExperienceSection />
        <StackSection />
        <ContactSection reference={reference} />
      </main>
      <Footer />
    </div>
  );
}
