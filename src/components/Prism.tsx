import React, { useRef, useEffect, useState } from 'react';
import { Renderer, Camera, Transform, Geometry, Program, Mesh, Box } from 'ogl';

interface PrismProps {
  animationType?: string;
  timeScale?: number;
  height?: number;
  baseWidth?: number;
  scale?: number;
  hueShift?: number;
  colorFrequency?: number;
  noise?: number;
  glow?: number;
}

const Prism: React.FC<PrismProps> = ({
  animationType = "rotate",
  timeScale = 0.5,
  height = 3.5,
  baseWidth = 5.5,
  scale = 3.6,
  hueShift = 0,
  colorFrequency = 1,
  noise = 0.5,
  glow = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer: Renderer;
    let animationId: number;

    try {
      // Create renderer
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
      });
      
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      
      // Set size
      const container = containerRef.current;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      container.appendChild(gl.canvas);

      // Create camera
      const camera = new Camera(gl, { fov: 45 });
      camera.position.set(0, 0, 8);

      // Create scene
      const scene = new Transform();

      // Use Box geometry instead of custom geometry to avoid issues
      const geometry = new Box(gl, {
        width: 2,
        height: 2,
        depth: 2,
      });

      // Simplified shader program
      const vertex = `
        attribute vec3 position;
        attribute vec3 normal;
        
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float time;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          
          vec3 pos = position;
          // Simple rotation animation
          float s = sin(time * 0.5);
          float c = cos(time * 0.5);
          pos.x = position.x * c - position.z * s;
          pos.z = position.x * s + position.z * c;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `;

      const fragment = `
        precision mediump float;
        
        uniform float time;
        uniform float hueShift;
        uniform float colorFrequency;
        uniform float glow;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        vec3 hsv2rgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main() {
          float h = (vPosition.x + vPosition.y + time * 0.1) * colorFrequency + hueShift;
          float s = 0.8;
          float v = 0.9 + sin(time + vPosition.z) * 0.1;
          
          vec3 color = hsv2rgb(vec3(h, s, v));
          
          // Add glow effect
          float glowFactor = 1.0 + glow * (sin(time) * 0.5 + 0.5);
          color *= glowFactor;
          
          // Add transparency
          float alpha = 0.6 + sin(vPosition.y + time) * 0.2;
          
          gl_FragColor = vec4(color, alpha);
        }
      `;

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
          time: { value: 0 },
          hueShift: { value: hueShift },
          colorFrequency: { value: colorFrequency },
          glow: { value: glow },
        },
        transparent: true,
        cullFace: gl.BACK,
      });

      // Create mesh
      const mesh = new Mesh(gl, { geometry, program });
      mesh.scale.set(scale, scale * height / baseWidth, scale);
      mesh.setParent(scene);

      // Animation loop
      const animate = () => {
        try {
          const time = performance.now() * 0.001 * timeScale;
          
          if (mesh.program && mesh.program.uniforms) {
            mesh.program.uniforms.time.value = time;
            
            // Apply rotation animation
            if (animationType === "rotate") {
              mesh.rotation.x = time * 0.3;
              mesh.rotation.y = time * 0.5;
            }
          }
          
          renderer.render({ scene, camera });
          animationId = requestAnimationFrame(animate);
        } catch (err) {
          console.error('Animation error:', err);
          setError(`Animation error: ${err}`);
        }
      };
      
      animate();

      // Handle resize
      const handleResize = () => {
        try {
          if (!containerRef.current || !renderer) return;
          
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          
          renderer.setSize(width, height);
          camera.perspective({ aspect: width / height });
        } catch (err) {
          console.error('Resize error:', err);
        }
      };
      
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (containerRef.current && gl.canvas && containerRef.current.contains(gl.canvas)) {
          containerRef.current.removeChild(gl.canvas);
        }
        // Clean up GL context
        if (renderer && renderer.gl) {
          const ext = renderer.gl.getExtension('WEBGL_lose_context');
          if (ext) ext.loseContext();
        }
      };

    } catch (err) {
      console.error('Prism initialization error:', err);
      setError(`Initialization error: ${err}`);
      
      // Clean up on error
      if (renderer && animationId) {
        cancelAnimationFrame(animationId);
      }
    }
  }, [animationType, timeScale, height, baseWidth, scale, hueShift, colorFrequency, noise, glow]);

  if (error) {
    console.warn('Prism component error:', error);
    return null; // Silently fail instead of showing error to user
  }

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        pointerEvents: 'none'
      }} 
    />
  );
};

export default Prism;