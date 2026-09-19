import React, { useState } from 'react';
import { PlexusConfig } from '../types';
import { generateStandaloneHtml } from '../utils/generateHtmlCode';
import { Check, Copy, Download, X, Code2, Sparkles, BookOpen, Layers, Sliders } from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PlexusConfig;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [copied, setCopied] = useState(false);
  const [includeControlPanel, setIncludeControlPanel] = useState(true);
  const [activeTab, setActiveTab] = useState<'full' | 'embed' | 'guide'>('full');

  if (!isOpen) return null;

  const fullHtmlCode = generateStandaloneHtml(config, { includeControlPanel });

  const handleCopy = () => {
    navigator.clipboard.writeText(fullHtmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([fullHtmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plexus-animation.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const snippetEmbed = `<!-- 1. ضع عنصر Canvas في صفحتك -->
<canvas id="plexus-canvas" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; pointer-events: auto;"></canvas>

<!-- 2. أضف هذا السكربت قبل إغلاق </body> -->
<script>
  // انسخ السكربت الموجود في تبويب "الملف الكامل"
</script>`;

  return (
    <div
      id="code-export-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="code-export-modal-card"
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0f141c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-right"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#131b26]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                كود الحركة بصيغة HTML لموقعك
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-normal">
                  جاهز للاستخدام الفوري
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                ملف مستقل وخفيف لا يتطلب أي مكتبات خارجية (Pure HTML5 & Vanilla JavaScript)
              </p>
            </div>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Subnav Tabs & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-white/5 bg-[#0d121a]">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              id="tab-full-html"
              onClick={() => setActiveTab('full')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'full'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              الملف الكامل (HTML مستقل)
            </button>
            <button
              id="tab-embed-html"
              onClick={() => setActiveTab('embed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'embed'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              تضمين في موقع حالي
            </button>
            <button
              id="tab-guide-html"
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              طريقة التركيب
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="download-html-file-btn"
              onClick={handleDownload}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              تحميل ملف index.html
            </button>
            <button
              id="copy-html-code-btn"
              onClick={handleCopy}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 active:scale-95 ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  تم نسخ الكود!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  نسخ الكود بالكامل
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Toggle On-Site Floating Control Panel */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  تضمين لوحة التحكم التفاعلية لموقعك (On-Site Floating Controls)
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-normal">
                    موصى به لموقعك
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  تضمين زر عائم ⚙️ في الكود يتيح لك ولزوارك التحكم بالجسيمات والسرعة والألوان فوراً من موقعك.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mr-3">
              <input
                type="checkbox"
                checked={includeControlPanel}
                onChange={(e) => setIncludeControlPanel(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>

          {activeTab === 'full' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>كود HTML متكامل يحتوي على تنسيقات CSS وسكربت الكانفاس التفاعلي:</span>
                <span className="font-mono text-slate-500 text-[11px]">
                  {fullHtmlCode.split('\n').length} سطراً | 0 مكتبات إضافية
                </span>
              </div>
              <div className="relative rounded-xl bg-[#090d13] border border-white/10 overflow-hidden" dir="ltr">
                <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[50vh] leading-relaxed select-all">
                  {fullHtmlCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'embed' && (
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                <h3 className="font-bold text-amber-300 mb-1">كيف تضع هذه الحركة كخلفية لموقعك الحالي؟</h3>
                <p className="text-xs">
                  يمكنك وضع لوحة الكانفاس في أي صفحة ويب وتطبيق <code>position: fixed</code> مع <code>z-index: -1</code> لتكون خلف كامل عناصر ونصوص موقعك بسلاسة تامة.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">1. إضافة عنصر الكانفاس (HTML)</h4>
                <div className="rounded-xl bg-[#090d13] border border-white/10 p-3 font-mono text-xs text-slate-200" dir="ltr">
                  {snippetEmbed}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">2. دعم جميع المنصات</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="font-bold text-amber-400 block mb-1">WordPress</span>
                    أضف الكود عبر مكوّن Custom HTML أو في قالب child-theme داخل <code>footer.php</code>.
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="font-bold text-amber-400 block mb-1">React / Next.js</span>
                    يمكنك نسخه في useEffect أو وضعه في مكون Canvas مستقل بدون الحاجة لأي حزم خارجية.
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="font-bold text-amber-400 block mb-1">Webflow / Shopify</span>
                    أضف الكود داخل Embed Code block وسيعمل تلقائياً مع تفاعل الفأرة.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">1</span>
                    تشغيل الملف محلياً
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    اضغط على زر <strong>تحميل ملف index.html</strong>، ثم افتح الملف مباشرة بنقرة مزدوجة في أي متصفح (Chrome, Safari, Edge, Firefox) وسترى الحركة تعمل فوراً بدون سيرفر!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">2</span>
                    تغيير الألوان وسرعة الحركة
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    ستجد في بداية كود الجافاسكربت كائن إعدادات <code>CONFIG</code> يمكنك من خلاله تعديل <code>nodeColor</code> و <code>speed</code> و <code>particleCount</code> بكل سهولة.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">3</span>
                    دقة الشاشات العالية (Retina)
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    الكود يحتوي تلقائياً على معالجة <code>devicePixelRatio</code> حتى تظهر النقاط والخطوط نقية وحادة جداً على شاشات ماك بوك والهواتف الحديثة بدون أي ضبابية.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">4</span>
                    تفاعل الفأرة واللمس
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    يتفاعل الكانفاس مع حركة الماوس، كما يمكنك النقر لإضافة جسيمات جديدة متصلة، ويدعم السحب والتفاعل باللمس على الهواتف والأجهزة اللوحية.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-[#0c1017]">
          <span className="text-xs text-slate-400">
            يمكنك دائماً تعديل الإعدادات في لوحة التحكم وتحديث الكود قبل النسخ
          </span>
          <button
            id="modal-bottom-close"
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
