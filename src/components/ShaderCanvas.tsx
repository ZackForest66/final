import { useEffect, useRef } from 'react';
import { initOrganicBlobShader } from '../shaders/organicBlob';
import { initAmbientGlowShader } from '../shaders/ambientGlow';

interface ShaderCanvasProps {
  variant: 'organic' | 'ambient';
  className?: string;
}

export default function ShaderCanvas({ variant, className = '' }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shaderRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for WebGL support
    const gl = canvas.getContext('webgl');
    if (!gl) {
      // WebGL not supported, show CSS gradient fallback
      return;
    }

    if (variant === 'organic') {
      shaderRef.current = initOrganicBlobShader(canvas);
    } else {
      shaderRef.current = initAmbientGlowShader(canvas);
    }

    return () => {
      if (shaderRef.current) {
        shaderRef.current.destroy();
        shaderRef.current = null;
      }
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
