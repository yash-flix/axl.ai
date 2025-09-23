import React, { useRef, useEffect } from 'react';
import { Renderer, Camera, Transform, Geometry, Program, Mesh, Vec3 } from 'ogl';

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
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<Transform | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Create renderer
    const renderer = new Renderer({
      alpha: true,
      antialias: true,
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

    // Create prism geometry
    const geometry = new Geometry(gl, {
      position: {
        size: 3,
        data: new Float32Array([
          // Front face
          -1, -1,  1,
           1, -1,  1,
           1,  1,  1,
          -1,  1,  1,
          // Back face
          -1, -1, -1,
          -1,  1, -1,
           1,  1, -1,
           1, -1, -1,
          // Top face
          -1,  1, -1,
          -1,  1,  1,
           1,  1,  1,
           1,  1, -1,
          // Bottom face
          -1, -1, -1,
           1, -1, -1,
           1, -1,  1,
          -1, -1,  1,
          // Right face
           1, -1, -1,
           1,  1, -1,
           1,  1,  1,
           1, -1,  1,
          // Left face
          -1, -1, -1,
          -1, -1,  1,
          -1,  1,  1,
          -1,  1, -1,
        ])
      },
      index: {
        data: new Uint16Array([
          0,  1,  2,    0,  2,  3,    // front
          4,  5,  6,    4,  6,  7,    // back
          8,  9,  10,   8,  10, 11,   // top
          12, 13, 14,   12, 14, 15,   // bottom
          16, 17, 18,   16, 18, 19,   // right
          20, 21, 22,   20, 22, 23,   // left
        ])
      },
    });

    // Create shader program
    const program = new Program(gl, {
      vertex: `
        attribute vec3 position;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float time;
        uniform float noise;
        varying vec3 vPosition;
        varying float vNoise;
        
        float random(vec3 scale, float seed) {
          return fract(sin(dot(gl_Position.xyz + seed, scale)) * 43758.5453 + seed);
        }
        
        void main() {
          vPosition = position;
          vec3 pos = position;
          
          // Add noise displacement
          float n = random(pos, time) * noise;
          pos += normalize(pos) * n * 0.1;
          
          vNoise = n;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragment: `
        precision mediump float;
        uniform float time;
        uniform float hueShift;
        uniform float colorFrequency;
        uniform float glow;
        varying vec3 vPosition;
        varying float vNoise;
        
        vec3 hsv2rgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main() {
          float h = (vPosition.x + vPosition.y + time * 0.1) * colorFrequency + hueShift;
          float s = 0.8 + vNoise * 0.2;
          float v = 0.9 + sin(time + vPosition.z) * 0.1;
          
          vec3 color = hsv2rgb(vec3(h, s, v));
          
          // Add glow effect
          float glowFactor = 1.0 + glow * (sin(time) * 0.5 + 0.5);
          color *= glowFactor;
          
          // Add transparency based on position
          float alpha = 0.7 + sin(vPosition.y + time) * 0.3;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        time: { value: 0 },
        noise: { value: noise },
        hueShift: { value: hueShift },
        colorFrequency: { value: colorFrequency },
        glow: { value: glow },
      },
      transparent: true,
      cullFace: null,
    });

    // Create mesh
    const mesh = new Mesh(gl, { geometry, program });
    mesh.scale.set(scale, scale * height / baseWidth, scale);
    mesh.setParent(scene);

    // Store references
    rendererRef.current = renderer;
    sceneRef.current = scene;
    meshRef.current = mesh;

    // Animation loop
    const animate = () => {
      const time = performance.now() * 0.001 * timeScale;
      
      if (meshRef.current && meshRef.current.program) {
        meshRef.current.program.uniforms.time.value = time;
        
        // Apply animation
        if (animationType === "rotate") {
          meshRef.current.rotation.x = time * 0.3;
          meshRef.current.rotation.y = time * 0.5;
        }
      }
      
      renderer.render({ scene, camera });
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      rendererRef.current.setSize(width, height);
      camera.perspective({ aspect: width / height });
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current && gl.canvas) {
        containerRef.current.removeChild(gl.canvas);
      }
    };
  }, [animationType, timeScale, height, baseWidth, scale, hueShift, colorFrequency, noise, glow]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none'
      }} 
    />
  );
};

export default Prism;