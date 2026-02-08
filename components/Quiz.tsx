
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface QuizProps {
  onComplete: () => void;
}

const DIVISIONS = [
  { id: 'middle', label: 'Middle Level', desc: 'Grades 6-8' },
  { id: 'high', label: 'High School', desc: 'Grades 9-12' },
  { id: 'collegiate', label: 'Collegiate', desc: 'Post-secondary' },
];

const EVENTS: Record<string, string[]> = {
  middle: [
    'Annual Chapter Activities Presentation',
    'Business Etiquette',
    'Business Math & Financial Literacy',
    'Career Exploration',
    'Career Research',
    'Critical Thinking',
    'Digital Citizenship',
    'Elevator Speech',
    'Exploring Computer Science',
    'Exploring Economics',
    'Exploring Technology',
    'FBLA Concepts',
    'Introduction to Business Communication',
    'Leadership',
    'Marketing Mix Challenge',
    'Multimedia & Website Development',
    'Video Game Challenge'
  ],
  high: [
    'Accounting I',
    'Accounting II',
    'Advertising',
    'Agribusiness',
    'American Enterprise Project',
    'Banking & Financial Systems',
    'Broadcast Journalism',
    'Business Calculations',
    'Business Communication',
    'Business Ethics',
    'Business Law',
    'Business Management',
    'Business Plan',
    'Client Service',
    'Coding & Programming',
    'Computer Game & Simulation Programming',
    'Computer Problem Solving',
    'Cyber Security',
    'Data Analysis',
    'Database Design & Application',
    'Economics',
    'Electronic Career Portfolio',
    'Entrepreneurship',
    'Future Business Leader',
    'Graphic Design',
    'Health Care Administration',
    'Help Desk',
    'Hospitality & Event Management',
    'Human Resource Management',
    'Impromptu Speaking',
    'International Business',
    'Introduction to Business Communication',
    'Introduction to Business Concepts',
    'Introduction to Business Procedures',
    'Introduction to Event Planning',
    'Introduction to FBLA',
    'Introduction to Financial Math',
    'Introduction to Information Technology',
    'Introduction to Marketing Concepts',
    'Introduction to Parliamentary Procedure',
    'Introduction to Public Speaking',
    'Introduction to Social Media Strategy',
    'Job Interview',
    'Journalism',
    'Local Chapter Annual Business Report',
    'Management Information Systems',
    'Marketing',
    'Mobile Application Development',
    'Network Design',
    'Networking Infrastructures',
    'Organizational Leadership',
    'Parliamentary Procedure',
    'Partnership with Business Project',
    'Personal Finance',
    'Public Policy & Advocacy',
    'Public Service Announcement',
    'Public Speaking',
    'Sales Presentation',
    'Securities & Investments',
    'Sports & Entertainment Management',
    'Supply Chain Management',
    'UX Design',
    'Website Design',
    'Word Processing'
  ],
  collegiate: [
    'Accounting Case Competition',
    'Business Communication',
    'Cybersecurity',
    'Entrepreneurship',
    'Finance Case Competition',
    'Future Business Executive',
    'Information Management',
    'Job Interview',
    'Management Analysis & Decision Making',
    'Marketing Analysis & Decision Making',
    'Microeconomics',
    'Network Design',
    'Public Speaking',
    'Sports Management & Marketing'
  ]
};

type Step = 'selection' | 'recommendation' | 'signup';

interface Recommendation {
  eventName: string;
  reason: string;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('selection');
  
  // Selection State
  const [division, setDivision] = useState<string>('');
  const [event, setEvent] = useState<string>('');
  
