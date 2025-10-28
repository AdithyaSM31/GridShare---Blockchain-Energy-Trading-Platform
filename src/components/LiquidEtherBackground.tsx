import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useDarkMode } from '../contexts/DarkModeContext';

export const LiquidEtherBackground: React.FC = () => {
  const { isDarkMode } = useDarkMode();
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    console.log('LiquidEtherBackground: Initializing');

    // Colors based on theme
    const colors = isDarkMode 
      ? [0x10b981, 0x22c55e, 0x4ade80] 
      : [0x10b981, 0x22c55e, 0x3b82f6];

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create fluid simulation with shader
    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      varying vec2 vUv;

      // Simplex noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = vUv;
        
        // Multiple layers of noise for liquid effect
        float n1 = snoise(uv * 2.0 + time * 0.3);
        float n2 = snoise(uv * 3.0 - time * 0.2);
        float n3 = snoise(uv * 4.0 + time * 0.4);
        
        // Combine noise layers
        float noise = (n1 + n2 * 0.5 + n3 * 0.25) / 1.75;
        
        // Create flowing pattern
        vec2 flow = vec2(
          snoise(uv * 2.0 + time * 0.2),
          snoise(uv * 2.0 + time * 0.3 + 100.0)
        ) * 0.3;
        
        float pattern = snoise(uv * 3.0 + flow + time * 0.5);
        
        // Mix colors based on pattern
        vec3 color = mix(color1, color2, smoothstep(-0.5, 0.5, pattern));
        color = mix(color, color3, smoothstep(-0.3, 0.7, noise));
        
        // Add some glow
        float glow = smoothstep(0.2, 0.8, abs(pattern));
        color += glow * 0.1;
        
        // Fade out
        float alpha = 0.15 + pattern * 0.1;
        
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(colors[0]) },
        color2: { value: new THREE.Color(colors[1]) },
        color3: { value: new THREE.Color(colors[2]) }
      },
      transparent: true,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop
    let time = 0;
    function animate() {
      time += 0.008; // Auto-animation speed
      material.uniforms.time.value = time;
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    }
    animate();

    // Handle resize
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    console.log('LiquidEtherBackground: Initialized successfully');

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      geometry.dispose();
      material.dispose();
    };
  }, [isDarkMode]);

  return (
    <div 
      ref={mountRef}
      className="fixed inset-0 w-full h-full" 
      style={{ 
        zIndex: 0, 
        pointerEvents: 'none'
      }}
    />
  );
};
