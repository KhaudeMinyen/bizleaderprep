
import React from 'react';
import { OrgType } from '../App';

interface CallToActionProps {
  onGetStarted: () => void;
  orgType: OrgType;
}

const CallToAction: React.FC<CallToActionProps> = ({ onGetStarted, orgType }) => {
  const brandColorClass = orgType === 'FBLA' ? 'bg-rh-green' : orgType === 'DECA' ? 'bg-rh-cyan' : 'bg-rh-yellow';
  const brandShadowClass = orgType === 'FBLA' ? 'shadow-[0_0_50px_rgba(0,200,5,0.25)]' : orgType === 'DECA' ? 'shadow-[0_0_50px_rgba(0,166,224,0.25)]' : 'shadow-[0_0_50px_rgba(255,218,0,0.25)]';
  const brandGlowClass = orgType === 'FBLA' ? 'bg-rh-green/5' : orgType === 'DECA' ? 'bg-rh-cyan/5' : 'bg-rh-yellow/5';

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className={`absolute -right-40 -top-40 w-[600px] h-[600px] ${brandGlowClass} rounded-full blur-[120px]`}></div>
        <div className="absolute -left-40 -bottom-40 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]"></div>
      </div>
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="bg-rh-dark border border-white/5 rounded-[40px] p-12 md:p-24 max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8">
            Start Focusing on <br /> Mastery Today
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-lg text-rh-gray font-medium mb-12">
            Join the elite circle of students using AI to dominate their {orgType} competitive events. Free for the 2025-26 season.
          </p>
          <button 
            onClick={onGetStarted}
            className={`${brandColorClass} text-black font-black px-16 py-5 rounded-full hover:scale-105 transition-all ${brandShadowClass} uppercase tracking-widest text-xs`}
          >
            Start Studying
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
