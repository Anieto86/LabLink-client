import Canvas3D from '@/components/app/pages/brainstorming/canvas/Canvas3D';
import FloatingMenu from '@/components/app/pages/brainstorming/ui/FloatingMenu';
import React from 'react';

const Brainstorming: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Render the Three.js Canvas */}
      <Canvas3D />
      <FloatingMenu />
    </div>
  );
};

export default Brainstorming;
