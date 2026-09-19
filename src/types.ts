export interface PlexusConfig {
  particleCount: number;
  maxDistance: number;
  speed: number;
  nodeSize: number;
  nodeColor: string;
  lineColor: string;
  triangleFillColor: string;
  showTriangles: boolean;
  showGrid: boolean;
  gridSize: number;
  gridColor: string;
  bgColor: string;
  glowIntensity: number;
  mouseInteraction: 'connect_attract' | 'connect_repel' | 'connect_only';
  mouseDistance: number;
  // إعدادات الشعار المدمج في الخلفية
  showLogo: boolean;
  logoCustomUrl?: string;
  logoOpacity: number; // 0.05 to 0.9
  logoSize: number; // in pixels, e.g., 380
  logoGlow: boolean;
  logoBlendMode: 'screen' | 'normal' | 'overlay' | 'luminosity';
  logoColor?: string; // override color if SVG
  // تشكيل وتجمع النقاط على هيئة الشعار
  formLogoWithParticles: boolean;
  logoFormingStrength: number; // 0.1 to 1 (قوة انجذاب النقاط لتشكل الشعار)
}

export interface PresetTheme {
  id: string;
  name: string;
  nameAr: string;
  config: Partial<PlexusConfig>;
}
