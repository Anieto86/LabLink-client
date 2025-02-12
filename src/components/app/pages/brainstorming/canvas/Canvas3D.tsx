import React, { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Html } from '@react-three/drei'
import * as THREE from 'three'

const GRID_SIZE = 2000
const GRID_DIVISIONS = 100
const MIN_ZOOM = 0.4
const MAX_ZOOM = 20

const GridBackground = () => (
  <gridHelper args={[GRID_SIZE, GRID_DIVISIONS, '#bbbbbb', '#dddddd']} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -10]} />
)

interface DraggableNodeProps {
  controlsRef: React.MutableRefObject<any>
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ controlsRef }) => {
  const { camera } = useThree()
  const [position, setPosition] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const [nodeText, setNodeText] = useState('Click to edit')
  const [editing, setEditing] = useState(false)
  const [editingMinWidth, setEditingMinWidth] = useState<number>(100)

  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  const startDragPoint = useRef(new THREE.Vector3())
  const initialNodePos = useRef(new THREE.Vector3())
  const dragging = useRef(false)
  const pointerDownPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const contentEditableRef = useRef<HTMLDivElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)

  const handlePointerDown = (e: any) => {
    if (editing) return
    e.stopPropagation()
    dragging.current = true
    pointerDownPos.current = { x: e.clientX, y: e.clientY }
    if (e.target.setPointerCapture) e.target.setPointerCapture(e.pointerId)
    controlsRef.current.enabled = false
    if (e.ray) e.ray.intersectPlane(plane, startDragPoint.current)
    initialNodePos.current.copy(position)
  }

  const handlePointerMove = (e: any) => {
    if (!dragging.current || editing) return
    e.stopPropagation()
    const currentIntersection = new THREE.Vector3()
    if (e.ray) {
      e.ray.intersectPlane(plane, currentIntersection)
      const delta = new THREE.Vector3().subVectors(currentIntersection, startDragPoint.current)
      const newPos = initialNodePos.current.clone().add(delta)
      newPos.z = 0
      setPosition(newPos)
    }
  }

  const handlePointerUp = (e: any) => {
    e.stopPropagation()
    if (e.target.releasePointerCapture) e.target.releasePointerCapture(e.pointerId)
    dragging.current = false
    controlsRef.current.enabled = true

    const dx = e.clientX - pointerDownPos.current.x
    const dy = e.clientY - pointerDownPos.current.y
    if (Math.sqrt(dx * dx + dy * dy) < 5) {
      const currentWidth = Math.max(100, nodeText.length * 8)
      setEditingMinWidth(currentWidth)
      setEditing(true)
    }
  }

  const ellipse = useMemo(() => {
    const minHeight = 60
    const computedWidth = editing ? Math.max(editingMinWidth, nodeText.length * 8) : Math.max(100, nodeText.length * 8)

    const shape = new THREE.Shape()
    shape.absellipse(0, 0, computedWidth / 2, minHeight / 2, 0, Math.PI * 2, false, 0)
    return shape
  }, [nodeText, editing, editingMinWidth])

  return (
    <group position={position} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <mesh>
        <shapeGeometry args={[ellipse, 64]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {!editing && (
        <Text position={[0, 0, 0.1]} fontSize={16} color="#000000" anchorX="center" anchorY="middle">
          {nodeText}
        </Text>
      )}

      {editing && (
        <Html center transform>
          <div
            ref={contentEditableRef}
            contentEditable
            style={{
              fontSize: '650px',
              width: `${editingMinWidth * 100}px`,
              textAlign: 'center',
              direction: 'ltr',
              whiteSpace: 'nowrap',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#000000',
              padding: '4px',
              transformOrigin: 'center',
              caretColor: 'transparent'
            }}
            suppressContentEditableWarning
            onInput={(e) => setNodeText(e.currentTarget.innerText)}
            onBlur={(e) => {
              setNodeText(e.currentTarget.innerText)
              setEditing(false)
            }}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          >
            {nodeText}
          </div>
        </Html>
      )}
    </group>
  )
}

const Scene = () => {
  const controlsRef = useRef<any>(null)
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
        mouseButtons={{
          LEFT: THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        }}
      />
    </>
  )
}

const Canvas3D: React.FC = () => (
  <Canvas camera={{ position: [0, 0, 100], zoom: 1 }} orthographic style={{ width: '100vw', height: '100vh', background: '#ffffff' }}>
    <Scene />
  </Canvas>
)

export default Canvas3D