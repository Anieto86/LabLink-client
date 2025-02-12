import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const GRID_SIZE = 10000;       // A large grid area for an "infinite" feel
const GRID_DIVISIONS = 1000;
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 20;

const GridBackground = () => {
  return (
    // By default, gridHelper is on the XZ plane.
    // Rotate it -90° about the X axis so that it lies on the XY plane.
    <gridHelper 
      args={[GRID_SIZE, GRID_DIVISIONS, '#bbbbbb', '#dddddd']} 
      rotation={[-Math.PI / 2, 0, 0]}
      // Position it behind our objects (our example sphere is at Z=0)
      position={[0, 0, -10]} 
    />
  );
};

const Scene = () => {
  return (
    <>
      {/* Background grid on the XY plane */}
      <GridBackground />

      {/* Example node: a red sphere at the origin */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* OrbitControls for panning and zooming */}
      <OrbitControls 
        enableRotate={false}               // Disable rotation so that dragging pans
        enablePan={true}                   // Allow panning
        screenSpacePanning={true}          // Panning follows mouse movement in screen space
        minZoom={MIN_ZOOM}                 // Minimum zoom factor
        maxZoom={MAX_ZOOM}                 // Maximum zoom factor
        dollyToCursor={true}               // Zoom toward the mouse cursor
        enableDamping={false} 
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,           // Left button pans
          MIDDLE: THREE.MOUSE.DOLLY,         // Middle button zooms/dollies
          RIGHT: THREE.MOUSE.PAN           // Right button pans too
        }}
      />
    </>
  );
};

const Canvas3D: React.FC = () => {
  return (
    <Canvas
      // Use an orthographic camera for a flat, 2D-like view.
      // The camera is placed at Z = 100 looking toward the origin.
      camera={{ position: [0, 0, 100], zoom: 1 }}
      orthographic
      style={{ width: '100vw', height: '100vh', background: '#ffffff' }}
    >
      <Scene />
    </Canvas>
  );
};

export default Canvas3D;
