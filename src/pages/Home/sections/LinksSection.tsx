import React from 'react';
import { config } from '../../../config';

const LinksSection: React.FC = () => {
  const socialLinks = [
    { icon: '✅', label: 'Contrato Verificado (BscScan)', url: config.spraiTokenContract ? `${config.blockExplorerUrl}address/${config.spraiTokenContract}` : null, delay: '200' },
    { icon: '📸', label: 'Instagram', url: config.instagramUrl, delay: '300' },
    { icon: '📘', label: 'Facebook', url: config.facebookUrl, delay: '400' },
    { icon: '🐦', label: 'Twitter (X)', url: config.twitterUrl, delay: '500' },
    { icon: '💬', label: 'Telegram', url: config.telegramUrl, delay: '600' },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-2xl">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 anim-zoom-in anim-normal"
          style={{ color: '#1a1a1a' }}
        >
          Links Oficiais
        </h2>

        <div className="flex flex-col gap-4 items-center">
          {socialLinks.filter(link => link.url).map((link) => (
            <a
              key={link.label}
              href={link.url!}
              target="_blank"
              rel="noopener noreferrer"
              className={`border border-black/30 text-black font-bold px-8 py-4 w-full sm:w-96 text-center bg-white/20 transition-all duration-300 hover:border-black/60 hover:-translate-y-1 anim-fade-up anim-normal anim-delay-${link.delay}`}
              style={{ borderRadius: '6px' }}
            >
              {link.icon} {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LinksSection;
