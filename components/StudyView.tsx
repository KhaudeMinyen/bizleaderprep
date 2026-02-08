
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
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
}

type StudyMode = 'selection' | 'flashcard' | 'test' | 'summary';

const StudyView: React.FC<StudyViewProps> = ({ eventName, division, orgType, onBack, flashcardsUsed, limit, onAnswer, onLoginRequest }) => {
  const [mode, setMode] = useState<StudyMode>('selection');
  const [cards, setCards] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const isLimitReached = flashcardsUsed >= limit;
  const remaining = Math.max(0, limit - flashcardsUsed);

  const brandTextClass = orgType === 'FBLA' ? 'text-rh-green' : orgType === 'DECA' ? 'text-rh-cyan' : 'text-rh-yellow';
  const brandBgClass = orgType === 'FBLA' ? 'bg-rh-green' : orgType === 'DECA' ? 'bg-rh-cyan' : 'bg-rh-yellow';
  const brandBorderClass = orgType === 'FBLA' ? 'border-rh-green' : orgType === 'DECA' ? 'border-rh-cyan' : 'border-rh-yellow';
  const brandShadowClass = orgType === 'FBLA' ? 'shadow-[0_0_40px_rgba(0,200,5,0.2)]' : orgType === 'DECA' ? 'shadow-[0_0_40px_rgba(0,166,224,0.2)]' : 'shadow-[0_0_40px_rgba(255,218,0,0.2)]';

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      try {
        const staticQuestions = getQuestionsForEvent(eventName, division);
        if (staticQuestions.length > 0) {
          setCards(staticQuestions);
          setIsLoading(false);
          return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Generate 5 high-quality competitive multiple choice study questions for the FBLA ${division} event: "${eventName}". 
          The questions must be difficult and follow official FBLA competition guidelines for the 2025 season.
          Return ONLY a JSON array of objects with "question", "options" (array of 4 strings), and "answer" (the exact correct answer text) keys.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  answer: { type: Type.STRING }
                },
                required: ['question', 'options', 'answer']
              }
            }
          }
        });

        if (response.text) {
          const generated = JSON.parse(response.text);
          setCards(generated);
        }
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
      setStreak(s => s + 1);
      setCorrectCount(c => c + 1);
    } else {
      setStreak(0);
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

  if (mode === 'summary') {
    const accuracy = (correctCount / cards.length) * 100;
    return (
      <div className="min-h-screen bg-black text-white px-6 py-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-rh-dark/50 border border-white/5 p-12 rounded-[48px] text-center shadow-2xl animate-slide-up">
           <div className="mb-8">
             <div className="text-[10px] font-black text-rh-gray uppercase tracking-[0.3em] mb-2">Study Complete</div>
             <h2 className="text-5xl font-bold tracking-tighter mb-4">Session Results</h2>
             <div className={`text-6xl font-bold tracking-tighter ${accuracy >= 70 ? 'text-rh-green' : 'text-red-500'}`}>
               {accuracy.toFixed(1)}%
             </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="text-[10px] font-black text-rh-gray uppercase mb-1">Max Streak</div>
                <div className="text-2xl font-bold text-white">{streak} 🔥</div>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="text-[10px] font-black text-rh-gray uppercase mb-1">Knowledge Growth</div>
                <div className="text-2xl font-bold text-rh-green">Active</div>
              </div>
           </div>

           <div className="space-y-4">
              <button 
                onClick={onBack}
                className={`w-full ${brandBgClass} text-black font-black py-5 rounded-2xl text-xs uppercase tracking-widest ${brandShadowClass} hover:scale-[1.02] transition-transform`}
              >
                Back to Study Plan
              </button>
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
          <button onClick={() => setMode('flashcard')} className={`group relative bg-rh-dark border border-white/5 p-10 rounded-[32px] hover:bg-white/5 hover:${brandBorderClass}/50 transition-all text-left overflow-hidden`}>
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Flashcards</h3>
            <p className="text-rh-gray text-sm font-medium relative z-10">Quick-fire memorization of official terms and concepts.</p>
          </button>
          <button onClick={() => setMode('test')} className={`group relative bg-rh-dark border border-white/5 p-10 rounded-[32px] hover:bg-white/5 hover:${brandBorderClass}/50 transition-all text-left overflow-hidden`}>
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
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
              <span className="text-[10px] font-black text-rh-gray uppercase tracking-widest">Streak</span>
              <span className={`text-xl font-bold tracking-tighter ${streak > 0 ? 'text-rh-green' : 'text-white'}`}>{streak} 🔥</span>
           </div>
           <div className="flex flex-col items-end">
              <span className={`text-[10px] font-black uppercase ${brandTextClass} tracking-[0.2em]`}>{mode === 'flashcard' ? 'Flashcards' : 'Practice Test'}</span>
              <span className="text-lg font-bold tracking-tighter text-right">{eventName}</span>
           </div>
        </div>
      </header>

      <div className={`border rounded-2xl p-4 mb-8 flex justify-between items-center transition-colors ${remaining === 0 ? 'bg-red-500/10 border-red-500/50' : 'bg-rh-dark border-white/5'}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${remaining > 0 ? `${brandBgClass} animate-pulse` : 'bg-red-500'}`}></div>
          <span className={`text-xs font-bold uppercase tracking-widest ${remaining === 0 ? 'text-red-500' : 'text-white'}`}>
            {remaining > 0 ? `${remaining} Free Items Remaining` : 'Daily Access Limit Reached'}
          </span>
        </div>
        {remaining === 0 && (
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
                <div className={`absolute inset-0 bg-rh-dark border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl hover:${brandBorderClass}/30 transition-colors [backface-visibility:hidden]`}>
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
