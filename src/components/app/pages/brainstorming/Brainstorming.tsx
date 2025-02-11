import { Column } from '@/components/design/Grid'
import * as PIXI from 'pixi.js'
import { useEffect, useRef, useState } from 'react'

const Brainstorming = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([{ x: 400, y: 300 }])

  useEffect(() => {
    if (!canvasRef.current) {
      console.error('Canvas ref is not attached')
      return
    }

    const pixiApp = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    })
    canvasRef.current.appendChild(pixiApp.view as HTMLCanvasElement)

    const container = new PIXI.Container()
    pixiApp.stage.addChild(container)

    // Add nodes
    nodes.forEach(({ x, y }) => {
      const circle = new PIXI.Graphics()
      circle.beginFill(0xff0000)
      circle.drawCircle(0, 0, 20)
      circle.endFill()
      circle.x = x
      circle.y = y
      container.addChild(circle)
    })

    // Handle zoom & pan
    let isDragging = false
    let startPosition = { x: 0, y: 0 }

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true
      startPosition = { x: event.clientX, y: event.clientY }
    }

    const handleMouseUp = () => {
      isDragging = false
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        container.x += event.clientX - startPosition.x
        container.y += event.clientY - startPosition.y
        startPosition = { x: event.clientX, y: event.clientY }
      }
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1
      container.scale.set(container.scale.x * scaleFactor)
    }

    if (pixiApp.view instanceof HTMLCanvasElement) {
      pixiApp.view.addEventListener('mousedown', handleMouseDown)
      pixiApp.view.addEventListener('mouseup', handleMouseUp)
      pixiApp.view.addEventListener('mousemove', handleMouseMove)
      pixiApp.view.addEventListener('wheel', handleWheel)
    }

    return () => {
      if (pixiApp.view instanceof HTMLCanvasElement) {
        pixiApp.view.removeEventListener('mousedown', handleMouseDown)
        pixiApp.view.removeEventListener('mouseup', handleMouseUp)
        pixiApp.view.removeEventListener('mousemove', handleMouseMove)
        pixiApp.view.removeEventListener('wheel', handleWheel)
        pixiApp.destroy(true, { children: true, texture: true })
      }
    }
  }, [nodes])

  const handleAddNode = () => {
    setNodes((prev) => [...prev, { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }])
  }

  return (
    <Column className="items-center fixed">
      <button type="button" onClick={handleAddNode}>
        Add Node
      </button>
      <div ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', border: '1px solid black' }} />
    </Column>
  )
}

export default Brainstorming
