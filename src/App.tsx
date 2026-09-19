import React, { useState, useEffect } from 'react';
import { PlexusConfig, WebsiteConfig, PlaygroundEffectType } from './types';
import { DEFAULT_CONFIG, DEFAULT_WEBSITE_CONFIG } from './data/presets';
import { PlexusCanvas } from './components/PlexusCanvas';
import { LogoBackdrop } from './components/LogoBackdrop';
import { ControlsPanel } from './components/ControlsPanel';
import { WebsitePreview } from './components/WebsitePreview';
import { GamePage } from './components/GamePage';
import { CodeExportModal } from './components/CodeExportModal';
import {
  Code,
  Download,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Gamepad2,
  Globe,
} from 'lucide-react';
import { generateStandaloneHtml } from './utils/generateHtmlCode';

export default function App() {
  const [config, setConfig] = useState<PlexusConfig>(DEFAULT_CONFIG);
  const [siteConfig, setSiteConfig] = useState<WebsiteConfig>(DEFAULT_WEBSITE_CONFIG);
  const [effectTrigger, setEffectTrigger] = useState<{
    type: PlaygroundEffectType;
    timestamp: number;
  } | null>(null);

  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [quickCopied, setQuickCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Trigger physics animation on canvas
  const handleTriggerEffect = (effect: PlaygroundEffectType) => {
    setEffectTrigger({ type: effect, timestamp: Date.now() });
  };

  // Update website configuration
  const handleUpdateSiteConfig = <K extends keyof WebsiteConfig>(
    key: K,
    value: WebsiteConfig[K]
  ) => {
    setSiteConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Quick copy of standalone HTML
  const handleQuickCopyHtml = () => {
    const code = generateStandaloneHtml(config, siteConfig);
    navigator.clipboard.writeText(code);
    setQuickCopied(true);
    setTimeout(() => setQuickCopied(false), 2500);
  };

  // Direct download of index.html
  const handleDownloadFile = () => {
    const code = generateStandaloneHtml(config, siteConfig);
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render current active page (Home or Game)
  const renderCurrentView = () => {
    if (siteConfig.currentPage === 'game') {
      return (
        <GamePage
          siteConfig={siteConfig}
          plexusConfig={config}
          onNavigate={(p) => handleUpdateSiteConfig('currentPage', p)}
          onOpenControls={() => setIsControlsOpen(true)}
        />
      );
    }
    return (
      <WebsitePreview
        siteConfig={siteConfig}
        plexusConfig={config}
        onUpdateSiteConfig={handleUpdateSiteConfig}
        onTriggerEffect={handleTriggerEffect}
        onOpenControls={() => setIsControlsOpen(true)}
        onNavigate={(p) => handleUpdateSiteConfig('currentPage', p)}
      />
    );
  };

  return (
    <div
      id="plexus-app-root"
      className="relative w-screen h-screen overflow-hidden select-none font-sans"
      style={{ backgroundColor: config.bgColor }}
      dir="rtl"
    >
      {/* 1. Central Integrated Botanical Logo Backdrop */}
      <LogoBackdrop config={config} />

      {/* 2. Background Interactive Plexus Canvas with Physics Engine */}
      <PlexusCanvas config={config} effectTrigger={effectTrigger} />

      {/* 3. Floating Studio Header / Bar */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2.5 bg-[#090d16]/85 backdrop-blur-xl border-b border-white/10 shadow-lg pointer-events-auto">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center border shadow-sm transition-transform hover:scale-105"
            style={{
              backgroundColor: `${config.nodeColor}25`,
              borderColor: `${config.nodeColor}70`,
              color: config.nodeColor,
            }}
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white tracking-wide">
                {siteConfig.siteName}
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                style={{
                  backgroundColor: `${config.nodeColor}20`,
                  color: config.nodeColor,
                }}
              >
                لوحة التحكم الحية
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline-block">
              {siteConfig.tagline}
            </span>
          </div>
        </div>

        {/* Center: Page Tabs Switcher (الرئيسية vs Game) & Device View Switcher */}
        <div className="flex items-center gap-2">
          {/* Main Website Page Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/50 border border-white/10">
            <button
              onClick={() => handleUpdateSiteConfig('currentPage', 'home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                siteConfig.currentPage !== 'game'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </button>

            <button
              onClick={() => handleUpdateSiteConfig('currentPage', 'game')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 relative ${
                siteConfig.currentPage === 'game'
                  ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-300 hover:text-white bg-white/5'
              }`}
              title="الانتقال إلى صفحة Game الجديدة"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Game (جيم)</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
            </button>
          </div>

          {/* Device View Mode Switcher */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10">
            <button
              onClick={() => handleUpdateSiteConfig('deviceView', 'desktop')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                siteConfig.deviceView === 'desktop'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="معاينة شاشة سطح المكتب"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">كمبيوتر</span>
            </button>

            <button
              onClick={() => handleUpdateSiteConfig('deviceView', 'tablet')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                siteConfig.deviceView === 'tablet'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="معاينة شاشة التابلت"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">تابلت</span>
            </button>

            <button
              onClick={() => handleUpdateSiteConfig('deviceView', 'mobile')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                siteConfig.deviceView === 'mobile'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="معاينة شاشة الهاتف المحمول"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">جوال</span>
            </button>

            <button
              onClick={() => handleUpdateSiteConfig('deviceView', 'fullscreen')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                siteConfig.deviceView === 'fullscreen'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="عرض الخلفية الكونية فقط بدون محتوى"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">خلفية فقط</span>
            </button>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Physics Play Buttons in Studio Bar */}
          <div className="hidden xl:flex items-center gap-1 px-2 py-1 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[11px] font-bold text-slate-400 ml-1">🎮 العب:</span>
            <button
              onClick={() => handleTriggerEffect('explode')}
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-amber-300 hover:bg-white/10 transition-colors"
              title="انفجار الجسيمات"
            >
              💥 انفجار
            </button>
            <button
              onClick={() => handleTriggerEffect('vortex')}
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-cyan-300 hover:bg-white/10 transition-colors"
              title="دوامة حلزونية"
            >
              🌀 إعصار
            </button>
            <button
              onClick={() => handleTriggerEffect('shockwave')}
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-violet-300 hover:bg-white/10 transition-colors"
              title="صعقة التوهج"
            >
              ⚡ صعقة
            </button>
          </div>

          {/* Quick Copy HTML */}
          <button
            id="quick-copy-header-btn"
            onClick={handleQuickCopyHtml}
            className={`hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-bold transition-all items-center gap-1.5 active:scale-95 shadow-sm ${
              quickCopied
                ? 'bg-emerald-500 text-white'
                : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
            }`}
            title="نسخ كود HTML الكامل لموقعك"
          >
            {quickCopied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                تم النسخ!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-teal-400" />
                نسخ HTML
              </>
            )}
          </button>

          {/* Download index.html */}
          <button
            onClick={handleDownloadFile}
            className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-all items-center gap-1.5 active:scale-95 shadow-sm"
            title="تحميل كود موقعك الكامل كملف index.html"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            تحميل الموقع
          </button>

          {/* Code Export Modal Trigger */}
          <button
            id="view-code-btn"
            onClick={() => setIsCodeModalOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-all flex items-center gap-1.5 active:scale-95"
            title="تصدير كود الموقع"
          >
            <Code className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden xs:inline">الكود</span>
          </button>

          {/* Main Control Panel Toggle Button */}
          <button
            id="main-control-panel-toggle"
            onClick={() => setIsControlsOpen((prev) => !prev)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 shadow-lg border ${
              isControlsOpen
                ? 'bg-teal-500 text-slate-950 border-teal-300 shadow-teal-500/25'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{isControlsOpen ? 'إغلاق لوحة التحكم ✕' : '⚙️ لوحة التحكم لموقعي'}</span>
          </button>
        </div>
      </header>

      {/* 4. Active Website Canvas / Frame Area */}
      <main className="relative w-full h-full pt-14 overflow-hidden">
        {siteConfig.deviceView === 'desktop' && (
          <div className="relative z-10 w-full h-[calc(100vh-56px)] overflow-y-auto">
            {renderCurrentView()}
          </div>
        )}

        {siteConfig.deviceView === 'tablet' && (
          <div className="relative z-10 w-full h-[calc(100vh-56px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="w-full max-w-3xl h-full max-h-[88vh] bg-[#0c121e]/85 backdrop-blur-2xl rounded-3xl border-4 border-slate-700/60 shadow-2xl overflow-y-auto relative flex flex-col">
              {renderCurrentView()}
            </div>
          </div>
        )}

        {siteConfig.deviceView === 'mobile' && (
          <div className="relative z-10 w-full h-[calc(100vh-56px)] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div className="w-full max-w-sm h-full max-h-[85vh] bg-[#0c121e]/85 backdrop-blur-2xl rounded-[40px] border-4 border-slate-700/60 shadow-2xl overflow-y-auto relative flex flex-col">
              {/* Phone speaker notch */}
              <div className="sticky top-2 left-1/2 -translate-x-1/2 z-50 w-28 h-4 bg-black/80 rounded-full mx-auto mb-1 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-white/10" />
              </div>
              {renderCurrentView()}
            </div>
          </div>
        )}

        {siteConfig.deviceView === 'fullscreen' && (
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-12 pointer-events-none">
            <div className="pointer-events-auto p-4 rounded-2xl bg-[#0f1520]/80 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center gap-3">
              <span className="text-xs text-slate-300 font-medium">
                🌌 وضع الخلفية النقية — حرك مؤشر الفأرة أو المس الشاشة لتفاعل الجسيمات
              </span>
              <button
                onClick={() => handleUpdateSiteConfig('deviceView', 'desktop')}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-all shadow-sm"
              >
                إظهار موقعك
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 5. Comprehensive Interactive Controls Panel (Drawer) */}
      <ControlsPanel
        config={config}
        onChange={setConfig}
        siteConfig={siteConfig}
        onChangeSiteConfig={handleUpdateSiteConfig}
        onTriggerEffect={handleTriggerEffect}
        onReset={() => {
          setConfig(DEFAULT_CONFIG);
          setSiteConfig(DEFAULT_WEBSITE_CONFIG);
        }}
        onOpenCode={() => setIsCodeModalOpen(true)}
        onDownloadFile={handleDownloadFile}
        isOpen={isControlsOpen}
        onToggleOpen={() => setIsControlsOpen((prev) => !prev)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* 6. Code Export Modal */}
      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        config={config}
        siteConfig={siteConfig}
      />
    </div>
  );
}
