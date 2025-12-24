import React from 'react';
import { config } from '../../../config';

const AboutSection: React.FC = () => {
  const features = [
    { icon: '🌱', text: 'Sustentabilidade', delay: '200' },
    { icon: '🔗', text: 'BNB Smart Chain', delay: '300' },
    { icon: '📊', text: `${config.tokenTotalSupply.toLocaleString()} Supply`, delay: '400' },
    { icon: '💎', text: 'Token com Propósito', delay: '500' },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-6 anim-zoom-in anim-normal"
          style={{ color: '#1a1a1a' }}
        >
          Sobre o {config.tokenSymbol}
        </h2>

        <p className="text-lg sm:text-xl text-center mb-12 text-black/80 max-w-3xl mx-auto leading-relaxed anim-fade-up anim-light-slow anim-delay-200">
          <strong>{config.tokenSymbol}</strong> e um token brasileiro construido na{' '}
          <strong>BNB Smart Chain</strong> com o objetivo de unir tecnologia, cultura local e
          sustentabilidade. Com foco em um futuro descentralizado e responsavel.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`border border-black/30 p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-black/60 bg-white/20 anim-flip-up anim-normal anim-delay-${feature.delay}`}
              style={{ borderRadius: '6px' }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-black text-lg font-bold">{feature.text}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
