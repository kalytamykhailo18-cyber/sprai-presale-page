import React from 'react';
import { config } from '../../../config';

const CampaignSection: React.FC = () => {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-6 anim-flip-down anim-normal"
          style={{ color: '#1a1a1a' }}
        >
          Campanhas Ambientais
        </h2>

        <div
          className="border-2 border-black/30 p-12 text-center transition-all duration-300 hover:scale-105 hover:border-black/60 bg-white/20 anim-zoom-in anim-slow anim-delay-200"
          style={{ borderRadius: '6px' }}
        >
          <div className="text-7xl mb-6">🌳</div>
          <p className="text-black/80 text-xl sm:text-2xl leading-relaxed">
            Participe da campanha <strong className="text-black">"Plante e Ganhe {config.tokenSymbol}"</strong>.
            Incentive a preservacao plantando uma Arvore!
          </p>
        </div>
      </div>
    </section>
  );
};

export default CampaignSection;
