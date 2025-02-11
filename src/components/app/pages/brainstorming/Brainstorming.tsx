import React, { useRef, useEffect, useState } from 'react';

const Brainstorming = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trianglePosition, setTrianglePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const vertexShaderSource = `
      attribute vec2 a_position;
      uniform vec2 u_translation;
      void main() {
        gl_Position = vec4(a_position + u_translation, 0, 1);
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
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clearColor(1, 1, 1, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const program = createProgram();
      gl.useProgram(program);

      const positionLocation = gl.getAttribLocation(program, 'a_position');
      const translationLocation = gl.getUniformLocation(program, 'u_translation');
      const colorLocation = gl.getUniformLocation(program, 'u_color');
      gl.uniform4f(colorLocation, 1, 0, 0, 1);
      gl.uniform2f(translationLocation, trianglePosition.x, trianglePosition.y);

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
  }, [trianglePosition]);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      setTrianglePosition(prev => ({
        x: prev.x + event.movementX / 250,
        y: prev.y - event.movementY / 250,
      }));
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div>
      <button id="drawTriangle">Draw Triangle</button>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ display: 'block', border: '1px solid black' }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default Brainstorming;
