import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, Loader2 } from 'lucide-react';

interface StartStopButtonProps {
  isRunning: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export const StartStopButton: React.FC<StartStopButtonProps> = ({
  isRunning,
  isLoading,
  onClick
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="lg"
      className={`
        px-8 py-6 text-lg font-semibold transition-all duration-300
        ${isRunning 
          ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
          : 'bg-success hover:bg-success/90 text-success-foreground'
        }
        shadow-lg hover:shadow-xl transform hover:scale-105
      `}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          {isRunning ? 'Stopping...' : 'Starting...'}
        </>
      ) : (
        <>
          {isRunning ? (
            <>
              <Square className="mr-2 h-5 w-5" />
              Stop Assistant
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Start Assistant
            </>
          )}
        </>
      )}
    </Button>
  );
};