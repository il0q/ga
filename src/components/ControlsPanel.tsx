import React, { useState } from 'react';
import { PlexusConfig, WebsiteConfig, PlaygroundEffectType } from '../types';
import { PRESETS } from '../data/presets';
import {
  Sliders,
  Sparkles,
  Grid,
  Zap,
  MousePointer,
  RotateCcw,
  Code,
  Palette,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  Upload,
  Eye,
  Trash2,
  X,
  Globe,
  Gamepad2,
  Layers,
  Download,
  Check,
  Flame,
  Atom,
  RefreshCw,
} from 'lucide-react';

interface ControlsPanelProps {
  config: PlexusConfig;
  onChange: (newConfig: PlexusConfig) => void;
  siteConfig: WebsiteConfig;
  onChangeSiteConfig: <K extends keyof WebsiteConfig>(key: K, value: WebsiteConfig[K]) => void;
  onTriggerEffect: (effect: PlaygroundEffectType) => void;
  onReset: () => void;
  onOpenCode: () => void;
  onDownloadFile: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  config,
  onChange,
  siteConfig,
  onChangeSiteConfig,
  onTriggerEffect,
  onReset,
  onOpenCode,
  onDownloadFile,
  isOpen,
  onToggleOpen,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [activeTab, setActiveTab] = useState<'play' | 'content' | 'theme' | 'logo'>('play');

