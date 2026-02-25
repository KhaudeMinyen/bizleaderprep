import React, { useState, useEffect } from "react";

export default function Countdown({ onDone }) {
  const steps = ["3", "2", "1", "GO!"];
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (index >= steps.length) {
      onDone();
      return;
    }
    setVisible(true);
    const hideTimer = setTimeout(() => setVisible(false), 750);
    const nextTimer = setTimeout(() => setIndex(i => i + 1), 1000);
    return () => { clearTimeout(hideTimer); clearTimeout(nextTimer); };
  }, [index]);

  if (index >= steps.length) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
      <span
        key={index}
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "clamp(100px, 20vw, 200px)",
          fontWeight: 500,
          color: "#fff",
          textShadow: "0 6px 0 #a03a00, 0 10px 40px rgba(0,0,0,0.4)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(1.4)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          display: "block",
          userSelect: "none",
        }}
      >
        {steps[index]}
      </span>
    </div>
  );
}