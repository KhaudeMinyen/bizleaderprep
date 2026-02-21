
import React from 'react';
import { OrgType } from '../App';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  orgType: OrgType;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, orgType, className = '' }) => {
  const brandTextClass = orgType === 'FBLA' ? 'text-rh-yellow' : orgType === 'DECA' ? 'text-rh-cyan' : 'text-rh-green';
  const brandBorderHoverClass = orgType === 'FBLA' ? 'hover:border-rh-yellow/30' : orgType === 'DECA' ? 'hover:border-rh-cyan/30' : 'hover:border-rh-green/30';

  return (
    <div className={`bg-rh-dark/40 border border-white/5 p-8 md:p-10 rounded-[32px] backdrop-blur-sm transition-all duration-300 ${brandBorderHoverClass} hover:bg-rh-dark/60 h-full flex flex-col items-start ${className}`}>
      <div className={`mb-6 ${brandTextClass}`}>{icon}</div>
      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-rh-gray leading-relaxed text-sm font-medium">{description}</p>
    </div>
  );
};

const Features: React.FC<{ orgType: OrgType }> = ({ orgType }) => {
  const brandTextClass = orgType === 'FBLA' ? 'text-rh-yellow' : orgType === 'DECA' ? 'text-rh-cyan' : 'text-rh-green';
  const brandGlowClass = orgType === 'FBLA' ? 'bg-rh-yellow/5' : orgType === 'DECA' ? 'bg-rh-cyan/5' : 'bg-rh-green/5';

  return (
    <section id="features" className="py-32 bg-black overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className={`${brandTextClass} text-xs font-black uppercase tracking-[0.2em] mb-4`}>Why PrepHub?</div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-6">The Competitive Edge</h2>
          <p className="text-lg text-rh-gray font-medium leading-relaxed max-w-2xl mx-auto">
            Standard study tools aren't enough for national competition. We built a chaotic, adaptive engine that mimics the unpredictability of real {orgType} testing scenarios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative max-w-6xl mx-auto">
          <div className={`absolute top-1/4 right-0 w-[500px] h-[500px] ${brandGlowClass} rounded-full blur-[100px] -z-10 pointer-events-none`}></div>

          <FeatureCard
            orgType={orgType}
            className="md:col-span-8"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            title="AI Flashcards"
            description={`Generate hyper-specific study material instantly using Gemini 3. From ${orgType === 'DECA' ? 'Marketing' : 'Accounting'} to Global Business, we cover it all.`}
          />

          <FeatureCard
            orgType={orgType}
            className="md:col-span-4"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            title="Real-time Analytics"
            description="Track your mastery portfolio. Watch your percentages rise as you conquer difficult topics."
          />

          <FeatureCard
            orgType={orgType}
            className="md:col-span-4"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title="Timed Mock Exams"
            description={`Simulate the pressure of a ${orgType} regional or national conference with timed questions that mimic real test formats.`}
          />

          <FeatureCard
            orgType={orgType}
            className="md:col-span-8"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            title="Peer Benchmarking"
            description={`See where you stand compared to other future leaders. Optimize your study time based on global trends.`}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
