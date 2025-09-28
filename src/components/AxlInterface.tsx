import React, { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoiceFeedback } from '@/components/VoiceFeedback';
import { StartStopButton } from '@/components/StartStopButton';
import Orb from '@/components/Orb';
import axlLogo from '@/assets/axl-logo.png';
import { Play, Square, Send } from 'lucide-react';

interface PyWebViewAPI {
  start_backend: () => Promise<boolean>;
  stop_backend: () => Promise<boolean>;
  send_command: (command: string) => Promise<string>;
  get_backend_status: () => Promise<boolean>;
}

declare global {
  interface Window {
    pywebview?: {
      api: PyWebViewAPI;
    };
  }
}

export default function AxlInterface() {
  const [isBackendRunning, setIsBackendRunning] = useState(false);
  const [command, setCommand] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check backend status on mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      if (window.pywebview?.api) {
        const status = await window.pywebview.api.get_backend_status();
        setIsBackendRunning(status);
      }
    } catch (error) {
      console.warn('PyWebView API not available - running in dev mode');
    }
  };

  const handleStartStop = async () => {
    if (!window.pywebview?.api) {
      // Fallback for development mode
      setIsBackendRunning(!isBackendRunning);
      showFeedbackMessage(isBackendRunning ? 'Backend stopped (dev mode)' : 'Backend started (dev mode)');
      return;
    }

    setIsLoading(true);
    try {
      let success = false;
      if (isBackendRunning) {
        success = await window.pywebview.api.stop_backend();
        if (success) {
          setIsBackendRunning(false);
          showFeedbackMessage('AXL Assistant stopped');
        }
      } else {
        success = await window.pywebview.api.start_backend();
        if (success) {
          setIsBackendRunning(true);
          showFeedbackMessage('AXL Assistant started and ready');
        }
      }
      if (!success) {
        showFeedbackMessage('Failed to change backend state');
      }
    } catch (error) {
      console.error('Backend operation failed:', error);
      showFeedbackMessage('Backend operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCommand = async () => {
    if (!command.trim()) return;

    if (!window.pywebview?.api) {
      // Fallback for development mode
      showFeedbackMessage(`Command received: "${command}"`);
      setCommand('');
      return;
    }

    setIsLoading(true);
    try {
      const response = await window.pywebview.api.send_command(command);
      showFeedbackMessage(response || 'Command processed');
      setCommand('');
    } catch (error) {
      console.error('Command failed:', error);
      showFeedbackMessage('Failed to process command');
    } finally {
      setIsLoading(false);
    }
  };

  const showFeedbackMessage = (message: string) => {
    setFeedbackMessage(message);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendCommand();
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Orb */}
      <div className="absolute inset-0 z-0">
        <Orb
          hoverIntensity={0.3}
          rotateOnHover={true}
          hue={220}
          forceHoverState={false}
        />
      </div>
      
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Voice Feedback Display */}
      <VoiceFeedback 
        message={feedbackMessage}
        isVisible={showFeedback}
        onHide={() => setShowFeedback(false)}
      />

      {/* Main Content */}
      <main className="min-h-screen flex flex-col items-center justify-center relative z-10 p-8">
        <div className="text-center max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src={axlLogo} 
              alt="AXL.AI Logo" 
              className="mx-auto max-w-xs h-auto filter drop-shadow-lg"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">Advanced Desktop Assistant</p>
          </div>

          {/* Start/Stop Button */}
          <StartStopButton
            isRunning={isBackendRunning}
            isLoading={isLoading}
            onClick={handleStartStop}
          />

          {/* Command Input Panel */}
          <div className="space-y-4 pt-8">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter command..."
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 bg-card/80 backdrop-blur-sm border-border/50"
              />
              <Button
                onClick={handleSendCommand}
                disabled={!command.trim() || isLoading}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {isBackendRunning ? 'Voice input active' : 'Manual commands only'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}