import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Power } from 'lucide-react';
import { BurgerMenu } from '@/components/BurgerMenu';
import { ThemeToggle } from '@/components/ThemeToggle';
import Prism from '@/components/Prism';
import axlLogo from '@/assets/axl-logo.png';

export default function JarvisInterface() {
  const [isMuted, setIsMuted] = useState(false);
  const [currentMode, setCurrentMode] = useState('normal');

  const handleModeChange = (mode: string) => {
    setCurrentMode(mode);
    console.log('Mode changed to:', mode);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    console.log('Mute toggled:', !isMuted);
  };

  const handleExit = () => {
    console.log('Exit requested');
    // Here you would handle exit/disconnect
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Prism */}
      <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
        <Prism
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0.5}
          glow={1}
        />
      </div>
      
      {/* Burger Menu */}
      <BurgerMenu currentMode={currentMode} onModeChange={handleModeChange} />
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Control Buttons */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-40">
        {/* Mute/Unmute Button */}
        <button
          onClick={handleMuteToggle}
          className={`p-3 rounded-full border-2 transition-colors ${
            isMuted 
              ? 'bg-destructive text-destructive-foreground border-destructive' 
              : 'bg-success text-white border-success'
          }`}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        
        {/* Exit Terminal Button */}
        <button
          onClick={handleExit}
          className="p-3 rounded-full bg-destructive text-destructive-foreground border-2 border-destructive hover:bg-destructive/90 transition-colors"
          aria-label="Exit Terminal"
        >
          <Power size={20} />
        </button>
      </div>

      {/* Main Content - Logo in Center */}
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img 
            src={axlLogo} 
            alt="AXL Logo" 
            className="mx-auto mb-8 max-w-xs h-auto filter drop-shadow-lg"
          />
          <h1 className="text-4xl font-bold text-foreground mb-4">AXL Assistant</h1>
          <p className="text-lg text-muted-foreground">Minimal AI Interface</p>
          <div className="mt-8 flex justify-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              isMuted ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'
            }`}>
              {isMuted ? 'Muted' : 'Active'}
            </span>
            <span className="px-3 py-1 rounded-full text-sm bg-secondary/50 text-secondary-foreground">
              Mode: {currentMode}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}