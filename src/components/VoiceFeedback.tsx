import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceFeedbackProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
}

export const VoiceFeedback: React.FC<VoiceFeedbackProps> = ({
  message,
  isVisible,
  onHide
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onHide, 5000); // Auto-hide after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible || !message) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in">
      <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-card-foreground flex-1">{message}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={onHide}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};