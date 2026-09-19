import React, { useState, useEffect } from 'react';
import { PlexusConfig } from './types';
import { DEFAULT_CONFIG } from './data/presets';
import { PlexusCanvas } from './components/PlexusCanvas';
import { LogoBackdrop } from './components/LogoBackdrop';
import { ControlsPanel } from './components/ControlsPanel';
import { CodeExportModal } from './components/CodeExportModal';
import {
  Code,
  Download,
  Copy,
  Check,
  Sparkles,
  MousePointerClick,
  Share2,
  Upload,
} from 'lucide-react';
import { generateStandaloneHtml } from './utils/generateHtmlCode';

export default function App() {
  const [config, setConfig] = useState<PlexusConfig>(DEFAULT_CONFIG);
  const [isControlsOpen, setIsControlsOpen] = useState(true);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [quickCopied, setQuickCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Fast direct copy of HTML
  const handleQuickCopyHtml = () => {
    const code = generateStandaloneHtml(config);
    navigator.clipboard.writeText(code);
    setQuickCopied(true);
    setTimeout(() => setQuickCopied(false), 2500);
  };

  // Direct download of index.html
  const handleDownloadFile = () => {
    const code = generateStandaloneHtml(config);
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plexus-animation.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="plexus-app-root"
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{ backgroundColor: config.bgColor }}
    >
      {/* Central Integrated Botanical Logo Backdrop */}
      <LogoBackdrop config={config} />

      {/* Background Interactive Plexus Canvas */}
      <PlexusCanvas config={config} />

      {/* Floating Top Left Brand / Status */}
      <header
        className="fixed top-4 left-4 z-20 flex items-center gap-3 pointer-events-auto"
        dir="ltr"
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0f1520]/80 border border-white/10 backdrop-blur-md shadow-lg">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
            style={{ backgroundColor: config.nodeColor }}
          />
          <span className="text-xs font-bold text-white tracking-wide">
            Plexus HTML Generator
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
            {config.particleCount} nodes
          </span>
        </div>
      </header>

      {/* Interactive Controls Panel (Right Side) */}
      <ControlsPanel
        config={config}
        onChange={setConfig}
        onReset={() => setConfig(DEFAULT_CONFIG)}
        onOpenCode={() => setIsCodeModalOpen(true)}
        isOpen={isControlsOpen}
        onToggleOpen={() => setIsControlsOpen((prev) => !prev)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Bottom Center Floating Quick Actions & Explanatory Card */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-xl pointer-events-auto text-center"
        dir="rtl"
      >
        <div className="p-4 rounded-2xl bg-[#0f1520]/90 border border-white/10 backdrop-blur-xl shadow-2xl space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="text-right">
              <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-400" />
                الحركة الهندسية التفاعلية مع الشعار المدمج
              </h1>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MousePointerClick className="w-3.5 h-3.5 text-teal-400/80" />
                الشعار مدمج في الخلفية وشبكة الجسيمات تبتعد عن الماوس بانسيابية
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="quick-copy-bottom-btn"
                onClick={handleQuickCopyHtml}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-md ${
                  quickCopied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/20'
                }`}
                title="نسخ كود HTML الكامل بنقرة واحدة"
              >
                {quickCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    تم النسخ!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    نسخ كود HTML
                  </>
                )}
              </button>

              <label
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-teal-300 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                title="رفع ملف الشعار الأصلي بدقة 100%"
              >
                <Upload className="w-3.5 h-3.5 text-teal-300" />
                <span>{config.logoCustomUrl ? 'تغيير صورة الشعار' : 'رفع ملف الشعار الأصلي'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setConfig((prev) => ({
                          ...prev,
                          showLogo: true,
                          logoCustomUrl: reader.result as string,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              <button
                id="open-controls-bottom-btn"
                onClick={() => setIsControlsOpen((prev) => !prev)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border active:scale-95 ${
                  isControlsOpen
                    ? 'bg-teal-500 text-slate-950 border-teal-400'
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                }`}
                title="فتح لوحة التحكم الكاملة"
              >
                <span>{isControlsOpen ? 'إخفاء لوحة التحكم ✕' : '⚙️ فتح لوحة التحكم'}</span>
              </button>

              <button
                id="view-code-bottom-btn"
                onClick={() => setIsCodeModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <Code className="w-3.5 h-3.5 text-teal-400" />
                تصدير كود الموقع HTML
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Code Export Modal with tabs, copy, and download */}
      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        config={config}
      />
    </div>
  );
}
