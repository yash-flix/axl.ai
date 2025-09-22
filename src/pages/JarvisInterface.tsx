import React, { useState, useEffect } from 'react';
import { VoiceVisualizer } from '@/components/VoiceVisualizer';
import { ChatInterface } from '@/components/ChatInterface';
import { ControlPanel } from '@/components/ControlPanel';
import { SystemMonitor } from '@/components/SystemMonitor';
import { MemoryPanel } from '@/components/MemoryPanel';
import { JarvisButton } from '@/components/JarvisButton';

export default function JarvisInterface() {
  const [isListening, setIsListening] = useState(false);
  const [currentMode, setCurrentMode] = useState('chat');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    // Here you would integrate with actual Jarvis backend
  };

  const handleStartListening = () => {
    setIsListening(true);
    // Here you would start actual voice recognition
  };

  const handleStopListening = () => {
    setIsListening(false);
    // Here you would stop voice recognition
  };

  const handleModeChange = (mode: string) => {
    setCurrentMode(mode);
    console.log('Mode changed to:', mode);
    // Here you would handle mode changes
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-jarvis-darker via-jarvis-dark to-jarvis-darker">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-jarvis-blue/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-jarvis-purple/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-jarvis-cyan/3 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-jarvis-blue/20 bg-jarvis-dark/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🤖</div>
              <div>
                <h1 className="text-2xl font-bold text-jarvis-cyan">J.A.R.V.I.S</h1>
                <p className="text-sm text-gray-400">Advanced AI Assistant Interface</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Status indicators */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-jarvis-cyan animate-pulse' : 'bg-gray-500'}`} />
                  <span className="text-sm text-gray-300">
                    {isListening ? 'Listening' : 'Standby'}
                  </span>
                </div>
                <div className="text-sm text-jarvis-cyan font-mono">
                  {formatTime(currentTime)}
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2">
                <JarvisButton
                  onClick={() => handleModeChange('emergency_stop')}
                  variant="danger"
                  size="sm"
                  icon="🚨"
                >
                  Emergency
                </JarvisButton>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - Main Interface */}
          <div className="lg:col-span-3 space-y-6">
            {/* Voice Visualizer */}
            <VoiceVisualizer isListening={isListening} />
            
            {/* Chat Interface */}
            <div className="flex-1">
              <ChatInterface
                isListening={isListening}
                onSendMessage={handleSendMessage}
                onStartListening={handleStartListening}
                onStopListening={handleStopListening}
              />
            </div>
          </div>

          {/* Right Panel - Controls and Monitoring */}
          <div className="space-y-6">
            {/* Control Panel */}
            <ControlPanel
              currentMode={currentMode}
              onModeChange={handleModeChange}
            />
            
            {/* System Monitor */}
            <SystemMonitor />
            
            {/* Memory Panel */}
            <MemoryPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-jarvis-blue/20 bg-jarvis-dark/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-gray-400">
              <span>Mode: <span className="text-jarvis-cyan">{currentMode}</span></span>
              <span>Status: <span className="text-green-400">Online</span></span>
              <span>Version: <span className="text-jarvis-purple">2.0.0</span></span>
            </div>
            <div className="text-gray-500">
              Powered by Advanced AI Technology
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}