import React from "react";
import { createPageUrl } from "@/utils";
// Fredoka font
const fredokaLink = document.createElement('link');
fredokaLink.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500&display=swap';
fredokaLink.rel = 'stylesheet';
document.head.appendChild(fredokaLink);

export default function Home({ onBack, onPlayGame }) {
  const [showCredits, setShowCredits] = React.useState(false);
  const [showDifficulty, setShowDifficulty] = React.useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center" style={{border: "none", outline: "none"}}>
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-5 z-30 px-5 py-2 rounded-full text-white text-lg shadow-lg transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #a0a0a0 0%, #707070 100%)",
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 400,
            boxShadow: "0 4px 0 #404040",
          }}>
          ← Back
        </button>
      )}
      {/* Sky background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #1a6bb5 0%, #3a9ad9 40%, #6ec6f5 70%, #a8dff5 100%)"
      }} />

      {/* Swirly sky texture overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <filter id="turbulence">
          <feTurbulence type="turbulence" baseFrequency="0.012 0.008" numOctaves="4" seed="3" result="turb" />
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="60" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <rect width="100%" height="100%" fill="white" filter="url(#turbulence)" />
      </svg>

      {/* Animated swirly clouds */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Cloud 1 */}
        <div className="cloud cloud-1" style={{top: "10%", left: "-200px", animationDelay: "0s"}} />
        {/* Cloud 2 */}
        <div className="cloud cloud-2" style={{top: "25%", left: "-300px", animationDelay: "8s"}} />
        {/* Cloud 3 */}
        <div className="cloud cloud-3" style={{top: "15%", left: "-250px", animationDelay: "4s"}} />
        {/* Cloud 4 */}
        <div className="cloud cloud-1" style={{top: "35%", left: "-180px", animationDelay: "14s"}} />
      </div>

      {/* Green dreamy landscape hills */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{height: "42%"}}>
        {/* Back hill */}
        <path d="M0,160 C200,60 400,200 600,120 C800,40 1000,180 1200,100 C1350,40 1420,130 1440,100 L1440,320 L0,320 Z"
          fill="#2d8a3e" opacity="0.6" />
        {/* Mid hill */}
        <path d="M0,220 C180,120 350,260 560,180 C750,100 950,240 1150,160 C1320,90 1400,180 1440,150 L1440,320 L0,320 Z"
          fill="#3aaa50" opacity="0.8" />
        {/* Front hill */}
        <path d="M0,270 C120,200 280,310 480,250 C680,190 860,300 1060,240 C1230,185 1360,265 1440,230 L1440,320 L0,320 Z"
          fill="#4dc463" />
        {/* Ground */}
        <rect x="0" y="300" width="1440" height="20" fill="#3aaa50" />
      </svg>

      {/* Foreground grass tufts */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{height: "12%"}}>
        <path d="M0,80 Q20,40 40,80 Q60,40 80,80 Q100,30 120,80 Q150,35 180,80 Q210,40 240,80 Q280,30 320,80 Q360,42 400,80 Q430,32 460,80 Q490,38 520,80 Q560,28 600,80 Q640,40 680,80 Q710,32 740,80 Q770,38 800,80 Q840,28 880,80 Q920,36 960,80 Q1000,30 1040,80 Q1080,40 1120,80 Q1160,32 1200,80 Q1240,36 1280,80 Q1320,28 1360,80 Q1400,38 1440,80 Z"
          fill="#5ddb73" />
      </svg>

      {/* Animal sprites floating around */}
      {(() => {
        const SHEET = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699dc2f8fe2bbd04d5643698/dbbfbc20c_AdobeExpress-file.png";
        const SIZE = 110;
        const SHEET_COLS = 2;
        const SHEET_ROWS = 2;
        // Each sprite occupies half the sheet width/height
        // backgroundSize = SIZE * SHEET_COLS x SIZE * SHEET_ROWS
        const bgSize = `${SIZE * SHEET_COLS}px ${SIZE * SHEET_ROWS}px`;
        const animals = [
          { label: "dog",  col: 0, row: 0, pos: { top: "12%",    left:  "6%" }, dur: "3.5s", delay: "0s"   },
          { label: "cat",  col: 1, row: 0, pos: { top: "12%",    right: "6%" }, dur: "4s",   delay: "0.8s" },
          { label: "pig",  col: 0, row: 1, pos: { bottom: "22%", left:  "6%" }, dur: "3.8s", delay: "1.5s" },
          { label: "bee",  col: 1, row: 1, pos: { bottom: "22%", right: "6%" }, dur: "4.2s", delay: "2.2s" },
        ];
        return (
          <div className="absolute inset-0 pointer-events-none z-10">
            {animals.map(({ label, col, row, pos, dur, delay }) => (
              <div key={label} style={{
                position: "absolute",
                width: `${SIZE}px`,
                height: `${SIZE}px`,
                borderRadius: "18px",
                filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
                animation: `floatBob ${dur} ease-in-out infinite`,
                animationDelay: delay,
                backgroundImage: `url(${SHEET})`,
                backgroundSize: bgSize,
                backgroundPosition: `${-col * SIZE}px ${-row * SIZE}px`,
                backgroundRepeat: "no-repeat",
                ...pos,
              }} title={label} />
            ))}
          </div>
        );
      })()}

      {/* Title */}
      <div className="relative z-10 flex flex-col items-center gap-8 mb-16">
        <h1 className="text-7xl md:text-9xl font-black tracking-tight drop-shadow-2xl select-none"
          style={{
            color: "#fff",
            textShadow: "0 4px 0 #b05a00, 0 8px 24px rgba(0,0,0,0.35), 0 2px 0 #e87a20",
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}>
          Animal Stax
        </h1>

        {/* Buttons */}
        <div className="flex flex-row gap-6 items-center">
          <button
            onClick={() => setShowDifficulty(true)}
            className="px-12 py-4 text-2xl font-bold rounded-full shadow-xl transition-all duration-150 active:scale-95 hover:scale-105 hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #ff8c00 0%, #e85d00 100%)",
              color: "#fff",
              boxShadow: "0 6px 0 #a03a00, 0 8px 24px rgba(0,0,0,0.3)",
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 400,
              letterSpacing: "0.08em",
            }}>
            Play
          </button>

          <button
            onClick={() => setShowCredits(true)}
            className="px-10 py-4 text-2xl font-bold rounded-full shadow-xl transition-all duration-150 active:scale-95 hover:scale-105 hover:brightness-110"
            style={{
              background: "linear-gradient(135deg, #a0a0a0 0%, #707070 100%)",
              color: "#fff",
              boxShadow: "0 6px 0 #404040, 0 8px 24px rgba(0,0,0,0.3)",
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 400,
              letterSpacing: "0.08em",
            }}>
            Credits
          </button>
        </div>
      </div>

      {/* Difficulty Modal */}
      {showDifficulty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowDifficulty(false)}>
          <div className="absolute inset-0 bg-black opacity-50" />
          <div
            onClick={e => e.stopPropagation()}
            className="relative rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-5 text-center"
            style={{
              background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
              fontFamily: "'Fredoka', sans-serif",
              minWidth: "320px",
            }}>
            <h2 className="text-4xl font-medium text-green-800" style={{fontWeight: 500}}>Select Difficulty</h2>
            {[
              { label: "Easy", bg: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)", shadow: "0 6px 0 #2d6a00" },
              { label: "Medium", bg: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)", shadow: "0 6px 0 #a05a00" },
              { label: "Hard", bg: "linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%)", shadow: "0 6px 0 #7a0000" },
            ].map(({ label, bg, shadow }) => (
              <button
                key={label}
                onClick={() => onPlayGame ? onPlayGame(label.toLowerCase()) : (window.location.href = createPageUrl(`Game?difficulty=${label.toLowerCase()}`))}
                className="w-full px-10 py-4 text-2xl font-bold rounded-full shadow-xl transition-all duration-150 active:scale-95 hover:scale-105 hover:brightness-110"
                style={{
                  background: bg,
                  color: "#fff",
                  boxShadow: shadow,
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.08em",
                }}>
                {label}
              </button>
            ))}
            <button
              onClick={() => setShowDifficulty(false)}
              className="mt-1 px-8 py-2 rounded-full text-white text-lg shadow-lg transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #a0a0a0 0%, #707070 100%)",
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 400,
                boxShadow: "0 4px 0 #404040",
              }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Credits Modal */}
      {showCredits && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowCredits(false)}>
          <div className="absolute inset-0 bg-black opacity-50" />
          <div
            onClick={e => e.stopPropagation()}
            className="relative rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-4 text-center"
            style={{
              background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
              fontFamily: "'Fredoka', sans-serif",
              minWidth: "300px",
            }}>
            <h2 className="text-4xl font-medium text-green-800" style={{fontWeight: 500}}>Credits</h2>
            <p className="text-xl text-green-900 leading-relaxed" style={{fontWeight: 400}}>
              Developer: Khaude Minyen
            </p>
            <p className="text-lg text-green-700" style={{fontWeight: 400}}>Created with Base44</p>
            <p className="text-lg text-green-700" style={{fontWeight: 400}}>Copyright AnimalStax 2026</p>
            <button
              onClick={() => setShowCredits(false)}
              className="mt-2 px-8 py-3 rounded-full text-white text-xl shadow-lg transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #a0a0a0 0%, #707070 100%)",
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 400,
                boxShadow: "0 4px 0 #404040",
              }}>
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .cloud {
          position: absolute;
          border-radius: 50px;
          background: white;
          animation: driftCloud linear infinite;
        }
        .cloud::before, .cloud::after {
          content: '';
          position: absolute;
          background: white;
          border-radius: 50%;
        }
        .cloud-1 {
          width: 220px; height: 70px;
          animation-duration: 38s;
          filter: blur(2px);
        }
        .cloud-1::before {
          width: 100px; height: 100px;
          top: -55px; left: 30px;
        }
        .cloud-1::after {
          width: 70px; height: 70px;
          top: -38px; left: 110px;
        }
        .cloud-2 {
          width: 300px; height: 90px;
          animation-duration: 55s;
          filter: blur(3px);
          opacity: 0.9;
        }
        .cloud-2::before {
          width: 130px; height: 130px;
          top: -70px; left: 50px;
        }
        .cloud-2::after {
          width: 90px; height: 90px;
          top: -50px; left: 160px;
        }
        .cloud-3 {
          width: 180px; height: 55px;
          animation-duration: 45s;
          filter: blur(1.5px);
          opacity: 0.85;
        }
        .cloud-3::before {
          width: 80px; height: 80px;
          top: -44px; left: 25px;
        }
        .cloud-3::after {
          width: 60px; height: 60px;
          top: -32px; left: 90px;
        }
        @keyframes floatBob {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes driftCloud {
          0%   { transform: translateX(0) rotate(-2deg); }
          25%  { transform: translateX(25vw) rotate(1deg); }
          50%  { transform: translateX(55vw) rotate(-1.5deg); }
          75%  { transform: translateX(85vw) rotate(1deg); }
          100% { transform: translateX(120vw) rotate(-2deg); }
        }
      `}</style>
    </div>
  );
}