import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../config';
import AboutSection from './sections/AboutSection';
import CampaignSection from './sections/CampaignSection';
import FAQSection from './sections/FAQSection';
import LinksSection from './sections/LinksSection';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const logoRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePresaleClick = () => {
    navigate('/presale');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!logoRef.current) return;
    const rect = logoRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -20, y: x * 20 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: 'linear-gradient(to right, #FFD700, #2E8B57)',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Hero Section */}
      <header className="min-h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-6xl">
          {/* Logo with 3D Effect */}
          <div
            ref={logoRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="mx-auto mb-8 cursor-pointer"
            style={{
              perspective: '1000px',
              width: 'fit-content',
            }}
          >
            <img
              src="/logo.png"
              alt="SPRAI Logo"
              className="block"
              style={{
                filter: `drop-shadow(${-tilt.y * 0.5}px ${tilt.x * 0.5}px 20px rgba(0, 0, 0, 0.3))`,
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.x !== 0 || tilt.y !== 0 ? 1.02 : 1})`,
                transition: 'transform 0.15s ease-out, filter 0.15s ease-out',
                transformStyle: 'preserve-3d',
              }}
            />
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-center mb-4 anim-zoom-in anim-normal anim-delay-200"
            style={{
              color: '#1a1a1a',
              textShadow: '0 2px 4px rgba(255, 255, 255, 0.3)',
            }}
          >
            {config.tokenSymbol} TOKEN
          </h1>

          {/* Subtitle */}
          <p
            className="text-xl sm:text-2xl lg:text-3xl text-center mb-8 anim-fade-up anim-light-slow anim-delay-400"
            style={{ color: '#1a1a1a', textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)' }}
          >
            A CRIPTOMOEDA PARA UM FUTURO SUSTENTAVEL E DIGITAL
          </p>

          {/* Banner Image - Full Width */}
          <img
            src="/banner-dois.jpeg"
            alt="SPRAI Banner"
            className="w-screen mb-10 block anim-zoom-out anim-slow anim-delay-600 transition-all duration-300 hover:scale-105"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              marginLeft: 'calc(-50vw + 50%)',
              marginRight: 'calc(-50vw + 50%)',
              maxWidth: '100vw',
            }}
          />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center anim-fade-up anim-light-slow anim-delay-800">
            <button
              onClick={handlePresaleClick}
              className="px-8 py-4 font-bold text-black text-lg transition-all hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                boxShadow: '0 8px 20px rgba(255, 215, 0, 0.4)',
                borderRadius: '6px',
              }}
            >
              💰 Comprar {config.tokenSymbol}
            </button>
            <a
              href="/Whitepaper_SPRAI_PT.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 font-bold text-lg transition-all border-2 border-black/40 hover:bg-white/30 text-black"
              style={{ borderRadius: '6px' }}
            >
              Ver Whitepaper (PT)
            </a>
            <a
              href="/Whitepaper_SPRAI_EN.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 font-bold text-lg transition-all border-2 border-black/40 hover:bg-white/30 text-black"
              style={{ borderRadius: '6px' }}
            >
              View Whitepaper (EN)
            </a>
          </div>
        </div>
      </header>

      {/* Sections */}
      <AboutSection />
      <CampaignSection />
      <FAQSection />
      <LinksSection />

      {/* Bottom Banner - Full Width */}
      <div className="py-16 text-center overflow-hidden">
        <img
          src="/sprai-banner.png"
          alt="SPRAI Banner"
          className="w-screen anim-zoom-in anim-slow transition-transform duration-300 hover:scale-105"
          style={{
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.5)',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            maxWidth: '100vw',
          }}
        />
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 text-center border-t border-black/20">
        <p className="text-black/90 mb-2">
          2025 {config.tokenSymbol} Token - Todos os direitos reservados.
        </p>
        <p className="text-black/70 text-sm">Contato: support@spraicoin.net</p>
      </footer>
    </div>
  );
};

export default Home;
