
import React, { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import StudyView from './components/StudyView';
import Auth from './components/Auth';
import { supabase } from './supabaseClient';
import { Rank, getRankFromXP, getRankColor, XP_REWARDS } from './utils/xp';

type ViewState = 'landing' | 'portfolio' | 'study' | 'auth' | 'events';
export type Division = 'ms' | 'hs';
export type OrgType = 'FBLA' | 'DECA' | 'NONE';

const FLASHCARD_LIMIT = 5;

const MS_EVENTS_LIST = [
  'Career Exploration','Digital Citizenship','Exploring Accounting & Finance',
  'Exploring Agribusiness','Exploring Business Communication','Exploring Business Concepts',
  'Exploring Computer Science','Exploring Economics','Exploring FBLA','Exploring Leadership',
  'Exploring Marketing Concepts','Exploring Parliamentary Procedure','Exploring Personal Finance',
  'Exploring Professionalism','Exploring Technology','Interpersonal Communication',
];

const HS_EVENTS_LIST = [
  'Accounting','Advanced Accounting','Advertising','Agribusiness','Business Communication',
  'Business Law','Computer Problem Solving','Cybersecurity','Data Science & AI','Economics',
  'Healthcare Administration','Human Resource Management','Insurance & Risk Management',
  'Introduction to Business Communication','Introduction to Business Concepts',
  'Introduction to Business Procedures','Introduction to FBLA','Introduction to Information Technology',
  'Introduction to Marketing Concepts','Introduction to Parliamentary Procedure',
  'Introduction to Retail & Merchandising','Introduction to Supply Chain Management','Journalism',
  'Networking Infrastructures','Organizational Leadership','Personal Finance','Project Management',
  'Public Administration & Management','Real Estate','Retail Management','Securities & Investments',
];

const getEventsList = (div: Division) => div === 'ms' ? MS_EVENTS_LIST : HS_EVENTS_LIST;

const getThemeColors = (div: Division) => {
  if (div === 'hs') {
    return {
      bgPrimary: '#000000',
      bgSecondary: '#0a0a0a',
      bgTertiary: '#0f0f0f',
      border: '#151515',
      text: '#d0d0d0',
      textMuted: '#666666',
      accentGreen: '#004d1a',
      accentPurple: '#a855f7',
      accentBlue: '#1e3a5f',
    };
  }
  // MS theme (lighter)
  return {
    bgPrimary: '#0a0a0a',
    bgSecondary: '#111',
    bgTertiary: '#181818',
    border: '#222',
    text: '#f0f0f0',
    textMuted: '#aaa',
    accentGreen: '#00ff6a',
    accentPurple: '#a855f7',
    accentBlue: '#3b82f6',
  };
};

const App: React.FC = () => {
  const isOAuthRedirect = window.location.hash.includes('access_token');
  const [view, setView] = useState<ViewState>(() => {
    const path = window.location.pathname;
    if (path === '/dashboard/events') return 'events';
    if (path === '/dashboard') return 'portfolio';
    if (window.location.hash.includes('access_token')) return 'portfolio';
    const savedEvent = localStorage.getItem('prephub_activeEvent');
    if (savedEvent) return 'study';
    return 'landing';
  });
  const [activeEvent, setActiveEvent] = useState<string | null>(
    () => localStorage.getItem('prephub_activeEvent')
  );
  const [division, setDivision] = useState<Division>('ms');
  const theme = getThemeColors(division);
  const orgType: OrgType = 'FBLA';

  // XP & Rank state
  const [userXP, setUserXP] = useState<number>(0);
  const [userRank, setUserRank] = useState<Rank>('Intern');
  const [isFounder, setIsFounder] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  // Batching refs — accumulate XP from multiple simultaneous awards into one DB write + one toast
  const pendingXPRef = useRef(0);
  const xpFlushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [xpToast, setXpToast] = useState<{ amount: number; visible: boolean }>({ amount: 0, visible: false });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [flashcardsUsed, setFlashcardsUsed] = useState(() => {
    const saved = localStorage.getItem('prephub_usage');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [authInitialView, setAuthInitialView] = useState<'login' | 'signup'>('login');

  // Username requirement modal state
  const [needsUsername, setNeedsUsername] = useState(false);
  const [pendingUsername, setPendingUsername] = useState('');
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pendingUserEmail, setPendingUserEmail] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameLoading, setUsernameLoading] = useState(false);

  // APEX Chat state
  const [apexMessages, setApexMessages] = useState<Array<{ role: 'user' | 'apex'; content: string }>>([]);
  const [apexInput, setApexInput] = useState('');
  const [apexLoading, setApexLoading] = useState(false);

  // Mobile state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Division picker & event modal state
  const [divisionPickerOpen, setDivisionPickerOpen] = useState(false);
  const [divisionPickerClosing, setDivisionPickerClosing] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState<string | null>(null);
  const [eventModalClosing, setEventModalClosing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileSidebarOpen(false);
        setDivisionPickerOpen(false);
        setSelectedEventModal(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Favorites (must be at top level — Rules of Hooks) ─────────────────────
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('prephub_favorites') || '[]'); } catch { return []; }
  });

  // ── Daily Question state ───────────────────────────────────────────────────
  type QuickQ = { question: string; options: string[]; answer: string; event: string; difficulty: string };
  const todayKey = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  const dailyAnsweredKey = `prephub_daily_answered_${division}_${todayKey}`;
  const dailyQuestionKey = `prephub_daily_question_${division}_${todayKey}`;
  const [quickQ, setQuickQ] = useState<QuickQ | null>(() => {
    try { const s = localStorage.getItem(dailyQuestionKey); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [quickAnswered, setQuickAnswered] = useState<string | null>(() => localStorage.getItem(dailyAnsweredKey));
  const isDailyAnswered = !!quickAnswered;
  const quickFetched = useRef(!!localStorage.getItem(dailyQuestionKey));
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(() => getEventsList('ms')[0]);

  // Close sidebar and picker when view changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
    setDivisionPickerOpen(false);
    setDivisionPickerClosing(false);
  }, [view]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const state = e.state as { view?: string } | null;
      if (state?.view === 'portfolio') setView('portfolio');
      else if (state?.view === 'events') setView('events');
      else if (state?.view === 'landing') setView('landing');
      else setView('landing');
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
        // Fetch user profile for XP/rank AND username check
        supabase.from('user_profiles').select('xp, rank, is_founder, username').eq('user_id', session.user.id).single().then(({ data }) => {
          if (data) {
            setUserXP(data.xp);
            setIsFounder(data.is_founder);
            setUserRank(getRankFromXP(data.xp, data.is_founder));
            setUsername(data.username || null);

            // Check if user needs to set a username (old accounts without username)
            if (!data.username) {
              setPendingUserId(session.user.id);
              setPendingUserEmail(session.user.email || null);
              setNeedsUsername(true);
              setIsLoading(false);
              clearTimeout(safetyTimeout);
              return;
            }

            setIsLoggedIn(true);
            const savedEvent = localStorage.getItem('prephub_activeEvent');
            if (savedEvent) {
              setActiveEvent(savedEvent);
              setView('study');
            } else {
              window.history.replaceState({ view: 'portfolio' }, '', '/dashboard');
              setView('portfolio');
            }
            setIsLoading(false);
            clearTimeout(safetyTimeout);
          }
        });
      } else if (!isOAuthRedirect) {
        // No session and not an OAuth redirect — safe to stop loading
        setIsLoading(false);
        clearTimeout(safetyTimeout);
      }
      // If OAuth redirect: wait for onAuthStateChange SIGNED_IN to fire
    }).catch((err) => {
      console.error("Auth check failed:", err);
      if (mounted) setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        // Fetch user profile for XP/rank AND username check
        supabase.from('user_profiles').select('xp, rank, is_founder, username').eq('user_id', session.user.id).single().then(({ data }) => {
          if (data) {
            setUserXP(data.xp);
            setIsFounder(data.is_founder);
            setUserRank(getRankFromXP(data.xp, data.is_founder));
            setUsername(data.username || null);

            // Check if user needs to set a username (old accounts without username)
            if (!data.username) {
              setPendingUserId(session.user.id);
              setPendingUserEmail(session.user.email || null);
              setNeedsUsername(true);
              setIsLoading(false);
              return;
            }

            setIsLoggedIn(true);
            window.history.replaceState({ view: 'portfolio' }, '', '/dashboard');
            setView('portfolio');
            setIsLoading(false);
          }
        });
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(prev => {
          if (prev) {
            // Only redirect to landing if user was actually logged in
            window.history.pushState({ view: 'landing' }, '', '/');
            setView('landing');
          }
          return false;
        });
        setNeedsUsername(false);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('prephub_usage', flashcardsUsed.toString());
  }, [flashcardsUsed]);

  // Sync favorites from Supabase when logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    supabase.from('user_favorites').select('event_name').then(({ data }) => {
      if (data) setFavorites(data.map((r: any) => r.event_name));
    });
  }, [isLoggedIn]);

  // Fetch daily question once per day
  useEffect(() => {
    if (quickFetched.current) return;
    quickFetched.current = true;
    const eventsList = getEventsList(division);
    const tableName = division === 'hs' ? 'questions' : 'FBLA MS Questions';
    const fetchDaily = async () => {
      // Use date as seed for deterministic event selection
      const seed = parseInt(todayKey.replace(/-/g, ''), 10);
      const divisionPrefix = `${division}:`;
      const favoritesForDivision = favorites.filter(f => f.startsWith(divisionPrefix)).map(f => f.substring(divisionPrefix.length));
      const pool = favoritesForDivision.length > 0 ? favoritesForDivision.filter(f => eventsList.includes(f)) : eventsList;
      const eventName = pool[seed % pool.length];
      const { data } = await supabase.from(tableName).select('*').eq('event', eventName).limit(100);
      if (!data || data.length === 0) return;
      const row = data[seed % data.length];
      const opts = [row.answer_choice_1, row.answer_choice_2, row.answer_choice_3, row.answer_choice_4].filter(Boolean) as string[];
      const ca = String(row.correct_answer ?? '').trim().toUpperCase();
      const answerMap: Record<string, string> = { A: opts[0], B: opts[1], C: opts[2], D: opts[3], '1': opts[0], '2': opts[1], '3': opts[2], '4': opts[3] };
      const answer = answerMap[ca] ?? ca;
      // Deterministic shuffle using seed
      const shuffled = [...opts].sort((a, b) => ((seed * opts.indexOf(a)) % 7) - ((seed * opts.indexOf(b)) % 7));
      const q: QuickQ = { question: row.question, options: shuffled, answer, event: eventName, difficulty: row.difficulty ?? 'Beginner' };
      localStorage.setItem(dailyQuestionKey, JSON.stringify(q));
      setQuickQ(q);
    };
    fetchDaily();
  }, [division]);

  const handleSetUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUserId) return;

    const trimmedUsername = pendingUsername.trim();
    if (!trimmedUsername) {
      setUsernameError('Username is required');
      return;
    }

    if (trimmedUsername.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return;
    }

    if (trimmedUsername.length > 30) {
      setUsernameError('Username must be 30 characters or less');
      return;
    }

    // Check for valid characters (alphanumeric, underscore, dash)
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
      setUsernameError('Username can only contain letters, numbers, underscores, and dashes');
      return;
    }

    setUsernameLoading(true);
    setUsernameError(null);

    try {
      const { error } = await supabase.from('user_profiles').update({ username: trimmedUsername }).eq('user_id', pendingUserId);

      if (error) {
        if (error.message.includes('duplicate') || error.message.includes('unique')) {
          setUsernameError('Username already taken. Choose another.');
        } else {
          setUsernameError(error.message);
        }
        setUsernameLoading(false);
        return;
      }

      // Username set successfully, complete login
      setNeedsUsername(false);
      setIsLoggedIn(true);
      setPendingUsername('');
      setPendingUserId(null);
      setPendingUserEmail(null);
      window.history.replaceState({ view: 'portfolio' }, '', '/dashboard');
      setView('portfolio');
      setUsernameLoading(false);
    } catch (err: any) {
      setUsernameError(err.message || 'Failed to set username');
      setUsernameLoading(false);
    }
  };

  const handleApexMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apexInput.trim() || apexLoading) return;

    const userMessage = apexInput.trim();
    setApexInput('');
    setApexMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setApexLoading(true);

    try {
      const response = await fetch('/api/apex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: 'FBLA competitive exam preparation and study guidance',
          division: division,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const apexResponse = data.response || data.message || 'I could not process that. Please try again.';
      setApexMessages(prev => [...prev, { role: 'apex', content: apexResponse }]);
    } catch (error: any) {
      console.error('APEX error:', error);
      setApexMessages(prev => [...prev, { role: 'apex', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setApexLoading(false);
    }
  };

  const showXPToast = (amount: number) => {
    setXpToast({ amount, visible: true });
    setTimeout(() => setXpToast(t => ({ ...t, visible: false })), 2000);
  };

  // awardXPToUser batches rapid successive calls (e.g. correct + new event + completed)
  // into a single DB write and a single combined toast shown after a 50ms debounce.
  const awardXPToUser = (amount: number): void => {
    if (!isLoggedIn) return;
    pendingXPRef.current += amount;
    if (xpFlushTimerRef.current) clearTimeout(xpFlushTimerRef.current);
    xpFlushTimerRef.current = setTimeout(async () => {
      const total = pendingXPRef.current;
      pendingXPRef.current = 0;
      xpFlushTimerRef.current = null;
      if (total <= 0) return;
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user?.id) return;
      // Use a functional read of userXP via the ref to avoid stale closure
      setUserXP(prev => {
        const newXP = prev + total;
        const newRank = getRankFromXP(newXP, isFounder);
        supabase.from('user_profiles').update({
          xp: newXP,
          rank: newRank,
          updated_at: new Date().toISOString(),
        }).eq('user_id', session.data.session!.user.id).then(({ error }) => {
          if (error) console.error('Failed to award XP:', error);
        });
        setUserRank(newRank);
        return newXP;
      });
      showXPToast(total);
    }, 50);
  };

  const startStudy = (eventName: string) => {
    setActiveEvent(eventName);
    localStorage.setItem('prephub_activeEvent', eventName);
    setView('study');
  };

  const goToPortfolio = () => {
    localStorage.removeItem('prephub_activeEvent');
    window.history.pushState({ view: 'portfolio' }, '', '/dashboard');
    setView('portfolio');
  };

  const closeDivisionPicker = () => {
    setDivisionPickerClosing(true);
    setTimeout(() => { setDivisionPickerOpen(false); setDivisionPickerClosing(false); }, 260);
  };

  const closeEventModal = () => {
    setEventModalClosing(true);
    setTimeout(() => { setSelectedEventModal(null); setEventModalClosing(false); }, 230);
  };

  const incrementUsage = () => {
    setFlashcardsUsed(prev => prev + 1);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    window.history.pushState({ view: 'portfolio' }, '', '/dashboard');
    setView('portfolio');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-rh-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rh-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Username requirement modal (for existing accounts without username)
  if (needsUsername && pendingUserId) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 420, background: '#111', border: '1px solid #222', borderRadius: 24, padding: 40, textAlign: 'center' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f0f0f0', marginBottom: 12 }}>Complete Your Profile</h2>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 28, lineHeight: 1.6 }}>
            Your account needs a unique username to continue. This will be public and cannot be changed.
          </p>

          {usernameError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.5)', padding: 12, borderRadius: 12, marginBottom: 20, fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
              {usernameError}
            </div>
          )}

          <form onSubmit={handleSetUsername} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#aaa', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Username</label>
              <input
                type="text"
                value={pendingUsername}
                onChange={(e) => { setPendingUsername(e.target.value); setUsernameError(null); }}
                placeholder="your_username"
                disabled={usernameLoading}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 12,
                  padding: '12px 16px',
                  color: '#f0f0f0',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'all 0.2s',
                  opacity: usernameLoading ? 0.6 : 1,
                  cursor: usernameLoading ? 'not-allowed' : 'text',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,255,106,0.3)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
              />
              <p style={{ fontSize: 11, color: '#666', marginTop: 8 }}>3-30 characters, letters/numbers/underscore/dash only</p>
            </div>

            <button
              type="submit"
              disabled={usernameLoading || !pendingUsername.trim()}
              style={{
                width: '100%',
                background: '#00ff6a',
                color: '#000',
                border: 'none',
                borderRadius: 12,
                padding: 14,
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                cursor: usernameLoading || !pendingUsername.trim() ? 'not-allowed' : 'pointer',
                opacity: usernameLoading || !pendingUsername.trim() ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { if (!usernameLoading && pendingUsername.trim()) e.currentTarget.style.transform = 'scale(1.01)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {usernameLoading ? 'Setting Username...' : 'Continue'}
            </button>
          </form>

          <p style={{ fontSize: 11, color: '#666', marginTop: 20 }}>
            {pendingUserEmail && <>Email: <strong style={{ color: '#888' }}>{pendingUserEmail}</strong></>}
          </p>
        </div>
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
        onBack={() => goToPortfolio()}
        flashcardsUsed={isLoggedIn ? 0 : flashcardsUsed}
        limit={FLASHCARD_LIMIT}
        onAnswer={incrementUsage}
        onLoginRequest={() => setView('auth')}
        isLoggedIn={isLoggedIn}
        onAwardXP={awardXPToUser}
        userXP={userXP}
        userRank={userRank}
        isMobile={isMobile}
      />
    );
  }

  if (view === 'landing') {
    return (
      <Hero
        onGetStarted={() => goToPortfolio()}
        onLoginRequest={() => { setAuthInitialView('login'); setView('auth'); }}
        onSignupRequest={() => { setAuthInitialView('signup'); setView('auth'); }}
        isLoggedIn={isLoggedIn}
        onSignOut={() => supabase.auth.signOut()}
      />
    );
  }

  // ── Events page data ──────────────────────────────────────────────────────
  const HS_EVENTS_INFO_DATA: Record<string, { type: string; desc: string; knowledge: string[]; nace: string }> = {
    'Accounting': { type: 'Team · Objective Test & Application', desc: 'Master comprehensive accounting principles and practices. Analyze financial statements, understand accounting standards, and prepare for accounting careers.', knowledge: ['Financial Statements', 'Accounting Cycle', 'Ledger Accounts', 'Financial Analysis', 'Accounting Standards'], nace: 'Critical Thinking, Technology' },
    'Advanced Accounting': { type: 'Team · Objective Test & Application', desc: 'Explore advanced accounting topics including consolidations, partnerships, and governmental accounting. Prepare for senior accounting roles.', knowledge: ['Consolidations', 'Partnership Accounting', 'Governmental Accounting', 'Nonprofit Accounting', 'International Standards'], nace: 'Critical Thinking, Technology' },
    'Advertising': { type: 'Team · Objective Test & Presentation', desc: 'Develop comprehensive advertising campaigns. Research, plan, create, and present persuasive advertising strategies for target markets.', knowledge: ['Market Research', 'Creative Strategy', 'Campaign Planning', 'Media Selection', 'Consumer Psychology'], nace: 'Communication, Critical Thinking, Leadership' },
    'Agribusiness': { type: 'Team · Objective Test & Application', desc: 'Understand the business side of agriculture. Analyze agribusiness operations, marketing, finance, and management.', knowledge: ['Farm Operations', 'Agricultural Marketing', 'Crop Economics', 'Livestock Management', 'Agribusiness Technology'], nace: 'Critical Thinking, Leadership' },
    'Business Communication': { type: 'Team · Objective Test & Presentation', desc: 'Master effective business communication in writing and speaking. Develop professional communication skills for business contexts.', knowledge: ['Business Writing', 'Presentations', 'Listening Skills', 'Interpersonal Communication', 'Professional Etiquette'], nace: 'Communication, Professionalism' },
    'Business Law': { type: 'Team · Objective Test & Case Study', desc: 'Study business law principles including contracts, torts, employment law, and business regulations.', knowledge: ['Contract Law', 'Tort Law', 'Employment Law', 'Business Entities', 'Intellectual Property'], nace: 'Critical Thinking, Leadership' },
    'Computer Problem Solving': { type: 'Team · Objective Test & Application', desc: 'Solve complex business problems using computer applications. Use spreadsheets, databases, and other tools effectively.', knowledge: ['Spreadsheet Applications', 'Database Management', 'Problem Analysis', 'Solution Design', 'Technical Tools'], nace: 'Technology, Critical Thinking' },
    'Cybersecurity': { type: 'Team · Objective Test & Application', desc: 'Understand cybersecurity principles, threats, and protections. Develop strategies to protect business data and systems.', knowledge: ['Security Threats', 'Encryption', 'Network Security', 'Data Protection', 'Compliance Standards'], nace: 'Technology, Critical Thinking' },
    'Data Science & AI': { type: 'Team · Objective Test & Application', desc: 'Explore data analytics and artificial intelligence applications in business. Analyze data to inform business decisions.', knowledge: ['Data Analysis', 'Machine Learning Basics', 'Data Visualization', 'Predictive Analytics', 'Business Intelligence'], nace: 'Technology, Critical Thinking' },
    'Economics': { type: 'Team · Objective Test & Application', desc: 'Study economic principles including microeconomics, macroeconomics, and business economics.', knowledge: ['Supply & Demand', 'Market Structures', 'Inflation & Unemployment', 'International Trade', 'Fiscal Policy'], nace: 'Critical Thinking' },
    'Healthcare Administration': { type: 'Team · Objective Test & Application', desc: 'Understand healthcare management and operations. Explore healthcare systems, regulations, and administrative functions.', knowledge: ['Healthcare Systems', 'Patient Care Management', 'Healthcare Finance', 'Healthcare Regulations', 'Quality Management'], nace: 'Leadership, Critical Thinking' },
    'Human Resource Management': { type: 'Team · Objective Test & Application', desc: 'Master HR functions including recruitment, training, compensation, and employee relations.', knowledge: ['Recruitment & Selection', 'Training & Development', 'Compensation Strategy', 'Employee Relations', 'Labor Laws'], nace: 'Leadership, Communication' },
    'Insurance & Risk Management': { type: 'Team · Objective Test & Application', desc: 'Understand insurance products, risk assessment, and risk management strategies for businesses.', knowledge: ['Risk Assessment', 'Insurance Types', 'Loss Prevention', 'Risk Management Strategies', 'Claims Management'], nace: 'Critical Thinking, Leadership' },
    'Introduction to Business Communication': { type: 'Individual · Objective Test · 100 questions', desc: 'Learn foundational business communication skills for effective workplace interaction and professional development.', knowledge: ['Verbal Communication', 'Written Communication', 'Presentation Skills', 'Listening Skills', 'Professional Etiquette'], nace: 'Communication, Professionalism' },
    'Introduction to Business Concepts': { type: 'Individual · Objective Test · 100 questions', desc: 'Understand fundamental business principles including organization, management, finance, and marketing.', knowledge: ['Business Fundamentals', 'Management Functions', 'Economic Systems', 'Marketing Basics', 'Business Finance'], nace: 'Critical Thinking' },
    'Introduction to Business Procedures': { type: 'Individual · Objective Test · 100 questions', desc: 'Learn standard business procedures and practices for office operations and administrative functions.', knowledge: ['Office Procedures', 'Record Management', 'Communication Tools', 'Time Management', 'Business Ethics'], nace: 'Professionalism, Critical Thinking' },
    'Introduction to FBLA': { type: 'Individual · Objective Test · 100 questions', desc: 'Explore FBLA organization, competitive events, leadership structure, and member benefits.', knowledge: ['FBLA History', 'Competitive Events', 'Leadership Structure', 'Member Benefits', 'FBLA Programs'], nace: 'Leadership' },
    'Introduction to Information Technology': { type: 'Individual · Objective Test · 100 questions', desc: 'Discover information technology fundamentals including hardware, software, networks, and digital security.', knowledge: ['Computer Hardware', 'Software Applications', 'Networks & Internet', 'Digital Security', 'IT Careers'], nace: 'Technology' },
    'Introduction to Marketing Concepts': { type: 'Individual · Objective Test · 100 questions', desc: 'Learn marketing fundamentals including market research, product, price, place, and promotion strategies.', knowledge: ['Marketing Process', 'Market Research', 'Product Strategy', 'Pricing', 'Promotion & Distribution'], nace: 'Communication, Critical Thinking' },
    'Introduction to Parliamentary Procedure': { type: 'Individual · Objective Test · 100 questions', desc: 'Study meeting protocols and parliamentary procedures for conducting organized business meetings.', knowledge: ['Meeting Structure', 'Motions & Amendments', 'Voting Procedures', 'Debate Rules', 'Committee Functions'], nace: 'Leadership, Communication' },
    'Introduction to Retail & Merchandising': { type: 'Individual · Objective Test · 100 questions', desc: 'Understand retail operations, merchandising strategies, customer service, and sales techniques.', knowledge: ['Retail Operations', 'Visual Merchandising', 'Customer Service', 'Sales Techniques', 'Inventory Management'], nace: 'Communication, Professionalism' },
    'Introduction to Supply Chain Management': { type: 'Individual · Objective Test · 100 questions', desc: 'Learn supply chain processes from production through distribution and customer delivery.', knowledge: ['Supply Chain Processes', 'Inventory Management', 'Logistics', 'Quality Control', 'Cost Management'], nace: 'Critical Thinking, Technology' },
    'Journalism': { type: 'Team · Objective Test & Writing', desc: 'Develop journalistic writing skills and understand news production, editing, and media ethics.', knowledge: ['News Writing', 'Editing', 'Research Methods', 'Media Law', 'Journalistic Ethics'], nace: 'Communication, Critical Thinking' },
    'Networking Infrastructures': { type: 'Team · Objective Test & Application', desc: 'Understand computer network design, administration, security, and troubleshooting.', knowledge: ['Network Architecture', 'Protocols & Standards', 'Network Security', 'Troubleshooting', 'Cloud Technologies'], nace: 'Technology, Critical Thinking' },
    'Organizational Leadership': { type: 'Team · Objective Test & Application', desc: 'Study leadership theories, organizational behavior, team dynamics, and change management.', knowledge: ['Leadership Theories', 'Organizational Behavior', 'Team Development', 'Change Management', 'Decision Making'], nace: 'Leadership, Communication' },
    'Personal Finance': { type: 'Individual · Objective Test · 100 questions', desc: 'Master personal financial planning including budgeting, saving, investing, credit, and retirement planning.', knowledge: ['Budgeting', 'Saving & Investment', 'Credit Management', 'Insurance Planning', 'Retirement Planning'], nace: 'Critical Thinking' },
    'Project Management': { type: 'Team · Objective Test & Application', desc: 'Learn project management principles including planning, execution, monitoring, and closing projects.', knowledge: ['Project Planning', 'Resource Management', 'Risk Management', 'Schedule Management', 'Quality Management'], nace: 'Leadership, Critical Thinking' },
    'Public Administration & Management': { type: 'Team · Objective Test & Case Study', desc: 'Understand government and public sector management including policy, budgeting, and public services.', knowledge: ['Government Structure', 'Public Policy', 'Budget Management', 'Public Services', 'Regulations & Compliance'], nace: 'Leadership, Critical Thinking' },
    'Real Estate': { type: 'Team · Objective Test & Application', desc: 'Study real estate markets, property management, financing, and investment strategies.', knowledge: ['Property Valuation', 'Real Estate Markets', 'Financing & Mortgages', 'Property Management', 'Investment Analysis'], nace: 'Critical Thinking, Leadership' },
    'Retail Management': { type: 'Team · Objective Test & Application', desc: 'Master retail operations, store management, staff training, customer service, and sales promotion.', knowledge: ['Store Operations', 'Staff Management', 'Sales Strategies', 'Customer Service', 'Visual Merchandising'], nace: 'Leadership, Communication' },
    'Securities & Investments': { type: 'Team · Objective Test & Application', desc: 'Understand securities markets, investment analysis, portfolio management, and financial instruments.', knowledge: ['Investment Types', 'Stock & Bond Markets', 'Portfolio Analysis', 'Risk Assessment', 'Investment Strategies'], nace: 'Critical Thinking, Technology' },
  };

  const MS_EVENTS_INFO_DATA: Record<string, { type: string; desc: string; knowledge: string[]; nace: string }> = {
    'Career Exploration': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate knowledge of various career fields. Explore interests, evaluate career options, and begin planning for future success.', knowledge: ['Career Readiness', 'Critical-Thinking Skills', 'Career Planning', 'Job-Search Skills', 'Career Advancement'], nace: 'Career & Self-Development, Critical Thinking' },
    'Digital Citizenship': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate understanding of safe, ethical, and responsible behavior in digital environments. Build skills to navigate the online world with confidence and integrity.', knowledge: ['Personal Security & Online Privacy', 'Rights and Responsibilities', 'Digital Footprint', 'Internet Searches', 'Copyrights', 'Cyber Bullying'], nace: 'Career & Self-Development, Communication, Critical Thinking, Professionalism, Technology' },
    'Exploring Accounting & Finance': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate knowledge of foundational concepts in accounting and finance. Introduces key principles and careers in financial services, accounting, and related fields.', knowledge: ['Personal Finance', 'Foundational Accounting Knowledge', 'Accounting Tools', 'Principles of Money', 'Foundational Finance Knowledge', 'Accounting and Finance Careers'], nace: 'Career & Self-Development, Technology, Critical Thinking' },
    'Exploring Agribusiness': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate understanding of basic concepts in agriculture and business. Introduces the diverse world of agribusiness at the intersection of agriculture, economics, and entrepreneurship.', knowledge: ['Safety Procedures & Regulations', 'Business Ownership', 'Nature of Agribusiness', 'Ethics', 'Economic Concepts', 'Management', 'Natural Resources & Systems'], nace: 'Career & Self-Development, Critical Thinking, Professionalism' },
    'Exploring Business Communication': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate knowledge of foundational communication skills. Introduces the principles of effective information sharing within and outside of a business setting.', knowledge: ['Information Literacy', 'Active Listening', 'Verbal Communication', 'Written Communication', 'Workplace Communication'], nace: 'Career & Self-Development, Critical Thinking, Communication' },
    'Exploring Business Concepts': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate understanding of foundational business principles including management, marketing, finance, and operations.', knowledge: ['Fundamental Economic Concepts', 'Nature of Business', 'Economic Systems', 'Cost/Profit Relationships', 'Types of Business Activities', 'Career Planning', 'Job-Search Skills'], nace: 'Career & Self-Development, Critical Thinking, Professionalism' },
    'Exploring Computer Science': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate understanding of foundational computing concepts including hardware, software, algorithms, and computational thinking.', knowledge: ['Coding Basics', 'Algorithmic Thinking', 'Data & AI Concepts', 'Cybersecurity Concepts', 'Networks & the Internet', 'Hardware & Systems'], nace: 'Career & Self-Development, Critical Thinking, Technology' },
    'Exploring Economics': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate understanding of fundamental economic concepts including supply and demand, market structures, and the role of government in the economy.', knowledge: ['Fundamental Economic Concepts', 'Nature of Business', "Government's Impact on Business", 'Cost/Profit Relationships', 'Economic Systems'], nace: 'Career & Self-Development, Critical Thinking' },
    'Exploring FBLA': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate knowledge of the Future Business Leaders of America organization — its history, structure, programs, leadership, and mission.', knowledge: ['FBLA History', 'Corporate & Division Bylaws', 'FBLA Programs', 'Pledge/Mission/Goals/Creed', 'MS Competitive Events', 'FBLA Structure', 'Dress Code', 'Publications', 'Deadlines', 'Website & Communications', 'FBLA Partners'], nace: 'Career & Self-Development' },
    'Exploring Leadership': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate understanding of core leadership principles. Explore how effective leaders align teams, inspire action, and guide others toward shared goals.', knowledge: ['Self-Awareness', 'Ethics', 'Interpersonal Skills', 'Leadership Skills'], nace: 'Career & Self-Development, Communication, Critical Thinking, Leadership, Professionalism' },
    'Exploring Marketing Concepts': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate understanding of basic marketing principles including market research, promotion, branding, and strategies to sell products and services.', knowledge: ['Marketing Fundamentals', 'Product/Service Management', 'Channel Management', 'Marketing-Information Management', 'Pricing', 'Selling'], nace: 'Career & Self-Development, Communication, Critical Thinking' },
    'Exploring Parliamentary Procedure': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate knowledge of meeting structure and rules. Introduces principles of orderly decision-making including motions, debate, and voting procedures.', knowledge: ['Making Motions', "Robert's Basic Rules of Order", 'Development of an Agenda', 'Amendments to Motions', 'Voting', 'Committees', 'Bylaws', 'Virtual Meetings', 'Organizational Skills', 'Working on Teams'], nace: 'Career & Self-Development, Communication, Critical Thinking, Teamwork' },
    'Exploring Personal Finance': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate understanding of essential financial skills including budgeting, saving, credit, investing, and financial decision-making for everyday life.', knowledge: ['Principles of Money', 'Financial Needs & Goals', 'Financial-Services Providers', 'Financial Literacy'], nace: 'Career & Self-Development, Critical Thinking, Professionalism' },
    'Exploring Professionalism': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate understanding of proper business etiquette — professional behavior, appearance, communication, and conduct in workplace and social settings.', knowledge: ['Proper Introductions & Eye Contact', 'Public Speaking', 'Table Manners & Dining', 'Cell Phone Etiquette', 'Netiquette', 'Professionalism', 'International Customs'], nace: 'Career & Self-Development, Communication, Critical Thinking, Professionalism' },
    'Exploring Technology': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate understanding of foundational technology concepts including digital tools, emerging technologies, cybersecurity, and the role of technology in business.', knowledge: ['Computer Literacy', 'Computational Thinking', 'Digital Citizenship & Safety', 'Networks & the Internet', 'Modern Technologies'], nace: 'Career & Self-Development, Critical Thinking, Technology' },
    'Interpersonal Communication': { type: 'Individual · Objective Test · 50 questions', desc: 'Demonstrate understanding of how people exchange messages, ideas, and information. Covers verbal and nonverbal communication, active listening, and relationship-building.', knowledge: ['Accountability', 'Verbal & Nonverbal Communication', 'Diverse Cultures', 'Teamwork', 'Collaboration', 'Personal Appearance', 'Decision Making', 'Values', 'Positive Attitude', 'Time Management', 'Ethics'], nace: 'Career & Self-Development, Communication, Critical Thinking, Teamwork' },
  };

  if (view === 'events') {
    const eventsInfo = division === 'ms' ? MS_EVENTS_INFO_DATA : HS_EVENTS_INFO_DATA;
    const eventsList = getEventsList(division);
    const selectedInfo = hoveredEvent ? eventsInfo[hoveredEvent] : null;
    const toggleFavorite = async (evt: string) => {
      if (!isLoggedIn) { setAuthInitialView('login'); setView('auth'); return; }
      const prefixedEvt = `${division}:${evt}`;
      const isFav = favorites.includes(prefixedEvt);
      if (isFav) {
        setFavorites(prev => prev.filter(f => f !== prefixedEvt));
        await supabase.from('user_favorites').delete().eq('event_name', prefixedEvt);
      } else {
        setFavorites(prev => [...prev, prefixedEvt]);
        await supabase.from('user_favorites').insert({ event_name: prefixedEvt });
      }
    };
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0a0a0a', color: '#f0f0f0', fontFamily: "'DM Sans', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
          .ev-row { display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:9px;cursor:pointer;transition:background 0.12s,border-color 0.12s;border:1px solid transparent; }
          .ev-row:hover { background:#181818;border-color:#2a2a2a; }
          .ev-row.active { background:rgba(0,255,106,0.06);border-color:rgba(0,255,106,0.2); }
          .ev-star { background:none;border:none;cursor:pointer;padding:2px 4px;color:#444;transition:color 0.15s,transform 0.15s;flex-shrink:0; }
          .ev-star:hover { color:#f59e0b;transform:scale(1.2); }
          .ev-star.starred { color:#f59e0b; }

          /* Division picker sheet */
          .division-sheet-backdrop { position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:200; animation:backdropFadeIn 0.25s ease forwards; }
          .division-sheet-backdrop.closing { animation:backdropFadeOut 0.25s ease forwards; }
          .division-sheet { position:fixed;bottom:0;left:0;right:0;background:#111; border-radius:20px 20px 0 0;z-index:201;padding:0 0 40px 0; animation:sheetSlideUp 0.3s cubic-bezier(0.32,0.72,0,1) forwards; }
          .division-sheet.closing { animation:sheetSlideDown 0.26s cubic-bezier(0.32,0.72,0,1) forwards; }
          .division-sheet-handle { width:40px;height:4px;background:#333;border-radius:4px;margin:12px auto 16px; }
          .division-option { display:flex;align-items:center;gap:14px;padding:0 20px;height:62px; cursor:pointer;transition:background 0.12s;border-bottom:1px solid #1a1a1a; }
          .division-option:last-child { border-bottom:none; }
          .division-option:hover { background:#1a1a1a; }
          .division-option:active { background:#222; }
          @keyframes sheetSlideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
          @keyframes sheetSlideDown { from{transform:translateY(0)} to{transform:translateY(100%)} }
          @keyframes backdropFadeIn { from{opacity:0} to{opacity:1} }
          @keyframes backdropFadeOut { from{opacity:1} to{opacity:0} }

          /* Event detail modal */
          .event-modal-overlay { position:fixed;top:0;left:0;right:0;bottom:0;background:#0a0a0a;z-index:300; display:flex;flex-direction:column;overflow-y:auto; animation:modalSlideUp 0.28s cubic-bezier(0.32,0.72,0,1) forwards; }
          .event-modal-overlay.closing { animation:modalSlideDown 0.23s cubic-bezier(0.32,0.72,0,1) forwards; }
          @keyframes modalSlideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
          @keyframes modalSlideDown { from{transform:translateY(0)} to{transform:translateY(100%)} }

          /* Mobile bottom nav */
          .mobile-bottom-nav {
            position:fixed;bottom:0;left:0;right:0;height:60px;background:#111;border-top:1px solid #222;
            display:flex;align-items:center;justify-content:space-around;z-index:100;padding:8px 0;
          }
          .mobile-nav-item {
            display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;
            color:#666;transition:color 0.2s;padding:8px 12px;font-size:11px;font-weight:500;flex:1;height:100%;
          }
          .mobile-nav-item.active { color:#00ff6a; }
          .mobile-nav-item svg { width:24px;height:24px;stroke-width:2; }
        `}</style>
        {!isMobile && <Sidebar isLoggedIn={isLoggedIn} onBack={() => setView('landing')} division={division} onDivisionChange={(d) => { setDivision(d); setHoveredEvent(getEventsList(d)[0]); }} theme={theme} userXP={userXP} userRank={userRank} isFounder={isFounder} username={username} />}
        {isMobile && isMobileSidebarOpen && (
          <div className="mobile-sb-overlay" onClick={() => setIsMobileSidebarOpen(false)}></div>
        )}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', minWidth: 0, paddingBottom: isMobile ? 60 : 0 }}>
          {/* Topbar */}
          <div style={{ height: 57, minHeight: 57, borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', padding: isMobile ? '0 12px' : '0 24px', gap: 14, background: '#111', flexShrink: 0 }}>
            <button onClick={() => { window.history.pushState({ view: 'portfolio' }, '', '/dashboard'); setView('portfolio'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', padding: 0 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <div style={{ fontFamily: "'Instrument Sans',sans-serif", fontWeight: 600, fontSize: 15 }}>All Events</div>
            <span style={{ fontSize: 11, background: '#181818', border: '1px solid #222', color: '#666', padding: '2px 9px', borderRadius: 5 }}>{eventsList.length} events</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
              {!isLoggedIn ? (
                <button onClick={() => { setAuthInitialView('signup'); setView('auth'); }} style={{ fontSize: 13, fontWeight: 600, color: '#000', padding: '7px 16px', borderRadius: 8, background: '#00ff6a', border: 'none', cursor: 'pointer', fontFamily: "'Instrument Sans',sans-serif" }}>Sign up free</button>
              ) : (
                <button onClick={() => supabase.auth.signOut()} style={{ fontSize: 13, color: '#aaa', padding: '7px 14px', borderRadius: 8, border: '1px solid #2a2a2a', background: 'transparent', cursor: 'pointer', fontFamily: "'Instrument Sans',sans-serif" }}>Sign out</button>
              )}
            </div>
          </div>

          {/* Two-column body */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Left: events list */}
            <div style={{ width: isMobile ? '100%' : 300, minWidth: isMobile ? 'unset' : 300, borderRight: isMobile ? 'none' : '1px solid #222', overflowY: 'auto', padding: '14px 10px' }}>
              {eventsList.map(evt => {
                const prefixedEvt = `${division}:${evt}`;
                const isFav = favorites.includes(prefixedEvt);
                const isActive = hoveredEvent === evt;
                return (
                  <div
                    key={evt}
                    className={`ev-row${isActive ? ' active' : ''}`}
                    onMouseEnter={() => !isMobile && setHoveredEvent(evt)}
                    onClick={() => { setHoveredEvent(evt); if (isMobile) setSelectedEventModal(evt); }}
                  >
                    <button
                      className={`ev-star${isFav ? ' starred' : ''}`}
                      onClick={e => { e.stopPropagation(); toggleFavorite(evt); }}
                      title={isFav ? 'Remove from saved' : 'Save event'}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill={isFav ? '#f59e0b' : 'none'} stroke={isFav ? '#f59e0b' : 'currentColor'} strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </button>
                    <span style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, color: isActive ? '#f0f0f0' : '#aaa', flex: 1, lineHeight: 1.35 }}>{evt}</span>
                    {isFav && <span style={{ fontSize: 9, background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 4, padding: '1px 5px', flexShrink: 0 }}>SAVED</span>}
                    {isMobile && <svg width="14" height="14" fill="none" stroke="#444" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>}
                  </div>
                );
              })}
            </div>

            {/* Right: event info */}
            {!isMobile && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
              {selectedInfo && hoveredEvent ? (
                <div style={{ maxWidth: 640 }}>
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 11, background: '#181818', border: '1px solid #222', color: '#666', padding: '3px 10px', borderRadius: 5 }}>{selectedInfo.type}</span>
                  </div>
                  <h2 style={{ fontFamily: "'Instrument Sans',sans-serif", fontWeight: 600, fontSize: 22, marginBottom: 10, marginTop: 14, letterSpacing: '-0.3px' }}>{hoveredEvent}</h2>
                  <p style={{ fontSize: 14, color: '#aaa', lineHeight: 1.65, marginBottom: 24 }}>{selectedInfo.desc}</p>

                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.4px', color: '#555', textTransform: 'uppercase', marginBottom: 12 }}>Knowledge Areas</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {selectedInfo.knowledge.map(k => (
                        <span key={k} style={{ fontSize: 12, background: '#181818', border: '1px solid #222', color: '#ddd', padding: '4px 12px', borderRadius: 6 }}>{k}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.4px', color: '#555', textTransform: 'uppercase', marginBottom: 10 }}>NACE Competencies</div>
                    <p style={{ fontSize: 13, color: '#888', lineHeight: 1.55 }}>{selectedInfo.nace}</p>
                  </div>

                  <button
                    onClick={() => startStudy(hoveredEvent)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#00ff6a', color: '#000', fontWeight: 700, fontSize: 13, padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: "'Instrument Sans',sans-serif" }}
                  >
                    Study this event
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#444', fontSize: 14 }}>
                  Hover an event to see details
                </div>
              )}
            </div>
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
            <div className="mobile-bottom-nav">
              <div className="mobile-nav-item" onClick={() => { window.history.pushState({ view: 'portfolio' }, '', '/dashboard'); setView('portfolio'); }}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                Dashboard
              </div>
              <div className={`mobile-nav-item${divisionPickerOpen ? ' active' : ''}`} onClick={() => divisionPickerOpen ? closeDivisionPicker() : setDivisionPickerOpen(true)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Division
              </div>
              <div className="mobile-nav-item" onClick={() => { window.history.pushState({ view: 'events' }, '', '/dashboard/events'); setView('events'); }}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292m0 0H8m4-5.292v12m0 0H8m4 0h4"/>
                </svg>
                Leaderboard
              </div>
              <div className="mobile-nav-item" onClick={() => isLoggedIn ? supabase.auth.signOut() : (setAuthInitialView('login'), setView('auth'))}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {isLoggedIn ? 'Profile' : 'Sign In'}
              </div>
            </div>
          )}

        {isMobile && (divisionPickerOpen || divisionPickerClosing) && (
          <>
            <div className={`division-sheet-backdrop${divisionPickerClosing ? ' closing' : ''}`}
              onClick={closeDivisionPicker} />
            <div className={`division-sheet${divisionPickerClosing ? ' closing' : ''}`}>
              <div className="division-sheet-handle" />
              <div style={{padding:'4px 20px 12px',fontSize:11,fontWeight:700,letterSpacing:'1.2px',color:'#555',textTransform:'uppercase'}}>
                Choose Division
              </div>
              {/* MS option */}
              <div className="division-option" onClick={() => { setDivision('ms'); setHoveredEvent(getEventsList('ms')[0]); closeDivisionPicker(); }}>
                <div style={{width:40,height:40,borderRadius:10,background:'rgba(0,255,106,0.08)',border:'1px solid rgba(0,255,106,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>🏫</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:15,color:'#f0f0f0'}}>Middle School FBLA</div>
                  <div style={{fontSize:12,color:'#555',marginTop:2}}>{getEventsList('ms').length} events</div>
                </div>
                {division === 'ms' && <svg width="18" height="18" fill="none" stroke="#00ff6a" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              {/* HS option */}
              <div className="division-option" onClick={() => { setDivision('hs'); setHoveredEvent(getEventsList('hs')[0]); closeDivisionPicker(); }}>
                <div style={{width:40,height:40,borderRadius:10,background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>🎓</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:15,color:'#f0f0f0'}}>High School FBLA</div>
                  <div style={{fontSize:12,color:'#555',marginTop:2}}>{getEventsList('hs').length} events</div>
                </div>
                {division === 'hs' && <svg width="18" height="18" fill="none" stroke="#a855f7" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            </div>
          </>
        )}

        {isMobile && (selectedEventModal || eventModalClosing) && (() => {
          const evInfo = division === 'ms' ? MS_EVENTS_INFO_DATA : HS_EVENTS_INFO_DATA;
          const modalInfo = selectedEventModal ? evInfo[selectedEventModal] : null;
          return (
            <div className={`event-modal-overlay${eventModalClosing ? ' closing' : ''}`}
                 style={{ paddingBottom: 80 }}>
              {/* Sticky header with X */}
              <div style={{position:'sticky',top:0,display:'flex',alignItems:'center',
                justifyContent:'space-between',padding:'14px 16px',background:'#0a0a0a',
                borderBottom:'1px solid #1a1a1a',zIndex:1}}>
                <span style={{fontFamily:"'Instrument Sans',sans-serif",fontWeight:600,fontSize:15}}>
                  Event Details
                </span>
                <button onClick={closeEventModal}
                  style={{background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'50%',
                    width:38,height:38,display:'flex',alignItems:'center',justifyContent:'center',
                    cursor:'pointer',color:'#aaa',flexShrink:0}}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              {/* Content */}
              {modalInfo && selectedEventModal && (
                <div style={{padding:'24px 20px',maxWidth:640,width:'100%',margin:'0 auto'}}>
                  <span style={{fontSize:11,background:'#181818',border:'1px solid #222',color:'#666',padding:'3px 10px',borderRadius:5}}>
                    {modalInfo.type}
                  </span>
                  <h2 style={{fontFamily:"'Instrument Sans',sans-serif",fontWeight:600,fontSize:22,margin:'14px 0 10px',letterSpacing:'-0.3px'}}>
                    {selectedEventModal}
                  </h2>
                  <p style={{fontSize:14,color:'#aaa',lineHeight:1.65,marginBottom:24}}>{modalInfo.desc}</p>
                  <div style={{marginBottom:24}}>
                    <div style={{fontSize:10,fontWeight:600,letterSpacing:'1.4px',color:'#555',textTransform:'uppercase',marginBottom:12}}>Knowledge Areas</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                      {modalInfo.knowledge.map(k => (
                        <span key={k} style={{fontSize:12,background:'#181818',border:'1px solid #222',color:'#ddd',padding:'4px 12px',borderRadius:6}}>{k}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{marginBottom:28}}>
                    <div style={{fontSize:10,fontWeight:600,letterSpacing:'1.4px',color:'#555',textTransform:'uppercase',marginBottom:10}}>NACE Competencies</div>
                    <p style={{fontSize:13,color:'#888',lineHeight:1.55}}>{modalInfo.nace}</p>
                  </div>
                  <button
                    onClick={() => { closeEventModal(); setTimeout(() => startStudy(selectedEventModal), 240); }}
                    style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                      background:'#00ff6a',color:'#000',fontWeight:700,fontSize:14,
                      padding:'13px 24px',borderRadius:10,border:'none',cursor:'pointer',width:'100%',
                      fontFamily:"'Instrument Sans',sans-serif"}}>
                    Study this event
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    );
  }

  // ── Derived stats from localStorage ──────────────────────────────────────
  const totalAnswered = flashcardsUsed;
  const masteryKey = `prephub_mastery_${division}`;
  const masteryScores: Record<string, number> = (() => {
    try { return JSON.parse(localStorage.getItem(masteryKey) || '{}'); } catch { return {}; }
  })();
  const studiedEvents = Object.keys(masteryScores);
  const eventsStudiedCount = studiedEvents.length;
  const avgAccuracy = studiedEvents.length > 0
    ? Math.round(studiedEvents.reduce((s, e) => s + masteryScores[e], 0) / studiedEvents.length)
    : 0;

  const MS_EVENTS = getEventsList(division);

  const hasFavorites = isLoggedIn && favorites.length > 0;
  const diffColor = (d: string) => d === 'Advanced' ? '#ef4444' : d === 'Intermediate' ? '#f59e0b' : '#00ff6a';
  const diffBg   = (d: string) => d === 'Advanced' ? 'rgba(239,68,68,0.1)' : d === 'Intermediate' ? 'rgba(245,158,11,0.1)' : 'rgba(0,255,106,0.1)';

  // portfolio view — full redesign layout
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: theme.bgPrimary, color: theme.text, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        .ds-stat-card { background:${theme.bgSecondary};border:1px solid ${theme.border};border-radius:12px;padding:16px 18px;display:flex;flex-direction:column;gap:8px;transition:border-color 0.2s,transform 0.2s;animation:dsFadeUp 0.4s ease both; }
        .ds-stat-card:hover { border-color:${theme.border};transform:translateY(-1px); }
        .ds-quiz-opt { background:${theme.bgTertiary};border:1px solid ${theme.border};border-radius:9px;padding:10px 13px;font-size:12.5px;cursor:pointer;transition:all 0.15s;line-height:1.4;color:${theme.textMuted}; }
        .ds-quiz-opt:hover { border-color:${theme.border};color:${theme.text};background:${theme.bgSecondary}; }
        .ds-quiz-opt.correct { border-color:rgba(0,255,106,0.4);background:rgba(0,255,106,0.06);color:#00ff6a; }
        .ds-quiz-opt.wrong { border-color:rgba(239,68,68,0.3);background:rgba(239,68,68,0.05);color:#ef4444; }
        .ds-lb-row { display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid ${theme.border}; }
        .ds-lb-row:last-child { border-bottom:none; }
        .ds-saved-event { display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:9px;border:1px solid ${theme.border};background:${theme.bgTertiary};cursor:pointer;transition:all 0.15s; }
        .ds-saved-event:hover { border-color:rgba(0,255,106,0.35);background:rgba(0,255,106,0.03); }
        @keyframes dsFadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dsBlink { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(0.08)} }
        @keyframes xpToastIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes xpToastOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(10px)} }
        .apex-input-ds { flex:1;background:${theme.bgTertiary};border:1px solid rgba(168,85,247,0.2);border-radius:9px;padding:9px 13px;font-size:13px;color:${theme.text};outline:none;font-family:'DM Sans',sans-serif;transition:border-color 0.15s; }
        .apex-input-ds:focus { border-color:rgba(168,85,247,0.5); }
        .apex-input-ds::placeholder { color:${theme.textMuted}; }
        .mobile-bottom-nav {
          position:fixed;bottom:0;left:0;right:0;height:60px;background:${theme.bgSecondary};border-top:1px solid ${theme.border};
          display:flex;align-items:center;justify-content:space-around;z-index:100;padding:8px 0;
        }
        .mobile-nav-item {
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;
          color:#666;transition:color 0.2s;padding:8px 12px;font-size:11px;font-weight:500;flex:1;height:100%;
        }
        .mobile-nav-item.active { color:#00ff6a; }
        .mobile-nav-item svg { width:24px;height:24px;stroke-width:2; }

        /* Division picker sheet */
        .division-sheet-backdrop { position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:200; animation:backdropFadeIn 0.25s ease forwards; }
        .division-sheet-backdrop.closing { animation:backdropFadeOut 0.25s ease forwards; }
        .division-sheet { position:fixed;bottom:0;left:0;right:0;background:#111; border-radius:20px 20px 0 0;z-index:201;padding:0 0 40px 0; animation:sheetSlideUp 0.3s cubic-bezier(0.32,0.72,0,1) forwards; }
        .division-sheet.closing { animation:sheetSlideDown 0.26s cubic-bezier(0.32,0.72,0,1) forwards; }
        .division-sheet-handle { width:40px;height:4px;background:#333;border-radius:4px;margin:12px auto 16px; }
        .division-option { display:flex;align-items:center;gap:14px;padding:0 20px;height:62px; cursor:pointer;transition:background 0.12s;border-bottom:1px solid #1a1a1a; }
        .division-option:last-child { border-bottom:none; }
        .division-option:hover { background:#1a1a1a; }
        .division-option:active { background:#222; }
        @keyframes sheetSlideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes sheetSlideDown { from{transform:translateY(0)} to{transform:translateY(100%)} }
        @keyframes backdropFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes backdropFadeOut { from{opacity:1} to{opacity:0} }

        /* Event detail modal */
        .event-modal-overlay { position:fixed;top:0;left:0;right:0;bottom:0;background:#0a0a0a;z-index:300; display:flex;flex-direction:column;overflow-y:auto; animation:modalSlideUp 0.28s cubic-bezier(0.32,0.72,0,1) forwards; }
        .event-modal-overlay.closing { animation:modalSlideDown 0.23s cubic-bezier(0.32,0.72,0,1) forwards; }
        @keyframes modalSlideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes modalSlideDown { from{transform:translateY(0)} to{transform:translateY(100%)} }
      `}</style>
      {!isMobile && <Sidebar isLoggedIn={isLoggedIn} onBack={() => setView('landing')} division={division} onDivisionChange={(d) => { setDivision(d); setHoveredEvent(getEventsList(d)[0]); }} theme={theme} />}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', minWidth: 0, paddingBottom: isMobile ? 60 : 0 }}>
        {/* Topbar */}
        <div style={{ height: 57, minHeight: 57, borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', padding: isMobile ? '0 12px' : '0 24px', gap: 14, background: theme.bgSecondary, flexShrink: 0 }}>
          <div style={{ fontFamily: "'Instrument Sans',sans-serif", fontWeight: 600, fontSize: isMobile ? 13 : 15 }}>Dashboard</div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', background: division === 'ms' ? 'rgba(0,255,106,0.1)' : 'rgba(168,85,247,0.1)', border: `1px solid ${division === 'ms' ? 'rgba(0,255,106,0.25)' : 'rgba(168,85,247,0.25)'}`, color: division === 'ms' ? '#00ff6a' : '#a855f7', padding: '2px 8px', borderRadius: 5, flexShrink: 0 }}>
            {division === 'ms' ? 'Middle School' : 'High School'}
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 10 }}>
            {!isLoggedIn ? (
              <>
                <button onClick={() => { setAuthInitialView('signup'); setView('auth'); }} style={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: '#000', padding: isMobile ? '5px 12px' : '7px 16px', borderRadius: 8, background: '#00ff6a', border: 'none', cursor: 'pointer', fontFamily: "'Instrument Sans',sans-serif" }}>Sign up</button>
                {!isMobile && (
                  <button onClick={() => { setAuthInitialView('login'); setView('auth'); }} style={{ fontSize: 13, color: '#aaa', padding: '7px 14px', borderRadius: 8, border: '1px solid #2a2a2a', background: 'transparent', cursor: 'pointer', fontFamily: "'Instrument Sans',sans-serif" }}>Log in</button>
                )}
              </>
            ) : (
              <button onClick={() => supabase.auth.signOut()} style={{ fontSize: isMobile ? 12 : 13, color: '#aaa', padding: isMobile ? '5px 10px' : '7px 14px', borderRadius: 8, border: '1px solid #2a2a2a', background: 'transparent', cursor: 'pointer', fontFamily: "'Instrument Sans',sans-serif" }}>Sign out</button>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '14px 12px' : '22px 24px', display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 22 }}>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: 12 }}>
            {[
              { label: 'Questions Answered', value: totalAnswered.toLocaleString(), color: theme.accentGreen, delta: totalAnswered > 0 ? 'keep it up!' : 'start studying', deltaUp: totalAnswered > 0, iconColor: `${theme.accentGreen}14`, iconStroke: theme.accentGreen },
              { label: 'Accuracy Rate', value: eventsStudiedCount > 0 ? `${avgAccuracy}%` : '—', color: division === 'ms' ? '#3b82f6' : '#a855f7', delta: eventsStudiedCount > 0 ? 'avg across events' : 'no data yet', deltaUp: avgAccuracy >= 70, iconColor: division === 'ms' ? 'rgba(59,130,246,0.08)' : 'rgba(168,85,247,0.08)', iconStroke: division === 'ms' ? '#3b82f6' : '#a855f7' },
              { label: 'Events Studied', value: `${eventsStudiedCount}/${MS_EVENTS.length}`, color: division === 'ms' ? '#a855f7' : theme.accentGreen, delta: eventsStudiedCount > 0 ? 'events in progress' : 'none yet', deltaUp: eventsStudiedCount > 0, iconColor: division === 'ms' ? 'rgba(168,85,247,0.08)' : `${theme.accentGreen}14`, iconStroke: division === 'ms' ? '#a855f7' : theme.accentGreen },
              { label: 'Your Rank', value: userRank, color: getRankColor(userRank), delta: isLoggedIn ? `${userXP} XP` : 'sign in to rank up', deltaUp: userXP > 0, iconColor: `${getRankColor(userRank)}14`, iconStroke: getRankColor(userRank) },
            ].map((s, i) => (
              <div key={i} className="ds-stat-card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: isMobile ? 10 : 12, color: '#666', fontWeight: 500 }}>{s.label}</span>
                  <div style={{ width: isMobile ? 24 : 28, height: isMobile ? 24 : 28, borderRadius: 7, background: s.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={isMobile ? 11 : 14} height={isMobile ? 11 : 14} fill="none" stroke={s.iconStroke} strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                  </div>
                </div>
                <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: isMobile ? 20 : 26, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.5px', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: isMobile ? 10 : 11.5, color: '#666' }}>
                  {s.deltaUp && <span style={{ color: '#00ff6a', fontWeight: 600 }}>↑ </span>}
                  {s.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Content grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 370px', gap: 16 }}>
            {/* Left col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>

              {/* Saved Events */}
              <div style={{ animation: 'dsFadeUp 0.4s ease 0.1s both' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Instrument Sans',sans-serif", fontWeight: 600, fontSize: 14 }}>Saved Events</div>
                  {hasFavorites && (
                    <button onClick={() => { window.history.pushState({ view: 'events' }, '', '/dashboard/events'); setView('events'); }} style={{ fontSize: 12, color: '#00ff6a', cursor: 'pointer', fontWeight: 500, background: 'none', border: 'none', padding: 0 }}>
                      View all {MS_EVENTS.length} →
                    </button>
                  )}
                </div>
                <div style={{ background: '#111', border: '1px solid #222', borderRadius: 12, padding: '16px 18px' }}>
                {!isLoggedIn || !hasFavorites ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: 10 }}>
                    <svg width="28" height="28" fill="none" stroke="#444" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span style={{ fontSize: 13, color: '#555' }}>{isLoggedIn ? 'Star events to save them here' : 'Sign in to save events'}</span>
                    <button
                      onClick={() => { window.history.pushState({ view: 'events' }, '', '/dashboard/events'); setView('events'); }}
                      style={{ fontSize: 13, color: '#00ff6a', fontWeight: 500, background: 'none', border: '1px solid rgba(0,255,106,0.25)', borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontFamily: "'Instrument Sans',sans-serif" }}
                    >
                      View all events →
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {favorites.filter(f => MS_EVENTS.includes(f)).slice(0, 6).map(evt => {
                      const score = masteryScores[evt];
                      return (
                        <div key={evt} className="ds-saved-event" onClick={() => startStudy(evt)}>
                          <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 10, minWidth: 0 }}>
                            <span style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt}</span>
                            {score !== undefined && (
                              <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(0,255,106,0.1)', color: '#00ff6a', borderRadius: 20, padding: '1px 7px', flexShrink: 0 }}>
                                {Math.round(score)}%
                              </span>
                            )}
                          </div>
                          <svg width="14" height="14" fill="none" stroke="#444" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
                        </div>
                      );
                    })}
                  </div>
                )}
                </div>
              </div>

              {/* Daily Question */}
              <div style={{ animation: 'dsFadeUp 0.4s ease 0.15s both' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Instrument Sans',sans-serif", fontWeight: 600, fontSize: 14 }}>Daily Question</div>
                  {quickQ && !isDailyAnswered && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ background: '#181818', border: '1px solid #222', padding: '2px 8px', borderRadius: 5, fontSize: 11, color: '#aaa' }}>{quickQ.event}</span>
                      <span style={{ background: diffBg(quickQ.difficulty), border: `1px solid ${diffColor(quickQ.difficulty)}33`, color: diffColor(quickQ.difficulty), padding: '2px 8px', borderRadius: 5, fontSize: 11 }}>{quickQ.difficulty}</span>
                    </div>
                  )}
                  {isDailyAnswered && (
                    <span style={{ fontSize: 11, color: '#555', background: '#181818', border: '1px solid #222', padding: '2px 10px', borderRadius: 5 }}>Answered · comes back tomorrow</span>
                  )}
                </div>
                <div style={{ background: isDailyAnswered ? '#0e0e0e' : '#111', border: `1px solid ${isDailyAnswered ? '#1a1a1a' : '#222'}`, borderRadius: 13, padding: '18px 20px', opacity: isDailyAnswered ? 0.45 : 1, pointerEvents: isDailyAnswered ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
                  {!quickQ ? (
                    <div style={{ color: '#555', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>Loading question…</div>
                  ) : (
                    <>
                      <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.55, marginBottom: 14, color: '#f0f0f0' }}>{quickQ.question}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {quickQ.options.map((opt) => {
                          const isCorrect = opt === quickQ.answer;
                          const isChosen = opt === quickAnswered;
                          let cls = 'ds-quiz-opt';
                          if (quickAnswered) cls += isCorrect ? ' correct' : isChosen ? ' wrong' : '';
                          return (
                            <div
                              key={opt}
                              className={cls}
                              onClick={() => {
                if (!quickAnswered && !isDailyAnswered) {
                  localStorage.setItem(dailyAnsweredKey, opt);
                  setQuickAnswered(opt);
                  awardXPToUser(XP_REWARDS.DAILY_QUESTION);
                  // Streak tracking
                  const today = new Date().toISOString().slice(0, 10);
                  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
                  const streak = (() => { try { return JSON.parse(localStorage.getItem('prephub_streak') || '{"lastAnswered":"","count":0}'); } catch { return { lastAnswered: '', count: 0 }; } })();
                  if (streak.lastAnswered !== today) {
                    streak.count = streak.lastAnswered === yesterday ? streak.count + 1 : 1;
                    streak.lastAnswered = today;
                    localStorage.setItem('prephub_streak', JSON.stringify(streak));
                    if (streak.count % 7 === 0) awardXPToUser(XP_REWARDS.STREAK_BONUS);
                  }
                }
              }}
                            >
                              {opt}{quickAnswered && isCorrect ? ' ✓' : ''}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Leaderboard */}
              <div style={{ background: '#111', border: '1px solid #222', borderRadius: 14, padding: 18, animation: 'dsFadeUp 0.4s ease 0.2s both' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontFamily: "'Instrument Sans',sans-serif", fontWeight: 600, fontSize: 14 }}>Top This Week</div>
                  <div style={{ fontSize: 12, color: '#00ff6a', cursor: 'pointer', fontWeight: 500 }}>Full board →</div>
                </div>
                {[
                  { rank: '1', rankColor: '#ffd700', av: isLoggedIn && username ? username.substring(0, 2).toUpperCase() : 'AU', avBg: 'linear-gradient(135deg,#888,#666)', name: isLoggedIn && username ? username : 'Anonymous User', score: '', you: isLoggedIn },
                  { rank: '2', rankColor: '#c0c0c0', av: '—', avBg: 'linear-gradient(135deg,#333,#222)', name: '—', score: '', you: false },
                  { rank: '3', rankColor: '#cd7f32', av: '—', avBg: 'linear-gradient(135deg,#333,#222)', name: '—', score: '', you: false },
                  { rank: '4', rankColor: '#666', av: '—', avBg: 'linear-gradient(135deg,#333,#222)', name: '—', score: '', you: false },
                  { rank: '5', rankColor: '#666', av: '—', avBg: 'linear-gradient(135deg,#333,#222)', name: '—', score: '', you: false },
                ].map((r) => (
                  <div key={r.rank} className="ds-lb-row" style={r.you ? { background: 'rgba(0,255,106,0.05)', borderRadius: 7, paddingLeft: 4, margin: '0 -4px' } : {}}>
                    <div style={{ fontWeight: 700, fontSize: 13, width: 22, textAlign: 'center', color: r.rankColor, flexShrink: 0 }}>{r.rank}</div>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: r.avBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, fontWeight: 700, color: r.rank === '1' ? '#f0f0f0' : '#666', flexShrink: 0 }}>{r.av}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 500, color: r.rank === '1' ? '#f0f0f0' : '#666' }}>{r.name}{r.you && <span style={{ fontSize: 10, color: '#00ff6a', marginLeft: 4 }}>(you)</span>}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Apex card — enlarged */}
              <div style={{ background: '#111', border: '2px solid rgba(168,85,247,0.5)', borderRadius: 14, padding: 22, position: 'relative', overflow: 'hidden', animation: 'dsFadeUp 0.4s ease 0.25s both', boxShadow: '0 0 0 1px rgba(168,85,247,0.1),inset 0 0 30px rgba(168,85,247,0.04)', flex: 1 }}>
                <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, background: 'rgba(168,85,247,0.18)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, background: '#0d0d0d', borderRadius: '50%', border: '2px solid rgba(168,85,247,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 18px rgba(168,85,247,0.3)' }}>
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                      <div style={{ width: 8, height: 10, background: '#a855f7', borderRadius: '50%', boxShadow: '0 0 10px #a855f7', animation: 'dsBlink 3.5s infinite' }}></div>
                      <div style={{ width: 8, height: 10, background: '#a855f7', borderRadius: '50%', boxShadow: '0 0 10px #a855f7', animation: 'dsBlink 3.5s 0.1s infinite' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Instrument Sans',sans-serif", fontWeight: 600, fontSize: 15 }}>Apex</div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 1 }}>Your study companion</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, background: '#00ff6a', borderRadius: '50%', boxShadow: '0 0 6px #00ff6a' }}></div>
                    <span style={{ fontSize: 11, color: '#00ff6a' }}>online</span>
                  </div>
                </div>
                {/* Chat bubbles */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, maxHeight: 250, overflowY: 'auto' }}>
                  {apexMessages.length === 0 ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ width: 26, height: 26, background: '#0d0d0d', border: '1px solid rgba(168,85,247,0.35)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ display: 'flex', gap: 3 }}>
                          <div style={{ width: 5, height: 6, background: '#a855f7', borderRadius: '50%', boxShadow: '0 0 5px #a855f7', animation: 'dsBlink 3.5s infinite' }}></div>
                          <div style={{ width: 5, height: 6, background: '#a855f7', borderRadius: '50%', boxShadow: '0 0 5px #a855f7', animation: 'dsBlink 3.5s 0.1s infinite' }}></div>
                        </div>
                      </div>
                      <div style={{ background: '#181818', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '10px 10px 10px 3px', padding: '10px 13px', fontSize: 13, lineHeight: 1.55, color: '#aaa', maxWidth: '90%' }}>
                        <b style={{ color: '#a855f7' }}>Lock in.</b>{' '}
                        {eventsStudiedCount > 0
                          ? `You've studied ${eventsStudiedCount} event${eventsStudiedCount !== 1 ? 's' : ''} with ${avgAccuracy}% avg accuracy. Keep pushing. 🔥`
                          : `Start with any event to begin building your mastery. District-level consistency starts today. 🔥`}
                      </div>
                    </div>
                  ) : (
                    apexMessages.map((msg, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        {msg.role === 'apex' && (
                          <div style={{ width: 26, height: 26, background: '#0d0d0d', border: '1px solid rgba(168,85,247,0.35)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <div style={{ display: 'flex', gap: 3 }}>
                              <div style={{ width: 5, height: 6, background: '#a855f7', borderRadius: '50%', boxShadow: '0 0 5px #a855f7' }}></div>
                              <div style={{ width: 5, height: 6, background: '#a855f7', borderRadius: '50%', boxShadow: '0 0 5px #a855f7' }}></div>
                            </div>
                          </div>
                        )}
                        <div style={{
                          background: msg.role === 'apex' ? '#181818' : '#a855f7',
                          border: msg.role === 'apex' ? '1px solid rgba(168,85,247,0.15)' : 'none',
                          borderRadius: msg.role === 'apex' ? '10px 10px 10px 3px' : '10px 10px 3px 10px',
                          padding: '10px 13px',
                          fontSize: 13,
                          lineHeight: 1.55,
                          color: msg.role === 'apex' ? '#aaa' : '#000',
                          maxWidth: '85%',
                          wordWrap: 'break-word',
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {apexLoading && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ width: 26, height: 26, background: '#0d0d0d', border: '1px solid rgba(168,85,247,0.35)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ display: 'flex', gap: 3 }}>
                          <div style={{ width: 5, height: 6, background: '#a855f7', borderRadius: '50%', boxShadow: '0 0 5px #a855f7', animation: 'dsBlink 3.5s infinite' }}></div>
                          <div style={{ width: 5, height: 6, background: '#a855f7', borderRadius: '50%', boxShadow: '0 0 5px #a855f7', animation: 'dsBlink 3.5s 0.1s infinite' }}></div>
                        </div>
                      </div>
                      <div style={{ background: '#181818', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '10px 10px 10px 3px', padding: '10px 13px', fontSize: 13, color: '#666' }}>
                        Apex is thinking...
                      </div>
                    </div>
                  )}
                </div>
                <form onSubmit={handleApexMessage} style={{ display: 'flex', gap: 7 }}>
                  <input
                    className="apex-input-ds"
                    placeholder="Ask Apex anything about FBLA..."
                    value={apexInput}
                    onChange={(e) => setApexInput(e.target.value)}
                    disabled={apexLoading}
                    style={{ opacity: apexLoading ? 0.6 : 1 }}
                  />
                  <button
                    type="submit"
                    disabled={apexLoading || !apexInput.trim()}
                    style={{
                      width: 38,
                      height: 38,
                      background: '#a855f7',
                      border: 'none',
                      borderRadius: 9,
                      cursor: apexLoading || !apexInput.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'opacity 0.15s',
                      opacity: apexLoading || !apexInput.trim() ? 0.5 : 1,
                    }}>
                    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="mobile-bottom-nav">
          <div className="mobile-nav-item active" onClick={() => { }}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Dashboard
          </div>
          <div className={`mobile-nav-item${divisionPickerOpen ? ' active' : ''}`} onClick={() => divisionPickerOpen ? closeDivisionPicker() : setDivisionPickerOpen(true)}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Division
          </div>
          <div className="mobile-nav-item" onClick={() => { window.history.pushState({ view: 'events' }, '', '/dashboard/events'); setView('events'); }}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292m0 0H8m4-5.292v12m0 0H8m4 0h4"/>
            </svg>
            Leaderboard
          </div>
          <div className="mobile-nav-item" onClick={() => isLoggedIn ? supabase.auth.signOut() : (setAuthInitialView('login'), setView('auth'))}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {isLoggedIn ? 'Profile' : 'Sign In'}
          </div>
        </div>
      )}

      {isMobile && (divisionPickerOpen || divisionPickerClosing) && (
        <>
          <div className={`division-sheet-backdrop${divisionPickerClosing ? ' closing' : ''}`}
            onClick={closeDivisionPicker} />
          <div className={`division-sheet${divisionPickerClosing ? ' closing' : ''}`}>
            <div className="division-sheet-handle" />
            <div style={{padding:'4px 20px 12px',fontSize:11,fontWeight:700,letterSpacing:'1.2px',color:'#555',textTransform:'uppercase'}}>
              Choose Division
            </div>
            {/* MS option */}
            <div className="division-option" onClick={() => { setDivision('ms'); setHoveredEvent(getEventsList('ms')[0]); closeDivisionPicker(); }}>
              <div style={{width:40,height:40,borderRadius:10,background:'rgba(0,255,106,0.08)',border:'1px solid rgba(0,255,106,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>🏫</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15,color:'#f0f0f0'}}>Middle School FBLA</div>
                <div style={{fontSize:12,color:'#555',marginTop:2}}>{getEventsList('ms').length} events</div>
              </div>
              {division === 'ms' && <svg width="18" height="18" fill="none" stroke="#00ff6a" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            {/* HS option */}
            <div className="division-option" onClick={() => { setDivision('hs'); setHoveredEvent(getEventsList('hs')[0]); closeDivisionPicker(); }}>
              <div style={{width:40,height:40,borderRadius:10,background:'rgba(168,85,247,0.08)',border:'1px solid rgba(168,85,247,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>🎓</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15,color:'#f0f0f0'}}>High School FBLA</div>
                <div style={{fontSize:12,color:'#555',marginTop:2}}>{getEventsList('hs').length} events</div>
              </div>
              {division === 'hs' && <svg width="18" height="18" fill="none" stroke="#a855f7" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
          </div>
        </>
      )}

      {/* XP Toast Notification */}
      {xpToast.visible && (
        <div
          style={{
            position: 'fixed',
            bottom: isMobile ? 20 : 24,
            right: isMobile ? 12 : 24,
            zIndex: 9999,
            background: '#111',
            border: '1px solid #00ff6a',
            borderRadius: 10,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 700,
            color: '#00ff6a',
            animation: xpToast.visible ? 'xpToastIn 0.2s ease-out' : 'xpToastOut 0.3s ease-out',
            opacity: xpToast.visible ? 1 : 0,
            transform: xpToast.visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.3s, transform 0.3s',
          }}
        >
          +{xpToast.amount} XP
        </div>
      )}
    </div>
  );
};

export default App;
