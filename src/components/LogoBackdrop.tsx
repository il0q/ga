import React from 'react';
import { PlexusConfig } from '../types';
import { DEFAULT_BOTANICAL_SVG } from '../data/botanicalLogo';

interface LogoBackdropProps {
  config: PlexusConfig;
}

export const LogoBackdrop: React.FC<LogoBackdropProps> = ({ config }) => {
  if (!config.showLogo) return null;

  const color = config.logoColor || config.nodeColor;
  const size = config.logoSize || 380;
  const opacity = config.logoOpacity !== undefined ? config.logoOpacity : 0.35;

  return (
    <div
      id="plexus-logo-backdrop"
      className="fixed inset-0 pointer-events-none z-[1] flex items-center justify-center transition-all duration-700 select-none overflow-hidden"
      style={{
        opacity: opacity,
        mixBlendMode: config.logoBlendMode || 'screen',
      }}
    >
      <div
        className="relative flex items-center justify-center transition-all duration-500 will-change-transform"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          maxWidth: '85vw',
          maxHeight: '85vh',
          color: color,
          filter: config.logoGlow
            ? `drop-shadow(0 0 25px ${color}66) drop-shadow(0 0 50px ${color}33)`
            : 'none',
        }}
      >
        {/* Soft Ambient Radial Backlight behind Logo */}
        {config.logoGlow && (
          <div
            className="absolute inset-0 rounded-full blur-3xl -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
              transform: 'scale(1.3)',
            }}
          />
        )}

        {config.logoCustomUrl ? (
          <img
            src={config.logoCustomUrl}
            alt="Uploaded Website Logo"
            className="w-full h-full object-contain rounded-full"
            style={{
              filter: config.logoBlendMode === 'screen' ? 'contrast(1.1)' : 'none',
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center animate-[pulse_6s_ease-in-out_infinite]"
            dangerouslySetInnerHTML={{ __html: DEFAULT_BOTANICAL_SVG }}
          />
        )}
      </div>
    </div>
  );
};
