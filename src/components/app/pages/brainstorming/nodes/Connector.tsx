import React, { useState, useRef } from 'react';

export interface ConnectorProps {
  angle: number; // angle in degrees relative to the node center
  onDrag?: (dx: number, dy: number) => void;
}

const Connector: React.FC<ConnectorProps> = ({ angle, onDrag }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    startPos.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    if (onDrag) onDrag(dx, dy);
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  // Base position on a circle (radius 50).
  const baseRadius = 50;
  const rad = (angle * Math.PI) / 180;
  const baseX = baseRadius * Math.cos(rad);
  const baseY = baseRadius * Math.sin(rad);

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${baseX + offset.x}px`,
    top: `${baseY + offset.y}px`,
    width: '10px',
    height: '10px',
    backgroundColor: '#333',
    borderRadius: '50%',
    cursor: 'pointer',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div
      style={style}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default Connector;
