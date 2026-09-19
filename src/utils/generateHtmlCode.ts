import { PlexusConfig } from '../types';
import { DEFAULT_BOTANICAL_SVG } from '../data/botanicalLogo';

export function generateStandaloneHtml(
  config: PlexusConfig,
  options: { includeControlPanel?: boolean } = { includeControlPanel: true }
): string {
  const includePanel = options.includeControlPanel !== false;
  const logoColor = config.logoColor || config.nodeColor;
  const logoSize = config.logoSize || 380;
  const logoOpacity = config.logoOpacity !== undefined ? config.logoOpacity : 0.35;
  const logoFilter = config.logoGlow
    ? `filter: drop-shadow(0 0 25px ${logoColor}66) drop-shadow(0 0 50px ${logoColor}33);`
    : '';

  const logoMarkup = config.showLogo
    ? `
  <!-- الشعار المدمج في منتصف خلفية الموقع -->
  <div class="plexus-logo-backdrop" aria-hidden="true">
    ${
      config.logoCustomUrl
        ? `<img src="${config.logoCustomUrl}" alt="Website Logo" class="plexus-logo-img" />`
        : `<div class="plexus-logo-svg">${DEFAULT_BOTANICAL_SVG}</div>`
    }
  </div>`
    : '';

  const logoStyle = config.showLogo
    ? `
    /* طبقة الشعار المدمج في الخلفية خلف المحتوى وأمام الكانفاس */
    .plexus-logo-backdrop {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${logoSize}px;
      height: ${logoSize}px;
      max-width: 85vw;
      max-height: 85vh;
      z-index: 1;
      pointer-events: none;
      opacity: ${logoOpacity};
      mix-blend-mode: ${config.logoBlendMode || 'screen'};
      color: ${logoColor};
      ${logoFilter}
      display: flex;
      align-items: center;
      justify-content: center;
      animation: floatLogo 7s ease-in-out infinite alternate;
    }
    .plexus-logo-backdrop svg {
      width: 100%;
      height: 100%;
    }
    .plexus-logo-backdrop .plexus-logo-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    @keyframes floatLogo {
      0% { transform: translate(-50%, -50%) scale(0.98); }
      100% { transform: translate(-50%, -50%) scale(1.02); }
    }`
    : '';
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>خلفية شبكة الجسيمات الهندسية | Interactive Plexus Canvas</title>
  <style>
    /* إعادة الضبط وضمان ملء الشاشة بنعومة */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: ${config.bgColor};
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* لوحة الكانفاس تشغل كامل الخلفية */
    #plexus-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      display: block;
      cursor: crosshair;
    }

    /* نموذج محتوى اختياري فوق الخلفية (يمكنك حذفه أو تغييره لموقعك) */
    .hero-content {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      color: #ffffff;
      text-align: center;
      pointer-events: none; /* يسمح بالتفاعل مع الكانفاس خلفه */
      padding: 24px;
    }
    .hero-content * {
      pointer-events: auto;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 500;
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fbbf24;
      margin-bottom: 20px;
      backdrop-filter: blur(8px);
    }
    .hero-title {
      font-size: clamp(2rem, 5vw, 3.75rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      line-height: 1.2;
      max-width: 800px;
      margin-bottom: 16px;
      background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.25rem);
      color: #94a3b8;
      max-width: 580px;
      line-height: 1.6;
      margin-bottom: 32px;
    }
    .hero-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      border-radius: 12px;
      background: ${config.nodeColor};
      color: #000000;
      font-weight: 700;
      font-size: 15px;
      text-decoration: none;
      transition: all 0.25s ease;
      box-shadow: 0 0 24px ${config.nodeColor}55;
    }
    .hero-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 32px ${config.nodeColor}88;
    }
