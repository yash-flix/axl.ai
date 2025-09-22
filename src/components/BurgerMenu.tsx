import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { SystemMonitor } from '@/components/SystemMonitor';
import { ControlPanel } from '@/components/ControlPanel';
import { MemoryPanel } from '@/components/MemoryPanel';

interface BurgerMenuProps {
  currentMode: string;
  onModeChange: (mode: string) => void;
}

export const BurgerMenu: React.FC<BurgerMenuProps> = ({ currentMode, onModeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="fixed top-4 left-4 z-50 bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors">
          <Menu size={20} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-background border-border">
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Control Panel</h2>
            <ControlPanel currentMode={currentMode} onModeChange={onModeChange} />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">System Monitor</h2>
            <SystemMonitor />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Memory</h2>
            <MemoryPanel />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};