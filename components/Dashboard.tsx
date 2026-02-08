
import React from 'react';
import { Division, OrgType } from '../App';

interface DashboardProps {
  onSelectEvent: (event: string) => void;
  division: Division;
  orgType: OrgType;
}

const FBLA_EVENTS: Record<Division, string[]> = {
  'Middle School': [
    'Business Etiquette', 
    'Career Exploration', 
    'Digital Citizenship', 
    'Exploring Computer Science', 
    'Exploring Economics', 
    'Financial Literacy',
    'Leadership',
    'Learning Strategies',
    'Running an Effective Meeting'
  ],
  'High School': [
    'Accounting I', 
    'Accounting II', 
    'Agribusiness', 
    'Business Law', 
    'Business Management', 
    'Computer Problem Solving',
    'Cybersecurity', 
    'Economics', 
    'Entrepreneurship', 
    'Healthcare Administration',
    'Insurance & Risk Management',
    'Introduction to Business Communication',
    'Marketing', 
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
  const events = orgType === 'DECA' 
    ? (DECA_EVENTS['High School'] || []) 
    : (FBLA_EVENTS[division] || []);
    
  const brandTextClass = orgType === 'FBLA' ? 'text-rh-green' : orgType === 'DECA' ? 'text-rh-cyan' : 'text-rh-yellow';

  if (events.length === 0) {
    return (
      <div className="py-20 text-center text-rh-gray">
        No competitive events found for this selection.
      </div>
    );
  }

  return (
    <div className="space-y-1 pb-20">
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
                <svg className="w-3 h-3 text-rh-gray/30 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                </svg>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{orgType} Competitive Series</span>
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

      <div className="py-16 text-center">
        <p className="text-rh-gray text-[10px] font-black uppercase tracking-[0.3em] mb-4">Official Disclaimer</p>
        <p className="text-rh-gray/50 text-xs max-w-md mx-auto leading-relaxed font-medium px-4">
          All study materials are generated based on the official 2025-2026 {orgType} Competitive Events Guide. Event availability is subject to change based on local and state conference updates.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
