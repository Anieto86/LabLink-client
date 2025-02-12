import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

// Constants
const GRID_SIZE = 4000
const GRID_DIVISIONS = 100
const MIN_ZOOM = 0.4
const MAX_ZOOM = 20

// Grid Background
const GridBackground = () => (
  <gridHelper args={[GRID_SIZE, GRID_DIVISIONS, '#bbbbbb', '#dddddd']} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]} />
)

// 🟩 Draggable & Always Editable Text Node
const DraggableNode: React.FC<{ controlsRef: React.MutableRefObject<any> }> = ({ controlsRef }) => {
  const { camera } = useThree()
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0))
  const [nodeText, setNodeText] = useState('Click to edit')
  const [boxWidth, setBoxWidth] = useState(0)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  // Adjust box size dynamically
  useEffect(() => {
    const lines = nodeText.split('\n')
    const longestLine = lines.reduce((max, line) => (line.length > max ? line.length : max), 0)

    setBoxWidth(Math.max(30, longestLine * 3.6)) // Bigger width scaling
  }, [nodeText])

  return (
    <group position={position}>
      {/* 🟩 Rounded Rectangle Shape */}
      <mesh>
        <shapeGeometry
          args={[
            new THREE.Shape()
              .moveTo(-boxWidth / 2, -10)
              .lineTo(boxWidth / 2, -10)
              .quadraticCurveTo(boxWidth / 2 + 10, -10, boxWidth / 2 + 10, -5)
              .lineTo(boxWidth / 2 + 10, 5)
              .quadraticCurveTo(boxWidth / 2 + 10, 10, boxWidth / 2, 10)
              .lineTo(-boxWidth / 2, 10)
              .quadraticCurveTo(-boxWidth / 2 - 10, 10, -boxWidth / 2 - 10, 5)
              .lineTo(-boxWidth / 2 - 10, -5)
              .quadraticCurveTo(-boxWidth / 2 - 10, -10, -boxWidth / 2, -10),
            64
          ]}
        />

        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* 📝 Always Editable Text Area */}
      <Html center transform>
        <textarea
          ref={textAreaRef}
          value={nodeText}
          onChange={(e) => setNodeText(e.target.value)}
          style={{
            fontSize: `${300 * camera.zoom}px`, // BIGGER TEXT SIZE
            fontWeight: 'bold',
            width: `${boxWidth * 1000}px`,
            height: 'auto',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#000000',
            overflow: 'hidden',
            resize: 'none',
            caretColor: 'black',
            transform: `scale(${1 / camera.zoom})`,
            transformOrigin: 'center'
          }}
        />
      </Html>
    </group>
  )
}

// 🎬 Main Scene
const Scene = () => {
  const controlsRef = useRef<any>(null)
  return (
    <>
      <GridBackground />
      <DraggableNode controlsRef={controlsRef} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls ref={controlsRef} enableRotate={false} enablePan={true} minZoom={MIN_ZOOM} maxZoom={MAX_ZOOM} />
    </>
  )
}

// 🖥 Canvas Container
const Canvas3D: React.FC = () => (
  <Canvas camera={{ position: [0, 0, 20], zoom: 3 }} orthographic style={{ width: '100vw', height: '100vh', background: '#ffffff' }}>
    <Scene />
  </Canvas>
)

export default Canvas3D
