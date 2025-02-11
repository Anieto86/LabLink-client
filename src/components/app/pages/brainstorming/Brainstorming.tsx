import { Column } from '@/components/design/Grid';
import React, { useRef, useEffect, useState } from 'react';

const Brainstorming = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trianglePosition, setTrianglePosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const vertexShaderSource = `
      attribute vec2 a_position;
      uniform vec2 u_translation;
      uniform float u_scale;
      void main() {
        gl_Position = vec4((a_position + u_translation) * u_scale, 0, 1);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec4 u_color;
      void main() {
        gl_FragColor = u_color;
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const createProgram = () => {
      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
      const program = gl.createProgram()!;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      return program;
    };

    const drawTriangle = () => {
      if (!trianglePosition) return;
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(1, 1, 1, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const program = createProgram();
      gl.useProgram(program);

      const positionLocation = gl.getAttribLocation(program, 'a_position');
      const translationLocation = gl.getUniformLocation(program, 'u_translation');
      const scaleLocation = gl.getUniformLocation(program, 'u_scale');
      const colorLocation = gl.getUniformLocation(program, 'u_color');
      gl.uniform4f(colorLocation, 1, 0, 0, 1);
      gl.uniform2f(translationLocation, transform.x + trianglePosition.x, transform.y + trianglePosition.y);
      gl.uniform1f(scaleLocation, transform.scale);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      const vertices = new Float32Array([
        -0.5, -0.5,
         0.5, -0.5,
         0.0,  0.5
      ]);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    drawTriangle();
  }, [trianglePosition, transform]);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging && trianglePosition) {
      setTrianglePosition(prev => prev ? {
        x: prev.x + event.movementX / 250,
        y: prev.y - event.movementY / 250,
      } : prev);
    }
  };

  const handleWheel = (event: WheelEvent) => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.1, prev.scale * (event.deltaY > 0 ? 0.9 : 1.1))
    }));
  };

  const handleDrawTriangle = () => {
    setTrianglePosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isDragging]);

  return (
    <Column className='items-center' >
      <button type="button" onClick={handleDrawTriangle}>Draw Triangle</button>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', border: '1px solid black' }}
        onMouseDown={handleMouseDown}
      />
    </Column>
  );
};

export default Brainstorming;
