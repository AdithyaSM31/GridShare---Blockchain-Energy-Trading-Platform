import React from 'react';
import LiquidEther from './LiquidEther';
import { useDarkMode } from '../contexts/DarkModeContext';

export const LiquidEtherBackground: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  // Color palette based on theme
  const colors = isDarkMode 
    ? ['#10b981', '#22c55e', '#4ade80'] // emerald and green shades for dark mode
    : ['#10b981', '#22c55e', '#3b82f6']; // emerald, green, and blue for light mode

  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none">
      <LiquidEther
        colors={colors}
        mouseForce={20}
        cursorSize={100}
        isViscous={false}
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo={true}
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