${logoStyle}
${
  includePanel
    ? `
    /* لوحة التحكم التفاعلية المدمجة لموقعك */
    #plexus-control-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 14px;
      background: rgba(18, 24, 38, 0.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
      transition: all 0.2s ease;
      user-select: none;
    }
    #plexus-control-toggle:hover {
      background: rgba(30, 41, 59, 0.95);
      border-color: ${config.nodeColor};
      transform: translateY(-2px);
    }
    #plexus-panel {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 330px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 40px);
      z-index: 1001;
      background: rgba(14, 20, 30, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
      color: #e2e8f0;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: inherit;
    }
    #plexus-panel.active {
      display: flex;
      animation: plexusFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes plexusFadeIn {
      from { opacity: 0; transform: scale(0.96) translateY(-8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .plexus-panel-header {
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.03);
    }
    .plexus-panel-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .plexus-panel-close {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 18px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      line-height: 1;
    }
    .plexus-panel-close:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.12);
    }
    .plexus-panel-body {
      padding: 16px 18px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .plexus-control-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .plexus-control-label {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #cbd5e1;
      font-weight: 500;
    }
    .plexus-control-val {
      font-family: monospace;
      font-weight: 700;
      color: ${config.nodeColor};
    }
    .plexus-range {
      width: 100%;
      accent-color: ${config.nodeColor};
      cursor: pointer;
      height: 6px;
      border-radius: 4px;
    }
    .plexus-checkbox-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #cbd5e1;
      cursor: pointer;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      transition: background 0.15s;
    }
    .plexus-checkbox-label:hover {
      background: rgba(255, 255, 255, 0.08);
    }
    .plexus-checkbox {
      accent-color: ${config.nodeColor};
      cursor: pointer;
      width: 16px;
      height: 16px;
    }
    .plexus-presets-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
    }
    .plexus-preset-btn {
      padding: 7px 4px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      transition: all 0.15s ease;
    }
    .plexus-preset-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: ${config.nodeColor};
    }
    .plexus-colors-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .plexus-color-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.04);
      padding: 6px 10px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 11px;
    }
    .plexus-color-input {
      border: none;
      width: 26px;
      height: 26px;
      border-radius: 6px;
      cursor: pointer;
      background: transparent;
    }`
    : ''
}
  </style>
</head>
<body>

  <!-- لوحة الرسم (Canvas) -->
  <canvas id="plexus-canvas"></canvas>
${logoMarkup}

