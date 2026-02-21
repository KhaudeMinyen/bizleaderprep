
import React from 'react';
import { OrgType } from '../App';

const VisualShowcase: React.FC<{ orgType: OrgType }> = ({ orgType }) => {
  const brandTextClass = orgType === 'FBLA' ? 'text-rh-yellow' : orgType === 'DECA' ? 'text-rh-cyan' : 'text-rh-green';
  const brandBgClass = orgType === 'FBLA' ? 'bg-rh-yellow' : orgType === 'DECA' ? 'bg-rh-cyan' : 'bg-rh-green';
  const brandGlowClass = orgType === 'FBLA' ? 'bg-rh-yellow/5' : orgType === 'DECA' ? 'bg-rh-cyan/5' : 'bg-rh-green/5';
  const brandBorderHoverClass = orgType === 'FBLA' ? 'hover:border-rh-yellow/30' : orgType === 'DECA' ? 'hover:border-rh-cyan/30' : 'hover:border-rh-green/30';
  const brandTextHoverClass = orgType === 'FBLA' ? 'group-hover:text-rh-yellow' : orgType === 'DECA' ? 'group-hover:text-rh-cyan' : 'group-hover:text-rh-green';

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white">Competitive Leaderboard</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-rh-gray font-medium leading-relaxed">
            Engage in friendly competition with peers nationwide. Earn exclusive achievement badges, season rewards, and conference-ready certifications as you dominate your events.
          </p>
        </div>

        <div className="relative w-full max-w-3xl mx-auto rounded-[32px] border border-white/5 shadow-2xl bg-transparent p-6 md:p-12">
          <div className="space-y-4 md:space-y-6 relative z-10">
            {[
              { name: "John Doe", points: "2,840 pts", rank: 1, event: orgType === 'DECA' ? "Principles of Marketing" : "Parliamentary Procedure" },
              { name: "Jane Smith", points: "2,715 pts", rank: 2, event: orgType === 'DECA' ? "Hotel & Lodging" : "Accounting I" },
              { name: "Edward Williams", points: "2,690 pts", rank: 3, event: orgType === 'DECA' ? "Business Finance" : "Business Law" },
              { name: "Sarah Miller", points: "2,400 pts", rank: 4, event: orgType === 'DECA' ? "Entrepreneurship" : "Public Speaking" },
              { name: "Alex Johnson", points: "2,250 pts", rank: 5, event: orgType === 'DECA' ? "Marketing Communications" : "Intro to FBLA" }
            ].map((user) => (
              <div key={user.rank} className={`bg-rh-dark/60 backdrop-blur-md border border-white/10 p-4 md:p-5 rounded-2xl flex items-center justify-between transition-all ${brandBorderHoverClass} hover:bg-rh-dark/80 group`}>
                <div className="flex items-center space-x-4 md:space-x-6">
                  <span className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-xs md:text-sm ${user.rank === 1 ? `${brandBgClass} text-black` : 'bg-rh-dark text-rh-gray border border-white/10'}`}>
                    {user.rank}
                  </span>
                  <div className="flex flex-col">
                    <span className={`font-bold text-base md:text-lg text-white ${brandTextHoverClass} transition-colors`}>{user.name}</span>
                    <span className="text-[10px] md:text-xs text-rh-gray uppercase tracking-widest font-black">{user.event} Mastery</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${brandTextClass} font-black tracking-tighter text-lg md:text-xl`}>{user.points}</div>
                  <div className="h-1.5 w-16 md:w-24 bg-white/5 rounded-full mt-2 overflow-hidden ml-auto">
                    <div className={`h-full ${brandBgClass}`} style={{ width: `${100 - user.rank * 15}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] ${brandGlowClass} blur-[100px] rounded-full pointer-events-none`}></div>
        </div>
      </div>
    </section>
  );
};

export default VisualShowcase;
