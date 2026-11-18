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
import { InteractiveDashboardSection } from './components/InteractiveDashboardSection';
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

  const handleSelectDashboardForQuote = ({
    nicheLabel,
    moduleLabel,
  }: {
    nicheLabel: string;
    moduleLabel: string;
  }) => {
    setQuoteContext({
      solutionType: 'pronta',
      niche: nicheLabel,
      referenceProject: `${moduleLabel} (${nicheLabel})`,
    });
    scrollToSection('contato');
  };

  const handleApplyEstimatedHours = (hoursSaved: number) => {
    setQuoteContext((prev) => ({
      solutionType: prev?.solutionType ?? 'personalizada',
      niche: prev?.niche,
      referenceProject: prev?.referenceProject,
      estimatedHoursSaved: hoursSaved,
    }));
    scrollToSection('contato');
  };

  const handleRequestFromRepo = (repo: ShowcaseRepository) => {
    setQuoteContext({
      solutionType: 'repositorio',
      referenceProject: `${repo.fullName} — ${repo.title}`,
    });
    scrollToSection('contato');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onRequestSolution={() => scrollToSection('contato')} />

      <main>
        <HeroSection
          onExploreDashboard={() => scrollToSection('painel')}
          onExploreRepos={() => scrollToSection('repositorios')}
        />

        <InteractiveDashboardSection onSelectForQuote={handleSelectDashboardForQuote} />

        <BusinessEvolutionSection onApplyEstimatedHours={handleApplyEstimatedHours} />

        <GitHubShowcaseSection onRequestFromRepo={handleRequestFromRepo} />

        <SpecialistAndStackSection />

        <SolutionsAndQuoteSection preselectedContext={quoteContext} />
      </main>

      <Footer />
    </div>
  );
}