${
  includePanel
    ? `
  <!-- زر فتح لوحة التحكم العائم لموقعك -->
  <button id="plexus-control-toggle" type="button" aria-label="لوحة التحكم">
    ⚙️ لوحة التحكم لموقعك
  </button>

  <!-- لوحة التحكم التفاعلية الشاملة لموقعك -->
  <aside id="plexus-panel" aria-label="لوحة تحكم خلفية الموقع">
    <div class="plexus-panel-header">
      <div class="plexus-panel-title">
        <span>⚙️</span>
        <span>لوحة التحكم بالموقع</span>
      </div>
      <button class="plexus-panel-close" id="plexus-close-btn" title="إغلاق">✕</button>
    </div>
    
    <div class="plexus-panel-body">
      <!-- الثيمات السريعة -->
      <div class="plexus-control-group">
        <div class="plexus-control-label">
          <span>🎨 ثيمات سريعة:</span>
        </div>
        <div class="plexus-presets-grid">
          <button class="plexus-preset-btn" data-preset="turquoise">فيروزي</button>
          <button class="plexus-preset-btn" data-preset="gold">ذهبي</button>
          <button class="plexus-preset-btn" data-preset="cyber">سيبراني</button>
          <button class="plexus-preset-btn" data-preset="matrix">ماتريكس</button>
        </div>
      </div>

      <!-- عدد الجسيمات -->
      <div class="plexus-control-group">
        <div class="plexus-control-label">
          <span>عدد الجسيمات (Nodes):</span>
          <span class="plexus-control-val" id="val-particleCount">${config.particleCount}</span>
        </div>
        <input type="range" class="plexus-range" id="ctrl-particleCount" min="30" max="250" step="5" value="${config.particleCount}">
      </div>

      <!-- سرعة الحركة -->
      <div class="plexus-control-group">
        <div class="plexus-control-label">
          <span>سرعة التدفق:</span>
          <span class="plexus-control-val" id="val-speed">${config.speed.toFixed(1)}x</span>
        </div>
        <input type="range" class="plexus-range" id="ctrl-speed" min="0.2" max="2.5" step="0.1" value="${config.speed}">
      </div>

      <!-- مسافة الخطوط -->
      <div class="plexus-control-group">
        <div class="plexus-control-label">
          <span>مسافة الروابط:</span>
          <span class="plexus-control-val" id="val-maxDistance">${config.maxDistance}px</span>
        </div>
        <input type="range" class="plexus-range" id="ctrl-maxDistance" min="60" max="200" step="5" value="${config.maxDistance}">
      </div>

      <!-- حجم النقاط -->
      <div class="plexus-control-group">
        <div class="plexus-control-label">
          <span>حجم النقاط المتوهجة:</span>
          <span class="plexus-control-val" id="val-nodeSize">${config.nodeSize}px</span>
        </div>
        <input type="range" class="plexus-range" id="ctrl-nodeSize" min="1" max="6" step="0.5" value="${config.nodeSize}">
      </div>

      <!-- تشكيل الشعار بالنقاط -->
      <label class="plexus-checkbox-label">
        <span>تشكيل الشعار بالجسيمات</span>
        <input type="checkbox" class="plexus-checkbox" id="ctrl-formLogo" ${config.formLogoWithParticles ? 'checked' : ''}>
      </label>

      <!-- قوة انجذاب النقاط للشعار -->
      <div class="plexus-control-group" id="group-formingStrength" style="${config.formLogoWithParticles ? '' : 'display:none;'}">
        <div class="plexus-control-label">
          <span>قوة تشكّل الشعار:</span>
          <span class="plexus-control-val" id="val-logoFormingStrength">${Math.round((config.logoFormingStrength || 0.85) * 100)}%</span>
        </div>
        <input type="range" class="plexus-range" id="ctrl-logoFormingStrength" min="0.2" max="1" step="0.05" value="${config.logoFormingStrength || 0.85}">
      </div>

      <!-- إظهار المثلثات -->
      <label class="plexus-checkbox-label">
        <span>المثلثات الشبكية (Mesh)</span>
        <input type="checkbox" class="plexus-checkbox" id="ctrl-showTriangles" ${config.showTriangles ? 'checked' : ''}>
      </label>

      <!-- منتقي الألوان -->
      <div class="plexus-colors-row">
        <div class="plexus-color-item">
          <span>النقاط:</span>
          <input type="color" class="plexus-color-input" id="ctrl-nodeColor" value="${config.nodeColor}">
        </div>
        <div class="plexus-color-item">
          <span>الخلفية:</span>
          <input type="color" class="plexus-color-input" id="ctrl-bgColor" value="${config.bgColor}">
        </div>
      </div>
    </div>
  </aside>`
    : ''
}

  <!-- محتوى تجريبي فوق الخلفية (يمكنك استبداله بمحتوى موقعك) -->
  <main class="hero-content">
    <div class="hero-badge">
      <span style="width: 8px; height: 8px; border-radius: 50%; background: ${config.nodeColor}; box-shadow: 0 0 8px ${config.nodeColor};"></span>
      تأثير شبكي تفاعلي حي
    </div>
    <h1 class="hero-title">شبكة الجسيمات الهندسية التفاعلية</h1>
    <p class="hero-subtitle">
      حرك مؤشر الفأرة أو المس الشاشة لتشهد تفاعل الخطوط والمثلثات الهندسية الذكية المتصلة في الوقت الفعلي.
    </p>
    <a href="#explore" class="hero-btn">
      استكشف موقعك هنا
    </a>
  </main>

  <script>
    /**
     * كود JavaScript خالص (Pure Vanilla JS) بدون أي مكتبات خارجية
     * يدعم الشاشات عالية الدقة (Retina / 4K) وتفاعل الفأرة واللمس
     */
    (function () {
      const canvas = document.getElementById('plexus-canvas');
      const ctx = canvas.getContext('2d');

      // إعدادات المحاكاة
      const CONFIG = {
        particleCount: ${config.particleCount},
        maxDistance: ${config.maxDistance},
        speed: ${config.speed},
        nodeSize: ${config.nodeSize},
        nodeColor: '${config.nodeColor}',
        lineColor: '${config.lineColor}',
        triangleFillColor: '${config.triangleFillColor}',
        showTriangles: ${config.showTriangles},
        showGrid: ${config.showGrid},
        gridSize: ${config.gridSize},
        gridColor: '${config.gridColor}',
        bgColor: '${config.bgColor}',
        glowIntensity: ${config.glowIntensity},
        mouseInteraction: '${config.mouseInteraction}',
        mouseDistance: ${config.mouseDistance},
        showLogo: ${config.showLogo},
        formLogoWithParticles: ${config.formLogoWithParticles},
        logoSize: ${config.logoSize || 380},
        logoFormingStrength: ${config.logoFormingStrength || 0.85}
      };

      let width = 0;
      let height = 0;
      let dpr = 1;
      let particles = [];
      let animationFrameId = null;

      // نقاط الهدف لتشكيل الشعار
      function getLogoTargetPoints(count) {
        const points = [];
        const circlePointsCount = Math.round(count * 0.35);
        for (let i = 0; i < circlePointsCount; i++) {
          const angle = (i / circlePointsCount) * Math.PI * 1.92 - 0.2;
          const r = 0.88 + (Math.random() - 0.5) * 0.02;
          points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
        }
        const topLeafCount = Math.round(count * 0.20);
        for (let i = 0; i < topLeafCount; i++) {
          const t = i / topLeafCount;
          const px = -0.05 + Math.sin(t * Math.PI * 2) * 0.25 * (1 - t * 0.5);
          const py = -0.55 + Math.cos(t * Math.PI * 2) * 0.35 * (1 - t * 0.4);
          points.push({ x: px, y: py });
        }
        const leftBloomCount = Math.round(count * 0.22);
        for (let i = 0; i < leftBloomCount; i++) {
          const t = i / leftBloomCount;
          const angle = t * Math.PI * 2;
          const localR = 0.18 + Math.sin(angle * 3) * 0.08;
          points.push({ x: -0.32 + Math.cos(angle) * localR, y: 0.32 + Math.sin(angle) * localR });
        }
        const remaining = count - points.length;
        for (let i = 0; i < remaining; i++) {
          const t = i / remaining;
          const angle = -Math.PI * 0.35 + t * Math.PI * 0.95;
          const r = 0.52 + Math.sin(t * Math.PI * 3) * 0.12;
          points.push({ x: Math.cos(angle) * r + 0.05, y: Math.sin(angle) * r + 0.05 });
        }
        return points;
      }

      let logoTargets = getLogoTargetPoints(CONFIG.particleCount);

      // إحداثيات مؤشر الفأرة
      const mouse = {
        x: null,
        y: null,
        radius: CONFIG.mouseDistance
      };

      // فئة الجسيم المفرد
      class Particle {
        constructor(index, x, y) {
          this.index = index;
          this.x = x !== undefined ? x : Math.random() * width;
          this.y = y !== undefined ? y : Math.random() * height;
          
          const angle = Math.random() * Math.PI * 2;
          const velocity = (Math.random() * 0.7 + 0.3) * CONFIG.speed;
          this.vx = Math.cos(angle) * velocity;
          this.vy = Math.sin(angle) * velocity;

          this.baseRadius = CONFIG.nodeSize * (0.8 + Math.random() * 0.4);
          this.radius = this.baseRadius;
          this.pulseOffset = Math.random() * Math.PI * 2;
        }

        update(time) {
          // الحركة التلقائية
          this.x += this.vx;
          this.y += this.vy;

          // تشكيل واصطفاف النقاط حول الشعار
          if (CONFIG.formLogoWithParticles && logoTargets.length > 0) {
            const tIdx = this.index % logoTargets.length;
            const targetNorm = logoTargets[tIdx];
            const logoRadius = CONFIG.logoSize * 0.5;
            const centerX = width / 2;
            const centerY = height / 2;

            const sway = Math.sin(time * 0.0015 + this.pulseOffset) * 4;
            const targetX = centerX + targetNorm.x * (logoRadius + sway);
            const targetY = centerY + targetNorm.y * (logoRadius + sway);

            const toTargetX = targetX - this.x;
            const toTargetY = targetY - this.y;
            const strength = CONFIG.logoFormingStrength * 0.038;

            this.vx += toTargetX * strength;
            this.vy += toTargetY * strength;
            this.vx *= 0.88;
            this.vy *= 0.88;
          }

          // الارتداد الناعم عن الحواف
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

          // تفاعل الفأرة (ابتعاد وهروب الجسيمات بنعومة)
          if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius && dist > 0) {
              const force = (1 - dist / mouse.radius);
              if (CONFIG.mouseInteraction === 'connect_repel') {
                const repelPower = force * 8;
                this.x -= (dx / dist) * repelPower;
                this.y -= (dy / dist) * repelPower;
                this.vx -= (dx / dist) * force * 0.8;
                this.vy -= (dy / dist) * force * 0.8;
              } else if (CONFIG.mouseInteraction === 'connect_attract') {
                this.x += (dx / dist) * force * 2.2;
                this.y += (dy / dist) * force * 2.2;
              }
            }
          }

          // إعادة السرعة تدريجياً للسرعة الطبيعية
          const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (currentSpeed > CONFIG.speed * 4) {
            this.vx = (this.vx / currentSpeed) * (CONFIG.speed * 4);
            this.vy = (this.vy / currentSpeed) * (CONFIG.speed * 4);
          }

          // نبض خفيف لحجم النواة
          this.radius = this.baseRadius + Math.sin(time * 0.003 + this.pulseOffset) * 0.5;
        }

        draw(ctx) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, Math.max(1, this.radius), 0, Math.PI * 2);
          ctx.fillStyle = CONFIG.nodeColor;

          // توهج النواة
          if (CONFIG.glowIntensity > 0) {
            ctx.shadowBlur = CONFIG.glowIntensity;
            ctx.shadowColor = CONFIG.nodeColor;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }
      }

      // رسم الشبكة الهندسية الخلفية كما في الفيديو
      function drawBackgroundGrid() {
        if (!CONFIG.showGrid) return;

        ctx.save();
        ctx.strokeStyle = CONFIG.gridColor;
        ctx.lineWidth = 1;

        const size = CONFIG.gridSize;
        const offsetX = 0;
        const offsetY = 0;

        ctx.beginPath();
        for (let x = offsetX; x <= width; x += size) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = offsetY; y <= height; y += size) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();

        // نقاط تقاطع صغيرة خافتة
        ctx.fillStyle = CONFIG.gridColor;
        for (let x = offsetX; x <= width; x += size * 2) {
          for (let y = offsetY; y <= height; y += size * 2) {
            ctx.fillRect(x - 1, y - 1, 2, 2);
          }
        }
        ctx.restore();
      }

      // تهيئة حجم الكانفاس والجسيمات
      function init() {
        dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        ctx.scale(dpr, dpr);

        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
          particles.push(new Particle(i));
        }
      }

      // الحلقة الرئيسية للرسم (Animation Loop)
      function animate(time) {
        ctx.clearRect(0, 0, width, height);

        // 1. رسم خلفية الشبكة
        drawBackgroundGrid();

        // 2. تحديث مواقع الجسيمات
        for (let i = 0; i < particles.length; i++) {
          particles[i].update(time);
        }

        // 3. رسم المثلثات المترابطة (Wireframe Triangles) إذا اتصلت 3 نقاط
        if (CONFIG.showTriangles) {
          ctx.shadowBlur = 0;
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx1 = particles[i].x - particles[j].x;
              const dy1 = particles[i].y - particles[j].y;
              const d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

              if (d1 < CONFIG.maxDistance) {
                for (let k = j + 1; k < particles.length; k++) {
                  const dx2 = particles[j].x - particles[k].x;
                  const dy2 = particles[j].y - particles[k].y;
                  const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                  if (d2 < CONFIG.maxDistance) {
                    const dx3 = particles[i].x - particles[k].x;
                    const dy3 = particles[i].y - particles[k].y;
                    const d3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

                    if (d3 < CONFIG.maxDistance) {
                      const avgDist = (d1 + d2 + d3) / 3;
                      const alpha = (1 - avgDist / CONFIG.maxDistance) * 0.22;

                      ctx.beginPath();
                      ctx.moveTo(particles[i].x, particles[i].y);
                      ctx.lineTo(particles[j].x, particles[j].y);
                      ctx.lineTo(particles[k].x, particles[k].y);
                      ctx.closePath();

                      ctx.fillStyle = hexOrRgbaToAlpha(CONFIG.triangleFillColor, alpha);
                      ctx.fill();

                      ctx.strokeStyle = hexOrRgbaToAlpha(CONFIG.lineColor, alpha * 1.5);
                      ctx.lineWidth = 0.6;
                      ctx.stroke();
                    }
                  }
                }
              }
            }
          }
        }

        // 4. رسم الخطوط بين النقاط
        ctx.shadowBlur = 0;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.maxDistance) {
              const alpha = (1 - dist / CONFIG.maxDistance) * 0.85;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = hexOrRgbaToAlpha(CONFIG.lineColor, alpha);
              ctx.lineWidth = Math.max(0.4, 1.2 * (1 - dist / CONFIG.maxDistance));
              ctx.stroke();
            }
          }

          // خطوط متصلة بمؤشر الفأرة
          if (mouse.x !== null && mouse.y !== null) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
              const alpha = (1 - dist / mouse.radius);
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = hexOrRgbaToAlpha(CONFIG.nodeColor, alpha * 0.9);
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }
          }
        }

        // 5. رسم الجسيمات فوق الخطوط
        for (let i = 0; i < particles.length; i++) {
          particles[i].draw(ctx);
        }

        animationFrameId = requestAnimationFrame(animate);
      }

      // تحويل اللون لإضافة الشفافية بدقة
      function hexOrRgbaToAlpha(color, alpha) {
        if (color.startsWith('#')) {
          let hex = color.replace('#', '');
          if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + Math.min(1, Math.max(0, alpha)).toFixed(3) + ')';
        }
        return color;
      }

      // رصد أحداث الفأرة واللمس
      window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });

      window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });

      // إضافة جسيم عند النقر
      window.addEventListener('click', (e) => {
        particles.push(new Particle(e.clientX, e.clientY));
        if (particles.length > CONFIG.particleCount + 30) {
          particles.shift();
        }
      });

      // التفاعل باللمس للشاشات الذكية
      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          mouse.x = e.touches[0].clientX;
          mouse.y = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
      });

      // إعادة التكيف عند تغيير حجم الشاشة
      window.addEventListener('resize', () => {
        init();
      });

      // البدء
      init();
      animationFrameId = requestAnimationFrame(animate);

