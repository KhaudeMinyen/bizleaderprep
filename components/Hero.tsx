
import React, { useEffect, useState } from 'react';
import { OrgType } from '../App';

interface HeroProps {
  onGetStarted: () => void;
  orgType: OrgType;
  onNavigate: (path: string) => void;
}

const images = [
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000",
  "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=1000",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000"
];

const ORGS = [
  { 
    name: 'FBLA', 
    logo: 'https://images.unsplash.com/vector-1769952554970-7659a978f58e?q=80&w=2320&auto=format&fit=crop', 
    path: '/fblaprephub',
    active: true,
    accent: 'rh-green'
  },
  { 
    name: 'DECA', 
    logo: 'https://images.unsplash.com/vector-1769952554970-ec7722064e8c?q=80&w=1632&auto=format&fit=crop', 
    path: '/decaprephub',
    active: true,
    accent: 'rh-cyan'
  },
  { 
    name: 'HOSA', 
    logo: 'https://images.unsplash.com/vector-1769952554978-837c3049b3f1?q=80&w=3014&auto=format&fit=crop', 
    path: '#',
    active: false,
    accent: 'rh-gray'
  },
  { 
    name: 'BPA', 
    logo: 'https://images.unsplash.com/vector-1769952555024-4f2f222d05fb?q=80&w=3600&auto=format&fit=crop', 
    path: '#',
    active: false,
    accent: 'rh-gray'
  }
];

const Hero: React.FC<HeroProps> = ({ onGetStarted, orgType, onNavigate }) => {
  const isGeneric = orgType === 'NONE';
  const brandColorClass = orgType === 'FBLA' ? 'bg-rh-green' : orgType === 'DECA' ? 'bg-rh-cyan' : 'bg-rh-yellow';
  const brandTextClass = orgType === 'FBLA' ? 'text-rh-green' : orgType === 'DECA' ? 'text-rh-cyan' : 'text-rh-yellow';
  const glowColorClass = orgType === 'FBLA' ? 'bg-rh-green' : orgType === 'DECA' ? 'bg-rh-cyan' : 'bg-rh-yellow';

  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center text-center overflow-hidden bg-black transition-colors duration-500">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 p-6 opacity-[0.05] filter grayscale scale-110">
          {[...images, ...images].map((src, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 bg-rh-dark">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)]"></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] blur-[150px] rounded-full opacity-10 transition-colors duration-700 ${glowColorClass}`}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 max-w-5xl pt-20">
        {!isGeneric && (
          <div className="inline-block mb-10 overflow-hidden rounded-full relative group">
            <div className={`relative inline-flex items-center space-x-2 px-8 py-3 rounded-full border border-white/10 bg-white/5 ${brandTextClass} text-[10px] font-black uppercase tracking-[0.2em] overflow-hidden`}>
              <span className="relative z-10">{orgType} COMPETITION PREP 2025</span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        )}
        
        <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white leading-[1] mb-8 animate-fade-in-up">
          {isGeneric ? (
            <>
              <span className="text-rh-yellow italic block">BizLeader</span>
              <span className="text-white font-normal block tracking-tight">Prep</span>
            </>
          ) : (
            <>
              {orgType} <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50 italic px-2 inline-block py-2`}>
                PREPHUB
              </span>
            </>
          )}
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-rh-gray mb-16 font-medium leading-relaxed animate-fade-in-up [animation-delay:200ms]">
          {isGeneric 
            ? 'The professional study platform for FBLA and DECA students. AI-driven flashcards and mock exams built for competitive excellence.' 
            : `Gain the ${orgType} competitive edge. Master the official clusters and events with adaptive AI learning paths.`
          }
        </p>
        
        {isGeneric ? (
          <div className="w-full flex flex-wrap justify-center items-center gap-6 md:gap-8 animate-fade-in-up [animation-delay:400ms] py-4">
            {ORGS.map((org, i) => (
              <button 
                key={i} 
                onClick={() => org.active && onNavigate(org.path)}
                className={`flex flex-col items-center space-y-4 p-8 rounded-[40px] border border-white/5 bg-white/5 transition-all duration-300 w-40 md:w-52 ${org.active ? `hover:border-${org.accent}/50 hover:bg-white/10 cursor-pointer hover:scale-105 active:scale-95` : 'opacity-20 grayscale pointer-events-none'}`}
              >
                <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center overflow-hidden rounded-3xl bg-white p-4 shadow-xl">
                  <img src={org.logo} alt={org.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="text-center">
                   <span className="block text-sm font-black text-white tracking-tighter uppercase mb-1">{org.name}</span>
                   {org.active ? (
                     <span className={`text-[8px] font-black ${org.name === 'FBLA' ? 'text-rh-green' : 'text-rh-cyan'} uppercase tracking-widest`}>Available Now</span>
                   ) : (
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Coming Soon</span>
                   )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-up [animation-delay:400ms]">
            <button 
              onClick={onGetStarted}
              className={`w-full sm:w-auto ${brandColorClass} text-black font-black uppercase tracking-widest text-[11px] px-20 py-6 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)]`}
            >
              Start Studying
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(150%); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
