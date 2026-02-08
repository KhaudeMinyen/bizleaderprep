
import React from 'react';

const Logo: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 7L12 12M22 7L12 12M12 22V12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface HeaderProps {
  onGetStarted: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetStarted }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="container mx-auto px-8 py-10 flex justify-between items-center">
        <div className="flex items-center space-x-2.5 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className="transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
            <Logo />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic group-hover:text-rh-yellow transition-colors">BLP</span>
        </div>
        
        <div className="hidden lg:flex items-center space-x-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          <a href="#features" className="hover:text-white transition-all hover:tracking-[0.4em]">Features</a>
          <a href="#about" className="hover:text-white transition-all hover:tracking-[0.4em]">About</a>
          <a href="#pricing" className="hover:text-white transition-all hover:tracking-[0.4em]">Pricing</a>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white px-5 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={onGetStarted}
            className="bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-full border border-white/10 transition-all backdrop-blur-md hover:border-white/30"
          >
            Start Learning
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
