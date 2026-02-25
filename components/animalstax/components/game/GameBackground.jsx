import React from "react";

export default function GameBackground() {
  return (
    <>
      {/* Sky */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #1a6bb5 0%, #3a9ad9 40%, #6ec6f5 70%, #a8dff5 100%)"
      }} />

      {/* Swirly sky texture */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <filter id="turbulence2">
          <feTurbulence type="turbulence" baseFrequency="0.012 0.008" numOctaves="4" seed="5" result="turb" />
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="60" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <rect width="100%" height="100%" fill="white" filter="url(#turbulence2)" />
      </svg>

      {/* Distant hills */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 500" preserveAspectRatio="none" style={{ height: "70%" }}>
        <path d="M-100,500 C100,200 300,350 500,260 C700,170 800,320 1000,220 C1150,140 1300,280 1540,200 L1540,500 Z"
          fill="#2d8a3e" opacity="0.5" />
        <path d="M-100,500 C50,280 200,400 420,310 C640,220 780,380 1000,290 C1180,210 1340,340 1540,270 L1540,500 Z"
          fill="#3aaa50" opacity="0.75" />
        <path d="M-200,500 C100,500 300,80 720,60 C1140,40 1340,500 1640,500 Z"
          fill="#4dc463" />
      </svg>

      {/* Ground */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ height: "14%" }}>
        <rect x="0" y="30" width="1440" height="70" fill="#3aaa50" />
        <path d="M0,30 Q20,0 40,30 Q60,0 80,30 Q100,5 120,30 Q150,2 180,30 Q210,5 240,30 Q280,0 320,30 Q360,4 400,30 Q430,2 460,30 Q490,4 520,30 Q560,0 600,30 Q640,4 680,30 Q710,2 740,30 Q770,4 800,30 Q840,0 880,30 Q920,3 960,30 Q1000,0 1040,30 Q1080,4 1120,30 Q1160,2 1200,30 Q1240,4 1280,30 Q1320,0 1360,30 Q1400,4 1440,30 Z"
          fill="#5ddb73" />
      </svg>
    </>
  );
}