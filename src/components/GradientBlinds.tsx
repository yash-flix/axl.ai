import React, { useEffect, useRef } from 'react';

interface GradientBlindsProps {
  gradientColors: string[];
  angle?: number;
  noise?: number;
  blindCount?: number;
  blindMinWidth?: number;
  spotlightRadius?: number;
  spotlightSoftness?: number;
  spotlightOpacity?: number;
  mouseDampening?: number;
  distortAmount?: number;
  shineDirection?: 'left' | 'right';
  mixBlendMode?: string;
}

const GradientBlinds: React.FC<GradientBlindsProps> = ({
  gradientColors = ['#FF9FFC', '#5227FF'],
  angle = 0,
  noise = 0.3,
  blindCount = 12,
  blindMinWidth = 50,
  spotlightRadius = 0.5,
  spotlightSoftness = 1,
  spotlightOpacity = 1,
  mouseDampening = 0.15,
  distortAmount = 0,
  shineDirection = 'left',
  mixBlendMode = 'lighten'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0.5, y: 0.5 });
  const currentPosition = useRef({ x: 0.5, y: 0.5 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const blinds: HTMLDivElement[] = [];

    // Create blinds
    for (let i = 0; i < blindCount; i++) {
      const blind = document.createElement('div');
      blind.className = 'gradient-blind';
      blind.style.cssText = `
        position: absolute;
        top: 0;
        height: 100%;
        background: linear-gradient(${angle}deg, ${gradientColors.join(', ')});
        filter: brightness(${1 + noise * (Math.random() - 0.5)});
        mix-blend-mode: ${mixBlendMode};
        transition: all 0.3s ease;
      `;
      
      container.appendChild(blind);
      blinds.push(blind);
    }

    const updateBlinds = () => {
      // Smooth interpolation towards mouse position
      currentPosition.current.x += (mousePosition.current.x - currentPosition.current.x) * mouseDampening;
      currentPosition.current.y += (mousePosition.current.y - currentPosition.current.y) * mouseDampening;

      const { x, y } = currentPosition.current;
      
      blinds.forEach((blind, index) => {
        const blindWidth = blindMinWidth + (100 - blindMinWidth) * Math.random();
        const leftPosition = (index / blindCount) * 100;
        
        // Calculate distance from spotlight center
        const distanceFromSpotlight = Math.abs((leftPosition + blindWidth / 2) / 100 - x);
        const spotlightEffect = Math.max(0, 1 - distanceFromSpotlight / spotlightRadius);
        
        // Apply spotlight opacity
        const opacity = spotlightOpacity * (0.3 + 0.7 * spotlightEffect);
        
        // Apply shine effect
        const shineIntensity = shineDirection === 'left' ? 
          Math.max(0, 1 - leftPosition / 100) : 
          Math.max(0, leftPosition / 100);
        
        blind.style.left = `${leftPosition}%`;
        blind.style.width = `${blindWidth}%`;
        blind.style.opacity = `${opacity}`;
        blind.style.filter = `brightness(${1 + shineIntensity * 0.3 + noise * (Math.random() - 0.5)})`;
        
        if (distortAmount > 0) {
          const distortion = (Math.random() - 0.5) * distortAmount;
          blind.style.transform = `skewX(${distortion}deg)`;
        }
      });

      animationFrameRef.current = requestAnimationFrame(updateBlinds);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePosition.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      };
    };

    container.addEventListener('mousemove', handleMouseMove);
    updateBlinds();

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      blinds.forEach(blind => blind.remove());
    };
  }, [gradientColors, angle, noise, blindCount, blindMinWidth, spotlightRadius, spotlightSoftness, spotlightOpacity, mouseDampening, distortAmount, shineDirection, mixBlendMode]);

  return (
    <div 
      ref={containerRef}
      className="gradient-blinds-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    />
  );
};

export default GradientBlinds;