${
  includePanel
    ? `
      // إعدادات وتفاعل لوحة التحكم لموقعك
      const panelToggle = document.getElementById('plexus-control-toggle');
      const panel = document.getElementById('plexus-panel');
      const closeBtn = document.getElementById('plexus-close-btn');

      if (panelToggle && panel) {
        panelToggle.addEventListener('click', () => {
          panel.classList.toggle('active');
        });
      }
      if (closeBtn && panel) {
        closeBtn.addEventListener('click', () => {
          panel.classList.remove('active');
        });
      }

      // 1. عدد الجسيمات
      const particleSlider = document.getElementById('ctrl-particleCount');
      if (particleSlider) {
        particleSlider.addEventListener('input', (e) => {
          const val = parseInt(e.target.value, 10);
          CONFIG.particleCount = val;
          const valDisplay = document.getElementById('val-particleCount');
          if (valDisplay) valDisplay.textContent = val;
          logoTargets = getLogoTargetPoints(val);
          while (particles.length < val) {
            particles.push(new Particle(particles.length));
          }
          if (particles.length > val) {
            particles.length = val;
          }
        });
      }

      // 2. سرعة الحركة
      const speedSlider = document.getElementById('ctrl-speed');
      if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
          CONFIG.speed = parseFloat(e.target.value);
          const valDisplay = document.getElementById('val-speed');
          if (valDisplay) valDisplay.textContent = CONFIG.speed.toFixed(1) + 'x';
        });
      }

      // 3. مسافة الروابط
      const distSlider = document.getElementById('ctrl-maxDistance');
      if (distSlider) {
        distSlider.addEventListener('input', (e) => {
          CONFIG.maxDistance = parseInt(e.target.value, 10);
          const valDisplay = document.getElementById('val-maxDistance');
          if (valDisplay) valDisplay.textContent = CONFIG.maxDistance + 'px';
        });
      }

      // 4. حجم النقاط
      const sizeSlider = document.getElementById('ctrl-nodeSize');
      if (sizeSlider) {
        sizeSlider.addEventListener('input', (e) => {
          CONFIG.nodeSize = parseFloat(e.target.value);
          const valDisplay = document.getElementById('val-nodeSize');
          if (valDisplay) valDisplay.textContent = CONFIG.nodeSize + 'px';
        });
      }

      // 5. تشكيل الشعار بالجسيمات
      const formLogoCheck = document.getElementById('ctrl-formLogo');
      const formingStrengthGroup = document.getElementById('group-formingStrength');
      if (formLogoCheck) {
        formLogoCheck.addEventListener('change', (e) => {
          CONFIG.formLogoWithParticles = e.target.checked;
          if (formingStrengthGroup) {
            formingStrengthGroup.style.display = e.target.checked ? '' : 'none';
          }
        });
      }

      // 6. قوة انجذاب النقاط للشعار
      const strengthSlider = document.getElementById('ctrl-logoFormingStrength');
      if (strengthSlider) {
        strengthSlider.addEventListener('input', (e) => {
          CONFIG.logoFormingStrength = parseFloat(e.target.value);
          const valDisplay = document.getElementById('val-logoFormingStrength');
          if (valDisplay) valDisplay.textContent = Math.round(CONFIG.logoFormingStrength * 100) + '%';
        });
      }

      // 7. المثلثات
      const trianglesCheck = document.getElementById('ctrl-showTriangles');
      if (trianglesCheck) {
        trianglesCheck.addEventListener('change', (e) => {
          CONFIG.showTriangles = e.target.checked;
        });
      }

      // 8. منتقي الألوان
      const nodeColorPicker = document.getElementById('ctrl-nodeColor');
      if (nodeColorPicker) {
        nodeColorPicker.addEventListener('input', (e) => {
          CONFIG.nodeColor = e.target.value;
          CONFIG.lineColor = e.target.value;
        });
      }

      const bgColorPicker = document.getElementById('ctrl-bgColor');
      if (bgColorPicker) {
        bgColorPicker.addEventListener('input', (e) => {
          CONFIG.bgColor = e.target.value;
          document.body.style.backgroundColor = e.target.value;
        });
      }

      // 9. الثيمات السريعة
      const presetBtns = document.querySelectorAll('.plexus-preset-btn');
      presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const preset = btn.getAttribute('data-preset');
          if (preset === 'turquoise') {
            CONFIG.nodeColor = '#14b8a6';
            CONFIG.lineColor = '#0d9488';
            CONFIG.bgColor = '#03080e';
          } else if (preset === 'gold') {
            CONFIG.nodeColor = '#f59e0b';
            CONFIG.lineColor = '#d97706';
            CONFIG.bgColor = '#0a0907';
          } else if (preset === 'cyber') {
            CONFIG.nodeColor = '#38bdf8';
            CONFIG.lineColor = '#0284c7';
            CONFIG.bgColor = '#050c18';
          } else if (preset === 'matrix') {
            CONFIG.nodeColor = '#22c55e';
            CONFIG.lineColor = '#16a34a';
            CONFIG.bgColor = '#030a05';
          }
          document.body.style.backgroundColor = CONFIG.bgColor;
          if (nodeColorPicker) nodeColorPicker.value = CONFIG.nodeColor;
          if (bgColorPicker) bgColorPicker.value = CONFIG.bgColor;
        });
      });`
    : ''
}
    })();
  </script>
</body>
</html>`;
}
