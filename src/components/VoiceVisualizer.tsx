import React, { useEffect, useState } from 'react';

interface VoiceVisualizerProps {
  isListening: boolean;
  className?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ 
  isListening, 
  className = "" 
}) => {
  const [bars, setBars] = useState<number[]>(new Array(20).fill(0));

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isListening) {
      interval = setInterval(() => {
        setBars(prev => prev.map(() => Math.random() * 100));
      }, 50);
    } else {
      interval = setInterval(() => {
        setBars(prev => prev.map(height => Math.max(0, height - 5)));
      }, 50);
    }

    return () => clearInterval(interval);
  }, [isListening]);

  return (
    <div className={`relative w-full h-32 bg-gradient-to-r from-jarvis-darker to-jarvis-dark rounded-xl border border-jarvis-blue/20 overflow-hidden ${className}`}>
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-10 h-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="border-r border-jarvis-blue/20" />
          ))}
        </div>
      </div>

      {/* Visualizer bars */}
      <div className="flex items-end justify-center h-full px-4 py-4 gap-1">
        {bars.map((height, index) => (
          <div
            key={index}
            className={`w-3 rounded-t-md transition-all duration-75 ${
              isListening 
                ? 'bg-gradient-to-t from-jarvis-purple via-jarvis-blue to-jarvis-cyan'
                : 'bg-gradient-to-t from-gray-600 to-gray-400'
            }`}
            style={{
              height: `${Math.max(4, (height / 100) * 80)}%`,
              animationDelay: `${index * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Center pulse effect when listening */}
      {isListening && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-jarvis-cyan rounded-full animate-pulse-glow" />
        </div>
      )}

      {/* Status indicator */}
      <div className="absolute top-2 right-2">
        <div className={`w-3 h-3 rounded-full ${
          isListening 
            ? 'bg-jarvis-cyan animate-pulse' 
            : 'bg-gray-500'
        }`} />
      </div>
    </div>
  );
};