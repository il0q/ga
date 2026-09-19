import React, { useEffect, useRef } from 'react';
import { PlexusConfig, PlaygroundEffectType } from '../types';
import {
  getBotanicalLogoTargetPoints,
  extractLogoPointsFromImage,
} from '../utils/logoPoints';

interface PlexusCanvasProps {
  config: PlexusConfig;
  onParticleCountChange?: (count: number) => void;
  effectTrigger?: { type: PlaygroundEffectType; timestamp: number } | null;
}

export const PlexusCanvas: React.FC<PlexusCanvasProps> = ({ config, effectTrigger }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);
  const lastEffectTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let animationFrameId: number;

    // Logo formation target points (normalized -1 to 1)
    let logoTargetPoints: { x: number; y: number }[] = getBotanicalLogoTargetPoints(
      config.particleCount
    );

    // If user provided a custom image, extract exact contour points from it!
    if (config.logoCustomUrl) {
      const customImg = new Image();
      customImg.crossOrigin = 'anonymous';
      customImg.src = config.logoCustomUrl;
      customImg.onload = () => {
        logoTargetPoints = extractLogoPointsFromImage(customImg, config.particleCount);
      };
    }

    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: config.mouseDistance,
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseRadius: number;
      radius: number;
      pulseOffset: number;
      targetIdx: number;

      constructor(index: number, x?: number, y?: number) {
        this.targetIdx = index;
        this.x = x !== undefined ? x : Math.random() * width;
        this.y = y !== undefined ? y : Math.random() * height;

        const angle = Math.random() * Math.PI * 2;
        const velocity = (Math.random() * 0.7 + 0.3) * config.speed;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity;

        this.baseRadius = config.nodeSize * (0.8 + Math.random() * 0.4);
        this.radius = this.baseRadius;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update(time: number) {
        // Natural wandering drift
        this.x += this.vx;
        this.y += this.vy;

        // --- Logo Formation Physics ---
        // If formLogoWithParticles is active, attract particles to their logo contour slots
        if (config.formLogoWithParticles && logoTargetPoints.length > 0) {
          const tIdx = this.targetIdx % logoTargetPoints.length;
          const targetNorm = logoTargetPoints[tIdx];

          const logoRadius = (config.logoSize || 380) * 0.5;
          const centerX = width / 2;
          const centerY = height / 2;

          // Breathing / organic micro-swaying effect on the target
          const sway = Math.sin(time * 0.0015 + this.pulseOffset) * 4;
          const targetX = centerX + targetNorm.x * (logoRadius + sway);
          const targetY = centerY + targetNorm.y * (logoRadius + sway);

          const toTargetX = targetX - this.x;
          const toTargetY = targetY - this.y;
          const distToTarget = Math.sqrt(toTargetX * toTargetX + toTargetY * toTargetY);

          // Spring pull towards target logo contour
          const strength = (config.logoFormingStrength || 0.85) * 0.038;
          this.vx += toTargetX * strength;
          this.vy += toTargetY * strength;

          // Smooth drag/friction so particles settle into crisp logo lines
          this.vx *= 0.88;
          this.vy *= 0.88;
        }

        // Screen boundary collisions
        if (this.x < 0) {
          this.x = 0;
          this.vx *= -1;
        } else if (this.x > width) {
          this.x = width;
          this.vx *= -1;
        }
        if (this.y < 0) {
          this.y = 0;
          this.vy *= -1;
        } else if (this.y > height) {
          this.y = height;
          this.vy *= -1;
        }

        // Mouse interaction (Repel away from logo cluster on mouse hover)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius);
            if (config.mouseInteraction === 'connect_repel') {
              const repelPower = force * 8;
              this.x -= (dx / dist) * repelPower;
              this.y -= (dy / dist) * repelPower;
              this.vx -= (dx / dist) * force * 0.8;
              this.vy -= (dy / dist) * force * 0.8;
            } else if (config.mouseInteraction === 'connect_attract') {
              this.x += (dx / dist) * force * 2.2;
              this.y += (dy / dist) * force * 2.2;
            }
          }
        }

        // Dampen excess velocity
        const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const maxAllowedSpeed = config.speed * 4;
        if (currentSpeed > maxAllowedSpeed) {
          this.vx = (this.vx / currentSpeed) * maxAllowedSpeed;
          this.vy = (this.vy / currentSpeed) * maxAllowedSpeed;
        }

        this.radius = this.baseRadius + Math.sin(time * 0.003 + this.pulseOffset) * 0.5;
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, Math.max(1, this.radius), 0, Math.PI * 2);
        context.fillStyle = config.nodeColor;

        if (config.glowIntensity > 0) {
          context.shadowBlur = config.glowIntensity;
          context.shadowColor = config.nodeColor;
        } else {
          context.shadowBlur = 0;
        }
        context.fill();
      }
    }

    let particles: Particle[] = [];

    const hexOrRgbaToAlpha = (color: string, alpha: number) => {
      if (color.startsWith('#')) {
        let hex = color.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, alpha)).toFixed(3)})`;
      }
      return color;
    };

    const drawGrid = () => {
      if (!config.showGrid) return;

      ctx.save();
      ctx.strokeStyle = config.gridColor;
      ctx.lineWidth = 1;

      const size = config.gridSize;

      ctx.beginPath();
      for (let x = 0; x <= width; x += size) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += size) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Intersection nodes
      ctx.fillStyle = config.gridColor;
      for (let x = 0; x <= width; x += size * 2) {
        for (let y = 0; y <= height; y += size * 2) {
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }
      ctx.restore();
    };

    const handleResize = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Re-init particles if count mismatch
      if (particles.length === 0 || Math.abs(particles.length - config.particleCount) > 10) {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
          particles.push(new Particle(i));
        }
      }
    };

    handleResize();

    // Spawn initial particles
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle(i));
    }
    particlesRef.current = particles;

    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Draw Grid
      drawGrid();

      // Update positions
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(time);
      }

      // Draw Triangles (3-point loops)
      if (config.showTriangles) {
        ctx.shadowBlur = 0;
        const maxDist = config.maxDistance;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx1 = particles[i].x - particles[j].x;
            const dy1 = particles[i].y - particles[j].y;
            const d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

            if (d1 < maxDist) {
              for (let k = j + 1; k < particles.length; k++) {
                const dx2 = particles[j].x - particles[k].x;
                const dy2 = particles[j].y - particles[k].y;
                const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                if (d2 < maxDist) {
                  const dx3 = particles[i].x - particles[k].x;
                  const dy3 = particles[i].y - particles[k].y;
                  const d3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

                  if (d3 < maxDist) {
                    const avgDist = (d1 + d2 + d3) / 3;
                    const alpha = (1 - avgDist / maxDist) * 0.22;

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.lineTo(particles[k].x, particles[k].y);
                    ctx.closePath();

                    ctx.fillStyle = hexOrRgbaToAlpha(config.triangleFillColor, alpha);
                    ctx.fill();

                    ctx.strokeStyle = hexOrRgbaToAlpha(config.lineColor, alpha * 1.6);
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                  }
                }
              }
            }
          }
        }
      }

      // Draw Connecting lines
      ctx.shadowBlur = 0;
      const maxDist = config.maxDistance;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.85;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = hexOrRgbaToAlpha(config.lineColor, alpha);
            ctx.lineWidth = Math.max(0.4, 1.3 * (1 - dist / maxDist));
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const alpha = 1 - dist / mouse.radius;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = hexOrRgbaToAlpha(config.nodeColor, alpha * 0.95);
            ctx.lineWidth = 1.3;
            ctx.stroke();
          }
        }
      }

      // Draw Particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Mouse handlers
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      // Spawn a burst of 5 particles with explosive velocities
      for (let k = 0; k < 5; k++) {
        const p = new Particle(particles.length, clickX, clickY);
        const burstAngle = Math.random() * Math.PI * 2;
        const burstSpeed = (Math.random() * 6 + 3) * config.speed;
        p.vx = Math.cos(burstAngle) * burstSpeed;
        p.vy = Math.sin(burstAngle) * burstSpeed;
        particles.push(p);
      }
      if (particles.length > config.particleCount + 60) {
        particles.splice(0, 5);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    };

    const onTouchEnd = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [config]);

  // Handle Interactive Physics Playground Triggers
  useEffect(() => {
    if (!effectTrigger || effectTrigger.timestamp === lastEffectTimeRef.current) return;
    lastEffectTimeRef.current = effectTrigger.timestamp;

    const particles = particlesRef.current;
    if (!particles || particles.length === 0) return;

    const canvas = canvasRef.current;
    const width = canvas ? canvas.clientWidth : window.innerWidth;
    const height = canvas ? canvas.clientHeight : window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    switch (effectTrigger.type) {
      case 'explode':
        particles.forEach((p) => {
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.5;
          const force = (Math.random() * 20 + 12) * config.speed;
          p.vx = Math.cos(angle) * force;
          p.vy = Math.sin(angle) * force;
        });
        break;

      case 'vortex':
        particles.forEach((p) => {
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const angle = Math.atan2(dy, dx);
          p.vx = -Math.sin(angle) * 14 + (centerX - p.x) * 0.03;
          p.vy = Math.cos(angle) * 14 + (centerY - p.y) * 0.03;
        });
        break;

      case 'shockwave':
        particles.forEach((p) => {
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = Math.max(0, 1 - dist / (width * 0.6)) * 22;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        });
        break;

      case 'zeroG':
        particles.forEach((p) => {
          p.vx = (Math.random() - 0.5) * 0.2;
          p.vy = (Math.random() - 0.5) * 0.2;
        });
        break;

      case 'assemble':
        particles.forEach((p) => {
          p.vx *= 0.05;
          p.vy *= 0.05;
        });
        break;

      case 'spawn':
        for (let k = 0; k < 6; k++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 8 + 3;
          const p = new (particles[0]?.constructor || Object)(
            particles.length,
            centerX + Math.cos(angle) * 30,
            centerY + Math.sin(angle) * 30
          );
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          particles.push(p);
        }
        break;
    }
  }, [effectTrigger, config.speed]);

  return (
    <canvas
      ref={canvasRef}
      id="main-plexus-canvas"
      className="absolute inset-0 w-full h-full cursor-crosshair block"
      style={{ backgroundColor: config.bgColor }}
    />
  );
};
