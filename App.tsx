
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import VisualShowcase from './components/VisualShowcase';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import StudyView from './components/StudyView';
import Auth from './components/Auth';
import { supabase } from './supabaseClient';

type ViewState = 'landing' | 'portfolio' | 'study' | 'auth';
export type Division = 'Middle School' | 'High School';
export type OrgType = 'FBLA' | 'DECA' | 'NONE';

const FLASHCARD_LIMIT = 5;

function getPathFromLocation(): string {
  const p = window.location.pathname;
  if (p === '/fblaprephub' || p === '/decaprephub') return p;
  return '/';
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [virtualPath, setVirtualPath] = useState(getPathFromLocation);
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [division, setDivision] = useState<Division>('High School');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flashcardsUsed, setFlashcardsUsed] = useState(() => {
    const saved = localStorage.getItem('prephub_usage');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [authInitialView, setAuthInitialView] = useState<'login' | 'signup'>('login');

  const isFBLA = virtualPath === '/fblaprephub';
  const isDECA = virtualPath === '/decaprephub';
  const orgType: OrgType = isFBLA ? 'FBLA' : isDECA ? 'DECA' : 'NONE';

  // Ensure DECA defaults to High School and stays there
  useEffect(() => {
    if (orgType === 'DECA' && division === 'Middle School') {
      setDivision('High School');
    }
  }, [orgType, division]);

  const navigateTo = (path: string) => {
    window.history.pushState({ path }, '', path);
    setVirtualPath(path);
    setView('landing');
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      setVirtualPath(getPathFromLocation());
      setView('landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    let mounted = true;
    const safetyTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        setIsLoading(false);
      }
    }, 2500);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        setIsLoggedIn(true);
        // Only auto-switch to portfolio if on a prephub page (not NONE)
        const currentOrgType = getPathFromLocation();
        if (currentOrgType === '/fblaprephub' || currentOrgType === '/decaprephub') {
          setView('portfolio');
        }
      }
      setIsLoading(false);
    }).catch((err) => {
      console.error("Auth check failed:", err);
      if (mounted) setIsLoading(false);
    }).finally(() => {
      clearTimeout(safetyTimeout);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        navigateTo('/');
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setView('landing');
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, [virtualPath]);

  useEffect(() => {
    localStorage.setItem('prephub_usage', flashcardsUsed.toString());
  }, [flashcardsUsed]);

  const startStudy = (eventName: string) => {
    setActiveEvent(eventName);
    setView('study');
  };

  const scrollToFeatures = () => {
    if (view !== 'landing') {
      setView('landing');
      setTimeout(() => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const incrementUsage = () => {
    setFlashcardsUsed(prev => prev + 1);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigateTo('/');
  };

  if (isLoading) {
    const spinnerBorder = virtualPath === '/fblaprephub' ? 'border-rh-yellow' : virtualPath === '/decaprephub' ? 'border-rh-cyan' : 'border-rh-green';
    return (
      <div className="min-h-screen bg-rh-black flex items-center justify-center">
        <div className={`w-8 h-8 border-2 ${spinnerBorder} border-t-transparent rounded-full animate-spin`}></div>
      </div>
    );
  }

  if (view === 'auth') {
    return (
      <Auth
        onLogin={handleLogin}
        onCancel={() => setView('landing')}
        defaultView={authInitialView}
        orgType={orgType}
      />
    );
  }

  if (view === 'study' && activeEvent) {
    return (
      <StudyView
        eventName={activeEvent}
        division={division}
        orgType={orgType}
        onBack={() => setView('portfolio')}
        flashcardsUsed={isLoggedIn ? 0 : flashcardsUsed}
        limit={FLASHCARD_LIMIT}
        onAnswer={incrementUsage}
        onLoginRequest={() => setView('auth')}
        isLoggedIn={isLoggedIn}
      />
    );
  }

  const brandColor = isFBLA ? 'bg-rh-yellow' : isDECA ? 'bg-rh-cyan' : 'bg-rh-green';
  const brandText = isFBLA ? 'text-rh-yellow' : isDECA ? 'text-rh-cyan' : 'text-rh-green';

  return (
    <div className={`min-h-screen bg-rh-black text-white selection:${isFBLA ? 'bg-rh-green' : isDECA ? 'bg-rh-cyan' : 'bg-rh-yellow'} selection:text-black font-sans`}>
      <nav className="px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-[100]">
        <div className="flex flex-col items-start">
          <div
            className="flex items-center space-x-2 cursor-pointer mb-1"
            onClick={() => orgType !== 'NONE' ? navigateTo(virtualPath) : navigateTo('/')}
          >
            <div className={`w-6 h-6 ${brandColor} rounded-sm rotate-45 flex items-center justify-center transition-colors duration-500`}>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
            <span className="font-black tracking-tight text-xl uppercase">
              {orgType === 'NONE' ? 'BIZLEADERPREP' : `${orgType} PREPHUB`}
            </span>
          </div>
          {orgType !== 'NONE' && (
            <button
              onClick={() => navigateTo('/')}
              className="text-[10px] font-bold text-rh-gray hover:text-white uppercase tracking-widest transition-colors flex items-center space-x-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              <span>Back to hub</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-6">
          {orgType !== 'NONE' && (
            <button
              onClick={scrollToFeatures}
              className={`text-sm font-bold transition-colors ${view === 'landing' ? brandText : 'text-rh-gray hover:text-white'}`}
            >
              Explore
            </button>
          )}
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => { setAuthInitialView('signup'); setView('auth'); }}
                className={`text-sm font-bold px-4 py-2 rounded-lg text-black transition-colors ${orgType === 'NONE' ? 'bg-rh-yellow hover:bg-rh-yellow/90' : isFBLA ? 'bg-rh-green hover:bg-rh-green/90' : 'bg-rh-cyan hover:bg-rh-cyan/90'
                  }`}
              >
                Sign up
              </button>
              <button
                onClick={() => { setAuthInitialView('login'); setView('auth'); }}
                className="text-sm font-bold text-rh-gray hover:text-white transition-colors"
              >
                Log in
              </button>
            </>
          ) : (
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm font-bold text-rh-gray hover:text-white transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>
      </nav>

      <main>
        {view === 'landing' ? (
          <>
            <Hero
              orgType={orgType}
              onGetStarted={() => setView('portfolio')}
              onNavigate={(path) => navigateTo(path)}
            />
            {orgType !== 'NONE' && (
              <>
                <Features orgType={orgType} />
                <VisualShowcase orgType={orgType} />
                <CallToAction orgType={orgType} onGetStarted={() => setView('portfolio')} />
              </>
            )}
          </>
        ) : (
          <div className="max-w-4xl mx-auto pt-12 px-6 animate-slide-up">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex-1">
                <p className="text-rh-gray text-xs font-bold uppercase tracking-widest mb-1">
                  Competitive Event Mastery
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white leading-tight">
                  {orgType === 'DECA' ? 'High School' : division} <br /> {orgType} Events
                </h1>
                {!isLoggedIn && flashcardsUsed >= FLASHCARD_LIMIT && (
                  <p className="text-red-500 text-xs font-bold mt-2 uppercase tracking-widest">
                    Free Trial Limit Reached — Log in to continue
                  </p>
                )}
              </div>

              {orgType !== 'DECA' && (
                <div className="flex bg-rh-dark p-1 rounded-xl border border-white/5 h-fit shrink-0">
                  {(['Middle School', 'High School'] as Division[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDivision(d)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${division === d ? (`${brandColor} text-black`) : 'text-rh-gray hover:text-white'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </header>
            <Dashboard onSelectEvent={startStudy} division={division} orgType={orgType} />
          </div>
        )}
      </main>

      <Footer orgType={orgType} />
    </div>
  );
};

export default App;
