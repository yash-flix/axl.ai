import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface JarvisButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const JarvisButton: React.FC<JarvisButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isActive = false,
  onClick,
  className = '',
  disabled = false,
}) => {
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-jarvis-blue/20 to-jarvis-cyan/20 
      border-jarvis-blue/40 text-jarvis-cyan
      hover:from-jarvis-blue/30 hover:to-jarvis-cyan/30 
      hover:border-jarvis-cyan hover:shadow-[0_0_20px_hsl(var(--jarvis-cyan)/0.3)]
      active:from-jarvis-blue/40 active:to-jarvis-cyan/40
    `,
    secondary: `
      bg-gradient-to-r from-jarvis-purple/20 to-jarvis-blue/20 
      border-jarvis-purple/40 text-jarvis-purple
      hover:from-jarvis-purple/30 hover:to-jarvis-blue/30 
      hover:border-jarvis-purple hover:shadow-[0_0_20px_hsl(var(--jarvis-purple)/0.3)]
      active:from-jarvis-purple/40 active:to-jarvis-blue/40
    `,
    success: `
      bg-gradient-to-r from-green-500/20 to-emerald-500/20 
      border-green-500/40 text-green-400
      hover:from-green-500/30 hover:to-emerald-500/30 
      hover:border-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]
      active:from-green-500/40 active:to-emerald-500/40
    `,
    warning: `
      bg-gradient-to-r from-yellow-500/20 to-orange-500/20 
      border-yellow-500/40 text-yellow-400
      hover:from-yellow-500/30 hover:to-orange-500/30 
      hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]
      active:from-yellow-500/40 active:to-orange-500/40
    `,
    danger: `
      bg-gradient-to-r from-red-500/20 to-pink-500/20 
      border-red-500/40 text-red-400
      hover:from-red-500/30 hover:to-pink-500/30 
      hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]
      active:from-red-500/40 active:to-pink-500/40
    `,
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const activeStyles = isActive 
    ? 'ring-2 ring-jarvis-cyan shadow-[0_0_20px_hsl(var(--jarvis-cyan)/0.4)]' 
    : '';

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        `
        relative overflow-hidden backdrop-blur-sm
        border-2 rounded-lg font-semibold
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:scale-100 disabled:hover:shadow-none
        `,
        variantStyles[variant],
        sizeStyles[size],
        activeStyles,
        className
      )}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
      
      {/* Content */}
      <div className="relative flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        {children}
      </div>
    </Button>
  );
};