import React from 'react';
import { PlexusConfig } from '../types';
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
} from 'lucide-react';

interface ControlsPanelProps {
  config: PlexusConfig;
  onChange: (newConfig: PlexusConfig) => void;
  onReset: () => void;
  onOpenCode: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  config,
  onChange,
  onReset,
  onOpenCode,
  isOpen,
  onToggleOpen,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const update = (key: keyof PlexusConfig, value: any) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const applyPreset = (presetId: string) => {
    const found = PRESETS.find((p) => p.id === presetId);
    if (found) {
      onChange({
        ...config,
        ...found.config,
      });
    }
  };

  return (
    <>
      {/* Toggle button on the screen */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2" dir="rtl">
        <button
          id="toggle-controls-btn"
          onClick={onToggleOpen}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 backdrop-blur-md transition-all border ${
            isOpen
              ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-lg shadow-teal-500/20'
              : 'bg-[#121824]/90 text-white border-white/10 hover:bg-[#182030] hover:border-teal-500/40'
          }`}
        >
          <Sliders className="w-4 h-4 text-current" />
          <span>{isOpen ? 'إخفاء لوحة التحكم ✕' : 'لوحة التحكم الكاملة ⚙️'}</span>
        </button>

        <button
          id="quick-open-html-code-btn"
          onClick={onOpenCode}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-teal-500/25 transition-transform active:scale-95"
        >
          <Code className="w-4 h-4" />
          <span>تصدير كود HTML لموقعك</span>
        </button>

        <button
          id="fullscreen-toggle-btn"
          onClick={onToggleFullscreen}
          className="p-2 rounded-xl bg-[#121824]/80 hover:bg-[#182030] text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors"
          title={isFullscreen ? 'خروج من ملء الشاشة' : 'ملء الشاشة'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Slide-out Sidebar for Customization */}
      {isOpen && (
        <aside
          id="controls-panel-sidebar"
          className="fixed top-0 right-0 h-full w-80 sm:w-96 z-30 bg-[#0f1520]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl p-5 overflow-y-auto flex flex-col gap-5 text-right transition-all"
          dir="rtl"
        >
          <div className="pt-14 pb-2 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                لوحة التحكم الكاملة لموقعك
              </h3>
              <p className="text-xs text-slate-400">تحكم بجميع خصائص الحركة والشعار</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onReset}
                className="p-1.5 text-xs text-slate-400 hover:text-teal-400 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1"
                title="إعادة لضبط الفيديو الأصلي"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط</span>
              </button>
              <button
                onClick={onToggleOpen}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="إغلاق اللوحة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Theme Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-teal-400" />
              القوالب الجاهزة
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {PRESETS.map((preset) => {
                const isSelected =
                  config.nodeColor.toLowerCase() === (preset.config.nodeColor?.toLowerCase() || '');
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-500/50 text-white font-bold'
                        : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: preset.config.nodeColor }}
                      />
                      {preset.nameAr}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full">
                        محدد
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders Section */}
          <div className="space-y-4 pt-2 border-t border-white/5">
            {/* Particle Count */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">عدد الجسيمات (Nodes):</span>
                <span className="font-mono text-teal-400 font-bold">{config.particleCount}</span>
              </div>
              <input
                type="range"
                min="30"
                max="260"
                step="5"
                value={config.particleCount}
                onChange={(e) => update('particleCount', Number(e.target.value))}
                className="w-full accent-teal-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Connection Distance */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">مسافة تشكل الروابط:</span>
                <span className="font-mono text-teal-400 font-bold">{config.maxDistance}px</span>
              </div>
              <input
                type="range"
                min="60"
                max="240"
                step="5"
                value={config.maxDistance}
                onChange={(e) => update('maxDistance', Number(e.target.value))}
                className="w-full accent-teal-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Drift Speed */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">سرعة تدفق الحركة:</span>
                <span className="font-mono text-teal-400 font-bold">{config.speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={config.speed}
                onChange={(e) => update('speed', Number(e.target.value))}
                className="w-full accent-teal-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Node Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">حجم النقاط المتوهجة:</span>
                <span className="font-mono text-teal-400 font-bold">{config.nodeSize}px</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="6"
                step="0.5"
                value={config.nodeSize}
                onChange={(e) => update('nodeSize', Number(e.target.value))}
                className="w-full accent-teal-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Glow Intensity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">شدة التوهج (Glow):</span>
                <span className="font-mono text-teal-400 font-bold">{config.glowIntensity}</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={config.glowIntensity}
                onChange={(e) => update('glowIntensity', Number(e.target.value))}
                className="w-full accent-teal-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Integrated Background Logo Section */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                دمج الشعار في الخلفية (Logo)
              </label>
              <input
                type="checkbox"
                checked={config.showLogo}
                onChange={(e) => update('showLogo', e.target.checked)}
                className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
              />
            </div>

            {config.showLogo && (
              <div className="space-y-2.5 p-3 rounded-xl bg-teal-500/5 border border-teal-500/20 text-xs">
                {/* Logo Opacity */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">شفافية الشعار (Opacity):</span>
                    <span className="font-mono text-teal-400 font-bold">
                      {Math.round(config.logoOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.9"
                    step="0.05"
                    value={config.logoOpacity}
                    onChange={(e) => update('logoOpacity', Number(e.target.value))}
                    className="w-full accent-teal-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Logo Size */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300">حجم الشعار:</span>
                    <span className="font-mono text-teal-400 font-bold">{config.logoSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="650"
                    step="10"
                    value={config.logoSize}
                    onChange={(e) => update('logoSize', Number(e.target.value))}
                    className="w-full accent-teal-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Glow & Blend Options */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-300 text-[11px]">توهج نيون محيطي للشعار:</span>
                  <input
                    type="checkbox"
                    checked={config.logoGlow}
                    onChange={(e) => update('logoGlow', e.target.checked)}
                    className="w-3.5 h-3.5 accent-teal-500 rounded cursor-pointer"
                  />
                </div>

                {/* Blend Mode */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-300 text-[11px]">نمط المزج (Blend Mode):</span>
                  <select
                    value={config.logoBlendMode || 'screen'}
                    onChange={(e) => update('logoBlendMode', e.target.value as any)}
                    className="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-[11px] text-teal-300 focus:outline-none"
                  >
                    <option value="screen">Screen (إزالة الخلفية البيضاء/الدمج)</option>
                    <option value="normal">Normal (الصورة الأصلية كما هي)</option>
                    <option value="overlay">Overlay (تداخل لوني)</option>
                    <option value="luminosity">Luminosity (إضاءة نقية)</option>
                  </select>
                </div>

                {/* Logo Particle Formation Toggle & Strength */}
                <div className="pt-2 border-t border-teal-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-300 text-xs font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      اصطفاف وتشكّل النقاط على هيئة الشعار
                    </span>
                    <input
                      type="checkbox"
                      checked={config.formLogoWithParticles}
                      onChange={(e) => update('formLogoWithParticles', e.target.checked)}
                      className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
                    />
                  </div>

                  {config.formLogoWithParticles && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300">قوة انجذاب النقاط لتحديد الشعار:</span>
                        <span className="font-mono text-teal-400 font-bold">
                          {Math.round((config.logoFormingStrength || 0.85) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="1"
                        step="0.05"
                        value={config.logoFormingStrength || 0.85}
                        onChange={(e) => update('logoFormingStrength', Number(e.target.value))}
                        className="w-full accent-teal-500 bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Upload custom logo or use the botanical one */}
                <div className="pt-2 border-t border-teal-500/20 flex items-center justify-between gap-2">
                  <label className="flex-1 py-1.5 px-2.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-medium text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                    <Upload className="w-3 h-3" />
                    <span>{config.logoCustomUrl ? 'تغيير الشعار المرفوع' : 'رفع صورة شعارك الخاصة'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            update('logoCustomUrl', reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {config.logoCustomUrl && (
                    <button
                      onClick={() => update('logoCustomUrl', undefined)}
                      className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
                      title="العودة للشعار النباتي الأصلي"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-white/5">
            {/* Show Triangles (Mesh Faces) */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
              <span className="text-xs text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                المثلثات الشبكية (كما في الفيديو)
              </span>
              <input
                type="checkbox"
                checked={config.showTriangles}
                onChange={(e) => update('showTriangles', e.target.checked)}
                className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
              />
            </label>

            {/* Show Technical Grid */}
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors">
              <span className="text-xs text-slate-200 flex items-center gap-2">
                <Grid className="w-4 h-4 text-teal-400" />
                شبكة الخلفية الهندسية
              </span>
              <input
                type="checkbox"
                checked={config.showGrid}
                onChange={(e) => update('showGrid', e.target.checked)}
                className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Mouse interaction mode */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MousePointer className="w-3.5 h-3.5 text-teal-400" />
              تفاعل الفأرة
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                onClick={() => update('mouseInteraction', 'connect_repel')}
                className={`py-1.5 px-2 rounded-lg border transition-all ${
                  config.mouseInteraction === 'connect_repel'
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 font-bold'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                ابتعاد وتنافر (افتراضي)
              </button>
              <button
                onClick={() => update('mouseInteraction', 'connect_attract')}
                className={`py-1.5 px-2 rounded-lg border transition-all ${
                  config.mouseInteraction === 'connect_attract'
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 font-bold'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                انجذاب
              </button>
              <button
                onClick={() => update('mouseInteraction', 'connect_only')}
                className={`py-1.5 px-2 rounded-lg border transition-all ${
                  config.mouseInteraction === 'connect_only'
                    ? 'bg-teal-500/20 border-teal-500/50 text-teal-300 font-bold'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                ثبات
              </button>
            </div>
          </div>

          {/* Colors Customization */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <label className="text-xs font-semibold text-slate-300">تخصيص الألوان الدقيقة</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                <span className="text-slate-400">لون الجسيمات والخطوط:</span>
                <input
                  type="color"
                  value={config.nodeColor}
                  onChange={(e) => {
                    update('nodeColor', e.target.value);
                    update('lineColor', e.target.value);
                    update('triangleFillColor', e.target.value);
                  }}
                  className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                />
              </div>
              <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                <span className="text-slate-400">لون تعبئة المثلث:</span>
                <input
                  type="color"
                  value={config.triangleFillColor.startsWith('#') ? config.triangleFillColor : '#f59e0b'}
                  onChange={(e) => update('triangleFillColor', e.target.value)}
                  className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                />
              </div>
              <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between col-span-2">
                <span className="text-slate-400">لون الخلفية:</span>
                <input
                  type="color"
                  value={config.bgColor}
                  onChange={(e) => update('bgColor', e.target.value)}
                  className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Action button in drawer bottom */}
          <div className="mt-auto pt-4 border-t border-white/10">
            <button
              id="drawer-export-html-btn"
              onClick={onOpenCode}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-transform active:scale-95"
            >
              <Code className="w-4 h-4" />
              <span>نسخ وتصدير كود HTML المتكامل لموقعك</span>
            </button>
          </div>
        </aside>
      )}
    </>
  );
};
