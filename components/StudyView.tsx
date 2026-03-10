
import React, { useState, useEffect } from 'react';
import { Division, OrgType } from '../App';
import { getQuestionsForEvent, QuestionData } from '../data/questionBank';
import { supabase } from '../src/lib/supabase';

interface StudyViewProps {
  eventName: string;
  division: Division;
  orgType: OrgType;
  onBack: () => void;
  flashcardsUsed: number;
  limit: number;
  onAnswer: () => void;
  onLoginRequest: () => void;
  isLoggedIn: boolean;
}

type StudyMode = 'difficulty' | 'selection' | 'flashcard' | 'test' | 'realistic' | 'summary' | 'review';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const REALISTIC_QTY: Record<Division, number> = { 'Middle School': 50, 'High School': 100 };
const REALISTIC_SECS: Record<Division, number> = { 'Middle School': 30 * 60, 'High School': 50 * 60 };

const getAnswerLetter = (card: QuestionData, text: string): string => {
  const i = card.options.indexOf(text);
  return i >= 0 ? String.fromCharCode(65 + i) : text;
};

const realisticKey = (evt: string, div: string) => `prephub_realistic_${evt}_${div}`;

const StudyView: React.FC<StudyViewProps> = ({
  eventName, division, orgType, onBack, flashcardsUsed, limit, onAnswer, onLoginRequest, isLoggedIn
}) => {
  const [mode, setMode] = useState<StudyMode>(orgType === 'FBLA' ? 'difficulty' : 'selection');
  const [lastMode, setLastMode] = useState<StudyMode | null>(null);
  const [cards, setCards] = useState<QuestionData[]>([]);
  const [allCards, setAllCards] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [selectedQty, setSelectedQty] = useState(20);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<{ card: QuestionData; chosen: string }[]>([]);

  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [isRetrying, setIsRetrying] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Realistic exam
  const [realisticCards, setRealisticCards] = useState<QuestionData[]>([]);
  const [realisticAnswers, setRealisticAnswers] = useState<Record<number, string>>({});
  const [realisticFlagged, setRealisticFlagged] = useState<number[]>([]);
  const [realisticIndex, setRealisticIndex] = useState(0);
  const [realisticSubmitted, setRealisticSubmitted] = useState(false);
  const [realisticScore, setRealisticScore] = useState<{ correct: number; total: number } | null>(null);

  const isLimitReached = !isRetrying && !isLoggedIn && flashcardsUsed >= limit;
  const remaining = Math.max(0, limit - flashcardsUsed);

  const brandTextClass = orgType === 'FBLA' ? 'text-rh-yellow' : orgType === 'DECA' ? 'text-rh-cyan' : 'text-rh-green';
  const brandBgClass = orgType === 'FBLA' ? 'bg-rh-yellow' : orgType === 'DECA' ? 'bg-rh-cyan' : 'bg-rh-green';
  const brandBorderClass = orgType === 'FBLA' ? 'border-rh-yellow' : orgType === 'DECA' ? 'border-rh-cyan' : 'border-rh-green';
  const brandShadowClass = orgType === 'FBLA' ? 'shadow-[0_0_40px_rgba(255,218,0,0.2)]' : orgType === 'DECA' ? 'shadow-[0_0_40px_rgba(0,166,224,0.2)]' : 'shadow-[0_0_40px_rgba(0,200,5,0.2)]';

  // Fetch all cards
  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      setAnswerHistory([]);
      try {
        const isSupabaseEvent = orgType === 'FBLA' && (division === 'High School' || division === 'Middle School');
        const tableName = division === 'High School' ? 'FBLA HS Questions' : 'FBLA MS Questions';

        if (isSupabaseEvent) {
          let q = supabase.from(tableName).select('*').eq('event', eventName);
          if (!isLoggedIn) q = q.eq('difficulty', difficulty).limit(limit);
          const { data, error } = await q;
          if (error) throw error;

          if (data && data.length > 0) {
            const questions: (QuestionData & { difficulty?: string })[] = data.map(row => {
              const a1 = row.answer_choice_1 ?? '';
              const a2 = row.answer_choice_2 ?? '';
              const a3 = row.answer_choice_3 ?? '';
              const a4 = row.answer_choice_4 ?? '';
              const options = [a1, a2, a3, a4];
              let answer = '';
              const ca = String(row.correct_answer ?? '').trim().toUpperCase();
              switch (ca) {
                case 'A': case '1': answer = a1; break;
                case 'B': case '2': answer = a2; break;
                case 'C': case '3': answer = a3; break;
                case 'D': case '4': answer = a4; break;
                default: answer = String(row.correct_answer ?? '').trim();
              }
              return { question: row.question, answer, options, difficulty: row.difficulty };
            });
            setAllCards(questions);
            setCards(questions.slice(0, isLoggedIn ? selectedQty : questions.length));
          } else {
            setAllCards([]); setCards([]);
          }
        } else {
          const staticQ = getQuestionsForEvent(eventName, division, isLoggedIn ? 200 : limit);
          setAllCards(staticQ);
          setCards(staticQ);
        }
      } catch (err) {
        console.error('StudyView fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCards();
  }, [eventName, division, orgType, isLoggedIn, difficulty]);

  // Realistic exam timer
  useEffect(() => {
    if (!timerActive || mode !== 'realistic') return;
    if (timeLeft <= 0) { setTimerActive(false); handleRealisticSubmit(); return; }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, timerActive, mode]);

  // Save realistic exam to localStorage on state change
  useEffect(() => {
    if (mode !== 'realistic' || realisticCards.length === 0 || realisticSubmitted) return;
    const key = realisticKey(eventName, division);
    localStorage.setItem(key, JSON.stringify({
      cards: realisticCards,
      answers: realisticAnswers,
      flagged: realisticFlagged,
      timeLeft,
      index: realisticIndex,
    }));
  }, [realisticAnswers, realisticFlagged, timeLeft, realisticIndex, mode]);

  const getPool = (diff: Difficulty): QuestionData[] => {
    const filtered = (allCards as any[]).filter(c => !c.difficulty || c.difficulty === diff);
    return filtered.length > 0 ? filtered : allCards;
  };

  const startFlashcard = () => {
    let pool = orgType === 'FBLA' ? getPool(difficulty) : allCards;
    if (!isLoggedIn) pool = pool.slice(0, limit);
    const deck = shuffleArray(pool).slice(0, isLoggedIn ? selectedQty : pool.length);
    setCards(deck);
    setCurrentIndex(0);
    setIsFlipped(false);
    setAnswerHistory([]);
    setIsRetrying(false);
    setMode('flashcard');
    setLastMode('flashcard');
  };

  const startPractice = () => {
    let pool = orgType === 'FBLA' ? getPool(difficulty) : allCards;
    if (!isLoggedIn) pool = pool.slice(0, limit);
    const deck = shuffleArray(pool).slice(0, isLoggedIn ? selectedQty : pool.length);
    setCards(deck);
    setCurrentIndex(0);
    setCorrectCount(0);
    setAnswerHistory([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setExplanation(null);
    setTimerActive(false);
    setIsRetrying(false);
    setMode('test');
    setLastMode('test');
  };

  const startRealistic = () => {
    if (!isLoggedIn) { onLoginRequest(); return; }
    const key = realisticKey(eventName, division);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const s = JSON.parse(saved);
        setRealisticCards(s.cards || []);
        setRealisticAnswers(s.answers || {});
        setRealisticFlagged(s.flagged || []);
        setTimeLeft(s.timeLeft ?? REALISTIC_SECS[division]);
        setRealisticIndex(s.index ?? 0);
        setRealisticSubmitted(false);
        setTimerActive(true);
        setMode('realistic');
        return;
      } catch {}
    }
    const qty = REALISTIC_QTY[division];
    const deck = shuffleArray(allCards).slice(0, qty);
    setRealisticCards(deck);
    setRealisticAnswers({});
    setRealisticFlagged([]);
    setTimeLeft(REALISTIC_SECS[division]);
    setRealisticIndex(0);
    setRealisticSubmitted(false);
    setTimerActive(true);
    setMode('realistic');
  };

  const toggleRealisticFlag = (idx: number) => {
    setRealisticFlagged(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const handleRealisticSubmit = () => {
    const correct = realisticCards.filter((c, i) => realisticAnswers[i] === c.answer).length;
    setRealisticScore({ correct, total: realisticCards.length });
    setTimerActive(false);
    setRealisticSubmitted(true);
    localStorage.removeItem(realisticKey(eventName, division));
    const acc = realisticCards.length > 0 ? (correct / realisticCards.length) * 100 : 0;
    const scores = JSON.parse(localStorage.getItem('prephub_mastery') || '{}');
    if (acc > (scores[eventName] || 0)) {
      scores[eventName] = acc;
      localStorage.setItem('prephub_mastery', JSON.stringify(scores));
    }
  };

  const fetchExplanation = async (card: QuestionData) => {
    setIsExplaining(true);
    setExplanation(null);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: card.question,
          answer: card.answer,
          options: card.options,
          selectedAnswer: selectedOption,
          eventName,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        setExplanation(`Error ${res.status}: ${text.slice(0, 100)}`);
        return;
      }
      const data = await res.json();
      setExplanation(data.explanation ?? 'No explanation available.');
    } catch {
      setExplanation('Could not load explanation. Please try again.');
    } finally {
      setIsExplaining(false);
    }
  };

  const handleNext = () => {
    if (isLimitReached) return;
    setIsFlipped(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setExplanation(null);
    if (!isRetrying) onAnswer();
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setMode('summary');
    }
  };

  const handleOptionClick = (option: string) => {
    if (isAnswered || isLimitReached) return;
    setSelectedOption(option);
    setIsAnswered(true);
    setAnswerHistory(prev => [...prev, { card: currentCard, chosen: option }]);
    if (option === currentCard.answer) setCorrectCount(c => c + 1);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className={`w-16 h-16 border-4 ${brandBorderClass} border-t-transparent rounded-full animate-spin mb-6`}></div>
        <h2 className="text-2xl font-bold tracking-tighter mb-2">Syncing {orgType} Core</h2>
        <p className="text-rh-gray text-sm animate-pulse">Gathering official materials for {eventName}...</p>
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (!isLoading && cards.length === 0 && mode === 'selection') {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-rh-dark/50 border border-white/5 p-12 rounded-[48px] text-center shadow-2xl animate-slide-up">
          <h2 className="text-4xl font-bold tracking-tighter mb-4">No Questions Found</h2>
          <p className="text-rh-gray text-sm font-medium leading-relaxed mb-8">
            No <span className={`font-bold ${brandTextClass}`}>{difficulty}</span> questions for <span className={`font-bold ${brandTextClass}`}>{eventName}</span> yet. Try a different level.
          </p>
          <div className="flex gap-2 mb-3">
            {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).filter(d => d !== difficulty).map(d => (
              <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 ${brandBgClass} text-black font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform`}>{d}</button>
            ))}
          </div>
          <button onClick={onBack} className="w-full bg-white/10 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/20 transition-colors">Back to Events</button>
        </div>
      </div>
    );
  }

  // ── Review (wrong answers) ─────────────────────────────────────────────────
  if (mode === 'review') {
    const mistakes = answerHistory.filter(h => h.chosen !== h.card.answer);
    return (
      <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <button onClick={() => setMode('summary')} className="text-rh-gray hover:text-white transition-colors flex items-center space-x-2 mb-8">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Results</span>
          </button>
          <div className="flex items-center space-x-3 mb-8">
            <h2 className="text-3xl font-bold tracking-tighter">Mistakes to Learn From</h2>
            <span className="text-xs font-black bg-red-500/20 text-red-400 px-3 py-1 rounded-full uppercase tracking-widest">{mistakes.length}</span>
          </div>
          <div className="space-y-4">
            {mistakes.map((h, i) => (
              <div key={i} className="bg-rh-dark border border-white/5 rounded-[28px] p-6">
                <p className="text-white font-bold mb-4 leading-snug">{h.card.question}</p>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest mt-0.5 shrink-0">Your Answer</span>
                    <span className="text-red-300 text-sm font-medium">{getAnswerLetter(h.card, h.chosen)}. {h.chosen}</span>
                  </div>
                  <div className="flex items-start space-x-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
                    <span className="text-[10px] font-black text-green-400 uppercase tracking-widest mt-0.5 shrink-0">Correct</span>
                    <span className="text-green-300 text-sm font-medium">{getAnswerLetter(h.card, h.card.answer)}. {h.card.answer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setMode('summary')} className={`w-full mt-8 ${brandBgClass} text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest ${brandShadowClass} hover:scale-[1.02] transition-transform`}>Back to Results</button>
        </div>
      </div>
    );
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  if (mode === 'summary') {
    const accuracy = cards.length > 0 ? (correctCount / cards.length) * 100 : 0;
    const isTest = lastMode === 'test';
    const mistakes = answerHistory.filter(h => h.chosen !== h.card.answer);
    if (isTest) {
      const scores = JSON.parse(localStorage.getItem('prephub_mastery') || '{}');
      if (accuracy > (scores[eventName] || 0)) {
        scores[eventName] = accuracy;
        localStorage.setItem('prephub_mastery', JSON.stringify(scores));
      }
    }
    return (
      <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-rh-dark/50 border border-white/5 p-12 rounded-[48px] text-center shadow-2xl animate-slide-up">
          <div className="mb-8">
            <div className="text-[10px] font-black text-rh-gray uppercase tracking-[0.3em] mb-2">{isTest ? 'Assessment Complete' : 'Review Complete'}</div>
            <h2 className="text-5xl font-bold tracking-tighter mb-4">{isTest ? 'Session Results' : 'Great Job!'}</h2>
            {isTest ? (
              <div className={`text-6xl font-bold tracking-tighter ${accuracy >= 70 ? brandTextClass : 'text-red-500'}`}>{accuracy.toFixed(1)}%</div>
            ) : (
              <div className={`text-xl font-bold ${brandTextClass} mb-4`}>You've reviewed all cards.</div>
            )}
          </div>
          <p className="text-rh-gray text-sm font-medium mb-10">
            {isTest ? `You answered ${correctCount} out of ${cards.length} correctly.` : `You went through ${cards.length} flashcards.`}
          </p>
          <div className="space-y-4">
            <button onClick={onBack} className={`w-full ${brandBgClass} text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest ${brandShadowClass} hover:scale-[1.02] transition-transform`}>Back to Study Plan</button>
            {isTest && mistakes.length > 0 && (
              <button onClick={() => setMode('review')} className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-red-500/20 transition-colors">
                Review {mistakes.length} Mistake{mistakes.length !== 1 ? 's' : ''}
              </button>
            )}
            {isLoggedIn ? (
              <button onClick={() => { setCurrentIndex(0); setCorrectCount(0); setAnswerHistory([]); lastMode === 'test' ? startPractice() : startFlashcard(); }} className="w-full bg-white/5 text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10">
                Try Again
              </button>
            ) : (
              <>
                <button onClick={() => { setIsRetrying(true); setCurrentIndex(0); setCorrectCount(0); setAnswerHistory([]); lastMode === 'test' ? startPractice() : startFlashcard(); }} className="w-full bg-white/5 text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10">Try Again</button>
                <button onClick={onLoginRequest} className="w-full bg-white text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">Sign Up to Unlock All Questions</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Realistic Exam ─────────────────────────────────────────────────────────
  if (mode === 'realistic') {
    if (realisticSubmitted && realisticScore) {
      const acc = (realisticScore.correct / realisticScore.total) * 100;
      return (
        <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-rh-dark border border-white/5 rounded-[40px] p-10 text-center mb-6 animate-slide-up">
              <div className="text-[10px] font-black text-rh-gray uppercase tracking-[0.3em] mb-2">Exam Complete</div>
              <h2 className="text-4xl font-bold tracking-tighter mb-2">{eventName}</h2>
              <div className={`text-7xl font-bold tracking-tighter mt-4 mb-2 ${acc >= 70 ? brandTextClass : 'text-red-500'}`}>{acc.toFixed(1)}%</div>
              <p className="text-rh-gray text-sm">{realisticScore.correct} / {realisticScore.total} correct</p>
            </div>
            {/* Answer key */}
            <div className="bg-rh-dark border border-white/5 rounded-2xl p-6 mb-6">
              <div className={`text-[10px] font-black uppercase tracking-widest ${brandTextClass} mb-4`}>Answer Key</div>
              <div className="grid grid-cols-5 gap-2">
                {realisticCards.map((card, i) => {
                  const chosen = realisticAnswers[i];
                  const correct = chosen === card.answer;
                  const letter = chosen ? getAnswerLetter(card, chosen) : '—';
                  return (
                    <div key={i} className={`rounded-lg p-2 text-center text-xs font-black border ${correct ? 'bg-green-500/10 border-green-500/30 text-green-400' : chosen ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                      <div className="text-[9px] text-gray-500 mb-0.5">Q{i + 1}</div>
                      {letter}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-3">
              <button onClick={onBack} className={`w-full ${brandBgClass} text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest ${brandShadowClass} hover:scale-[1.02] transition-transform`}>Back to Events</button>
              <button onClick={() => { localStorage.removeItem(realisticKey(eventName, division)); startRealistic(); }} className="w-full bg-white/5 text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10">Retake Exam</button>
            </div>
          </div>
        </div>
      );
    }

    const rCard = realisticCards[realisticIndex] || { question: '', answer: '', options: [] };
    const answered = Object.keys(realisticAnswers).length;
    const isFlagged = realisticFlagged.includes(realisticIndex);
    const progressPct = realisticCards.length > 0 ? (answered / realisticCards.length) * 100 : 0;
    const NAV = '#1a237e';        // dark navy — header & footer
    const Q_BLUE = '#1565c0';     // medium blue — question bar
    const BTN_BLUE = '#1976d2';   // button blue

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: "'Segoe UI', Arial, sans-serif", background: '#fff' }}>

        {/* ════ HEADER ════ */}
        <div style={{ background: NAV, display: 'flex', alignItems: 'center', padding: '6px 12px', gap: 12, flexShrink: 0, minHeight: 56 }}>
          {/* Left: event title + subtitle */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {eventName.toUpperCase()}
            </div>
            <div style={{ color: '#90caf9', fontSize: 11 }}>{orgType} {division} Competitive Exam</div>
          </div>

          {/* Center: progress bar + score + timer */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: 200, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden', marginBottom: 3 }}>
              <div style={{ height: '100%', borderRadius: 3, background: '#42a5f5', width: `${progressPct}%`, transition: 'width 0.3s' }} />
            </div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {answered} / {realisticCards.length}
            </div>
            <div style={{ color: timeLeft < 300 ? '#ef5350' : '#90caf9', fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              Remaining: {formatTime(timeLeft)}
            </div>
          </div>

          {/* Right: submit button */}
          <div style={{ flexShrink: 0 }}>
            <button
              onClick={() => { if (window.confirm('Submit exam? This cannot be undone.')) handleRealisticSubmit(); }}
              style={{ background: BTN_BLUE, color: '#fff', border: 'none', borderRadius: 4, padding: '7px 16px', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Submit
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </div>
        </div>

        {/* ════ BODY (scrollable) ════ */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#fff', display: 'flex', flexDirection: 'column' }}>

          {/* Question number bar */}
          <div style={{ background: Q_BLUE, color: '#fff', padding: '10px 20px', fontWeight: 700, fontSize: 15 }}>
            Question #{realisticIndex + 1}
          </div>

          {/* Question text */}
          <div style={{ padding: '18px 24px 12px', borderBottom: '1px solid #e0e0e0' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#212121', lineHeight: 1.6 }}>{rCard.question}</p>
          </div>

          {/* Radio options */}
          <div style={{ padding: '8px 24px', flex: 1 }}>
            {rCard.options.map((opt, idx) => {
              const isSelected = realisticAnswers[realisticIndex] === opt;
              return (
                <label
                  key={idx}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', background: isSelected ? '#e3f2fd' : 'transparent' }}
                >
                  <input
                    type="radio"
                    name={`q-${realisticIndex}`}
                    checked={isSelected}
                    onChange={() => setRealisticAnswers(prev => ({ ...prev, [realisticIndex]: opt }))}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: BTN_BLUE }}
                  />
                  <span style={{ fontSize: 14, color: '#212121' }}>{opt}</span>
                </label>
              );
            })}
          </div>

          {/* Bottom bar: flag + clear */}
          <div style={{ padding: '10px 24px', borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#555' }}>
              <input
                type="checkbox"
                checked={isFlagged}
                onChange={() => toggleRealisticFlag(realisticIndex)}
                style={{ width: 14, height: 14, cursor: 'pointer', accentColor: BTN_BLUE }}
              />
              I want to review this again before I submit
            </label>
            <button
              onClick={() => setRealisticAnswers(prev => { const n = { ...prev }; delete n[realisticIndex]; return n; })}
              disabled={!realisticAnswers[realisticIndex]}
              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555', background: 'none', border: '1px solid #bdbdbd', borderRadius: 3, padding: '5px 10px', cursor: 'pointer', opacity: realisticAnswers[realisticIndex] ? 1 : 0.35 }}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Clear Answer
            </button>
          </div>
        </div>

        {/* ════ FOOTER ════ */}
        <div style={{ background: NAV, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', flexShrink: 0 }}>
          <button
            onClick={() => setRealisticIndex(i => Math.max(0, i - 1))}
            disabled={realisticIndex === 0}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, padding: '7px 16px', color: '#fff', fontWeight: 700, fontSize: 13, cursor: realisticIndex === 0 ? 'not-allowed' : 'pointer', opacity: realisticIndex === 0 ? 0.35 : 1 }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            Prev Question
          </button>

          {/* Question minimap */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, maxWidth: 340, justifyContent: 'center' }}>
            {realisticCards.map((_, i) => (
              <button
                key={i}
                onClick={() => setRealisticIndex(i)}
                title={`Q${i + 1}${realisticFlagged.includes(i) ? ' (flagged)' : ''}`}
                style={{
                  width: 20, height: 20, borderRadius: 3, border: 'none', fontSize: 9, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                  background: i === realisticIndex ? BTN_BLUE : realisticFlagged.includes(i) ? '#f57c00' : realisticAnswers[i] ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)',
                  color: i === realisticIndex || realisticFlagged.includes(i) || realisticAnswers[i] ? '#fff' : 'rgba(255,255,255,0.5)',
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setRealisticIndex(i => Math.min(realisticCards.length - 1, i + 1))}
            disabled={realisticIndex === realisticCards.length - 1}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, padding: '7px 16px', color: '#fff', fontWeight: 700, fontSize: 13, cursor: realisticIndex === realisticCards.length - 1 ? 'not-allowed' : 'pointer', opacity: realisticIndex === realisticCards.length - 1 ? 0.35 : 1 }}
          >
            Next Question
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    );
  }

  // ── Difficulty Screen ──────────────────────────────────────────────────────
  if (mode === 'difficulty') {
    const opts: { d: Difficulty; label: string; desc: string; bg: string; border: string; text: string; badge: string }[] = [
      { d: 'Beginner',     label: 'Beginner',     desc: 'Fundamental concepts and definitions. Great for first-time studiers.', bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400',  badge: 'bg-green-500/20 text-green-300' },
      { d: 'Intermediate', label: 'Intermediate', desc: 'Applied knowledge and scenario-based questions.',                      bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300' },
      { d: 'Advanced',     label: 'Advanced',     desc: 'Complex analysis and competitive-level challenge questions.',          bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400',    badge: 'bg-red-500/20 text-red-300' },
    ];
    return (
      <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
        <button onClick={onBack} className="absolute top-6 left-6 text-rh-gray hover:text-white transition-colors flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          <span className="text-xs font-bold uppercase tracking-widest">Exit</span>
        </button>
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${brandTextClass} mb-3`}>{eventName}</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-3 text-center">Choose Your Level</h1>
        <p className="text-rh-gray text-sm mb-10 text-center max-w-md">Select the difficulty that matches where you are in your preparation.</p>
        <div className="flex flex-col gap-4 w-full max-w-lg">
          {opts.map(({ d, label, desc, bg, border, text, badge }) => (
            <button
              key={d}
              onClick={() => { setDifficulty(d); setMode('selection'); }}
              className={`group w-full ${bg} border ${border} p-6 rounded-2xl text-left hover:scale-[1.01] transition-all flex items-center justify-between`}
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-lg font-black ${text}`}>{label}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${badge}`}>{d}</span>
                </div>
                <p className="text-white/50 text-sm font-medium">{desc}</p>
              </div>
              <svg className={`w-5 h-5 ${text} opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
            </button>
          ))}

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">or</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Realistic Exam */}
          <button
            onClick={startRealistic}
            className={`group relative w-full ${brandBgClass} p-6 rounded-2xl text-left overflow-hidden hover:scale-[1.01] transition-transform ${brandShadowClass} flex items-center justify-between`}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-lg font-black text-black">Realistic Exam</span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/20 text-black/70">
                  {division === 'Middle School' ? '30 min' : '50 min'}
                </span>
              </div>
              <p className="text-black/60 text-sm font-medium">
                {REALISTIC_QTY[division]} questions · timed · mirrors real {orgType} conditions
              </p>
              {!isLoggedIn && <p className="text-black/50 text-xs font-black uppercase tracking-widest mt-1">Login required</p>}
              {!!localStorage.getItem(realisticKey(eventName, division)) && isLoggedIn && (
                <p className="text-black/70 text-xs font-black uppercase tracking-widest mt-1">⚡ Resume saved exam</p>
              )}
            </div>
            <svg className="w-5 h-5 text-black/50 group-hover:text-black/80 transition-colors shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    );
  }

  // ── Selection Screen ───────────────────────────────────────────────────────
  if (mode === 'selection') {
    const cardColor: { bg: string; border: string; hover: string; text: string; icon: string } = ({
      Beginner:     { bg: 'bg-green-500/10',  border: 'border-green-500/20',  hover: 'hover:bg-green-500/15 hover:border-green-500/40',  text: 'text-green-300/60',  icon: 'text-green-400'  },
      Intermediate: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', hover: 'hover:bg-yellow-500/15 hover:border-yellow-500/40', text: 'text-yellow-300/60', icon: 'text-yellow-400' },
      Advanced:     { bg: 'bg-red-500/10',    border: 'border-red-500/20',    hover: 'hover:bg-red-500/15 hover:border-red-500/40',       text: 'text-red-300/60',    icon: 'text-red-400'    },
    } as Record<Difficulty, { bg: string; border: string; hover: string; text: string; icon: string }>)[difficulty];
    const qtyOptions = isLoggedIn ? [10, 20, 30, 50] : [];
    const savedRealistic = !!localStorage.getItem(realisticKey(eventName, division));

    return (
      <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
        <button onClick={() => orgType === 'FBLA' ? setMode('difficulty') : onBack()} className="absolute top-6 left-6 text-rh-gray hover:text-white transition-colors flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          <span className="text-xs font-bold uppercase tracking-widest">{orgType === 'FBLA' ? 'Back' : 'Exit'}</span>
        </button>

        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${brandTextClass} mb-1`}>{difficulty} Level</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-2 text-center">Select Study Path</h1>
        <p className="text-rh-gray mb-6 text-center max-w-lg text-sm">Choose your preferred method for mastering {eventName}.</p>

        {/* Quantity selector */}
        {isLoggedIn && (
          <div className="flex items-center space-x-2 mb-8">
            <span className="text-[10px] font-black text-rh-gray uppercase tracking-widest mr-1">Questions:</span>
            {qtyOptions.map(q => (
              <button key={q} onClick={() => setSelectedQty(q)} className={`w-10 h-10 rounded-lg text-xs font-black transition-all border ${selectedQty === q ? `${brandBgClass} text-black border-transparent` : 'bg-white/5 text-rh-gray border-white/10 hover:border-white/30 hover:text-white'}`}>{q}</button>
            ))}
          </div>
        )}

        {/* Mode cards */}
        <div className="grid md:grid-cols-2 gap-5 w-full max-w-4xl mb-5">
          <button
            onClick={startFlashcard}
            className={`group relative ${cardColor.bg} border ${cardColor.border} p-10 rounded-[32px] ${cardColor.hover} transition-all text-left overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity ${cardColor.icon}`}>
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Flashcards</h3>
            <p className={`${cardColor.text} text-sm font-medium relative z-10`}>Quick-fire memorization of official terms and concepts.</p>
            {isLoggedIn && <p className={`text-[10px] font-black uppercase tracking-widest mt-3 relative z-10 ${cardColor.icon}`}>{selectedQty} questions · {difficulty}</p>}
          </button>

          <button
            onClick={startPractice}
            className={`group relative ${cardColor.bg} border ${cardColor.border} p-10 rounded-[32px] ${cardColor.hover} transition-all text-left overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity ${cardColor.icon}`}>
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Practice Exam</h3>
            <p className={`${cardColor.text} text-sm font-medium relative z-10`}>Untimed practice with instant feedback and AI explanations.</p>
            {isLoggedIn && <p className={`text-[10px] font-black uppercase tracking-widest mt-3 relative z-10 ${cardColor.icon}`}>{selectedQty} questions · {difficulty} · No timer</p>}
          </button>
        </div>

      </div>
    );
  }

  // ── Flashcard / Practice Exam shared layout ────────────────────────────────
  const currentCard = cards[currentIndex] || { question: 'No questions found', answer: '', options: [] };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8 flex flex-col relative">
      <header className="flex justify-between items-center mb-6">
        <button onClick={() => { setTimerActive(false); setMode('selection'); }} className="text-rh-gray hover:text-white transition-colors flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className={`text-[10px] font-black uppercase ${brandTextClass} tracking-[0.2em]`}>{mode === 'flashcard' ? 'Flashcards' : 'Practice Exam'}</span>
          <span className="text-lg font-bold tracking-tighter">{eventName}</span>
        </div>
        <button onClick={() => { setTimerActive(false); setMode('summary'); }} className="text-[10px] font-black uppercase tracking-widest text-white/80 hover:text-red-400 transition-colors border border-white/30 hover:border-red-500/50 px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/10">
          End
        </button>
      </header>

      <div className={`border rounded-2xl p-4 mb-4 flex justify-between items-center transition-colors ${!isLoggedIn && remaining === 0 ? 'bg-red-500/10 border-red-500/50' : 'bg-rh-dark border-white/5'}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${(isLoggedIn || remaining > 0) ? `${brandBgClass} animate-pulse` : 'bg-red-500'}`}></div>
          <span className={`text-xs font-bold uppercase tracking-widest ${!isLoggedIn && remaining === 0 ? 'text-red-500' : 'text-white'}`}>
            {isLoggedIn ? `Question ${currentIndex + 1} / ${cards.length}` : remaining > 0 ? `${currentIndex + 1} / ${cards.length} — Free Preview` : 'Free Preview Ended — Sign Up to Continue'}
          </span>
        </div>
        {!isLoggedIn && remaining === 0 && (
          <button onClick={onLoginRequest} className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-4 py-2 rounded-lg hover:scale-105 transition-all">Join PrepHub Elite</button>
        )}
      </div>

      <div className="flex-grow flex flex-col items-center justify-center max-w-2xl mx-auto w-full relative">
        {isLimitReached ? (
          <div className="relative w-full aspect-[4/3] z-10">
            <div className="absolute inset-0 bg-rh-dark border border-white/10 rounded-[40px] p-12 flex flex-col items-center justify-center text-center shadow-2xl">
              <h3 className="text-3xl font-bold tracking-tighter mb-6">Study Limit Reached</h3>
              <p className="text-rh-gray mb-10 leading-relaxed font-medium">You've reached your free study limit. Create a free account to continue.</p>
              <div className="space-y-4 w-full">
                <button onClick={onLoginRequest} className={`w-full ${brandBgClass} text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest ${brandShadowClass} hover:scale-[1.02] transition-transform`}>Create Account</button>
                <button onClick={() => { setIsRetrying(true); setCurrentIndex(0); setCorrectCount(0); setAnswerHistory([]); setIsFlipped(false); }} className="w-full bg-white/5 border border-white/10 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">Try Again</button>
                <button onClick={onBack} className="w-full bg-transparent text-white/40 font-bold py-2 text-xs uppercase tracking-widest hover:text-white/80 transition-colors">Back to Dashboard</button>
              </div>
            </div>
          </div>
        ) : mode === 'flashcard' ? (
          <>
            <div className="relative w-full aspect-[4/3] group" style={{ perspective: '1000px' }}>
              <div onClick={() => !isLimitReached && setIsFlipped(!isFlipped)} className={`relative w-full h-full cursor-pointer transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                <div className={`absolute inset-0 bg-rh-dark border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl ${orgType === 'FBLA' ? 'hover:border-rh-yellow/30' : orgType === 'DECA' ? 'hover:border-rh-cyan/30' : 'hover:border-rh-green/30'} transition-colors [backface-visibility:hidden]`}>
                  <span className="absolute top-8 left-8 text-[10px] font-bold text-rh-gray uppercase tracking-widest">Question {currentIndex + 1}</span>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug px-4">{currentCard.question}</h3>
                  <span className={`absolute bottom-8 text-[10px] font-bold ${brandTextClass} uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity`}>Click to reveal</span>
                </div>
                <div className={`absolute inset-0 ${brandBgClass} text-black rounded-3xl p-10 flex flex-col items-center justify-center text-center ${brandShadowClass} [backface-visibility:hidden] [transform:rotateY(180deg)]`}>
                  <span className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-widest text-black/40">Answer</span>
                  <p className="text-lg font-black uppercase tracking-widest text-black/50 mb-2">{getAnswerLetter(currentCard, currentCard.answer)}</p>
                  <p className="text-xl md:text-2xl font-bold leading-relaxed px-4">{currentCard.answer || 'Answer not available'}</p>
                </div>
              </div>
            </div>
            <a href={`mailto:support@bizleaderprep.com?subject=Issue with ${encodeURIComponent(eventName)}&body=Question%20index%3A%20${currentIndex + 1}%0A%0ADescribe%20the%20issue%3A`} className="mt-6 text-[10px] font-bold text-rh-gray hover:text-red-400 transition-colors uppercase tracking-widest flex items-center space-x-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <span>Report Issue</span>
            </a>
            <div className="mt-12 flex space-x-4 w-full">
              <button onClick={handleNext} className="flex-grow bg-white text-black font-black py-5 rounded-2xl text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">Next Question</button>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="bg-rh-dark border border-white/5 rounded-3xl p-10 w-full text-center shadow-2xl mb-6">
              <span className="block text-[10px] font-bold text-rh-gray uppercase tracking-widest mb-4">Exam Item {currentIndex + 1}</span>
              <h3 className="text-2xl font-bold tracking-tight leading-snug mb-2">{currentCard.question}</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 w-full">
              {currentCard.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentCard.answer;
                const showCorrect = isAnswered && isCorrect;
                const showWrong = isAnswered && isSelected && !isCorrect;
                let buttonStyle = 'bg-rh-dark border-white/10 hover:border-white/30 text-white';
                if (showCorrect) buttonStyle = `${brandBgClass} text-black ${brandBorderClass}`;
                else if (showWrong) buttonStyle = 'bg-red-500 text-white border-red-500 animate-shake';
                else if (isAnswered && !isSelected && !isCorrect) buttonStyle = 'bg-rh-dark border-white/5 text-gray-500 opacity-50';
                return (
                  <button key={idx} onClick={() => handleOptionClick(option)} disabled={isAnswered} className={`w-full p-5 rounded-xl border text-left font-bold transition-all flex items-center space-x-3 ${buttonStyle} ${!isAnswered ? 'hover:scale-[1.01]' : ''}`}>
                    <span className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-black ${isSelected && showCorrect ? 'border-black/30' : isSelected && showWrong ? 'border-white/30' : 'border-current opacity-50'}`}>{String.fromCharCode(65 + idx)}</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
            <a href={`mailto:support@bizleaderprep.com?subject=Issue with ${encodeURIComponent(eventName)}&body=Question%20index%3A%20${currentIndex + 1}%0A%0ADescribe%20the%20issue%3A`} className="mt-8 text-[10px] font-bold text-rh-gray hover:text-red-400 transition-colors uppercase tracking-widest flex items-center space-x-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <span>Report Issue</span>
            </a>
            {isAnswered && (
              <div className="mt-8 w-full animate-slide-up space-y-3">
                {!explanation && (
                  <button onClick={() => fetchExplanation(currentCard)} disabled={isExplaining} className={`w-full border py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${isExplaining ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'} ${brandBorderClass} ${brandTextClass} bg-transparent`}>
                    {isExplaining ? <span className="flex items-center justify-center space-x-2"><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg><span>Explaining...</span></span> : '✦ Explain This Answer'}
                  </button>
                )}
                {explanation && (
                  <div className={`w-full border ${brandBorderClass} bg-white/[0.03] rounded-2xl p-5 animate-slide-up`}>
                    <div className={`text-[10px] font-black uppercase tracking-widest ${brandTextClass} mb-2`}>✦ AI Explanation</div>
                    <p className="text-white/80 text-sm leading-relaxed font-medium whitespace-pre-line">{explanation}</p>
                    <button onClick={() => fetchExplanation(currentCard)} disabled={isExplaining} className="mt-3 text-[10px] font-bold text-rh-gray hover:text-white uppercase tracking-widest transition-colors disabled:opacity-40">Regenerate</button>
                  </div>
                )}
                <button onClick={handleNext} className="w-full bg-white text-black font-black py-5 rounded-2xl text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">Continue Assessment</button>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="mt-8 pt-8 border-t border-white/5 flex justify-center">
        <div className="flex space-x-1.5">
          {cards.map((_, i) => (<div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? `w-10 ${brandBgClass}` : 'w-3 bg-white/10'}`}></div>))}
        </div>
      </footer>
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default StudyView;
