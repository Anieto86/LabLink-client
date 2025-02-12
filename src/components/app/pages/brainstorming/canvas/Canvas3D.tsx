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
 * Renders an ellipse with centered text.  
 * – On pointer down, we record the initial pointer (screen) position and the node’s world position.  
 * – On pointer move, we update the node’s position using a ray–plane intersection (the XY plane).  
 * – On pointer up, if the pointer hasn’t moved beyond a small threshold, we switch into inline editing mode.
 * The ellipse’s geometry is recomputed based on the current text so that it enlarges when more text is added.
 */
interface DraggableNodeProps {
  controlsRef: React.MutableRefObject<any>;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ controlsRef }) => {
  const { camera } = useThree();
  // Node's world position (starts at the origin)
  const [position, setPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  // The node's text
  const [nodeText, setNodeText] = useState("Click to edit");
  // Editing state: if true, the text becomes inline-editable
  const [editing, setEditing] = useState(false);

  // For dragging: we'll use a ray–plane intersection with the XY plane (z = 0)
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const startDragPoint = useRef(new THREE.Vector3());
  const initialNodePos = useRef(new THREE.Vector3());
  const dragging = useRef(false);
  // To determine if the pointer moved significantly (versus a click)
  const pointerDownPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerDown = (e: any) => {
    if (editing) return; // If already editing, ignore drag events.
    e.stopPropagation();
    dragging.current = true;
    // Record pointer-down screen position
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    // Capture pointer events (so you keep receiving events even if the pointer leaves the node)
    if (e.target.setPointerCapture) {
      e.target.setPointerCapture(e.pointerId);
    }
    // Disable OrbitControls during node drag
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }
    // Compute the intersection of the pointer ray with the XY plane
    if (e.ray) {
      e.ray.intersectPlane(plane, startDragPoint.current);
    }
    // Save the node's initial position
    initialNodePos.current.copy(position);
  };

  const handlePointerMove = (e: any) => {
    if (!dragging.current || editing) return;
    e.stopPropagation();
    const currentIntersection = new THREE.Vector3();
    if (e.ray) {
      e.ray.intersectPlane(plane, currentIntersection);
      // Calculate the delta from the initial intersection point
      const delta = new THREE.Vector3().subVectors(currentIntersection, startDragPoint.current);
      const newPos = new THREE.Vector3().copy(initialNodePos.current).add(delta);
      newPos.z = 0; // Constrain movement to the XY plane
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
    // Determine if the pointer moved only a tiny bit (i.e. it was a click, not a drag)
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const threshold = 5; // pixels
    if (dist < threshold) {
      // If it was a click, enter editing mode
      setEditing(true);
    }
  };

  // Compute a dynamic ellipse shape based on the text length.
  // (For simplicity, we assume a fixed height and use text length * 8 as an approximation for width.)
  const ellipse = useMemo(() => {
    const minWidth = 100,
          minHeight = 60;
    const computedWidth = Math.max(minWidth, nodeText.length * 8);
    const computedHeight = minHeight; // You could enhance this for multiline text.
    const shape = new THREE.Shape();
    shape.absellipse(0, 0, computedWidth / 2, computedHeight / 2, 0, Math.PI * 2, false, 0);
    return shape;
  }, [nodeText]);

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
      {/* Show the text if not in editing mode */}
      {!editing && (
        <Text position={[0, 0, 0.1]} fontSize={16} color="#000000" anchorX="center" anchorY="middle">
          {nodeText}
        </Text>
      )}
      {/* When editing, render an inline contentEditable element using Drei’s Html */}
      {editing && (
        <Html center>
          <div
            contentEditable
            style={{
              fontSize: '16px',
              padding: '4px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#000000',
              textAlign: 'center',
            }}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              // Update the node text and exit editing mode when focus is lost
              setNodeText(e.currentTarget.innerText);
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                // Exit editing mode when Enter is pressed
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
  // Create a ref for OrbitControls so we can disable/enable it during node dragging.
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
