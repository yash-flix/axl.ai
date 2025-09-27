import React, { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import GradientBlinds from '@/components/GradientBlinds';
import axlLogo from '@/assets/axl-logo.png';

export default function JarvisInterface() {

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background GradientBlinds */}
      <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1 }}>
        <GradientBlinds
          gradientColors={['#FF9FFC', '#5227FF']}
          angle={0}
          noise={0.3}
          blindCount={12}
          blindMinWidth={50}
          spotlightRadius={0.5}
          spotlightSoftness={1}
          spotlightOpacity={1}
          mouseDampening={0.15}
          distortAmount={0}
          shineDirection="left"
          mixBlendMode="lighten"
        />
      </div>
      
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Main Content - Logo in Center */}
      <main className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center">
          <img 
            src={axlLogo} 
            alt="AXL Logo" 
            className="mx-auto mb-8 max-w-xs h-auto filter drop-shadow-lg"
          />
          <h1 className="text-4xl font-bold text-foreground mb-4">AXL Assistant</h1>
          <p className="text-lg text-muted-foreground">Minimal AI Interface</p>
        </div>
      </main>
    </div>
  );
}