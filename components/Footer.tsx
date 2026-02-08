
import React from 'react';
import { OrgType } from '../App';

interface FooterProps {
  orgType?: OrgType;
}

const Footer: React.FC<FooterProps> = ({ orgType = 'NONE' }) => {
  const brandColorClass = orgType === 'FBLA' ? 'bg-rh-green' : orgType === 'DECA' ? 'bg-rh-cyan' : 'bg-rh-yellow';
  const brandTextClass = orgType === 'FBLA' ? 'text-rh-green' : orgType === 'DECA' ? 'text-rh-cyan' : 'text-rh-yellow';

  return (
    <footer className="bg-black border-t border-white/5 py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-5 h-5 ${brandColorClass} rounded-sm rotate-45 flex items-center justify-center`}>
                <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
              </div>
              <span className="font-black text-white tracking-tight">{orgType === 'NONE' ? 'BIZLEADERPREP' : `${orgType} PREPHUB`}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <div className={`w-1.5 h-1.5 rounded-full ${brandColorClass} animate-pulse`}></div>
              <span className={`text-[9px] font-black ${brandTextClass} uppercase tracking-widest`}>Systems Live</span>
            </div>
          </div>
          
          <div className="flex space-x-10 text-[10px] font-bold text-rh-gray uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Events</a>
          </div>
          
          <div className="text-rh-gray text-[10px] font-medium text-right">
            <p>&copy; {new Date().getFullYear()} BIZLEADERPREP.</p>
            <p className="mt-1 opacity-50 uppercase tracking-tighter">Powered by Gemini 3 Flash</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
