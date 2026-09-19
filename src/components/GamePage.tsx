import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WebsiteConfig, PlexusConfig } from '../types';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  Flame,
  Pause,
  Play,
  Maximize2,
  Heart,
} from 'lucide-react';

interface GamePageProps {
  siteConfig: WebsiteConfig;
  plexusConfig: PlexusConfig;
  onNavigate: (page: 'home' | 'game') => void;
  onOpenControls: () => void;
}

// Procedural sound synthesizer using Web Audio API (zero external assets required)
class GameAudio {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  constructor() {
    // Lazy initialize to adhere to browser autoplay policies
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  playCollect(combo: number = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = 440 + Math.min(combo * 60, 600);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio context might fail on restricted environments silently
    }
  }

  playBlast() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  playHit() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(60, now + 0.2);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }
}

const audio = new GameAudio();

interface StarNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  points: number;
  id: number;
}

interface Hazard {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotSpeed: number;
  id: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const GamePage: React.FC<GamePageProps> = ({
  siteConfig,
  plexusConfig,
  onNavigate,
  onOpenControls,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game state
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [energy, setEnergy] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [gameMode, setGameMode] = useState<'classic' | 'hyper' | 'zen'>('classic');
  const [blastWave, setBlastWave] = useState<{ x: number; y: number; radius: number } | null>(null);

  // Player position and keys
  const playerRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    radius: 18,
    angle: 0,
    speed: 8,
  });

