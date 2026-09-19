import { PlexusConfig, WebsiteConfig } from '../types';
import { DEFAULT_BOTANICAL_SVG } from '../data/botanicalLogo';
import { DEFAULT_WEBSITE_CONFIG } from '../data/presets';

export function generateStandaloneHtml(
  config: PlexusConfig,
  siteConfigOrOptions?: WebsiteConfig | { includeControlPanel?: boolean },
  maybeOptions?: { includeControlPanel?: boolean }
): string {
  let siteConfig: WebsiteConfig = DEFAULT_WEBSITE_CONFIG;
  let options: { includeControlPanel?: boolean } = { includeControlPanel: true };

  if (siteConfigOrOptions && 'siteName' in siteConfigOrOptions) {
    siteConfig = siteConfigOrOptions as WebsiteConfig;
    if (maybeOptions) options = maybeOptions;
  } else if (siteConfigOrOptions && 'includeControlPanel' in siteConfigOrOptions) {
    options = siteConfigOrOptions as { includeControlPanel?: boolean };
  }

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
  <title>${siteConfig.siteName} | ${siteConfig.tagline}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      width: 100%;
      min-height: 100%;
      background-color: ${config.bgColor};
      color: #f1f5f9;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow-x: hidden;
      scroll-behavior: smooth;
    }

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

    /* Website Container */
    .website-wrapper {
      position: relative;
      z-index: 10;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Navbar */
    .site-nav {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 28px;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      background: rgba(10, 15, 25, 0.45);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .site-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: ${config.nodeColor}25;
      border: 1px solid ${config.nodeColor}60;
      color: ${config.nodeColor};
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 16px;
    }
    .brand-text h1 {
      font-size: 17px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
    }
    .brand-text p {
      font-size: 11px;
      color: #94a3b8;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
      list-style: none;
    }
    .nav-links a {
      color: #cbd5e1;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      transition: color 0.15s;
    }
    .nav-links a:hover {
      color: ${config.nodeColor};
    }

    /* Hero Section */
    .hero-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 75vh;
      padding: 60px 24px 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      background: ${config.nodeColor}18;
      border: 1px solid ${config.nodeColor}40;
      color: ${config.nodeColor};
      margin-bottom: 20px;
      backdrop-filter: blur(8px);
      cursor: pointer;
      transition: transform 0.2s;
    }
    .hero-badge:hover {
      transform: scale(1.04);
    }
    .hero-title {
      font-size: clamp(2.2rem, 5vw, 3.8rem);
      font-weight: 900;
      letter-spacing: -0.02em;
      line-height: 1.25;
      color: #ffffff;
      margin-bottom: 18px;
      text-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.2rem);
      color: #cbd5e1;
      max-width: 650px;
      line-height: 1.65;
      margin-bottom: 30px;
    }
    .hero-buttons {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 14px;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 13px 28px;
      border-radius: 12px;
      background: ${config.nodeColor};
      color: #050b14;
      font-weight: 800;
      font-size: 14px;
      text-decoration: none;
      cursor: pointer;
      border: none;
      box-shadow: 0 10px 25px -5px ${config.nodeColor}66;
      transition: all 0.2s;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      filter: brightness(1.1);
    }
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 13px 26px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      transition: all 0.2s;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.14);
      transform: translateY(-2px);
    }

    /* On-Page Quick Playground Bar */
    .playground-bar {
      margin-top: 40px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 18px;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(16px);
      box-shadow: 0 15px 35px rgba(0,0,0,0.4);
    }
    .fx-btn {
      padding: 8px 14px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #f8fafc;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s;
    }
    .fx-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.03);
    }

    /* Features Grid */
    .features-section {
      max-width: 1050px;
      margin: 40px auto 60px;
      padding: 0 24px;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    .feature-card {
      padding: 24px;
      border-radius: 20px;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      transition: all 0.3s;
    }
    .feature-card:hover {
      border-color: ${config.nodeColor}50;
      transform: translateY(-4px);
    }
    .feature-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: ${config.nodeColor}20;
      color: ${config.nodeColor};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-bottom: 16px;
    }
    .feature-card h3 {
      font-size: 17px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .feature-card p {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.6;
    }

    /* Stats Section */
    .stats-section {
      max-width: 1050px;
      margin: 0 auto 60px;
      padding: 0 24px;
    }
    .stats-card {
      padding: 28px;
      border-radius: 24px;
      background: rgba(10, 16, 30, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 24px;
      text-align: center;
    }
    .stat-num {
      font-size: 32px;
      font-weight: 900;
      color: ${config.nodeColor};
      margin-bottom: 4px;
    }
    .stat-label {
      font-size: 12px;
      color: #94a3b8;
      font-weight: 500;
    }

    /* Footer */
    .site-footer {
      margin-top: auto;
      padding: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(5, 8, 15, 0.6);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #64748b;
      flex-wrap: wrap;
      gap: 12px;
    }

${logoStyle}

${
  includePanel
    ? `
    /* Floating Widget Button */
    #plexus-control-toggle {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1000;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 14px;
      background: rgba(18, 24, 38, 0.88);
      backdrop-filter: blur(12px);
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
      left: 20px;
      width: 340px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 40px);
      z-index: 1001;
      background: rgba(14, 20, 30, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
      color: #e2e8f0;
      display: none;
      flex-direction: column;
      overflow: hidden;
    }
    #plexus-panel.active {
      display: flex;
    }
    .plexus-panel-header {
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.02);
    }
    .plexus-panel-title {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .plexus-panel-close {
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-size: 16px;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .plexus-panel-close:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }
    .plexus-panel-body {
      padding: 16px 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .plexus-control-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
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
    }
    .plexus-checkbox {
      accent-color: ${config.nodeColor};
      cursor: pointer;
      width: 16px;
      height: 16px;
    }
    .plexus-fx-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }
    .plexus-fx-btn {
      padding: 8px 6px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      transition: all 0.15s ease;
    }
    .plexus-fx-btn:hover {
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

  <!-- لوحة الرسم التفاعلية (Canvas) -->
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
  <aside id="plexus-panel" aria-label="لوحة تحكم الموقع">
    <div class="plexus-panel-header">
      <div class="plexus-panel-title">
        <span>⚙️</span>
        <span>لوحة التحكم لموقعك</span>
      </div>
      <button class="plexus-panel-close" id="plexus-close-btn" title="إغلاق">✕</button>
    </div>
    
    <div class="plexus-panel-body">
      <!-- أزرار اللعب والتأثيرات الحركية -->
      <div class="plexus-control-group">
        <div class="plexus-control-label">
          <span>🎮 ألعاب حركية فورية:</span>
        </div>
        <div class="plexus-fx-grid">
          <button class="plexus-fx-btn" onclick="triggerPhysicsEffect('explode')">💥 انفجار</button>
          <button class="plexus-fx-btn" onclick="triggerPhysicsEffect('vortex')">🌀 إعصار</button>
          <button class="plexus-fx-btn" onclick="triggerPhysicsEffect('shockwave')">⚡ صعقة</button>
          <button class="plexus-fx-btn" onclick="triggerPhysicsEffect('zeroG')">🪐 طفو</button>
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

  <!-- المحتوى الكامل لموقعك المخصص -->
  <div class="website-wrapper">
    ${
      siteConfig.showNavbar
        ? `
    <!-- شريط التنقل (Navbar) -->
    <nav class="site-nav">
      <div class="site-brand">
        <div class="brand-icon">✦</div>
        <div class="brand-text">
          <h1>${siteConfig.siteName}</h1>
          <p>${siteConfig.tagline}</p>
        </div>
      </div>
      <ul class="nav-links">
        <li><a href="#hero">الرئيسية</a></li>
        <li><a href="#game-section" style="color: ${config.nodeColor}; font-weight: 700;">🎮 Game</a></li>
        ${siteConfig.showFeatures ? `<li><a href="#features">المميزات</a></li>` : ''}
        ${siteConfig.showStats ? `<li><a href="#stats">الإحصائيات</a></li>` : ''}
      </ul>
      <a href="#cta" class="btn-primary" style="padding: 9px 18px; font-size: 13px;">${siteConfig.ctaPrimaryText}</a>
    </nav>`
        : ''
    }

    <!-- الواجهة الرئيسية (Hero Section) -->
    <section id="hero" class="hero-section">
      ${
        siteConfig.heroBadge
          ? `<div class="hero-badge" onclick="triggerPhysicsEffect('shockwave')">
        <span>✦</span>
        <span>${siteConfig.heroBadge}</span>
      </div>`
          : ''
      }
      <h2 class="hero-title">${siteConfig.heroTitle}</h2>
      <p class="hero-subtitle">${siteConfig.heroSubtitle}</p>

      <div class="hero-buttons">
        <button class="btn-primary" onclick="triggerPhysicsEffect('explode')">${siteConfig.ctaPrimaryText}</button>
        <button class="btn-secondary" onclick="triggerPhysicsEffect('vortex')">${siteConfig.ctaSecondaryText}</button>
      </div>

      <!-- شريط اللعب السريع بالحركة -->
      <div class="playground-bar">
        <span style="font-size: 12px; font-weight: 700; margin-left: 6px;">🎮 العب بالحركة:</span>
        <button class="fx-btn" onclick="triggerPhysicsEffect('explode')">💥 انفجار</button>
        <button class="fx-btn" onclick="triggerPhysicsEffect('vortex')">🌀 إعصار</button>
        <button class="fx-btn" onclick="triggerPhysicsEffect('shockwave')">⚡ صعقة</button>
        <button class="fx-btn" onclick="triggerPhysicsEffect('zeroG')">🪐 طفو حر</button>
        <button class="fx-btn" onclick="triggerPhysicsEffect('assemble')" style="background: ${config.nodeColor}; color: #000;">🎯 تشكيل الشعار</button>
      </div>
    </section>

    ${
      siteConfig.showFeatures
        ? `
    <!-- قسم المميزات (Features) -->
    <section id="features" class="features-section">
      <div class="features-grid">
        ${siteConfig.features
          .map(
            (f) => `
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>${f.title}</h3>
          <p>${f.desc}</p>
        </div>`
          )
          .join('')}
      </div>
    </section>`
        : ''
    }

    ${
      siteConfig.showStats
        ? `
    <!-- قسم الإحصائيات (Stats) -->
    <section id="stats" class="stats-section">
      <div class="stats-card">
        ${siteConfig.stats
          .map(
            (s) => `
        <div>
          <div class="stat-num">${s.value}</div>
          <div class="stat-label">${s.label}</div>
        </div>`
          )
          .join('')}
      </div>
    </section>`
        : ''
    }

    <!-- قسم صفحة Game التفاعلية -->
    <section id="game-section" style="max-width: 900px; margin: 40px auto 60px; padding: 32px 24px; border-radius: 28px; background: rgba(12, 18, 30, 0.85); border: 1px solid rgba(255, 255, 255, 0.12); backdrop-filter: blur(20px); text-align: center; box-shadow: 0 25px 60px rgba(0,0,0,0.5);">
      <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; background: ${config.nodeColor}22; color: ${config.nodeColor}; font-size: 12px; font-weight: 800; margin-bottom: 12px;">
        <span>🎮</span>
        <span>صفحة جيم (Game Zone)</span>
      </div>
      <h3 style="font-size: 26px; font-weight: 900; color: #fff; margin-bottom: 10px;">Plexus Cosmic Arcade Game</h3>
      <p style="font-size: 14px; color: #94a3b8; max-width: 540px; margin: 0 auto 24px;">العب الآن وتفاعل مع الجسيمات الكونية عبر نقرات الماوس أو اللمس، وأطلق نبضات الطاقة والإعصار الممتعة!</p>
      
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
        <button onclick="triggerPhysicsEffect('explode')" class="btn-primary" style="padding: 12px 22px;">💥 إطلاق انفجار النجوم</button>
        <button onclick="triggerPhysicsEffect('vortex')" class="btn-secondary" style="padding: 12px 22px;">🌀 تشغيل إعصار الفضاء</button>
        <button onclick="triggerPhysicsEffect('shockwave')" class="btn-secondary" style="padding: 12px 22px;">⚡ إطلاق نبضة الصعقة</button>
        <button onclick="triggerPhysicsEffect('assemble')" class="btn-primary" style="padding: 12px 22px; background: ${config.nodeColor}; color: #000;">🎯 تجميع الشعار الكوني</button>
      </div>
    </section>

    ${
      siteConfig.showFooter
        ? `
    <!-- الفوتر (Footer) -->
    <footer class="site-footer">
      <div>${siteConfig.siteName} — جميع الحقوق محفوظة © ${new Date().getFullYear()}</div>
      <div>مدعوم بشبكة الجسيمات الهندسية التفاعلية Plexus</div>
    </footer>`
        : ''
    }
  </div>

  <script>
    (function () {
      const canvas = document.getElementById('plexus-canvas');
      const ctx = canvas.getContext('2d');

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

      const mouse = {
        x: null,
        y: null,
        radius: CONFIG.mouseDistance
      };

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
          this.x += this.vx;
          this.y += this.vy;

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

          const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (currentSpeed > CONFIG.speed * 4) {
            this.vx = (this.vx / currentSpeed) * (CONFIG.speed * 4);
            this.vy = (this.vy / currentSpeed) * (CONFIG.speed * 4);
          }

          this.radius = this.baseRadius + Math.sin(time * 0.003 + this.pulseOffset) * 0.5;
        }

        draw(ctx) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, Math.max(1, this.radius), 0, Math.PI * 2);
          ctx.fillStyle = CONFIG.nodeColor;

          if (CONFIG.glowIntensity > 0) {
            ctx.shadowBlur = CONFIG.glowIntensity;
            ctx.shadowColor = CONFIG.nodeColor;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }
      }

      function drawBackgroundGrid() {
        if (!CONFIG.showGrid) return;
        ctx.save();
        ctx.strokeStyle = CONFIG.gridColor;
        ctx.lineWidth = 1;
        const size = CONFIG.gridSize;
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
        ctx.restore();
      }

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

      function animate(time) {
        ctx.clearRect(0, 0, width, height);
        drawBackgroundGrid();

        for (let i = 0; i < particles.length; i++) {
          particles[i].update(time);
        }

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
                      const alpha = (1 - avgDist / CONFIG.maxDistance) * 0.12;
                      ctx.beginPath();
                      ctx.moveTo(particles[i].x, particles[i].y);
                      ctx.lineTo(particles[j].x, particles[j].y);
                      ctx.lineTo(particles[k].x, particles[k].y);
                      ctx.closePath();
                      ctx.fillStyle = CONFIG.triangleFillColor;
                      ctx.globalAlpha = alpha;
                      ctx.fill();
                      ctx.globalAlpha = 1.0;
                    }
                  }
                }
              }
            }
          }
        }

        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.maxDistance) {
              const alpha = Math.pow(1 - dist / CONFIG.maxDistance, 1.4) * 0.75;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = CONFIG.lineColor;
              ctx.globalAlpha = alpha;
              ctx.stroke();
              ctx.globalAlpha = 1.0;
            }
          }
        }

        for (let i = 0; i < particles.length; i++) {
          particles[i].draw(ctx);
        }

        animationFrameId = requestAnimationFrame(animate);
      }

      // Physics Playground Trigger Method
      function triggerPhysicsEffect(type) {
        const centerX = width / 2;
        const centerY = height / 2;
        if (type === 'explode') {
          particles.forEach(p => {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.5;
            const force = (Math.random() * 20 + 12) * CONFIG.speed;
            p.vx = Math.cos(angle) * force;
            p.vy = Math.sin(angle) * force;
          });
        } else if (type === 'vortex') {
          particles.forEach(p => {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const angle = Math.atan2(dy, dx);
            p.vx = -Math.sin(angle) * 14 + (centerX - p.x) * 0.03;
            p.vy = Math.cos(angle) * 14 + (centerY - p.y) * 0.03;
          });
        } else if (type === 'shockwave') {
          particles.forEach(p => {
            const dx = p.x - centerX;
            const dy = p.y - centerY;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = Math.max(0, 1 - dist / (width * 0.6)) * 22;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          });
        } else if (type === 'zeroG') {
          particles.forEach(p => {
            p.vx = (Math.random() - 0.5) * 0.2;
            p.vy = (Math.random() - 0.5) * 0.2;
          });
        } else if (type === 'assemble') {
          particles.forEach(p => {
            p.vx *= 0.05;
            p.vy *= 0.05;
          });
        }
      }
      window.triggerPhysicsEffect = triggerPhysicsEffect;

      // Mouse & Click Handlers
      window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });

      window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });

      window.addEventListener('click', (e) => {
        // Spawn burst of 5 particles on click
        for (let k = 0; k < 5; k++) {
          const p = new Particle(particles.length, e.clientX, e.clientY);
          const angle = Math.random() * Math.PI * 2;
          const spd = Math.random() * 8 + 3;
          p.vx = Math.cos(angle) * spd;
          p.vy = Math.sin(angle) * spd;
          particles.push(p);
        }
        if (particles.length > CONFIG.particleCount + 50) {
          particles.splice(0, 5);
        }
      });

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

      window.addEventListener('resize', () => {
        init();
      });

      init();
      animationFrameId = requestAnimationFrame(animate);

${
  includePanel
    ? `
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

      const speedSlider = document.getElementById('ctrl-speed');
      if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
          CONFIG.speed = parseFloat(e.target.value);
          const valDisplay = document.getElementById('val-speed');
          if (valDisplay) valDisplay.textContent = CONFIG.speed.toFixed(1) + 'x';
        });
      }

      const distSlider = document.getElementById('ctrl-maxDistance');
      if (distSlider) {
        distSlider.addEventListener('input', (e) => {
          CONFIG.maxDistance = parseInt(e.target.value, 10);
          const valDisplay = document.getElementById('val-maxDistance');
          if (valDisplay) valDisplay.textContent = CONFIG.maxDistance + 'px';
        });
      }

      const sizeSlider = document.getElementById('ctrl-nodeSize');
      if (sizeSlider) {
        sizeSlider.addEventListener('input', (e) => {
          CONFIG.nodeSize = parseFloat(e.target.value);
          const valDisplay = document.getElementById('val-nodeSize');
          if (valDisplay) valDisplay.textContent = CONFIG.nodeSize + 'px';
        });
      }

      const formLogoCheck = document.getElementById('ctrl-formLogo');
      if (formLogoCheck) {
        formLogoCheck.addEventListener('change', (e) => {
          CONFIG.formLogoWithParticles = e.target.checked;
        });
      }

      const trianglesCheck = document.getElementById('ctrl-showTriangles');
      if (trianglesCheck) {
        trianglesCheck.addEventListener('change', (e) => {
          CONFIG.showTriangles = e.target.checked;
        });
      }

      const nodeColorPicker = document.getElementById('ctrl-nodeColor');
      if (nodeColorPicker) {
        nodeColorPicker.addEventListener('input', (e) => {
          CONFIG.nodeColor = e.target.value;
          CONFIG.lineColor = e.target.value;
          CONFIG.triangleFillColor = e.target.value;
        });
      }

      const bgColorPicker = document.getElementById('ctrl-bgColor');
      if (bgColorPicker) {
        bgColorPicker.addEventListener('input', (e) => {
          CONFIG.bgColor = e.target.value;
          document.body.style.backgroundColor = e.target.value;
        });
      }`
    : ''
}
    })();
  </script>
</body>
</html>`;
}
