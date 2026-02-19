
import React, { useState, useEffect } from 'react';
import { Division, OrgType } from '../App';
import { getQuestionsForEvent, QuestionData } from '../data/questionBank';
import { supabase } from '../supabaseClient';

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

type StudyMode = 'selection' | 'flashcard' | 'test' | 'summary';

const StudyView: React.FC<StudyViewProps> = ({ eventName, division, orgType, onBack, flashcardsUsed, limit, onAnswer, onLoginRequest, isLoggedIn }) => {
  const [mode, setMode] = useState<StudyMode>('selection');
  const [cards, setCards] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Constraint: Everyone limited to 5 items per session/event.
  // Non-logged-in: Limit by usage count (flashcardsUsed).
  // Logged-in: Limited by available content (artificial 5 item cap).

  const isLimitReached = !isLoggedIn && flashcardsUsed >= limit;
  const remaining = Math.max(0, limit - flashcardsUsed);

  const brandTextClass = orgType === 'FBLA' ? 'text-rh-yellow' : orgType === 'DECA' ? 'text-rh-cyan' : 'text-rh-green';
  const brandBgClass = orgType === 'FBLA' ? 'bg-rh-yellow' : orgType === 'DECA' ? 'bg-rh-cyan' : 'bg-rh-green';
  const brandBorderClass = orgType === 'FBLA' ? 'border-rh-yellow' : orgType === 'DECA' ? 'border-rh-cyan' : 'border-rh-green';
  const brandBorderHoverClass = orgType === 'FBLA' ? 'hover:border-rh-yellow/50' : orgType === 'DECA' ? 'hover:border-rh-cyan/50' : 'hover:border-rh-green/50';
  const brandShadowClass = orgType === 'FBLA' ? 'shadow-[0_0_40px_rgba(255,218,0,0.2)]' : orgType === 'DECA' ? 'shadow-[0_0_40px_rgba(0,166,224,0.2)]' : 'shadow-[0_0_40px_rgba(0,200,5,0.2)]';

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      try {
        const staticQuestions = getQuestionsForEvent(eventName, division);
        if (staticQuestions.length > 0) {
          setCards(staticQuestions.slice(0, 5)); // Hard limit of 5 items
        }
        // If no static questions exist, cards stays empty -> "Under Construction" shown
      } catch (err) {
        console.error("StudyView fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, [eventName, division, orgType]);

  const handleNext = () => {
    if (isLimitReached) return;
    setIsFlipped(false);
    setSelectedOption(null);
    setIsAnswered(false);
    onAnswer();

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

    if (option === currentCard.answer) {
      setCorrectCount(c => c + 1);
    }
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

  // Show "Under Construction" when no questions are available for this event
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
            <h2 className="text-4xl font-bold tracking-tighter mb-4">Under Construction</h2>
            <p className="text-rh-gray text-sm font-medium leading-relaxed max-w-sm mx-auto">
              Study materials for <span className={`font-bold ${brandTextClass}`}>{eventName}</span> are currently being built for the 2025-26 season. Check back soon!
            </p>
          </div>
          <button
            onClick={onBack}
            className={`w-full ${brandBgClass} text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest ${brandShadowClass} hover:scale-[1.02] transition-transform`}
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'summary') {
    const accuracy = (correctCount / cards.length) * 100;

    // Save score
    const savedScores = JSON.parse(localStorage.getItem('prephub_mastery') || '{}');
    // Only update if new score is higher or doesn't exist? Or just overwrite? "Accurate mastery scores" usually implies best or latest. I'll save the Highest score for "Mastery".
    const previousBest = savedScores[eventName] || 0;
    if (accuracy > previousBest) {
      savedScores[eventName] = accuracy;
      localStorage.setItem('prephub_mastery', JSON.stringify(savedScores));
    }

    return (
      <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-rh-dark/50 border border-white/5 p-12 rounded-[48px] text-center shadow-2xl animate-slide-up">
          <div className="mb-8">
            <div className="text-[10px] font-black text-rh-gray uppercase tracking-[0.3em] mb-2">Study Complete</div>
            <h2 className="text-5xl font-bold tracking-tighter mb-4">Session Results</h2>
            <div className={`text-6xl font-bold tracking-tighter ${accuracy >= 70 ? brandTextClass : 'text-red-500'}`}>
              {accuracy.toFixed(1)}%
            </div>
          </div>

          <div className="mb-10 text-center">
            <p className="text-rh-gray text-sm font-medium">You answered {correctCount} out of {cards.length} correctly.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={onBack}
              className={`w-full ${brandBgClass} text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest ${brandShadowClass} hover:scale-[1.02] transition-transform`}
            >
              Back to Study Plan
            </button>

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setCorrectCount(0);
                    setMode('test');
                  }}
                  className="w-full bg-white/5 text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10"
                >
                  Retry Assessment
                </button>
                <p className="text-rh-gray text-[10px] uppercase tracking-widest mt-4">
                  Additional questions under construction
                </p>
              </>
            ) : (
              <button
                onClick={onLoginRequest}
                className={`w-full bg-white text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]`}
              >
                Sign Up to Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'selection') {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
        <button onClick={onBack} className="absolute top-6 left-6 text-rh-gray hover:text-white transition-colors flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          <span className="text-xs font-bold uppercase tracking-widest">Exit</span>
        </button>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-center">Select Study Path</h1>
        <p className="text-rh-gray mb-12 text-center max-w-lg">Choose your preferred method for mastering {eventName}.</p>
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          <button onClick={() => setMode('flashcard')} className={`group relative bg-rh-dark border border-white/5 p-10 rounded-[32px] hover:bg-white/5 ${brandBorderHoverClass} transition-all text-left overflow-hidden`}>
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Flashcards</h3>
            <p className="text-rh-gray text-sm font-medium relative z-10">Quick-fire memorization of official terms and concepts.</p>
          </button>
          <button onClick={() => setMode('test')} className={`group relative bg-rh-dark border border-white/5 p-10 rounded-[32px] hover:bg-white/5 ${brandBorderHoverClass} transition-all text-left overflow-hidden`}>
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Mock Exam</h3>
            <p className="text-rh-gray text-sm font-medium relative z-10">Realistic simulation of {orgType} competitive testing.</p>
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex] || { question: 'No questions found', answer: '', options: [] };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8 flex flex-col relative">
      <header className="flex justify-between items-center mb-6">
        <button onClick={() => setMode('selection')} className="text-rh-gray hover:text-white transition-colors flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>
        <div className="flex space-x-8 items-center">
          <div className="flex flex-col items-end">
            <span className={`text-[10px] font-black uppercase ${brandTextClass} tracking-[0.2em]`}>{mode === 'flashcard' ? 'Flashcards' : 'Practice Test'}</span>
            <span className="text-lg font-bold tracking-tighter text-right">{eventName}</span>
          </div>
        </div>
      </header>

      <div className={`border rounded-2xl p-4 mb-8 flex justify-between items-center transition-colors ${!isLoggedIn && remaining === 0 ? 'bg-red-500/10 border-red-500/50' : 'bg-rh-dark border-white/5'
        }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${(isLoggedIn || remaining > 0) ? `${brandBgClass} animate-pulse` : 'bg-red-500'
            }`}></div>
          <span className={`text-xs font-bold uppercase tracking-widest ${!isLoggedIn && remaining === 0 ? 'text-red-500' : 'text-white'
            }`}>
            {isLoggedIn
              ? "Items Available: 5 (Under Construction)"
              : (remaining > 0 ? `${remaining} Free Items Remaining` : 'Daily Access Limit Reached')
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
                <div className={`absolute inset-0 bg-rh-dark border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl ${orgType === 'FBLA' ? 'hover:border-rh-green/30' : orgType === 'DECA' ? 'hover:border-rh-cyan/30' : 'hover:border-rh-yellow/30'} transition-colors [backface-visibility:hidden]`}>
                  <span className="absolute top-8 left-8 text-[10px] font-bold text-rh-gray uppercase tracking-widest">Question {currentIndex + 1}</span>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug px-4">{currentCard.question}</h3>
                  <span className={`absolute bottom-8 text-[10px] font-bold ${brandTextClass} uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity`}>Click to reveal</span>
                </div>
                <div className={`absolute inset-0 ${brandBgClass} text-black rounded-3xl p-10 flex flex-col items-center justify-center text-center ${brandShadowClass} [backface-visibility:hidden] [transform:rotateY(180deg)]`}>
                  <span className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-widest text-black/40">Knowledge Base</span>
                  <p className="text-xl md:text-2xl font-bold leading-relaxed px-4">{currentCard.answer}</p>
                </div>
              </div>
            </div>
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