  const starsRef = useRef<StarNode[]>([]);
  const hazardsRef = useRef<Hazard[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const blastWaveRef = useRef<{ x: number; y: number; radius: number; maxRadius: number } | null>(null);
  const nextIdRef = useRef(1);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const animationFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const themeColor = plexusConfig.nodeColor || '#14b8a6';

  // Load high score from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('plexus_game_high_score');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {}
  }, []);

  const toggleSound = () => {
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Spawn star collection nodes
  const spawnStar = useCallback((w: number, h: number): StarNode => {
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 0.8 + 0.4) * (gameMode === 'hyper' ? 1.8 : 1);
    return {
      x: Math.random() * (w - 40) + 20,
      y: Math.random() * (h - 40) + 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 3 + 4,
      color: themeColor,
      points: 100,
      id: nextIdRef.current++,
    };
  }, [gameMode, themeColor]);

  // Spawn hazard obstacle
  const spawnHazard = useCallback((w: number, h: number): Hazard => {
    // Spawn from one of four edges
    const edge = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    if (edge === 0) {
      x = Math.random() * w;
      y = -20;
    } else if (edge === 1) {
      x = w + 20;
      y = Math.random() * h;
    } else if (edge === 2) {
      x = Math.random() * w;
      y = h + 20;
    } else {
      x = -20;
      y = Math.random() * h;
    }

    const angleToCenter = Math.atan2(h / 2 - y, w / 2 - x) + (Math.random() - 0.5) * 0.6;
    const spd = (Math.random() * 1.5 + 1.2) * (gameMode === 'hyper' ? 2 : 1);

    return {
      x,
      y,
      vx: Math.cos(angleToCenter) * spd,
      vy: Math.sin(angleToCenter) * spd,
      radius: Math.random() * 10 + 12,
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      id: nextIdRef.current++,
    };
  }, [gameMode]);

  // Trigger energy blast pulse
  const triggerBlast = useCallback(() => {
    if (energy < 25 && gameMode !== 'zen') return;
    const p = playerRef.current;

    blastWaveRef.current = {
      x: p.x,
      y: p.y,
      radius: p.radius,
      maxRadius: 180,
    };
    setBlastWave({ x: p.x, y: p.y, radius: p.radius });

    audio.playBlast();
    if (gameMode !== 'zen') {
      setEnergy((prev) => Math.max(0, prev - 25));
    }

    // Explode hazards near wave
    const survivingHazards: Hazard[] = [];
    hazardsRef.current.forEach((h) => {
      const dx = h.x - p.x;
      const dy = h.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        // Destroyed! Spawn sparks
        for (let i = 0; i < 12; i++) {
          const a = Math.random() * Math.PI * 2;
          const s = Math.random() * 6 + 2;
          sparksRef.current.push({
            x: h.x,
            y: h.y,
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s,
            life: 25,
            maxLife: 25,
            color: '#f87171',
            size: Math.random() * 3 + 2,
          });
        }
        setScore((prev) => prev + 150);
      } else {
        survivingHazards.push(h);
      }
    });
    hazardsRef.current = survivingHazards;
  }, [energy, gameMode]);

  // Restart game
  const handleRestart = () => {
    setScore(0);
    setCombo(0);
    setLives(3);
    setEnergy(100);
    setIsGameOver(false);
    setIsPaused(false);
    sparksRef.current = [];
    hazardsRef.current = [];

    const canvas = canvasRef.current;
    if (canvas) {
      playerRef.current.x = canvas.width / (2 * (window.devicePixelRatio || 1));
      playerRef.current.y = canvas.height / (2 * (window.devicePixelRatio || 1));
      playerRef.current.targetX = playerRef.current.x;
      playerRef.current.targetY = playerRef.current.y;

      const initialStars: StarNode[] = [];
      for (let i = 0; i < 18; i++) {
        initialStars.push(spawnStar(canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1)));
      }
      starsRef.current = initialStars;
    }
  };

  // Keyboard and mouse listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
      if (e.code === 'Space') {
        e.preventDefault();
        triggerBlast();
      }
      if (e.code === 'KeyP') {
        setIsPaused((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerBlast]);

  // Main game loop and canvas resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const resize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Initialize player in center
      if (playerRef.current.x === 0 && playerRef.current.y === 0) {
        playerRef.current.x = width / 2;
        playerRef.current.y = height / 2;
        playerRef.current.targetX = width / 2;
        playerRef.current.targetY = height / 2;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Initial stars
    starsRef.current = [];
    for (let i = 0; i < 20; i++) {
      starsRef.current.push(spawnStar(width, height));
    }

    let lastHazardSpawn = Date.now();

    const loop = (time: number) => {
      if (isGameOver || isPaused) {
        animationFrameId.current = requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Update Player based on keys or target mouse
      const player = playerRef.current;
      const speed = player.speed;

      if (keysPressed.current['ArrowUp'] || keysPressed.current['KeyW']) {
        player.y -= speed;
      }
      if (keysPressed.current['ArrowDown'] || keysPressed.current['KeyS']) {
        player.y += speed;
      }
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) {
        player.x -= speed;
      }
      if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD']) {
        player.x += speed;
      }

      // Smooth lerp to mouse target if no keys pressed
      const hasKeyMove =
        keysPressed.current['ArrowUp'] ||
        keysPressed.current['ArrowDown'] ||
        keysPressed.current['ArrowLeft'] ||
        keysPressed.current['ArrowRight'] ||
        keysPressed.current['KeyW'] ||
        keysPressed.current['KeyS'] ||
        keysPressed.current['KeyA'] ||
        keysPressed.current['KeyD'];

      if (!hasKeyMove) {
        const dx = player.targetX - player.x;
        const dy = player.targetY - player.y;
        player.x += dx * 0.12;
        player.y += dy * 0.12;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          player.angle = Math.atan2(dy, dx);
        }
      }

      // Keep player inside arena
      player.x = Math.max(player.radius, Math.min(width - player.radius, player.x));
      player.y = Math.max(player.radius, Math.min(height - player.radius, player.y));

      // Regenerate energy gradually
      setEnergy((prev) => Math.min(100, prev + 0.08));

      // 2. Spawn Hazards periodically
      const now = Date.now();
      const hazardInterval = gameMode === 'hyper' ? 900 : 1600;
      if (gameMode !== 'zen' && now - lastHazardSpawn > hazardInterval && hazardsRef.current.length < 12) {
        hazardsRef.current.push(spawnHazard(width, height));
        lastHazardSpawn = now;
      }

      // 3. Update & Draw Wave Blast if active
      if (blastWaveRef.current) {
        const bw = blastWaveRef.current;
        bw.radius += 10;
        ctx.save();
        ctx.beginPath();
        ctx.arc(bw.x, bw.y, bw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 3;
        ctx.globalAlpha = Math.max(0, 1 - bw.radius / bw.maxRadius);
        ctx.shadowBlur = 15;
        ctx.shadowColor = themeColor;
        ctx.stroke();
        ctx.restore();

        if (bw.radius >= bw.maxRadius) {
          blastWaveRef.current = null;
          setBlastWave(null);
        }
      }

      // 4. Draw Plexus Constellation lines between Stars
      const stars = starsRef.current;
      ctx.lineWidth = 1;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = themeColor;
            ctx.globalAlpha = (1 - dist / 100) * 0.4;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }

      // 5. Update and Draw Stars
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += s.vx;
        s.y += s.vy;

        // Bounce from edges
        if (s.x < s.radius || s.x > width - s.radius) s.vx *= -1;
        if (s.y < s.radius || s.y > height - s.radius) s.vy *= -1;

        // Check collision with player
        const dx = s.x - player.x;
        const dy = s.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < player.radius + s.radius + 6) {
          // Collected!
          audio.playCollect(combo + 1);
          setCombo((c) => {
            const nextCombo = c + 1;
            setScore((prev) => {
              const gained = s.points * Math.min(nextCombo, 8);
              const newScore = prev + gained;
              if (newScore > highScore) {
                setHighScore(newScore);
                try {
                  localStorage.setItem('plexus_game_high_score', newScore.toString());
                } catch {}
              }
              return newScore;
            });
            return nextCombo;
          });

          // Spawn burst sparks
          for (let k = 0; k < 10; k++) {
            const a = Math.random() * Math.PI * 2;
            const spd = Math.random() * 5 + 2;
            sparksRef.current.push({
              x: s.x,
              y: s.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              life: 20,
              maxLife: 20,
              color: themeColor,
              size: Math.random() * 3 + 2,
            });
          }

          // Respawn star elsewhere
          stars.splice(i, 1);
          stars.push(spawnStar(width, height));
          continue;
        }

        // Draw star node
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = themeColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = themeColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 6. Update and Draw Hazards (Asteroids / Debris)
      const hazards = hazardsRef.current;
      for (let i = hazards.length - 1; i >= 0; i--) {
        const h = hazards[i];
        h.x += h.vx;
        h.y += h.vy;
        h.rotation += h.rotSpeed;

        // Remove if offscreen by far
        if (h.x < -60 || h.x > width + 60 || h.y < -60 || h.y > height + 60) {
          hazards.splice(i, 1);
          continue;
        }

        // Check collision with player
        const dx = h.x - player.x;
        const dy = h.y - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < player.radius + h.radius - 2 && gameMode !== 'zen') {
          // Player hit!
          audio.playHit();
          setCombo(0);

          // Sparks
          for (let k = 0; k < 15; k++) {
            const a = Math.random() * Math.PI * 2;
            const spd = Math.random() * 6 + 2;
            sparksRef.current.push({
              x: player.x,
              y: player.y,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              life: 25,
              maxLife: 25,
              color: '#ef4444',
              size: Math.random() * 4 + 2,
            });
          }

          hazards.splice(i, 1);

          setLives((prev) => {
            const nextLives = prev - 1;
            if (nextLives <= 0) {
              setIsGameOver(true);
            }
            return nextLives;
          });
          continue;
        }

        // Draw Asteroid / Hazard
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rotation);
        ctx.beginPath();
        // Jagged polygon
        const sides = 6;
        for (let s = 0; s < sides; s++) {
          const a = (s / sides) * Math.PI * 2;
          const r = h.radius * (0.8 + (s % 2) * 0.35);
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ef4444';
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // 7. Update and Draw Sparks
      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life--;

        if (sp.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size * (sp.life / sp.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.life / sp.maxLife;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // 8. Draw Player Spaceship Probe
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);

      // Engine glow trail
      ctx.beginPath();
      ctx.moveTo(-player.radius, -player.radius * 0.4);
      ctx.lineTo(-player.radius - 12 - Math.random() * 8, 0);
      ctx.lineTo(-player.radius, player.radius * 0.4);
      ctx.fillStyle = themeColor;
      ctx.shadowBlur = 15;
      ctx.shadowColor = themeColor;
      ctx.fill();

      // Ship body (sleek sleek aerodynamic arrow)
      ctx.beginPath();
      ctx.moveTo(player.radius + 4, 0);
      ctx.lineTo(-player.radius * 0.7, -player.radius * 0.85);
      ctx.lineTo(-player.radius * 0.3, 0);
      ctx.lineTo(-player.radius * 0.7, player.radius * 0.85);
      ctx.closePath();

      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Core cockpit orb
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.shadowColor = themeColor;
      ctx.fill();

      ctx.restore();

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameMode, isGameOver, isPaused, spawnHazard, spawnStar, themeColor, combo, highScore]);

  // Pointer movement over game container
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    playerRef.current.targetX = e.clientX - rect.left;
    playerRef.current.targetY = e.clientY - rect.top;
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onClick={triggerBlast}
      className="relative w-full h-full min-h-[85vh] flex flex-col select-none overflow-hidden cursor-crosshair"
      style={{ backgroundColor: 'rgba(4, 8, 16, 0.88)' }}
      dir="rtl"
    >
      {/* 1. Game Top Header Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-3.5 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-md font-bold"
            style={{
              backgroundColor: `${themeColor}20`,
              borderColor: `${themeColor}60`,
              color: themeColor,
            }}
          >
            <Gamepad2 className="w-5 h-5 animate-bounce" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white tracking-wide">
                صفحة جيم (Game)
              </h1>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${themeColor}25`, color: themeColor }}
              >
                Plexus Arcade
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              اجمع النجوم الهندسية بالماوس أو الأسهم وتفادى العقبات الكونية!
            </p>
          </div>
        </div>

        {/* Page Switcher: Home vs Game */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5"
            title="العودة لصفحة موقعك الرئيسية"
          >
            <span>الرئيسية</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 transition-all flex items-center gap-1.5 shadow-md"
            style={{ backgroundColor: themeColor }}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Game (جيم)</span>
          </button>

          <button
            onClick={onOpenControls}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-1.5 ml-2"
          >
            <span>⚙️ لوحة التحكم</span>
          </button>
        </div>
      </nav>

      {/* 2. In-Game Heads-Up Display (HUD) */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 bg-[#0b101b]/70 border-b border-white/5 backdrop-blur-md">
        {/* Score & Combo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-xl border border-white/10">
            <Sparkles className="w-4 h-4" style={{ color: themeColor }} />
            <span className="text-xs text-slate-400">النقاط:</span>
            <span className="text-sm font-mono font-black text-white">{score}</span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-xl border border-white/10">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">أعلى رقم:</span>
            <span className="text-sm font-mono font-bold text-amber-300">{highScore}</span>
          </div>

          {combo > 1 && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black animate-pulse"
              style={{ backgroundColor: `${themeColor}30`, color: themeColor }}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>كومبو x{combo}</span>
            </div>
          )}
        </div>

        {/* Lives & Energy Pulse Gauge */}
        <div className="flex items-center gap-3">
          {gameMode !== 'zen' ? (
            <div className="flex items-center gap-1.5 bg-red-950/40 px-3 py-1 rounded-xl border border-red-500/20">
              <span className="text-xs text-red-300 font-semibold ml-1">القلوب:</span>
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition-all ${
                    i < lives ? 'text-red-500 fill-red-500' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className="px-3 py-1 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
              وضع الاسترخاء (بدون خسارة)
            </div>
          )}

          {/* Energy bar for Blast wave */}
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-xl border border-white/10">
            <Zap className="w-3.5 h-3.5" style={{ color: themeColor }} />
            <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${energy}%`,
                  backgroundColor: energy >= 25 ? themeColor : '#64748b',
                }}
              />
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline">صعقة (Space/انقر)</span>
          </div>

          {/* Audio & Pause Controls */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
            title={isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
            title={isPaused ? 'استئناف' : 'إيقاف مؤقت'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={handleRestart}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
            title="إعادة بدء اللعبة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Main Game Canvas Arena */}
      <div className="relative flex-1 w-full h-full">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Floating Quick Difficulty Mode Switcher */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
          <button
            onClick={() => setGameMode('classic')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
              gameMode === 'classic'
                ? 'bg-white/20 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            كلاسيكي
          </button>
          <button
            onClick={() => setGameMode('hyper')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
              gameMode === 'hyper'
                ? 'bg-red-500/30 text-red-300 border border-red-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ سريع (Hyper)
          </button>
          <button
            onClick={() => setGameMode('zen')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
              gameMode === 'zen'
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🧘 استرخاء
          </button>
        </div>

        {/* Floating Instructions Pill */}
        <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-slate-400">
          <span>حرك المركبة بالفأرة أو الأسهم</span>
          <span>•</span>
          <span className="font-mono text-white">Space / نقرة</span>
          <span>= إطلاق موجة صعقة</span>
        </div>

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-xl p-6">
            <div className="w-full max-w-md p-6 rounded-3xl bg-[#0d1424] border border-white/15 text-center shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center">
                <Gamepad2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">انتهت اللعبة!</h2>
                <p className="text-sm text-slate-400 mt-1">
                  أداء رائع في مغامرة النجوم الكونية
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div>
                  <div className="text-xs text-slate-400">النتيجة النهائية</div>
                  <div className="text-2xl font-black text-white font-mono">{score}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">أعلى رقم مسجل</div>
                  <div className="text-2xl font-black text-amber-300 font-mono">{highScore}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-950 text-sm transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  style={{ backgroundColor: themeColor }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>العب مجدداً</span>
                </button>

                <button
                  onClick={() => onNavigate('home')}
                  className="flex-1 py-3 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 text-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>العودة للموقع</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {isPaused && !isGameOver && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/15 text-center shadow-2xl space-y-4">
              <Pause className="w-10 h-10 mx-auto text-amber-400" />
              <h3 className="text-lg font-bold text-white">اللعبة متوقفة مؤقتاً</h3>
              <button
                onClick={() => setIsPaused(false)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 shadow-md"
                style={{ backgroundColor: themeColor }}
              >
                استئناف اللعب
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
