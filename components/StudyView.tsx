
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
  onAnimalStax?: () => void;
}

type StudyMode = 'selection' | 'flashcard' | 'test' | 'summary' | 'review';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

const StudyView: React.FC<StudyViewProps> = ({ eventName, division, orgType, onBack, flashcardsUsed, limit, onAnswer, onLoginRequest, isLoggedIn, onAnimalStax }) => {
  const [mode, setMode] = useState<StudyMode>('selection');
  const [lastMode, setLastMode] = useState<StudyMode | null>(null);
  const [cards, setCards] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<{ card: QuestionData; chosen: string }[]>([]);

  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [isRetrying, setIsRetrying] = useState(false);

  const isLimitReached = !isRetrying && !isLoggedIn && flashcardsUsed >= limit;
  const remaining = Math.max(0, limit - flashcardsUsed);

  const brandTextClass = orgType === 'FBLA' ? 'text-rh-yellow' : orgType === 'DECA' ? 'text-rh-cyan' : 'text-rh-green';
  const brandBgClass = orgType === 'FBLA' ? 'bg-rh-yellow' : orgType === 'DECA' ? 'bg-rh-cyan' : 'bg-rh-green';
  const brandBorderClass = orgType === 'FBLA' ? 'border-rh-yellow' : orgType === 'DECA' ? 'border-rh-cyan' : 'border-rh-green';
  const brandBorderHoverClass = orgType === 'FBLA' ? 'hover:border-rh-yellow/50' : orgType === 'DECA' ? 'hover:border-rh-cyan/50' : 'hover:border-rh-green/50';
  const brandShadowClass = orgType === 'FBLA' ? 'shadow-[0_0_40px_rgba(255,218,0,0.2)]' : orgType === 'DECA' ? 'shadow-[0_0_40px_rgba(0,166,224,0.2)]' : 'shadow-[0_0_40px_rgba(0,200,5,0.2)]';

  const showDifficultyFilter = orgType === 'FBLA' && division === 'High School';

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      setAnswerHistory([]);
      try {
        const fetchLimit = isLoggedIn ? 50 : 5;

        if (orgType === 'FBLA' && division === 'High School') {
          const { data, error } = await supabase
            .from('FBLA HS Questions')
            .select('*')
            .eq('event', eventName)
            .eq('difficulty', difficulty);

          if (error) throw error;

          if (data && data.length > 0) {
            const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, fetchLimit);
            const questions: QuestionData[] = shuffled.map(row => {
              const options = [row.answer_1, row.answer_2, row.answer_3, row.answer_4].map(o => o ?? '');
              let answer = '';
              const ca = String(row.correct_answer ?? '').trim().toUpperCase();
              switch (ca) {
                case 'A': answer = row.answer_1 ?? ''; break;
                case 'B': answer = row.answer_2 ?? ''; break;
                case 'C': answer = row.answer_3 ?? ''; break;
                case 'D': answer = row.answer_4 ?? ''; break;
              }
              return { question: row.question, answer, options };
            });
            setCards(questions);
          } else {
            setCards([]);
          }
        } else {
          const staticQuestions = getQuestionsForEvent(eventName, division, fetchLimit);
          if (staticQuestions.length > 0) {
            setCards(staticQuestions);
          }
        }
      } catch (err) {
        console.error("StudyView fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [eventName, division, orgType, isLoggedIn, difficulty]);

  // Countdown timer — only active during test mode
  useEffect(() => {
    if (!timerActive || mode !== 'test') return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      setMode('summary');
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, timerActive, mode]);

  const startTest = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setAnswerHistory([]);
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(cards.length * 45);
    setTimerActive(true);
    setMode('test');
    setLastMode('test');
  };

  const handleNext = () => {
    if (isLimitReached) return;
    setIsFlipped(false);
    setSelectedOption(null);
    setIsAnswered(false);
    if (!isRetrying) onAnswer();

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setTimerActive(false);
      setMode('summary');
    }
  };

  const handleOptionClick = (option: string) => {
    if (isAnswered || isLimitReached) return;
    setSelectedOption(option);
    setIsAnswered(true);
    setAnswerHistory(prev => [...prev, { card: currentCard, chosen: option }]);

    if (option === currentCard.answer) {
      setCorrectCount(c => c + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className={`w-16 h-16 border-4 ${brandBorderClass} border-t-transparent rounded-full animate-spin mb-6`}></div>
        <h2 className="text-2xl font-bold tracking-tighter mb-2">Syncing {orgType} Core</h2>
        <p className="text-rh-gray text-sm animate-pulse-fast">Gathering official materials for {eventName}...</p>
      </div>
    );
  }

  if (!isLoading && cards.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-rh-dark/50 border border-white/5 p-12 rounded-[48px] text-center shadow-2xl animate-slide-up">
          <div className="mb-8">
            <div className={`w-16 h-16 ${brandBgClass} rounded-2xl rotate-12 flex items-center justify-center mx-auto mb-8 ${brandShadowClass}`}>
              <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </div>
            <h2 className="text-4xl font-bold tracking-tighter mb-4">No Questions Found</h2>
            <p className="text-rh-gray text-sm font-medium leading-relaxed max-w-sm mx-auto">
              No <span className={`font-bold ${brandTextClass}`}>{difficulty}</span> questions for <span className={`font-bold ${brandTextClass}`}>{eventName}</span> yet. Try a different level.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).filter(d => d !== difficulty).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 ${brandBgClass} text-black font-black py-4 rounded-2xl text-xs uppercase tracking-widest ${brandShadowClass} hover:scale-[1.02] transition-transform`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              onClick={onBack}
              className="w-full bg-white/10 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/20 transition-colors"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Review mode — wrong answers only
  if (mode === 'review') {
    const mistakes = answerHistory.filter(h => h.chosen !== h.card.answer);
    return (
      <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <button onClick={() => setMode('summary')} className="text-rh-gray hover:text-white transition-colors flex items-center space-x-2 mb-8">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
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
                    <span className="text-red-300 text-sm font-medium">{h.chosen}</span>
                  </div>
                  <div className={`flex items-start space-x-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3`}>
                    <span className="text-[10px] font-black text-green-400 uppercase tracking-widest mt-0.5 shrink-0">Correct</span>
                    <span className="text-green-300 text-sm font-medium">{h.card.answer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setMode('summary')}
            className={`w-full mt-8 ${brandBgClass} text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest ${brandShadowClass} hover:scale-[1.02] transition-transform`}
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'summary') {
    const accuracy = cards.length > 0 ? (correctCount / cards.length) * 100 : 0;
    const isTest = lastMode === 'test';
    const mistakes = answerHistory.filter(h => h.chosen !== h.card.answer);

    if (isTest) {
      const savedScores = JSON.parse(localStorage.getItem('prephub_mastery') || '{}');
      const previousBest = savedScores[eventName] || 0;
      if (accuracy > previousBest) {
        savedScores[eventName] = accuracy;
        localStorage.setItem('prephub_mastery', JSON.stringify(savedScores));
      }
    }

    return (
      <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-rh-dark/50 border border-white/5 p-12 rounded-[48px] text-center shadow-2xl animate-slide-up">
          <div className="mb-8">
            <div className="text-[10px] font-black text-rh-gray uppercase tracking-[0.3em] mb-2">
              {isTest ? 'Assessment Complete' : 'Review Complete'}
            </div>
            <h2 className="text-5xl font-bold tracking-tighter mb-4">
              {isTest ? 'Session Results' : 'Great Job!'}
            </h2>
            {isTest ? (
              <div className={`text-6xl font-bold tracking-tighter ${accuracy >= 70 ? brandTextClass : 'text-red-500'}`}>
                {accuracy.toFixed(1)}%
              </div>
            ) : (
              <div className={`text-xl font-bold ${brandTextClass} mb-4`}>
                You've reviewed all cards.
              </div>
            )}
          </div>

          <div className="mb-10 text-center">
            <p className="text-rh-gray text-sm font-medium">
              {isTest
                ? `You answered ${correctCount} out of ${cards.length} correctly.`
                : `You went through ${cards.length} flashcards.`
              }
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={onBack}
              className={`w-full ${brandBgClass} text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest ${brandShadowClass} hover:scale-[1.02] transition-transform`}
            >
              Back to Study Plan
            </button>

            {isTest && mistakes.length > 0 && (
              <button
                onClick={() => setMode('review')}
                className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-red-500/20 transition-colors"
              >
                Review {mistakes.length} Mistake{mistakes.length !== 1 ? 's' : ''}
              </button>
            )}

            {isLoggedIn ? (
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setCorrectCount(0);
                  setAnswerHistory([]);
                  if (lastMode === 'test') {
                    startTest();
                  } else {
                    setMode(lastMode || 'flashcard');
                  }
                }}
                className="w-full bg-white/5 text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10"
              >
                {isTest ? 'Retry Assessment' : 'Review Again'}
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsRetrying(true);
                    setCurrentIndex(0);
                    setCorrectCount(0);
                    setAnswerHistory([]);
                    if (lastMode === 'test') {
                      startTest();
                    } else {
                      setIsFlipped(false);
                      setMode(lastMode || 'flashcard');
                    }
                  }}
                  className="w-full bg-white/5 text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10"
                >
                  Try Again
                </button>
                <button
                  onClick={onLoginRequest}
                  className="w-full bg-white text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Sign Up to Unlock All 50
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'selection') {
    const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

    const difficultyPillColor: Record<Difficulty, string> = {
      Beginner:     difficulty === 'Beginner'     ? 'bg-green-500/80 text-black'  : 'bg-green-500/10 text-green-400 hover:bg-green-500/20',
      Intermediate: difficulty === 'Intermediate' ? 'bg-yellow-500/80 text-black' : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20',
      Advanced:     difficulty === 'Advanced'     ? 'bg-red-500/80 text-white'    : 'bg-red-500/10 text-red-400 hover:bg-red-500/20',
    };

    // All mode cards take the color of the currently selected difficulty
    const cardColor = {
      Beginner:     { bg: 'bg-green-500/10',  border: 'border-green-500/20',  hover: 'hover:bg-green-500/15 hover:border-green-500/40',  text: 'text-green-300/60',  icon: 'text-green-400'  },
      Intermediate: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', hover: 'hover:bg-yellow-500/15 hover:border-yellow-500/40', text: 'text-yellow-300/60', icon: 'text-yellow-400' },
      Advanced:     { bg: 'bg-red-500/10',    border: 'border-red-500/20',    hover: 'hover:bg-red-500/15 hover:border-red-500/40',       text: 'text-red-300/60',    icon: 'text-red-400'    },
    }[difficulty];

    return (
      <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
        <button onClick={onBack} className="absolute top-6 left-6 text-rh-gray hover:text-white transition-colors flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          <span className="text-xs font-bold uppercase tracking-widest">Exit</span>
        </button>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-center">Select Study Path</h1>
        <p className="text-rh-gray mb-8 text-center max-w-lg">Choose your preferred method for mastering {eventName}.</p>

        {showDifficultyFilter && (
          <div className="flex space-x-2 mb-10">
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${difficultyPillColor[d]}`}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          <button
            onClick={() => { setMode('flashcard'); setLastMode('flashcard'); }}
            className={`group relative ${cardColor.bg} border ${cardColor.border} p-10 rounded-[32px] ${cardColor.hover} transition-all text-left overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity ${cardColor.icon}`}>
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Flashcards</h3>
            <p className={`${cardColor.text} text-sm font-medium relative z-10`}>Quick-fire memorization of official terms and concepts.</p>
          </button>
          <button
            onClick={startTest}
            className={`group relative ${cardColor.bg} border ${cardColor.border} p-10 rounded-[32px] ${cardColor.hover} transition-all text-left overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity ${cardColor.icon}`}>
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Mock Exam</h3>
            <p className={`${cardColor.text} text-sm font-medium relative z-10`}>Realistic simulation of {orgType} competitive testing.</p>
          </button>
          {onAnimalStax && (
            <button onClick={onAnimalStax} className={`group relative ${cardColor.bg} border ${cardColor.border} p-10 rounded-[32px] ${cardColor.hover} transition-all text-left overflow-hidden md:col-span-2`}>
              <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity ${cardColor.icon}`}>
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
              </div>
              <div className="flex items-center space-x-3 mb-2 relative z-10">
                <h3 className="text-2xl font-bold text-white">Animal Stax</h3>
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-rh-yellow text-black">New</span>
              </div>
              <p className={`${cardColor.text} text-sm font-medium relative z-10`}>Take a break — stack animals in this arcade-style study game.</p>
            </button>
          )}
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex] || { question: 'No questions found', answer: '', options: [] };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8 flex flex-col relative">
      <header className="flex justify-between items-center mb-6">
        <button onClick={() => { setTimerActive(false); setMode('selection'); }} className="text-rh-gray hover:text-white transition-colors flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className={`text-[10px] font-black uppercase ${brandTextClass} tracking-[0.2em]`}>{mode === 'flashcard' ? 'Flashcards' : 'Practice Test'}</span>
          <span className="text-lg font-bold tracking-tighter">{eventName}</span>
        </div>
        <div className="flex items-center space-x-3">
          {mode === 'test' && (
            <div className={`text-2xl font-black tabular-nums tracking-tighter ${timeLeft < 30 ? 'text-red-500' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          )}
          <button
            onClick={() => { setTimerActive(false); setMode('summary'); }}
            className="text-[10px] font-black uppercase tracking-widest text-rh-gray/50 hover:text-red-400 transition-colors border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg"
          >
            End
          </button>
        </div>
      </header>

      <div className={`border rounded-2xl p-4 mb-4 flex justify-between items-center transition-colors ${!isLoggedIn && remaining === 0 ? 'bg-red-500/10 border-red-500/50' : 'bg-rh-dark border-white/5'
        }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${(isLoggedIn || remaining > 0) ? `${brandBgClass} animate-pulse` : 'bg-red-500'
            }`}></div>
          <span className={`text-xs font-bold uppercase tracking-widest ${!isLoggedIn && remaining === 0 ? 'text-red-500' : 'text-white'
            }`}>
            {isLoggedIn
              ? `Question ${currentIndex + 1} / ${cards.length}`
              : (remaining > 0 ? `${currentIndex + 1} / 50 — Free Preview` : 'Free Preview Ended — Sign Up to Continue')
            }
          </span>
        </div>
        {!isLoggedIn && remaining === 0 && (
          <button onClick={onLoginRequest} className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-4 py-2 rounded-lg hover:scale-105 transition-all">
            Join PrepHub Elite
          </button>
        )}
      </div>

      <div className="flex-grow flex flex-col items-center justify-center max-w-2xl mx-auto w-full relative">
        {isLimitReached ? (
          <div className="relative w-full aspect-[4/3] z-10">
            <div className="absolute inset-0 bg-rh-dark border border-white/10 rounded-[40px] p-12 flex flex-col items-center justify-center text-center shadow-2xl animate-fade-in-up">
              <h3 className="text-3xl font-bold tracking-tighter mb-6">Study Limit Reached</h3>
              <p className="text-rh-gray mb-10 leading-relaxed font-medium">
                You've reached your free study limit for the 2025-26 season preview. Continue your mastery by creating a free account.
              </p>
              <div className="space-y-4 w-full">
                <button
                  onClick={onLoginRequest}
                  className={`w-full ${brandBgClass} text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest ${brandShadowClass} hover:scale-[1.02] active:scale-[0.98] transition-transform`}
                >
                  Create Account
                </button>
                <button onClick={onBack} className="w-full bg-transparent text-white font-bold py-3 text-xs uppercase tracking-widest hover:text-white/80">
                  Back to Dashboard
                </button>
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
                  <span className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-widest text-black/40">Knowledge Base</span>
                  <p className="text-xl md:text-2xl font-bold leading-relaxed px-4">{currentCard.answer || 'Answer not available'}</p>
                </div>
              </div>
            </div>

            <button className="mt-6 text-[10px] font-bold text-rh-gray hover:text-red-400 transition-colors uppercase tracking-widest flex items-center space-x-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>Report Issue</span>
            </button>

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

                let buttonStyle = "bg-rh-dark border-white/10 hover:border-white/30 text-white";
                if (showCorrect) buttonStyle = `${brandBgClass} text-black ${brandBorderClass}`;
                else if (showWrong) buttonStyle = "bg-red-500 text-white border-red-500 animate-shake";
                else if (isAnswered && !isSelected && !isCorrect) buttonStyle = "bg-rh-dark border-white/5 text-gray-500 opacity-50";

                return (
                  <button key={idx} onClick={() => handleOptionClick(option)} disabled={isAnswered} className={`w-full p-5 rounded-xl border text-left font-bold transition-all ${buttonStyle} ${!isAnswered ? 'hover:scale-[1.01]' : ''}`}>
                    <span className="inline-block w-6 text-xs opacity-50 mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>

            <button className="mt-8 text-[10px] font-bold text-rh-gray hover:text-red-400 transition-colors uppercase tracking-widest flex items-center space-x-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>Report Issue</span>
            </button>

            {isAnswered && (
              <div className="mt-8 w-full animate-slide-up">
                <button onClick={handleNext} className="w-full bg-white text-black font-black py-5 rounded-2xl text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  Continue Assessment
                </button>
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default StudyView;
