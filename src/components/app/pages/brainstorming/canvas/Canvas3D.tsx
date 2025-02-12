import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// Constants for grid and zoom
const GRID_SIZE = 2000;
const GRID_DIVISIONS = 100;
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 20;

/**
 * GridBackground  
 * Renders a grid helper rotated to lie on the XY plane and positioned behind the scene.
 */
const GridBackground = () => (
  <gridHelper 
    args={[GRID_SIZE, GRID_DIVISIONS, '#bbbbbb', '#dddddd']} 
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, 0, -10]} 
  />
);

/**
 * DraggableNode  
 * Renders an ellipse with centered text that can be click‑and‑dragged.
 * A click (without dragging) puts the node into inline editing mode.
 * While editing, the ellipse resizes in real time, but it never shrinks below its initial size.
 */
interface DraggableNodeProps {
  controlsRef: React.MutableRefObject<any>;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ controlsRef }) => {
  const { camera } = useThree();
  // The node’s world position (starts at [0,0,0])
  const [position, setPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  // The node’s text
  const [nodeText, setNodeText] = useState("Click to edit");
  // Editing state
  const [editing, setEditing] = useState(false);
  // When editing begins, we record the current ellipse width so that it never shrinks
  const [editingMinWidth, setEditingMinWidth] = useState<number>(100);

  // For dragging: we use a ray–plane intersection with the XY plane (z = 0)
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const startDragPoint = useRef(new THREE.Vector3());
  const initialNodePos = useRef(new THREE.Vector3());
  const dragging = useRef(false);
  // Record pointer-down screen coordinates to distinguish a click from a drag
  const pointerDownPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerDown = (e: any) => {
    if (editing) return; // Ignore drag events during editing
    e.stopPropagation();
    dragging.current = true;
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    if (e.target.setPointerCapture) {
      e.target.setPointerCapture(e.pointerId);
    }
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
    if (e.ray) {
      e.ray.intersectPlane(plane, startDragPoint.current);
    }
    initialNodePos.current.copy(position);
  };

  const handlePointerMove = (e: any) => {
    if (!dragging.current || editing) return;
    e.stopPropagation();
    const currentIntersection = new THREE.Vector3();
    if (e.ray) {
      e.ray.intersectPlane(plane, currentIntersection);
      const delta = new THREE.Vector3().subVectors(currentIntersection, startDragPoint.current);
      const newPos = new THREE.Vector3().copy(initialNodePos.current).add(delta);
      newPos.z = 0;
      setPosition(newPos);
    }
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    if (e.target.releasePointerCapture) {
      e.target.releasePointerCapture(e.pointerId);
    }
    dragging.current = false;
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
    }
    // If the pointer moved only a tiny bit, treat it as a click
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const threshold = 5; // pixels
    if (dist < threshold) {
      // On click, store the current computed width as the minimum width for editing
      const minWidth = 100;
      const currentWidth = Math.max(minWidth, nodeText.length * 8);
      setEditingMinWidth(currentWidth);
      setEditing(true);
    }
  };

  // Compute a dynamic ellipse shape based on the text.
  // When editing, the width will never go below editingMinWidth.
  const ellipse = useMemo(() => {
    const minWidth = 100;
    const minHeight = 60;
    const computedWidth = editing
      ? Math.max(editingMinWidth, nodeText.length * 8)
      : Math.max(minWidth, nodeText.length * 8);
    const computedHeight = minHeight;
    const shape = new THREE.Shape();
    shape.absellipse(0, 0, computedWidth / 2, computedHeight / 2, 0, Math.PI * 2, false, 0);
    return shape;
  }, [nodeText, editing, editingMinWidth]);

  return (
    <group
      position={position}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Ellipse Mesh that uses the dynamic shape */}
      <mesh>
        <shapeGeometry args={[ellipse, 64]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Show the text if not editing */}
      {!editing && (
        <Text position={[0, 0, 0.1]} fontSize={16} color="#000000" anchorX="center" anchorY="middle">
          {nodeText}
        </Text>
      )}
      {/* When editing, render an inline contentEditable element via Drei’s Html */}
      {editing && (
        <Html center>
          <div
            contentEditable
            style={{
              fontSize: '16px',
              width: `${Math.max(editingMinWidth, nodeText.length * 8)}px`,
              textAlign: 'center',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#000000',
              // Keep the same padding as in non-edit mode (if desired)
              padding: '4px',
            }}
            suppressContentEditableWarning={true}
            onInput={(e) => {
              // Update text live as the user types so that the ellipse resizes in real time
              setNodeText(e.currentTarget.innerText);
            }}
            onBlur={(e) => {
              setNodeText(e.currentTarget.innerText);
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
          >
            {nodeText}
          </div>
        </Html>
      )}
    </group>
  );
};

/**
 * Scene  
 * Contains the grid background, the draggable node, lights, and OrbitControls.
 */
const Scene = () => {
  const controlsRef = useRef<any>(null);
  return (
    <>
      <GridBackground />
      <DraggableNode controlsRef={controlsRef} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls
        ref={controlsRef}
        enableRotate={false}
        enablePan={true}
        screenSpacePanning={true}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        dollyToCursor={true}
        enableDamping={false}
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
      />
    </>
  );
};

/**
 * Canvas3D  
 * The main container that uses an orthographic camera for a 2D whiteboard feel.
 */
const Canvas3D: React.FC = () => (
  <Canvas
    camera={{ position: [0, 0, 100], zoom: 1 }}
    orthographic
    style={{ width: '100vw', height: '100vh', background: '#ffffff' }}
  >
    <Scene />
  </Canvas>
);

export default Canvas3D;
