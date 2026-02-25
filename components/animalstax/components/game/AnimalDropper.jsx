import React, { useState, useEffect, useRef, useCallback } from "react";

const SHEET = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/699dc2f8fe2bbd04d5643698/dbbfbc20c_AdobeExpress-file.png";
const ANIMAL_SIZE = 90;
const SHEET_COLS = 2;
const SHEET_ROWS = 2;
const ANIMALS = [
  { label: "dog", col: 0, row: 0 },
  { label: "cat", col: 1, row: 0 },
  { label: "pig", col: 0, row: 1 },
  { label: "bee", col: 1, row: 1 },
];
const GAME_DURATION = 30;
const SWINGER_Y = 60; // px from top where swinger travels

function randomAnimal() {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
}

function AnimalSprite({ animal, style }) {
  return (
    <div style={{
      width: ANIMAL_SIZE,
      height: ANIMAL_SIZE,
      borderRadius: "14px",
      backgroundImage: `url(${SHEET})`,
      backgroundSize: `${ANIMAL_SIZE * SHEET_COLS}px ${ANIMAL_SIZE * SHEET_ROWS}px`,
      backgroundPosition: `${-animal.col * ANIMAL_SIZE}px ${-animal.row * ANIMAL_SIZE}px`,
      backgroundRepeat: "no-repeat",
      imageRendering: "pixelated",
      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))",
      ...style,
    }} />
  );
}

export default function AnimalDropper({ onGameOver }) {
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [swinger, setSwinger] = useState({ animal: randomAnimal(), x: 0, dir: 1 });
  const [dropped, setDropped] = useState([]);
  const [score, setScore] = useState(0);

  const swingerRef = useRef(swinger);
  const gameAreaRef = useRef(null);
  const speedRef = useRef(3.5); // px per frame
  const animFrameRef = useRef(null);
  const gameOverFired = useRef(false);

  swingerRef.current = swinger;

  // Animate swinger
  useEffect(() => {
    let lastTime = null;
    function step(ts) {
      if (!gameAreaRef.current) { animFrameRef.current = requestAnimationFrame(step); return; }
      const width = gameAreaRef.current.offsetWidth;
      const maxX = width - ANIMAL_SIZE;
      if (!lastTime) lastTime = ts;
      const delta = ts - lastTime;
      lastTime = ts;
      const px = speedRef.current * (delta / 16.67);

      setSwinger(prev => {
        let newX = prev.x + prev.dir * px;
        let newDir = prev.dir;
        if (newX >= maxX) { newX = maxX; newDir = -1; }
        if (newX <= 0) { newX = 0; newDir = 1; }
        return { ...prev, x: newX, dir: newDir };
      });
      animFrameRef.current = requestAnimationFrame(step);
    }
    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Game timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          if (!gameOverFired.current) {
            gameOverFired.current = true;
            setTimeout(() => onGameOver(score), 300);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Drop action
  const drop = useCallback(() => {
    if (timeLeft <= 0) return;
    const current = swingerRef.current;
    setDropped(prev => [...prev, { ...current, id: Date.now() }]);
    setScore(s => s + 1);
    setSwinger({ animal: randomAnimal(), x: current.x, dir: current.dir });
    speedRef.current = Math.min(speedRef.current + 0.3, 12);
  }, [timeLeft]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => { if (e.code === "Space") { e.preventDefault(); drop(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drop]);

  const timerColor = timeLeft <= 10 ? "#ff4444" : "#fff";

  return (
    <div ref={gameAreaRef} className="absolute inset-0 z-20" onClick={drop} style={{ cursor: "pointer" }}>
      {/* HUD */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-8 z-30 pointer-events-none"
        style={{ fontFamily: "'Fredoka', sans-serif" }}>
        {/* Timer */}
        <div style={{
          fontSize: "2.4rem", fontWeight: 500, color: timerColor,
          textShadow: "0 3px 0 rgba(0,0,0,0.3)",
          transition: "color 0.3s",
          minWidth: "3ch", textAlign: "center",
        }}>
          {timeLeft}s
        </div>
        {/* Score */}
        <div style={{
          fontSize: "2.4rem", fontWeight: 500, color: "#fff",
          textShadow: "0 3px 0 rgba(0,0,0,0.3)",
        }}>
          🐾 {score}
        </div>
      </div>

      {/* Swinging animal */}
      <div style={{
        position: "absolute",
        top: SWINGER_Y,
        left: swinger.x,
        transition: "none",
      }}>
        <AnimalSprite animal={swinger.animal} />
      </div>

      {/* Dropped animals */}
      {dropped.map((d) => (
        <DroppingAnimal key={d.id} animal={d.animal} startX={d.x} />
      ))}

      {/* Hint */}
      {score === 0 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ fontFamily: "'Fredoka', sans-serif", color: "#fff", fontSize: "1.4rem",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)", opacity: 0.85 }}>
          Click or press Space to drop!
        </div>
      )}
    </div>
  );
}

function DroppingAnimal({ animal, startX }) {
  const [y, setY] = useState(SWINGER_Y);
  const frameRef = useRef(null);
  // Drop to ground (approx 86% of screen height)
  const groundY = typeof window !== "undefined" ? window.innerHeight * 0.86 - ANIMAL_SIZE : 500;

  useEffect(() => {
    let velocity = 2;
    function step() {
      setY(prev => {
        const next = prev + velocity;
        velocity += 0.8; // gravity
        if (next >= groundY) return groundY;
        return next;
      });
      frameRef.current = requestAnimationFrame(step);
    }
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [groundY]);

  // Stop animating once on ground
  useEffect(() => {
    if (y >= groundY) cancelAnimationFrame(frameRef.current);
  }, [y, groundY]);

  return (
    <div style={{ position: "absolute", top: y, left: startX }}>
      <AnimalSprite animal={animal} />
    </div>
  );
}