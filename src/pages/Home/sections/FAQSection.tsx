import React from 'react';
import { config } from '../../../config';

const FAQSection: React.FC = () => {
  const faqs = [
    {
      q: `A ${config.tokenSymbol} e segura?`,
      a: 'Sim, nosso contrato e verificado e a liquidez esta travada na Mudra.',
      delay: '200',
      animation: 'fade-left',
    },
    {
      q: `Como compro ${config.tokenSymbol}?`,
      a: `Basta clicar no botao "Comprar ${config.tokenSymbol}", conectar sua MetaMask e confirmar a transacao.`,
      delay: '400',
      animation: 'fade-right',
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 anim-zoom-in anim-normal"
          style={{ color: '#1a1a1a' }}
        >
          FAQ (Perguntas Frequentes)
        </h2>

        <div className="flex flex-col gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border-l-4 border-black/50 p-8 bg-white/20 transition-all duration-300 hover:border-l-8 hover:translate-x-2 anim-${faq.animation} anim-light-slow anim-delay-${faq.delay}`}
              style={{ borderRadius: '6px' }}
            >
              <h3 className="text-black text-lg font-bold mb-3">Q: {faq.q}</h3>
              <p className="text-black/80 text-base leading-relaxed">R: {faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
