import React, { useState } from "react";
import GameBackground from "../components/game/GameBackground";
import Countdown from "../components/game/Countdown";
import AnimalDropper from "../components/game/AnimalDropper";

const fredokaLink = document.createElement('link');
fredokaLink.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500&display=swap';
fredokaLink.rel = 'stylesheet';
document.head.appendChild(fredokaLink);

export default function Game({ onBack, difficulty: difficultyProp }) {
  const urlParams = new URLSearchParams(window.location.search);
  const difficulty = difficultyProp || urlParams.get("difficulty") || "easy";

  const handleBack = () => onBack ? onBack() : window.history.back();

  // phase: "countdown" | "playing" | "gameover"
  const [phase, setPhase] = useState("countdown");
  const [finalScore, setFinalScore] = useState(0);

  return (
    <div
      className="relative w-full h-screen overflow-hidden select-none"
      style={{ animation: "fadeIn 1.2s ease-out both" }}
    >
      <GameBackground />

      {/* Difficulty label */}
      <div className="absolute top-5 right-6 z-30"
        style={{ fontFamily: "'Fredoka', sans-serif" }}>
        <span className="text-white text-xl opacity-60 font-medium tracking-widest uppercase">
          {difficulty}
        </span>
      </div>

      {/* Back button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-5 z-30 px-5 py-2 rounded-full text-white text-lg shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #a0a0a0 0%, #707070 100%)",
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 400,
          boxShadow: "0 4px 0 #404040",
        }}>
        ← Back
      </button>

      {/* Countdown */}
      {phase === "countdown" && (
        <Countdown onDone={() => setPhase("playing")} />
      )}

      {/* Game */}
      {phase === "playing" && (
        <AnimalDropper onGameOver={(score) => { setFinalScore(score); setPhase("gameover"); }} />
      )}

      {/* Game Over */}
      {phase === "gameover" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-5 text-center"
            style={{
              background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
              fontFamily: "'Fredoka', sans-serif",
              minWidth: "300px",
            }}>
            <h2 style={{ fontSize: "2.8rem", fontWeight: 500, color: "#2d6a00" }}>Time's Up!</h2>
            <p style={{ fontSize: "1.6rem", color: "#3a7a00", fontWeight: 400 }}>
              You stacked <strong>{finalScore}</strong> animal{finalScore !== 1 ? "s" : ""}!
            </p>
            <button
              onClick={() => { setFinalScore(0); setPhase("countdown"); }}
              className="px-10 py-3 rounded-full text-white text-xl shadow-lg transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
                boxShadow: "0 5px 0 #2d6a00",
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 400,
              }}>
              Play Again
            </button>
            <button
              onClick={handleBack}
              className="px-8 py-2 rounded-full text-white text-lg shadow-lg transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #a0a0a0 0%, #707070 100%)",
                boxShadow: "0 4px 0 #404040",
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 400,
              }}>
              Select Study Path
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
