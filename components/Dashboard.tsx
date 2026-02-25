
import React, { useState } from 'react';
import { Division, OrgType } from '../App';

interface DashboardProps {
  onSelectEvent: (event: string) => void;
  division: Division;
  orgType: OrgType;
}

// Official 2025-2026 FBLA High School Objective Test Events
const FBLA_EVENTS: Record<Division, string[]> = {
  'Middle School': [
    'Career Exploration',
    'Digital Citizenship',
    'Exploring Accounting & Finance',
    'Exploring Agribusiness',
    'Exploring Business Communication',
    'Exploring Business Concepts',
    'Exploring Computer Science',
    'Exploring Economics',
    'Exploring FBLA',
    'Exploring Leadership',
    'Exploring Marketing Concepts',
    'Exploring Parliamentary Procedure',
    'Exploring Personal Finance',
    'Exploring Professionalism',
    'Exploring Technology',
    'Interpersonal Communication'
  ],
  'High School': [
    'Accounting',
    'Advanced Accounting',
    'Advertising',
    'Agribusiness',
    'Business Communication',
    'Business Ethics',
    'Business Law',
    'Computer Problem Solving',
    'Cybersecurity',
    'Data Science & AI',
    'Economics',
    'Entrepreneurship',
    'Financial Math & Analysis',
    'Healthcare Administration',
    'Human Resource Management',
    'Insurance & Risk Management',
    'International Business',
    'Introduction to Business Communication',
    'Introduction to Business Concepts',
    'Introduction to Business Procedures',
    'Introduction to FBLA',
    'Introduction to Information Technology',
    'Introduction to Marketing Concepts',
    'Introduction to Marketing Strategies',
    'Introduction to Parliamentary Procedure',
    'Marketing',
    'Networking Concepts',
    'Organizational Leadership',
    'Personal Finance',
    'Securities & Investments'
  ]
};

const DECA_EVENTS: Record<string, string[]> = {
  'High School': [
    'Principles of Business Management',
    'Principles of Finance',
    'Principles of Hospitality and Tourism',
    'Principles of Marketing',
    'Apparel and Accessories Marketing',
    'Automotive Services Marketing',
    'Business Services Marketing',
    'Food Marketing Series',
    'Marketing Communications',
    'Retail Merchandising',
    'Sports and Entertainment Marketing',
    'Business Finance Series',
    'Hotel and Lodging Management',
    'Quick Serve Restaurant Management',
    'Restaurant and Food Service Management',
    'Business Law and Ethics Team Decision Making',
    'Human Resources Management',
    'Entrepreneurship Series',
    'Personal Financial Literacy'
  ]
};

const Dashboard: React.FC<DashboardProps> = ({ onSelectEvent, division, orgType }) => {
  const [searchQuery, setSearchQuery] = useState('');

  let events = orgType === 'DECA'
    ? (DECA_EVENTS['High School'] || [])
    : orgType === 'FBLA'
      ? (FBLA_EVENTS[division] || [])
      : [];

  if (searchQuery.trim()) {
    events = events.filter(evt => evt.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  const brandTextClass = orgType === 'FBLA' ? 'text-rh-yellow' : orgType === 'DECA' ? 'text-rh-cyan' : 'text-rh-green';
  const brandFocusClass = orgType === 'FBLA' ? 'focus:border-rh-yellow/50' : orgType === 'DECA' ? 'focus:border-rh-cyan/50' : 'focus:border-rh-green/50';

  return (
    <div className="space-y-1 pb-20">
      <div className="px-6 mb-8">
        <div className="relative group">
          <input
            type="text"
            placeholder={`Search ${orgType} events...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-rh-dark/50 border border-white/5 rounded-2xl px-12 py-5 text-white outline-none transition-all ${brandFocusClass} placeholder:text-rh-gray/30 font-medium`}
          />
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-rh-gray/30 group-focus-within:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="py-20 text-center text-rh-gray">
          {searchQuery ? "No events match your search." : "No competitive events found for this selection."}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 text-[10px] font-black text-rh-gray uppercase tracking-[0.2em]">
            <span>Event Name</span>
            <span>Action</span>
          </div>

          {events.map((evt) => {
            return (
              <div
                key={evt}
                onClick={() => onSelectEvent(evt)}
                className="group flex justify-between items-center px-6 py-8 hover:bg-white/[0.03] cursor-pointer transition-all border-b border-white/5 rounded-2xl"
              >
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold text-xl tracking-tight group-hover:${brandTextClass} transition-colors`}>{evt}</span>
                    {(() => {
                      const scores = JSON.parse(localStorage.getItem('prephub_mastery') || '{}');
                      const score = scores[evt];
                      if (score !== undefined) {
                        return (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${brandTextClass} bg-white/10 uppercase tracking-widest`}>
                            {Math.round(score)}% Mastery
                          </span>
                        );
                      }
                      return null;
                    })()}
                    <svg className="w-3 h-3 text-rh-gray/30 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    </svg>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{orgType} Objective Test</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity ${brandTextClass}`}>
                    Begin Study Session
                  </div>
                  <svg
                    className={`w-5 h-5 ml-4 transition-transform group-hover:translate-x-1 ${brandTextClass}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </>
      )}

      <div className="py-16 text-center">
        <p className="text-rh-gray text-[10px] font-black uppercase tracking-[0.3em] mb-4">Official Disclaimer</p>
        <p className="text-rh-gray/50 text-xs max-w-md mx-auto leading-relaxed font-medium px-4">
          All study materials are based on the official 2025-2026 {orgType} Competitive Events Guide. Event availability is subject to change based on local and state conference updates.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;

