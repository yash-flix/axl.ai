import React, { useState } from 'react';
import { JarvisButton } from './JarvisButton';

interface ControlPanelProps {
  onModeChange: (mode: string) => void;
  currentMode: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  onModeChange, 
  currentMode 
}) => {
  const [activePersonality, setActivePersonality] = useState<string>('normal');

  const modes = [
    { id: 'chat', label: 'Chat Mode', icon: '💬', variant: 'primary' as const },
    { id: 'text', label: 'Text Mode', icon: '⌨️', variant: 'secondary' as const },
    { id: 'voice', label: 'Voice Mode', icon: '🎙️', variant: 'primary' as const },
    { id: 'sleep', label: 'Sleep Mode', icon: '😴', variant: 'warning' as const },
  ];

  const personalities = [
    { id: 'normal', label: 'Normal', icon: '🤖', variant: 'primary' as const },
    { id: 'fun', label: 'Fun Mode', icon: '🎉', variant: 'success' as const },
    { id: 'focus', label: 'Focus Mode', icon: '🎯', variant: 'secondary' as const },
    { id: 'roast', label: 'Roast Mode', icon: '🔥', variant: 'danger' as const },
  ];

  const quickActions = [
    { id: 'screenshot', label: 'Screenshot', icon: '📸', variant: 'secondary' as const },
    { id: 'screen-read', label: 'Read Screen', icon: '👁️', variant: 'secondary' as const },
    { id: 'weather', label: 'Weather', icon: '🌤️', variant: 'primary' as const },
    { id: 'time', label: 'Time', icon: '🕐', variant: 'primary' as const },
  ];

  const handleModeClick = (modeId: string) => {
    onModeChange(modeId);
  };

  const handlePersonalityClick = (personalityId: string) => {
    setActivePersonality(personalityId);
    onModeChange(`personality_${personalityId}`);
  };

  const handleQuickAction = (actionId: string) => {
    onModeChange(`action_${actionId}`);
  };

  const ControlSection: React.FC<{
    title: string;
    children: React.ReactNode;
  }> = ({ title, children }) => (
    <div className="bg-gradient-to-br from-jarvis-dark/50 to-jarvis-darker/50 p-4 rounded-lg border border-jarvis-blue/20 backdrop-blur-sm">
      <h3 className="text-jarvis-cyan text-lg font-bold mb-4">{title}</h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Mode Controls */}
      <ControlSection title="🎛️ Mode Controls">
        {modes.map((mode) => (
          <JarvisButton
            key={mode.id}
            onClick={() => handleModeClick(mode.id)}
            variant={mode.variant}
            icon={mode.icon}
            isActive={currentMode === mode.id}
            className="w-full justify-start"
          >
            {mode.label}
          </JarvisButton>
        ))}
      </ControlSection>

      {/* Personality Controls */}
      <ControlSection title="🎭 Personality">
        {personalities.map((personality) => (
          <JarvisButton
            key={personality.id}
            onClick={() => handlePersonalityClick(personality.id)}
            variant={personality.variant}
            icon={personality.icon}
            isActive={activePersonality === personality.id}
            className="w-full justify-start"
          >
            {personality.label}
          </JarvisButton>
        ))}
      </ControlSection>

      {/* Quick Actions */}
      <ControlSection title="⚡ Quick Actions">
        {quickActions.map((action) => (
          <JarvisButton
            key={action.id}
            onClick={() => handleQuickAction(action.id)}
            variant={action.variant}
            icon={action.icon}
            className="w-full justify-start"
          >
            {action.label}
          </JarvisButton>
        ))}
      </ControlSection>

      {/* Emergency Controls */}
      <ControlSection title="🚨 Emergency">
        <JarvisButton
          onClick={() => handleQuickAction('emergency_stop')}
          variant="danger"
          icon="🛑"
          className="w-full justify-start"
        >
          Emergency Stop
        </JarvisButton>
        <JarvisButton
          onClick={() => handleQuickAction('restart')}
          variant="warning"
          icon="🔄"
          className="w-full justify-start"
        >
          Restart Jarvis
        </JarvisButton>
      </ControlSection>
    </div>
  );
};