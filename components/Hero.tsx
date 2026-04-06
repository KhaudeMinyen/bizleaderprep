
import React, { useEffect, useState, useRef } from 'react';

interface HeroProps {
  onGetStarted: () => void;
  onLoginRequest: () => void;
  onSignupRequest: () => void;
  isLoggedIn: boolean;
  onSignOut: () => void;
}

type HeroView = 'home' | 'pricing';

const Hero: React.FC<HeroProps> = ({ onGetStarted, onLoginRequest, onSignupRequest, isLoggedIn, onSignOut }) => {
  const [heroView, setHeroView] = useState<HeroView>('home');
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const CELL = 40, RADIUS = 160, BASE_ALPHA = 0.18, MAX_ALPHA = 0.75;
    let W = 0, H = 0;
    const mouse = { x: -9999, y: -9999 };
    let rafId: number;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    resize();
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const cols = Math.ceil(W / CELL) + 1;
      const rows = Math.ceil(H / CELL) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * CELL, y = j * CELL;
          const dx = mouse.x - x, dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const alpha = dist < RADIUS ? BASE_ALPHA + (MAX_ALPHA - BASE_ALPHA) * (1 - dist / RADIUS) : BASE_ALPHA;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(200,200,200,${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(x, y); ctx.lineTo(x, y + CELL); ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y); ctx.lineTo(x + CELL, y); ctx.stroke();
          if (dist < RADIUS) {
            const dotAlpha = (1 - dist / RADIUS) * 0.9;
            const dotR = (1 - dist / RADIUS) * 3;
            ctx.beginPath();
            ctx.arc(x, y, dotR, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,200,200,${dotAlpha})`;
            ctx.fill();
          }
        }
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll('.blp-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => (entry.target as HTMLElement).classList.add('blp-visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [heroView]);

  // Close features dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (featuresRef.current && !featuresRef.current.contains(e.target as Node)) {
        setFeaturesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navH = 64;
    const top = el.getBoundingClientRect().top + window.scrollY - navH - 24;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        :root {
          --blp-bg: #070709; --blp-surface: #0f0f12; --blp-surface2: #161619;
          --blp-surface3: #1c1c20; --blp-border: #1e1e24; --blp-border2: #2a2a32;
          --blp-green: #00ff6a; --blp-purple: #a855f7;
          --blp-text: #f2f2f4; --blp-text2: #9999aa; --blp-muted: #55555f;
          --blp-amber: #f59e0b; --blp-blue: #3b82f6;
        }
        .blp-root { font-family: 'Instrument Sans', sans-serif; background: var(--blp-bg); color: var(--blp-text); font-size: 15px; line-height: 1.6; overflow-x: hidden; }
        .blp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          display: flex; align-items: center; padding: 0 48px; height: 64px;
          background: var(--blp-bg); backdrop-filter: blur(20px);
        }
        .blp-nav-logo img { height: 48px; width: auto; display: block; }
        .blp-nav-center { display: flex; align-items: center; gap: 4px; margin-left: 20px; }
        .blp-nav-right { display: flex; align-items: center; gap: 10px; }
        .blp-nav-btn {
          font-size: 13.5px; color: var(--blp-text2); padding: 7px 14px; border-radius: 8px;
          border: none; background: transparent; cursor: pointer;
          font-family: 'Instrument Sans', sans-serif; transition: all 0.15s;
          display: inline-flex; align-items: center; gap: 5px;
        }
        .blp-nav-btn:hover { color: var(--blp-text); background: rgba(255,255,255,0.04); }
        .blp-nav-btn.active { color: var(--blp-text); }
        .blp-features-dropdown {
          position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%);
          background: var(--blp-surface); border: 1px solid var(--blp-border2);
          border-radius: 14px; padding: 8px; min-width: 220px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5); z-index: 200;
          animation: blpFadeUp 0.15s ease both;
        }
        .blp-dd-item {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px;
          cursor: pointer; transition: background 0.12s; color: var(--blp-text2); font-size: 13.5px;
          font-family: 'Instrument Sans', sans-serif;
        }
        .blp-dd-item:hover { background: var(--blp-surface2); color: var(--blp-text); }
        .blp-dd-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; }
        .blp-btn-ghost {
          font-size: 13.5px; color: var(--blp-text2); padding: 7px 16px; border-radius: 8px;
          border: 1px solid var(--blp-border2); background: transparent; cursor: pointer;
          font-family: 'Instrument Sans', sans-serif; transition: all 0.15s; text-decoration: none;
          display: inline-flex; align-items: center;
        }
        .blp-btn-ghost:hover { color: var(--blp-text); background: var(--blp-surface2); }
        .blp-btn-green {
          font-size: 13.5px; font-weight: 600; color: #000; padding: 7px 18px; border-radius: 8px;
          background: var(--blp-green); border: none; cursor: pointer;
          font-family: 'Instrument Sans', sans-serif; transition: opacity 0.15s, transform 0.1s;
          display: inline-flex; align-items: center; gap: 6px;
        }
        .blp-btn-green:hover { opacity: 0.88; }
        .blp-btn-green:active { transform: scale(0.98); }
        .blp-hero {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 120px 48px 100px; text-align: center; position: relative; overflow: hidden; z-index: 2;
        }
        .blp-hero-content { position: relative; z-index: 1; max-width: 720px; display: flex; flex-direction: column; align-items: center; }
        .blp-hero-logo { margin-bottom: 28px; animation: blpFadeUp 0.5s ease both; }
        .blp-hero-logo img { height: 187px; width: auto; filter: drop-shadow(0 0 28px rgba(0,180,60,0.2)); }
        .blp-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--blp-surface2); border: 1px solid var(--blp-border2);
          border-radius: 20px; padding: 6px 16px 6px 10px;
          font-size: 12.5px; color: var(--blp-text2); margin-bottom: 28px;
          animation: blpFadeUp 0.5s ease 0.05s both;
        }
        .blp-badge-dot { width: 7px; height: 7px; background: var(--blp-green); border-radius: 50%; box-shadow: 0 0 8px var(--blp-green); animation: blpPulse 2s infinite; }
        @keyframes blpPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.75); } }
        .blp-hero-title {
          font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800;
          font-size: clamp(38px, 5.5vw, 68px); line-height: 1.05; letter-spacing: -2px;
          margin-bottom: 22px; animation: blpFadeUp 0.5s ease 0.1s both;
        }
        .blp-accent { color: var(--blp-green); }
        .blp-hero-sub {
          font-size: 17px; color: var(--blp-text2); max-width: 500px; margin: 0 auto 14px;
          line-height: 1.65; animation: blpFadeUp 0.5s ease 0.15s both;
        }
        .blp-hero-free {
          display: inline-flex; align-items: center; gap: 7px; font-size: 13px;
          color: var(--blp-green); font-weight: 600; margin-bottom: 32px;
          animation: blpFadeUp 0.5s ease 0.18s both;
        }
        .blp-hero-primary-cta { animation: blpFadeUp 0.5s ease 0.2s both; margin-bottom: 14px; }
        .blp-btn-lg {
          font-size: 15px; font-weight: 600; color: #000; padding: 13px 32px; border-radius: 10px;
          background: var(--blp-green); border: none; cursor: pointer;
          font-family: 'Instrument Sans', sans-serif; transition: opacity 0.15s, transform 0.1s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .blp-btn-lg:hover { opacity: 0.88; }
        .blp-btn-lg:active { transform: scale(0.98); }
        .blp-hero-secondary-ctas {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-bottom: 44px; animation: blpFadeUp 0.5s ease 0.25s both;
        }
        .blp-btn-outline {
          font-size: 14px; font-weight: 500; color: var(--blp-green); padding: 10px 22px;
          border-radius: 10px; border: 1px solid rgba(0,255,106,0.3);
          background: rgba(0,255,106,0.04); cursor: pointer;
          font-family: 'Instrument Sans', sans-serif; transition: all 0.15s;
          display: inline-flex; align-items: center; gap: 7px;
        }
        .blp-btn-outline:hover { background: rgba(0,255,106,0.09); border-color: rgba(0,255,106,0.55); }
        .blp-org-chip {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--blp-surface2); border: 1px solid rgba(0,255,106,0.2);
          border-radius: 12px; padding: 12px 22px; animation: blpFadeUp 0.5s ease 0.35s both;
        }
        .blp-org-chip-icon { font-size: 22px; }
        .blp-org-chip-name { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 15px; color: var(--blp-green); }
        .blp-org-chip-sub { font-size: 12px; color: var(--blp-muted); margin-top: 1px; }
        .blp-stats-bar {
          background: var(--blp-bg); border-top: 1px solid var(--blp-border); border-bottom: 1px solid var(--blp-border);
          padding: 36px 48px; display: grid; grid-template-columns: repeat(4, 1fr);
          position: relative; z-index: 200;
        }
        .blp-stat-item { text-align: center; padding: 0 24px; border-right: 1px solid var(--blp-border); }
        .blp-stat-item:last-child { border-right: none; }
        .blp-stat-num { font-family: 'Bricolage Grotesque', sans-serif; font-size: 38px; font-weight: 800; letter-spacing: -1.5px; color: var(--blp-green); line-height: 1; margin-bottom: 6px; }
        .blp-stat-desc { font-size: 13px; color: var(--blp-text2); }
        .blp-why-section { padding: 96px 48px; max-width: 1160px; margin: 0 auto; position: relative; z-index: 2; }
        .blp-why-header { text-align: center; margin-bottom: 52px; }
        .blp-section-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--blp-green); margin-bottom: 14px; }
        .blp-section-heading { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(28px, 3.5vw, 44px); letter-spacing: -1.5px; line-height: 1.1; }
        .blp-bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: auto auto auto; gap: 14px; }
        .blp-bento-card {
          background: var(--blp-surface); border: 1px solid var(--blp-border); border-radius: 18px; padding: 28px;
          position: relative; overflow: hidden; transition: border-color 0.2s, transform 0.2s; cursor: default;
        }
        .blp-bento-card:hover { border-color: var(--blp-border2); transform: translateY(-2px); }
        .blp-bento-card.big { grid-column: span 2; }
        .blp-bento-card.tall { grid-row: span 2; }
        .blp-bento-card.green-accent { border-color: rgba(0,255,106,0.2); background: linear-gradient(135deg, rgba(0,255,106,0.04) 0%, var(--blp-surface) 60%); }
        .blp-bento-card.green-accent:hover { border-color: rgba(0,255,106,0.4); }
        .blp-bento-card.purple-accent { border-color: rgba(168,85,247,0.2); background: linear-gradient(135deg, rgba(168,85,247,0.04) 0%, var(--blp-surface) 60%); }
        .blp-bento-card.purple-accent:hover { border-color: rgba(168,85,247,0.4); }
        .blp-bento-card.amber-accent { border-color: rgba(245,158,11,0.2); background: linear-gradient(135deg, rgba(245,158,11,0.04) 0%, var(--blp-surface) 60%); }
        .blp-bento-card.amber-accent:hover { border-color: rgba(245,158,11,0.4); }
        .blp-bento-card.blue-accent { border-color: rgba(59,130,246,0.2); background: linear-gradient(135deg, rgba(59,130,246,0.04) 0%, var(--blp-surface) 60%); }
        .blp-bento-card.blue-accent:hover { border-color: rgba(59,130,246,0.4); }
        .blp-bento-tag { display: inline-block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; padding: 3px 9px; border-radius: 20px; margin-bottom: 14px; }
        .blp-tag-green { background: rgba(0,255,106,0.1); color: var(--blp-green); }
        .blp-tag-purple { background: rgba(168,85,247,0.1); color: var(--blp-purple); }
        .blp-tag-amber { background: rgba(245,158,11,0.1); color: var(--blp-amber); }
        .blp-tag-blue { background: rgba(59,130,246,0.1); color: var(--blp-blue); }
        .blp-bento-title { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 18px; margin-bottom: 10px; line-height: 1.2; }
        .blp-bento-desc { font-size: 13.5px; color: var(--blp-text2); line-height: 1.65; }
        .blp-lb-mini { display: flex; flex-direction: column; gap: 8px; margin-top: 18px; }
        .blp-lb-mini-row { display: flex; align-items: center; gap: 9px; background: var(--blp-surface2); border: 1px solid var(--blp-border); border-radius: 9px; padding: 8px 12px; }
        .blp-lb-mini-rank { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 12px; width: 18px; text-align: center; flex-shrink: 0; }
        .blp-lb-mini-av { width: 24px; height: 24px; border-radius: 50%; font-size: 9px; font-weight: 700; color: #000; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .blp-lb-mini-name { flex: 1; font-size: 12px; font-weight: 500; }
        .blp-lb-mini-score { font-family: 'Bricolage Grotesque', sans-serif; font-size: 12px; font-weight: 700; color: var(--blp-green); }
        .blp-timer-display { margin-top: 20px; background: var(--blp-surface2); border: 1px solid var(--blp-border); border-radius: 14px; padding: 20px; text-align: center; }
        .blp-timer-digits { font-family: 'Bricolage Grotesque', sans-serif; font-size: 44px; font-weight: 800; letter-spacing: -2px; color: var(--blp-amber); line-height: 1; margin-bottom: 6px; }
        .blp-timer-label { font-size: 11.5px; color: var(--blp-muted); }
        .blp-timer-bar-wrap { margin-top: 14px; height: 4px; background: var(--blp-surface3); border-radius: 2px; overflow: hidden; }
        .blp-timer-bar-fill { height: 100%; width: 65%; background: var(--blp-amber); border-radius: 2px; animation: blpTimerTick 8s linear infinite; }
        @keyframes blpTimerTick { from { width: 65%; } to { width: 5%; } }
        .blp-ai-mini { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
        .blp-ai-mini-msg { display: flex; gap: 8px; align-items: flex-start; }
        .blp-ai-mini-orb { width: 26px; height: 26px; border-radius: 50%; background: #0d0d0d; border: 1px solid rgba(168,85,247,0.35); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .blp-ai-mini-eyes { display: flex; gap: 3px; }
        .blp-ai-mini-eye { width: 5px; height: 6px; background: var(--blp-purple); border-radius: 50%; box-shadow: 0 0 5px var(--blp-purple); animation: blpBlink 3.5s infinite; }
        .blp-ai-mini-eye:last-child { animation-delay: 0.1s; }
        @keyframes blpBlink { 0%, 88%, 100% { transform: scaleY(1); } 93% { transform: scaleY(0.08); } }
        .blp-ai-mini-bubble { background: var(--blp-surface2); border: 1px solid var(--blp-border); border-radius: 8px 8px 8px 2px; padding: 8px 12px; font-size: 12px; color: var(--blp-text2); line-height: 1.45; }
        .blp-ai-mini-bubble b { color: var(--blp-purple); }
        .blp-apex-section { padding: 0 48px 96px; max-width: 1160px; margin: 0 auto; position: relative; z-index: 2; }
        .blp-apex-showcase { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .blp-section-sub { font-size: 15.5px; color: var(--blp-text2); line-height: 1.7; }
        .blp-apex-check-list { display: flex; flex-direction: column; gap: 11px; margin-top: 26px; }
        .blp-apex-check { display: flex; align-items: center; gap: 11px; font-size: 13.5px; color: var(--blp-text2); }
        .blp-check-icon { width: 20px; height: 20px; background: rgba(168,85,247,0.15); border-radius: 5px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .blp-apex-right { background: var(--blp-surface); border: 1px solid var(--blp-border); border-radius: 20px; padding: 28px; position: relative; overflow: hidden; }
        .blp-apex-right::before { content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%); pointer-events: none; }
        .blp-chat-messages { display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px; }
        .blp-chat-msg { display: flex; gap: 10px; align-items: flex-start; }
        .blp-chat-msg.user { flex-direction: row-reverse; }
        .blp-chat-orb { width: 32px; height: 32px; border-radius: 50%; background: #0d0d0d; border: 1px solid rgba(168,85,247,0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .blp-chat-eyes { display: flex; gap: 4px; }
        .blp-chat-eye { width: 6px; height: 8px; background: var(--blp-purple); border-radius: 50%; box-shadow: 0 0 6px var(--blp-purple); animation: blpBlink 3.5s infinite; }
        .blp-chat-eye:last-child { animation-delay: 0.1s; }
        .blp-user-orb { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--blp-green), #00aaff); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #000; flex-shrink: 0; }
        .blp-bubble { max-width: 78%; padding: 10px 14px; font-size: 13px; line-height: 1.5; border-radius: 12px; }
        .blp-bubble.apex { background: var(--blp-surface2); border: 1px solid var(--blp-border); border-radius: 12px 12px 12px 3px; color: var(--blp-text2); }
        .blp-bubble.apex b { color: var(--blp-purple); }
        .blp-bubble.user { background: rgba(0,255,106,0.08); border: 1px solid rgba(0,255,106,0.15); border-radius: 12px 12px 3px 12px; color: var(--blp-text); }
        .blp-chat-input-mock { display: flex; gap: 8px; background: var(--blp-surface2); border: 1px solid var(--blp-border); border-radius: 10px; padding: 10px 14px; align-items: center; }
        .blp-chat-placeholder { flex: 1; font-size: 13px; color: var(--blp-muted); }
        .blp-chat-send { width: 30px; height: 30px; background: var(--blp-purple); border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .blp-cta-section { padding: 100px 48px; text-align: center; position: relative; overflow: hidden; border-top: 1px solid var(--blp-border); z-index: 200; background: var(--blp-bg); }
        .blp-cta-glow { position: absolute; width: 500px; height: 300px; background: radial-gradient(ellipse, rgba(0,255,106,0.07) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; }
        .blp-cta-content { position: relative; z-index: 1; }
        .blp-cta-title { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(32px, 5vw, 54px); letter-spacing: -2px; line-height: 1.05; margin-bottom: 18px; }
        .blp-cta-title span { color: var(--blp-green); }
        .blp-cta-sub { font-size: 16px; color: var(--blp-text2); margin-bottom: 40px; }
        .blp-cta-free-badge { display: inline-flex; align-items: center; gap: 7px; background: rgba(0,255,106,0.06); border: 1px solid rgba(0,255,106,0.2); border-radius: 20px; padding: 6px 16px; font-size: 13px; color: var(--blp-green); font-weight: 600; margin-bottom: 32px; }
        .blp-cta-btns { display: flex; align-items: center; justify-content: center; gap: 12px; }
        footer.blp-footer { border-top: 1px solid var(--blp-border); padding: 28px 48px; display: flex; align-items: center; justify-content: space-between; background: var(--blp-bg); position: relative; z-index: 200; }
        .blp-footer-logo img { height: 34px; width: auto; display: block; }
        .blp-footer-copy { font-size: 12.5px; color: var(--blp-muted); }
        .blp-footer-links { display: flex; gap: 20px; }
        .blp-footer-link { font-size: 12.5px; color: var(--blp-muted); text-decoration: none; transition: color 0.15s; }
        .blp-footer-link:hover { color: var(--blp-text2); }
        @keyframes blpFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blpSlideIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .blp-page-enter { animation: blpSlideIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }
        .blp-features-dropdown-wide {
          position: fixed; top: 64px; right: 0; width: 34vw; min-width: 380px;
          background: var(--blp-surface); border-left: 1px solid var(--blp-border2);
          border-bottom: 1px solid var(--blp-border2);
          padding: 12px; z-index: 300;
          box-shadow: -12px 12px 48px rgba(0,0,0,0.7);
          animation: blpFadeUp 0.15s ease both;
        }
        .blp-dd-item-wide {
          display: flex; align-items: flex-start; padding: 13px 14px; border-radius: 10px;
          cursor: pointer; transition: background 0.12s;
          font-family: 'Instrument Sans', sans-serif;
        }
        .blp-dd-item-wide:hover { background: var(--blp-surface2); }
        .blp-dd-item-wide:hover .blp-dd-label { color: var(--blp-text); }
        .blp-dd-label { font-weight: 600; font-size: 13.5px; color: var(--blp-text); margin-bottom: 5px; }
        .blp-dd-desc { font-size: 12px; color: var(--blp-text2); line-height: 1.6; }
        .blp-reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.5s ease, transform 0.5s ease; animation: blpRevealDefault 0.6s ease 0.3s forwards; }
        .blp-reveal.blp-visible { opacity: 1; transform: translateY(0); animation: none; }
        @keyframes blpRevealDefault { to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .blp-nav { padding: 0 20px; }
          .blp-hero { padding: 100px 24px 80px; }
          .blp-stats-bar { grid-template-columns: repeat(2,1fr); padding: 24px; }
          .blp-bento-grid { grid-template-columns: 1fr; }
          .blp-bento-card.big, .blp-bento-card.tall { grid-column: span 1; grid-row: span 1; }
          .blp-apex-showcase { grid-template-columns: 1fr; gap: 32px; }
          .blp-why-section, .blp-apex-section { padding: 48px 24px; }
          .blp-cta-section { padding: 64px 24px; }
          footer.blp-footer { flex-direction: column; gap: 16px; text-align: center; padding: 28px 24px; }
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      <div className="blp-root">
        <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }} />
        {/* NAV */}
        <nav className="blp-nav">
          <div className="blp-nav-logo" style={{ cursor: 'pointer' }} onClick={() => setHeroView('home')}>
            <img src="/TransparentLogo.png" alt="BizLeaderPrep" />
          </div>

          <div style={{ flex: 1 }} />

          <div className="blp-nav-right">
            {/* Features dropdown — hover triggered */}
            <div ref={featuresRef} style={{ position: 'relative' }}
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <button className={`blp-nav-btn${featuresOpen ? ' active' : ''}`}>
                Features
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                  style={{ transform: featuresOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {featuresOpen && (
                <div className="blp-features-dropdown-wide">
                  {[
                    { label: 'Apex AI Tutor', desc: 'Claude-powered explanations break down every right and wrong answer — so you actually understand the concept, not just memorize it.', onClick: () => { setHeroView('home'); setTimeout(() => scrollTo('apex'), 50); } },
                    { label: 'Practice Questions', desc: '850+ questions spanning all 17 FBLA Middle School events, organized by difficulty. Beginner to advanced — you choose how hard to push.', onClick: () => { setHeroView('home'); setTimeout(() => scrollTo('why'), 50); } },
                    { label: 'Chapter Leaderboard', desc: 'Compete against your classmates and chapter members on a live weekly leaderboard. See exactly who\'s putting in the reps before competition day.', onClick: () => { setHeroView('home'); setTimeout(() => scrollTo('why'), 50); } },
                    { label: 'Timed Mock Exams', desc: 'Simulate real FBLA test conditions with timed sessions. Train under pressure so competition day feels familiar, not stressful.', onClick: () => { setHeroView('home'); setTimeout(() => scrollTo('why'), 50); } },
                    { label: 'Progress Tracking', desc: 'Per-event accuracy scores show exactly where you\'re strong and where you need more reps. Study smarter, not just longer.', onClick: () => { setHeroView('home'); setTimeout(() => scrollTo('why'), 50); } },
                  ].map(item => (
                    <div key={item.label} className="blp-dd-item-wide" onClick={item.onClick}>
                      <div>
                        <div className="blp-dd-label">{item.label}</div>
                        <div className="blp-dd-desc">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="blp-nav-btn" onClick={() => setHeroView('pricing')}>Pricing</button>
            <div style={{ width: 1, height: 18, background: 'var(--blp-border2)', margin: '0 4px' }} />
            {!isLoggedIn ? (
              <>
                <button className="blp-btn-ghost" onClick={onLoginRequest}>Log In</button>
                <button className="blp-btn-green" onClick={onSignupRequest}>
                  Start Free
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </>
            ) : (
              <button className="blp-btn-ghost" onClick={onSignOut}>Sign out</button>
            )}
          </div>
        </nav>

        {heroView === 'pricing' ? (
          /* ── PRICING PAGE ─────────────────────────────────────────────── */
          <div className="blp-page-enter" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 48px 80px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <div style={{ maxWidth: 640 }}>
              {/* Big green badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,255,106,0.08)', border: '1px solid rgba(0,255,106,0.2)', borderRadius: 20, padding: '6px 18px', fontSize: 12.5, color: 'var(--blp-green)', fontWeight: 600, marginBottom: 32 }}>
                <div style={{ width: 7, height: 7, background: 'var(--blp-green)', borderRadius: '50%', boxShadow: '0 0 8px var(--blp-green)' }}></div>
                Always Free — No catches
              </div>
              <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: 'clamp(52px, 8vw, 100px)', lineHeight: 1, letterSpacing: '-3px', color: 'var(--blp-green)', marginBottom: 24 }}>100% Free.</h1>
              <p style={{ fontSize: 18, color: 'var(--blp-text2)', lineHeight: 1.7, marginBottom: 40 }}>
                Every question. Every event. Apex AI. Leaderboard. Timed exams. Progress tracking.<br />
                All of it — completely free, forever. No credit card. No paywall. No tier.
              </p>
              {/* Feature checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48, textAlign: 'left', maxWidth: 400, margin: '0 auto 48px' }}>
                {[
                  'All 850+ practice questions unlocked',
                  'All 17 FBLA MS events covered',
                  'Apex AI explanations on every answer',
                  'Weekly leaderboard with your chapter',
                  'Timed mock exams with real conditions',
                  'Per-event accuracy & progress tracking',
                  'No credit card, ever',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--blp-text2)' }}>
                    <svg width="16" height="16" fill="none" stroke="var(--blp-green)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                <button className="blp-btn-lg" onClick={onGetStarted}>
                  Start Studying Free
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
                <button className="blp-btn-outline" onClick={() => setHeroView('home')}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Back
                </button>
              </div>
            </div>
          </div>
        ) : (<>

        {/* HERO */}
        <section className="blp-hero">
          <div className="blp-hero-content">
            <div className="blp-hero-logo">
              <img src="/TransparentLogo.png" alt="BizLeaderPrep Logo" />
            </div>
            <div className="blp-hero-badge">
              <div className="blp-badge-dot"></div>
              Now with Apex AI — your competitive study companion
            </div>
            <h1 className="blp-hero-title">
              Study Smarter.<br /><span className="blp-accent">Place Higher.</span>
            </h1>
            <p className="blp-hero-title" style={{ color: '#00ff6a', marginTop: -16, marginBottom: 22 }}>For Middle School.</p>
            <p className="blp-hero-sub">
              The practice platform built for FBLA Middle School students. 850+ questions across all 17 events — with AI explanations and a coach that actually pushes you.
            </p>
            <div className="blp-hero-free">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              100% free. No credit card. No catch.
            </div>
            <div className="blp-hero-primary-cta">
              <button className="blp-btn-lg" onClick={onGetStarted}>
                Start Studying Free
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
            <div className="blp-hero-secondary-ctas">
              <button className="blp-btn-outline" onClick={() => scrollTo('apex')}>
                Meet Apex
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <button className="blp-btn-outline" onClick={() => scrollTo('why')}>
                Why BizLeaderPrep?
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="blp-stats-bar">
          <div className="blp-stat-item blp-reveal"><div className="blp-stat-num">850+</div><div className="blp-stat-desc">Practice questions</div></div>
          <div className="blp-stat-item blp-reveal"><div className="blp-stat-num">17</div><div className="blp-stat-desc">MS events covered</div></div>
          <div className="blp-stat-item blp-reveal"><div className="blp-stat-num">3</div><div className="blp-stat-desc">Difficulty levels each</div></div>
          <div className="blp-stat-item blp-reveal"><div className="blp-stat-num">$0</div><div className="blp-stat-desc">Forever free</div></div>
        </div>

        {/* WHY SECTION */}
        <section className="blp-why-section" id="why">
          <div className="blp-why-header">
            <div className="blp-section-label">Why BizLeaderPrep</div>
            <h2 className="blp-section-heading">Everything you need.<br />Nothing you don't.</h2>
          </div>
          <div className="blp-bento-grid">
            <div className="blp-bento-card big purple-accent blp-reveal">
              <span className="blp-bento-tag blp-tag-purple">AI Powered</span>
              <div className="blp-bento-title">Apex explains every answer — right or wrong.</div>
              <div className="blp-bento-desc">Powered by Claude AI, Apex breaks down exactly why you got something wrong and what concept to remember. Not just "incorrect" — actual understanding.</div>
              <div className="blp-ai-mini">
                <div className="blp-ai-mini-msg">
                  <div className="blp-ai-mini-orb"><div className="blp-ai-mini-eyes"><div className="blp-ai-mini-eye"></div><div className="blp-ai-mini-eye"></div></div></div>
                  <div className="blp-ai-mini-bubble"><b>Locked.</b> Digital citizenship = responsible online behavior. The key: it's about how you act, not just what you know.</div>
                </div>
              </div>
            </div>
            <div className="blp-bento-card tall green-accent blp-reveal">
              <span className="blp-bento-tag blp-tag-green">Leaderboard</span>
              <div className="blp-bento-title">Compete with your chapter.</div>
              <div className="blp-bento-desc">See who's putting in the reps. Weekly rankings keep you motivated and accountable — just like competition day.</div>
              <div className="blp-lb-mini">
                <div className="blp-lb-mini-row"><div className="blp-lb-mini-rank" style={{color:'#ffd700'}}>1</div><div className="blp-lb-mini-av" style={{background:'linear-gradient(135deg,#ffd700,#ff8c00)'}}>JS</div><div className="blp-lb-mini-name">Jordan S.</div><div className="blp-lb-mini-score">2,410</div></div>
                <div className="blp-lb-mini-row" style={{background:'rgba(0,255,106,0.05)',borderColor:'rgba(0,255,106,0.2)'}}><div className="blp-lb-mini-rank" style={{color:'#c0c0c0'}}>2</div><div className="blp-lb-mini-av" style={{background:'linear-gradient(135deg,#00ff6a,#00aaff)'}}>MK</div><div className="blp-lb-mini-name">you</div><div className="blp-lb-mini-score">1,284</div></div>
                <div className="blp-lb-mini-row"><div className="blp-lb-mini-rank" style={{color:'#cd7f32'}}>3</div><div className="blp-lb-mini-av" style={{background:'linear-gradient(135deg,#a855f7,#ec4899)'}}>AL</div><div className="blp-lb-mini-name">Alex L.</div><div className="blp-lb-mini-score">1,102</div></div>
                <div className="blp-lb-mini-row"><div className="blp-lb-mini-rank">4</div><div className="blp-lb-mini-av" style={{background:'linear-gradient(135deg,#3b82f6,#06b6d4)'}}>PR</div><div className="blp-lb-mini-name">Priya R.</div><div className="blp-lb-mini-score">980</div></div>
              </div>
            </div>
            <div className="blp-bento-card amber-accent blp-reveal">
              <span className="blp-bento-tag blp-tag-amber">Timed Exams</span>
              <div className="blp-bento-title">Practice under pressure.</div>
              <div className="blp-bento-desc">Simulate real competition conditions with timed exams. Build speed and confidence before district and state.</div>
              <div className="blp-timer-display">
                <div className="blp-timer-digits">12:34</div>
                <div className="blp-timer-label">Digital Citizenship · 25 questions</div>
                <div className="blp-timer-bar-wrap"><div className="blp-timer-bar-fill"></div></div>
              </div>
            </div>
            <div className="blp-bento-card green-accent blp-reveal">
              <span className="blp-bento-tag blp-tag-green">100% Free</span>
              <div className="blp-bento-title">No paywalls. No limits.</div>
              <div className="blp-bento-desc">Every question. Every event. Every Apex explanation. Completely free — because competition prep shouldn't cost money.</div>
              <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:9}}>
                {['All 850+ questions unlocked','Apex AI included','Leaderboard access','No credit card ever'].map(item => (
                  <div key={item} style={{display:'flex',alignItems:'center',gap:9,fontSize:13,color:'var(--blp-text2)'}}>
                    <svg width="14" height="14" fill="none" stroke="var(--blp-green)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="blp-bento-card blue-accent blp-reveal" style={{gridColumn:'span 3'}}>
              <span className="blp-bento-tag blp-tag-blue">Progress</span>
              <div className="blp-bento-title">Track every event, every difficulty.</div>
              <div className="blp-bento-desc">Know exactly where you stand across all 17 MS events. Per-event accuracy shows what to focus on next.</div>
              <div style={{marginTop:18,display:'flex',flexDirection:'column',gap:8}}>
                {[
                  {name:'Career Exploration',pct:82,color:'var(--blp-blue)'},
                  {name:'Digital Citizenship',pct:60,color:'var(--blp-blue)'},
                  {name:'Exploring FBLA',pct:45,color:'var(--blp-amber)'},
                  {name:'Personal Finance',pct:22,color:'#ef4444'},
                ].map(({name,pct,color}) => (
                  <div key={name} style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontSize:12,color:'var(--blp-text2)',width:130,flexShrink:0}}>{name}</span>
                    <div style={{flex:1,height:4,background:'var(--blp-surface3)',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:2}}></div></div>
                    <span style={{fontSize:11,color,fontWeight:600,width:30,textAlign:'right'}}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* APEX SECTION */}
        <section className="blp-apex-section" id="apex">
          <div className="blp-apex-showcase">
            <div className="blp-apex-left blp-reveal">
              <div className="blp-section-label">Apex AI</div>
              <h2 className="blp-section-heading">A study companion<br />that actually<br /><span style={{color:'var(--blp-purple)'}}>gets it.</span></h2>
              <p className="blp-section-sub">Apex isn't a generic chatbot. It's a competitive coach powered by AI — built to explain wrong answers clearly, keep you motivated, and push you toward your best performance.</p>
              <div className="blp-apex-check-list">
                {['Explains why every wrong answer is wrong','Keeps you motivated with personalized encouragement','Answers any FBLA concept question on demand','Always free — no limits on Apex questions'].map(item => (
                  <div key={item} className="blp-apex-check">
                    <div className="blp-check-icon"><svg width="11" height="11" fill="none" stroke="var(--blp-purple)" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="blp-apex-right blp-reveal">
              <div className="blp-chat-messages">
                <div className="blp-chat-msg">
                  <div className="blp-chat-orb"><div className="blp-chat-eyes"><div className="blp-chat-eye"></div><div className="blp-chat-eye"></div></div></div>
                  <div className="blp-bubble apex"><b>Lock in.</b> You're on a 5-question streak in Digital Citizenship. That's the consistency that wins districts. Keep going. 🔥</div>
                </div>
                <div className="blp-chat-msg user">
                  <div className="blp-user-orb">MS</div>
                  <div className="blp-bubble user">Why was my answer on cyberbullying wrong?</div>
                </div>
                <div className="blp-chat-msg">
                  <div className="blp-chat-orb"><div className="blp-chat-eyes"><div className="blp-chat-eye"></div><div className="blp-chat-eye"></div></div></div>
                  <div className="blp-bubble apex"><b>Good question.</b> Cyberbullying requires repeated harmful behavior — a single rude comment doesn't qualify. The key concept: it's the pattern and intent that define it.</div>
                </div>
              </div>
              <div className="blp-chat-input-mock">
                <div className="blp-chat-placeholder">Ask Apex anything about FBLA...</div>
                <div className="blp-chat-send"><svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="blp-cta-section">
          <div className="blp-cta-glow"></div>
          <div className="blp-cta-content blp-reveal">
            <div className="blp-cta-free-badge">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              100% Free — No credit card required
            </div>
            <h2 className="blp-cta-title">Ready to <span>lock in</span>?</h2>
            <p className="blp-cta-sub">850+ questions. Apex AI. Leaderboard. Timed exams. All free — built for FBLA Middle School students.</p>
            <div className="blp-cta-btns">
              <button className="blp-btn-lg" onClick={onGetStarted}>
                Start Studying Free
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>

          </div>
        </section>

        {/* FOOTER */}
        <footer className="blp-footer">
          <div className="blp-footer-logo"><img src="/TransparentLogo.png" alt="BizLeaderPrep" /></div>
          <div className="blp-footer-copy">© 2026 BizLeaderPrep. Built for FBLA Middle School competitors.</div>
          <div className="blp-footer-links">
            <a href="/privacy-policy.html" className="blp-footer-link">Privacy</a>
            <a href="#" className="blp-footer-link">Terms</a>
          </div>
        </footer>
        </>)}
      </div>
    </>
  );
};

export default Hero;
