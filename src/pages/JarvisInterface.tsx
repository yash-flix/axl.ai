import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Orb from '@/components/Orb';
import axlLogo from '@/assets/axl-logo.png';

export default function JarvisInterface() {

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Orb */}
      <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1 }}>
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
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