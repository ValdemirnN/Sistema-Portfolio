/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BusinessEvolutionSection } from './components/BusinessEvolutionSection';
import { Footer } from './components/Footer';
import { GitHubShowcaseSection } from './components/GitHubShowcaseSection';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import {
  SolutionsAndQuoteSection,
  type PreselectedQuoteContext,
} from './components/SolutionsAndQuoteSection';
import { SpecialistAndStackSection } from './components/SpecialistAndStackSection';
import type { ShowcaseRepository } from './lib/github';

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function App() {
  const [quoteContext, setQuoteContext] = useState<PreselectedQuoteContext | null>(null);

  const handleRequestFromRepo = (repo: ShowcaseRepository) => {
    setQuoteContext({
      solutionType: 'repositorio',
      referenceProject: `${repo.fullName} — ${repo.title}`,
    });
    scrollToSection('contato');
  };

  return (
    <div className="min-h-screen bg-[#060B16] text-slate-100">
      <Header onRequestSolution={() => scrollToSection('contato')} />

      <main>
        <HeroSection
          onExploreDashboard={() => scrollToSection('repositorios')}
          onExploreRepos={() => scrollToSection('contato')}
        />

                <BusinessEvolutionSection />

        <GitHubShowcaseSection onRequestFromRepo={handleRequestFromRepo} />

        <SpecialistAndStackSection />

        <SolutionsAndQuoteSection preselectedContext={quoteContext} />
      </main>

      <Footer />
    </div>
  );
}