  const update = (key: keyof PlexusConfig, value: any) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    onChange({
      ...config,
      ...preset.config,
    });
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        update('logoCustomUrl', result);
        update('showLogo', true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomLogo = () => {
    update('logoCustomUrl', undefined);
  };

  const primaryColor = config.nodeColor;

  return (
    <>
      {/* Drawer Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={onToggleOpen}
        />
      )}

      {/* Main Drawer Container */}
      <aside
        id="plexus-controls-panel"
        className={`fixed top-0 bottom-0 right-0 z-40 w-84 sm:w-96 bg-[#0c121d]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir="rtl"
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center border shadow-md"
              style={{
                backgroundColor: `${primaryColor}20`,
                borderColor: `${primaryColor}50`,
                color: primaryColor,
              }}
            >
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                لوحة تحكم وتخصيص موقعك
              </h2>
              <p className="text-[10px] text-slate-400">تحكم كامل بالمحتوى والحركة والألوان</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleFullscreen}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              title={isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggleOpen}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="إغلاق اللوحة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 p-2 gap-1 border-b border-white/10 bg-[#080d15]/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('play')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition-all ${
              activeTab === 'play'
                ? 'bg-white/10 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            style={activeTab === 'play' ? { color: primaryColor } : {}}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="text-[11px]">العب وجرب</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition-all ${
              activeTab === 'content'
                ? 'bg-white/10 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            style={activeTab === 'content' ? { color: primaryColor } : {}}
          >
            <Globe className="w-4 h-4" />
            <span className="text-[11px]">محتوى موقعك</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition-all ${
              activeTab === 'theme'
                ? 'bg-white/10 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            style={activeTab === 'theme' ? { color: primaryColor } : {}}
          >
            <Palette className="w-4 h-4" />
            <span className="text-[11px]">الألوان والثيم</span>
          </button>

          <button
            onClick={() => setActiveTab('logo')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center gap-1 transition-all ${
              activeTab === 'logo'
                ? 'bg-white/10 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            style={activeTab === 'logo' ? { color: primaryColor } : {}}
          >
            <ImageIcon className="w-4 h-4" />
            <span className="text-[11px]">الشعار</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-slate-200 text-xs">
          {/* TAB 1: PLAY & PHYSICS */}
          {activeTab === 'play' && (
            <div className="space-y-5">
              {/* Quick Launch Game Page */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-950/70 to-emerald-950/70 border border-teal-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>صفحة جيم (Game)</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-teal-500 text-slate-950 font-bold rounded-full">جديد</span>
                    </div>
                    <div className="text-[10px] text-teal-200/80">لعبة فضائية هندسية تفاعلية كاملة</div>
                  </div>
                </div>
                <button
                  onClick={() => onChangeSiteConfig('currentPage', siteConfig.currentPage === 'game' ? 'home' : 'game')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-all shadow-md active:scale-95 flex items-center gap-1"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>{siteConfig.currentPage === 'game' ? 'العودة للموقع' : 'فتح Game 🚀'}</span>
                </button>
              </div>

              {/* Fun Instant Physics Actions */}
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2 text-xs">
                    <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                    ألعاب وتأثيرات حركية فورية:
                  </span>
                  <span className="text-[10px] text-slate-400">انقر لتجربة الحركة</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onTriggerEffect('explode')}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
                    title="انفجار الجسيمات في الشاشة"
                  >
                    <span>💥 انفجار النجوم</span>
                  </button>

                  <button
                    onClick={() => onTriggerEffect('vortex')}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
                    title="دوامة إعصار دوار"
                  >
                    <span>🌀 دوامة الإعصار</span>
                  </button>

                  <button
                    onClick={() => onTriggerEffect('shockwave')}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
                    title="صعقة توهج قوية"
                  >
                    <span>⚡ صعقة البرق</span>
                  </button>

                  <button
                    onClick={() => onTriggerEffect('zeroG')}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white font-bold transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
                    title="طفو وانعدام جاذبية"
                  >
                    <span>🪐 انعدام الجاذبية</span>
                  </button>

                  <button
                    onClick={() => onTriggerEffect('assemble')}
                    className="col-span-2 p-2.5 rounded-xl text-slate-950 font-bold transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                    title="تشكيل الشعار فورا بالنقاط"
                  >
                    <Atom className="w-4 h-4" />
                    <span>🎯 تشكيل الشعار فوراً بالجسيمات</span>
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 text-center">
                  💡 تلميح: انقر بالماوس في أي مكان على الشاشة لتوليد حزم جسيمات جديدة!
                </p>
              </div>

              {/* Sliders: Particles, Speed, Distance */}
              <div className="space-y-4">
                {/* Particle Count */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">كثافة الجسيمات (Nodes):</span>
                    <span className="font-mono font-bold" style={{ color: primaryColor }}>
                      {config.particleCount}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="260"
                    step="5"
                    value={config.particleCount}
                    onChange={(e) => update('particleCount', parseInt(e.target.value, 10))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10"
                    style={{ accentColor: primaryColor }}
                  />
                </div>

                {/* Speed */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">سرعة تدفق الحركة:</span>
                    <span className="font-mono font-bold" style={{ color: primaryColor }}>
                      {config.speed.toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.5"
                    step="0.05"
                    value={config.speed}
                    onChange={(e) => update('speed', parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10"
                    style={{ accentColor: primaryColor }}
                  />
                </div>

                {/* Max Distance */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">مسافة تشابك الخطوط:</span>
                    <span className="font-mono font-bold" style={{ color: primaryColor }}>
                      {config.maxDistance}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="220"
                    step="5"
                    value={config.maxDistance}
                    onChange={(e) => update('maxDistance', parseInt(e.target.value, 10))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10"
                    style={{ accentColor: primaryColor }}
                  />
                </div>

                {/* Node Size */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">حجم النقاط المتوهجة:</span>
                    <span className="font-mono font-bold" style={{ color: primaryColor }}>
                      {config.nodeSize.toFixed(1)}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="0.5"
                    value={config.nodeSize}
                    onChange={(e) => update('nodeSize', parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10"
                    style={{ accentColor: primaryColor }}
                  />
                </div>
              </div>

              {/* Mouse Interaction Modes */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MousePointer className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                  تفاعل الفأرة واللمس:
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    onClick={() => update('mouseInteraction', 'connect_repel')}
                    className={`py-2 px-2 rounded-xl border transition-all ${
                      config.mouseInteraction === 'connect_repel'
                        ? 'bg-white/15 border-white/40 text-white font-bold'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    تنافر ودفع
                  </button>
                  <button
                    onClick={() => update('mouseInteraction', 'connect_attract')}
                    className={`py-2 px-2 rounded-xl border transition-all ${
                      config.mouseInteraction === 'connect_attract'
                        ? 'bg-white/15 border-white/40 text-white font-bold'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    جذب ومغناطيس
                  </button>
                  <button
                    onClick={() => update('mouseInteraction', 'connect_only')}
                    className={`py-2 px-2 rounded-xl border transition-all ${
                      config.mouseInteraction === 'connect_only'
                        ? 'bg-white/15 border-white/40 text-white font-bold'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                    }`}
                  >
                    شبكة فقط
                  </button>
                </div>
              </div>

              {/* Triangles and Grid Toggles */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <span className="text-xs text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
                    المثلثات الشبكية (Mesh Triangles)
                  </span>
                  <input
                    type="checkbox"
                    checked={config.showTriangles}
                    onChange={(e) => update('showTriangles', e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer"
                    style={{ accentColor: primaryColor }}
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                  <span className="text-xs text-slate-200 flex items-center gap-2">
                    <Grid className="w-4 h-4" style={{ color: primaryColor }} />
                    شبكة الخلفية الهندسية
                  </span>
                  <input
                    type="checkbox"
                    checked={config.showGrid}
                    onChange={(e) => update('showGrid', e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer"
                    style={{ accentColor: primaryColor }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: SITE CONTENT */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-xs font-bold text-white mb-1">تخصيص محتوى ونصوص موقعك:</h3>
                <p className="text-[11px] text-slate-400">
                  عدّل العناوين والنصوص لتظهر فوراً في المعاينة وفي كود الموقع المصدّر.
                </p>
              </div>

              {/* Site Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">اسم الموقع:</label>
                <input
                  type="text"
                  value={siteConfig.siteName}
                  onChange={(e) => onChangeSiteConfig('siteName', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-400"
                  placeholder="اسم موقعك أو شركتك"
                />
              </div>

              {/* Tagline */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">الوصف المختصر (Tagline):</label>
                <input
                  type="text"
                  value={siteConfig.tagline}
                  onChange={(e) => onChangeSiteConfig('tagline', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-400"
                  placeholder="منصة الحلول المستقبلية"
                />
              </div>

              {/* Hero Badge */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">الشارة الترويجية (Badge):</label>
                <input
                  type="text"
                  value={siteConfig.heroBadge}
                  onChange={(e) => onChangeSiteConfig('heroBadge', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-400"
                />
              </div>

              {/* Hero Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">العنوان الرئيسي (Hero Title):</label>
                <textarea
                  rows={2}
                  value={siteConfig.heroTitle}
                  onChange={(e) => onChangeSiteConfig('heroTitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-400"
                />
              </div>

              {/* Hero Subtitle */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">النص التعريفي (Subtitle):</label>
                <textarea
                  rows={3}
                  value={siteConfig.heroSubtitle}
                  onChange={(e) => onChangeSiteConfig('heroSubtitle', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-teal-400"
                />
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">نص الزر الأساسي:</label>
                  <input
                    type="text"
                    value={siteConfig.ctaPrimaryText}
                    onChange={(e) => onChangeSiteConfig('ctaPrimaryText', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">نص الزر الثانوي:</label>
                  <input
                    type="text"
                    value={siteConfig.ctaSecondaryText}
                    onChange={(e) => onChangeSiteConfig('ctaSecondaryText', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                  />
                </div>
              </div>

              {/* Section Visibility Toggles */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <h4 className="text-xs font-bold text-slate-300">إظهار وإخفاء أقسام الموقع:</h4>
                <label className="flex items-center justify-between p-2 rounded-lg bg-white/5 cursor-pointer">
                  <span>شريط التنقل العلوي (Navbar)</span>
                  <input
                    type="checkbox"
                    checked={siteConfig.showNavbar}
                    onChange={(e) => onChangeSiteConfig('showNavbar', e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: primaryColor }}
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-lg bg-white/5 cursor-pointer">
                  <span>قسم المميزات والخدمات (Features)</span>
                  <input
                    type="checkbox"
                    checked={siteConfig.showFeatures}
                    onChange={(e) => onChangeSiteConfig('showFeatures', e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: primaryColor }}
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-lg bg-white/5 cursor-pointer">
                  <span>قسم الأرقام والإحصائيات (Stats)</span>
                  <input
                    type="checkbox"
                    checked={siteConfig.showStats}
                    onChange={(e) => onChangeSiteConfig('showStats', e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: primaryColor }}
                  />
                </label>
                <label className="flex items-center justify-between p-2 rounded-lg bg-white/5 cursor-pointer">
                  <span>تذييل الموقع (Footer)</span>
                  <input
                    type="checkbox"
                    checked={siteConfig.showFooter}
                    onChange={(e) => onChangeSiteConfig('showFooter', e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: primaryColor }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: THEMES & STYLING */}
          {activeTab === 'theme' && (
            <div className="space-y-5">
              {/* Presets */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                  الثيمات الجاهزة بنقرة واحدة:
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {PRESETS.map((preset) => {
                    const isSelected =
                      config.nodeColor === preset.config.nodeColor &&
                      config.bgColor === preset.config.bgColor;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset.id)}
                        className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                          isSelected
                            ? 'bg-white/15 border-white/40 text-white font-bold'
                            : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
                            style={{ backgroundColor: preset.config.nodeColor }}
                          />
                          {preset.nameAr}
                        </span>
                        {isSelected && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                          >
                            محدد
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <label className="text-xs font-semibold text-slate-300">تخصيص الألوان يدوياً:</label>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                    <span className="text-[11px] text-slate-400 block">لون الجسيمات والخطوط</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.nodeColor}
                        onChange={(e) => {
                          update('nodeColor', e.target.value);
                          update('lineColor', e.target.value);
                          update('triangleFillColor', e.target.value);
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="font-mono text-xs">{config.nodeColor}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                    <span className="text-[11px] text-slate-400 block">لون خلفية الموقع</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.bgColor}
                        onChange={(e) => update('bgColor', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <span className="font-mono text-xs">{config.bgColor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LOGO & FORMATION */}
          {activeTab === 'logo' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-xs font-bold text-white mb-1">الشعار واصطفاف الجسيمات:</h3>
                <p className="text-[11px] text-slate-400">
                  تتجمع الجسيمات والخطوط لتشكل ملامح الشعار في قلب موقعك.
                </p>
              </div>

              {/* Show Logo */}
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer">
                <span className="text-xs text-slate-200">إظهار الشعار في الخلفية</span>
                <input
                  type="checkbox"
                  checked={config.showLogo}
                  onChange={(e) => update('showLogo', e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: primaryColor }}
                />
              </label>

              {/* Form Logo With Particles */}
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer">
                <div>
                  <span className="text-xs text-slate-200 block font-semibold">
                    تشكيل الشعار بالجسيمات
                  </span>
                  <span className="text-[10px] text-slate-400">
                    تنجذب النقاط لرسم الشعار في الخلفية
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.formLogoWithParticles}
                  onChange={(e) => update('formLogoWithParticles', e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: primaryColor }}
                />
              </label>

              {/* Logo Forming Strength */}
              {config.formLogoWithParticles && (
                <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-300">قوة انجذاب النقاط للشعار:</span>
                    <span className="font-mono font-bold" style={{ color: primaryColor }}>
                      {Math.round(config.logoFormingStrength * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1"
                    step="0.05"
                    value={config.logoFormingStrength}
                    onChange={(e) => update('logoFormingStrength', parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10"
                    style={{ accentColor: primaryColor }}
                  />
                </div>
              )}

              {/* Logo Size */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">حجم الشعار:</span>
                  <span className="font-mono font-bold" style={{ color: primaryColor }}>
                    {config.logoSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="180"
                  max="550"
                  step="10"
                  value={config.logoSize}
                  onChange={(e) => update('logoSize', parseInt(e.target.value, 10))}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10"
                  style={{ accentColor: primaryColor }}
                />
              </div>

              {/* Upload Custom Logo */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-xs font-semibold text-slate-300 block">
                  رفع شعار خاص من جهازك (SVG أو PNG):
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 px-3 py-2.5 rounded-xl border border-dashed border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 cursor-pointer transition-all flex items-center justify-center gap-2 text-xs font-semibold text-slate-200">
                    <Upload className="w-4 h-4" />
                    <span>اختر ملف الشعار</span>
                    <input
                      type="file"
                      accept="image/png,image/svg+xml,image/jpeg,image/webp"
                      onChange={handleCustomLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {config.logoCustomUrl && (
                    <button
                      onClick={handleRemoveCustomLogo}
                      className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400"
                      title="حذف الشعار المخصص"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel Footer / Direct Export */}
        <div className="p-4 border-t border-white/10 bg-[#080d15]/80 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onDownloadFile}
              className="px-3 py-2.5 rounded-xl text-xs font-bold text-slate-950 flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              style={{ backgroundColor: primaryColor }}
            >
              <Download className="w-4 h-4" />
              <span>تحميل الموقع HTML</span>
            </button>

            <button
              onClick={onOpenCode}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center gap-1.5 transition-all"
            >
              <Code className="w-4 h-4" />
              <span>كود الموقع</span>
            </button>
          </div>

          <button
            onClick={onReset}
            className="w-full py-1.5 text-[11px] text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>استعادة الإعدادات الافتراضية</span>
          </button>
        </div>
      </aside>
    </>
  );
};