  // Recommendation State
  const [interests, setInterests] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  
  // Signup State
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleGetRecommendations = async () => {
    if (!interests.trim()) return;
    setIsThinking(true);
    setRecommendations([]);

    const currentDivision = DIVISIONS.find(d => d.id === division);
    const divisionLabel = currentDivision ? currentDivision.label : 'FBLA';
    const validEvents = division ? EVENTS[division] : [];

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I am a student in the ${divisionLabel} division looking for an FBLA competitive event. 
        My interests/skills are: "${interests}". 
        
        Strictly recommend 3 events from this list: ${JSON.stringify(validEvents)}.
        Provide the response in JSON format.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                eventName: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          }
        }
      });

      if (response.text) {
        setRecommendations(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSelectRecommendation = (evtName: string) => {
    setEvent(evtName);
    setStep('signup');
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);
    // Simulate a brief delay
    setTimeout(() => {
      setIsSigningUp(false);
      setSignupSuccess(true);
      setTimeout(() => onComplete(), 1500);
    }, 1000);
  };

  if (step === 'recommendation') {
    return (
      <div className="mt-24 pt-10 max-w-4xl mx-auto p-6 md:p-10">
        <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl border border-gray-800 p-8 shadow-2xl">
          <div className="mb-8">
            <button 
              onClick={() => setStep('selection')}
              className="text-gray-400 hover:text-white flex items-center mb-4 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              Back
            </button>
            <h2 className="text-3xl font-bold text-white mb-2">Find Your Event</h2>
            <p className="text-gray-400">Tell us what you enjoy, and Gemini will find your best FBLA match.</p>
          </div>

          <div className="mb-8">
            <textarea 
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., I like finance, public speaking, and I'm interested in coding..."
              className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
            />
          </div>

          <div className="flex justify-end mb-8">
            <button
              onClick={handleGetRecommendations}
              disabled={isThinking || !interests.trim()}
              className={`px-8 py-3 rounded-full font-bold flex items-center transition-all ${
                isThinking || !interests.trim()
                  ? 'bg-gray-700 text-gray-500'
                  : 'bg-brand-blue hover:bg-blue-600 text-white shadow-lg'
              }`}
            >
              {isThinking ? 'Analyzing...' : 'Find Match'}
            </button>
          </div>

          {recommendations.length > 0 && (
            <div className="space-y-4 animate-fade-in-up">
              {recommendations.map((rec, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectRecommendation(rec.eventName)}
                  className="flex flex-col text-left w-full p-5 rounded-xl bg-gray-800 border border-gray-700 hover:border-brand-blue transition-all"
                >
                  <span className="text-lg font-bold text-white mb-1">{rec.eventName}</span>
                  <span className="text-sm text-gray-400">{rec.reason}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'signup') {
    return (
      <div className="mt-24 pt-10 max-w-2xl mx-auto p-6 md:p-10">
        <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl border border-gray-800 p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Join PrepHub</h2>
            <p className="text-gray-400">Study plan for: <span className="text-brand-blue font-bold">{event}</span></p>
          </div>
          <form onSubmit={handleSignupSubmit} className="space-y-5">
            <input 
              type="text" required placeholder="Name"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input 
              type="email" required placeholder="Email"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input 
              type="password" required minLength={6} placeholder="Password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
              type="submit"
              disabled={isSigningUp || signupSuccess}
              className={`w-full font-bold py-4 rounded-full transition-all flex justify-center items-center shadow-lg ${
                signupSuccess ? 'bg-green-600' : 'bg-brand-blue hover:bg-blue-600'
              }`}
            >
              {signupSuccess ? 'Ready to Start!' : isSigningUp ? 'Saving...' : 'Start Studying'}
            </button>
            <button type="button" onClick={() => setStep('selection')} className="w-full text-gray-500 text-sm">Cancel</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-24 pt-10 max-w-4xl mx-auto p-6 md:p-10">
      <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl border border-gray-800 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Select Your Path</h2>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Division</p>
            {DIVISIONS.map((div) => (
              <button
                key={div.id}
                onClick={() => { setDivision(div.id); setEvent(''); }}
                className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                  division === div.id ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-gray-800 border-transparent text-gray-400'
                }`}
              >
                <div className="font-bold">{div.label}</div>
                <div className="text-xs opacity-60">{div.desc}</div>
              </button>
            ))}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Event</p>
            <div className="h-[200px] overflow-y-auto bg-gray-800/50 rounded-xl p-2 border border-gray-800">
              {!division ? (
                <div className="h-full flex items-center justify-center text-gray-500 text-xs italic">Select division first</div>
              ) : (
                <div className="space-y-1">
                  {EVENTS[division].map((evt) => (
                    <button
                      key={evt}
                      onClick={() => setEvent(evt)}
                      className={`w-full p-2.5 rounded-lg text-left text-sm transition-colors ${
                        event === evt ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      {evt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
                onClick={() => setStep('recommendation')}
                disabled={!division}
                className="w-full mt-4 py-2 border border-dashed border-gray-700 text-xs text-gray-500 hover:text-white rounded-lg transition-colors"
            >
                AI Event Recommender
            </button>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-800 flex justify-center">
          <button
            onClick={() => setStep('signup')}
            disabled={!division || !event}
            className={`px-12 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all ${
              division && event ? 'bg-white text-black hover:scale-105 shadow-xl' : 'bg-gray-800 text-gray-600'
            }`}
          >
            Continue
          </button>
        </div>
        <button onClick={onComplete} className="w-full text-center mt-6 text-xs text-gray-600 hover:text-white">Return to Home</button>
      </div>
    </div>
  );
};

export default Quiz;
