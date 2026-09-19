import React from 'react';
import { WebsiteConfig, PlexusConfig } from '../types';
import {
  Cpu,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Layers,
  Star,
  Activity,
  CheckCircle2,
  Gamepad2,
} from 'lucide-react';

interface WebsitePreviewProps {
  siteConfig: WebsiteConfig;
  plexusConfig: PlexusConfig;
  onUpdateSiteConfig: <K extends keyof WebsiteConfig>(key: K, value: WebsiteConfig[K]) => void;
  onTriggerEffect: (effect: 'explode' | 'vortex' | 'shockwave' | 'zeroG' | 'assemble') => void;
  onOpenControls: () => void;
  onNavigate?: (page: 'home' | 'game') => void;
}

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({
  siteConfig,
  plexusConfig,
  onUpdateSiteConfig,
  onTriggerEffect,
  onOpenControls,
  onNavigate,
}) => {
  const primaryColor = plexusConfig.nodeColor;

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-6 h-6" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'Zap':
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden text-slate-100 scrollbar-thin scrollbar-thumb-white/10 scroll-smooth">
      {/* 1. Header / Navbar */}
      {siteConfig.showNavbar && (
        <header className="sticky top-0 z-30 w-full px-6 py-4 transition-all backdrop-blur-md bg-black/20 border-b border-white/10">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg transition-transform hover:scale-105"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  borderColor: `${primaryColor}60`,
                  color: primaryColor,
                }}
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  {siteConfig.siteName}
                </h1>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {siteConfig.tagline}
                </p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
              <a href="#hero" className="hover:text-white transition-colors">
                الرئيسية
              </a>
              {/* New Game Page Link */}
              <button
                onClick={() => onNavigate && onNavigate('game')}
                className="hover:text-white transition-all flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 shadow-sm"
                title="فتح صفحة Game الجديدة"
              >
                <Gamepad2 className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span className="font-bold text-white">Game</span>
                <span
                  className="text-[9px] px-1.5 py-0.2 rounded-full font-black text-slate-950"
                  style={{ backgroundColor: primaryColor }}
                >
                  جديد
                </span>
              </button>
              {siteConfig.showFeatures && (
                <a href="#features" className="hover:text-white transition-colors">
                  المميزات
                </a>
              )}
              {siteConfig.showStats && (
                <a href="#stats" className="hover:text-white transition-colors">
                  الإحصائيات
                </a>
              )}
              <a href="#playground" className="hover:text-white transition-colors flex items-center gap-1">
                <span>منطقة اللعب</span>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                  style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
                >
                  حي
                </span>
              </a>
            </nav>

            {/* CTA in Navbar */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenControls}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5"
                style={{
                  backgroundColor: `${primaryColor}18`,
                  borderColor: `${primaryColor}50`,
                  color: primaryColor,
                }}
                title="تخصيص هذا الموقع"
              >
                <span>⚙️ خصص موقعك</span>
              </button>
              <button
                className="hidden sm:inline-flex px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 transition-all shadow-md active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                {siteConfig.ctaPrimaryText}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* 2. Hero Section */}
      <section
        id="hero"
        className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-4 pt-12 pb-16 max-w-5xl mx-auto z-10"
      >
        {/* Interactive Badge */}
        {siteConfig.heroBadge && (
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border shadow-lg backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: `${primaryColor}15`,
              borderColor: `${primaryColor}40`,
              color: primaryColor,
            }}
            onClick={() => onTriggerEffect('shockwave')}
            title="انقر لتشغيل موجة التوهج!"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{siteConfig.heroBadge}</span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/80">
              انقر للعب
            </span>
          </div>
        )}

        {/* Hero Title */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.2] max-w-4xl drop-shadow-md">
          {siteConfig.heroTitle}
        </h2>

        {/* Hero Subtitle */}
        <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
          {siteConfig.heroSubtitle}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onTriggerEffect('explode')}
            className="px-6 py-3 rounded-xl text-sm font-bold text-slate-950 shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            style={{
              backgroundColor: primaryColor,
              boxShadow: `0 10px 25px -5px ${primaryColor}60`,
            }}
          >
            <span>{siteConfig.ctaPrimaryText}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onTriggerEffect('vortex')}
            className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" style={{ color: primaryColor }} />
            <span>{siteConfig.ctaSecondaryText}</span>
          </button>
        </div>

        {/* Mini Interactive Playground Bar on Hero */}
        <div className="mt-12 p-2.5 rounded-2xl bg-[#0f172a]/70 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold text-slate-300 px-3 flex items-center gap-1.5">
            <span>🎮 العب بالحركة:</span>
          </span>
          <button
            onClick={() => onTriggerEffect('explode')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all active:scale-95 flex items-center gap-1.5"
            title="انفجار الجسيمات ثم عودتها"
          >
            <span>💥 انفجار النجوم</span>
          </button>
          <button
            onClick={() => onTriggerEffect('vortex')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all active:scale-95 flex items-center gap-1.5"
            title="إعصار دوار"
          >
            <span>🌀 إعصار</span>
          </button>
          <button
            onClick={() => onTriggerEffect('shockwave')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all active:scale-95 flex items-center gap-1.5"
            title="صعقة توهج"
          >
            <span>⚡ نبض خارق</span>
          </button>
          <button
            onClick={() => onTriggerEffect('zeroG')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all active:scale-95 flex items-center gap-1.5"
            title="انعدام الجاذبية"
          >
            <span>🪐 طفو حر</span>
          </button>
          <button
            onClick={() => onTriggerEffect('assemble')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 transition-all active:scale-95 flex items-center gap-1.5"
            style={{ backgroundColor: primaryColor }}
            title="اصطفاف فوري حول الشعار"
          >
            <span>🎯 تشكيل الشعار</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate('game')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 transition-all active:scale-95 flex items-center gap-1.5 shadow-md hover:scale-105"
            title="الانتقال إلى صفحة جيم (Game)"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>🎮 صفحة جيم (Game)</span>
          </button>
        </div>
      </section>

      {/* 3. Features Section */}
      {siteConfig.showFeatures && (
        <section id="features" className="py-16 px-6 max-w-6xl mx-auto z-10 relative">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border"
              style={{
                backgroundColor: `${primaryColor}15`,
                borderColor: `${primaryColor}40`,
                color: primaryColor,
              }}
            >
              مميزات استثنائية لموقعك
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-3">
              حلول تقنية متكاملة تواكب تطلعاتك
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              تم بناء النظام ليوفر لك أعلى معايير الاستقرار والسرعة والجمالية البصرية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteConfig.features.map((feature, idx) => (
              <div
                key={feature.id || idx}
                className="group p-6 rounded-2xl bg-[#0e1626]/60 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300 hover:-translate-y-1 shadow-xl relative overflow-hidden"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `${primaryColor}20`,
                    borderColor: `${primaryColor}50`,
                    color: primaryColor,
                  }}
                >
                  {getFeatureIcon(feature.icon)}
                </div>
                <h4 className="text-base font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {feature.desc}
                </p>
                {/* Glowing bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Stats Section */}
      {siteConfig.showStats && (
        <section id="stats" className="py-12 px-6 max-w-6xl mx-auto z-10 relative">
          <div className="p-8 rounded-3xl bg-[#09111e]/75 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {siteConfig.stats.map((stat, idx) => (
                <div key={stat.id || idx} className="space-y-1">
                  <div
                    className="text-2xl sm:text-4xl font-black tracking-tight"
                    style={{ color: primaryColor }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Playground Callout Section */}
      <section id="playground" className="py-14 px-6 max-w-4xl mx-auto z-10 relative">
        <div
          className="p-8 rounded-3xl border backdrop-blur-xl shadow-2xl text-center relative overflow-hidden"
          style={{
            backgroundColor: `${primaryColor}0c`,
            borderColor: `${primaryColor}30`,
          }}
        >
          <div className="max-w-xl mx-auto space-y-3">
            <div
              className="inline-flex p-3 rounded-2xl border mx-auto"
              style={{
                backgroundColor: `${primaryColor}20`,
                borderColor: `${primaryColor}50`,
                color: primaryColor,
              }}
            >
              <Activity className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-white">
              جرب التفاعل الحي والفيزيائي الآن
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              حرك مؤشر الفأرة على الشاشة أو اضغط في أي مكان لتوليد نقاط وخطوط ضوئية متوهجة! انقر على أزرار اللعب لتجربة مؤثرات خارقة.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onTriggerEffect('explode')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 shadow-lg active:scale-95"
                style={{ backgroundColor: primaryColor }}
              >
                💥 تجربة الانفجار
              </button>
              <button
                onClick={onOpenControls}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 border border-white/10 text-white active:scale-95"
              >
                ⚙️ افتح لوحة التحكم الكاملة
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      {siteConfig.showFooter && (
        <footer className="py-10 px-6 border-t border-white/10 bg-black/40 backdrop-blur-md z-10 relative mt-12">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{siteConfig.siteName}</span>
              <span>— جميع الحقوق محفوظة © {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onOpenControls}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>لوحة التحكم والتخصيص</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">مدعوم بشبكة Plexus التفاعلية</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
