import React from 'react';
import LiquidEther from './LiquidEther';
import { useDarkMode } from '../contexts/DarkModeContext';

export const LiquidEtherBackground: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  // Color palette based on theme - reduced intensity for performance
  const colors = isDarkMode 
    ? ['#10b981', '#22c55e', '#4ade80'] // emerald and green shades for dark mode
    : ['#10b981', '#22c55e', '#3b82f6']; // emerald, green, and blue for light mode

  return (
    <div 
      className="fixed inset-0 w-full h-full" 
      style={{ zIndex: 0, pointerEvents: 'auto' }}
    >
      <LiquidEther
        colors={colors}
        mouseForce={15}
        cursorSize={80}
        isViscous={false}
        viscous={20}
        iterationsViscous={16}
        iterationsPoisson={16}
        resolution={0.35}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.3}
        autoIntensity={1.5}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
