import { Column } from '@/components/design/Grid'
import * as PIXI from 'pixi.js'
import { useEffect, useRef, useState } from 'react'

const Brainstorming = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  // A sample node for demonstration.
  const [nodes, setNodes] = useState([{ x: 400, y: 300 }])

  useEffect(() => {
    if (!canvasRef.current) return

    // Create the PIXI application with the view typed as HTMLCanvasElement.
    const app = new PIXI.Application<HTMLCanvasElement>({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    })
    canvasRef.current.appendChild(app.view)

    // ----------------------------------------------------------------
    // 1. Create the main "world" container that will be panned/zoomed.
    // ----------------------------------------------------------------
    const container = new PIXI.Container()
    app.stage.addChild(container)

    // ----------------------------------------------------------------
    // 2. Create a grid Graphics object as a child of the container.
    //    (Drawing in world coordinates makes the grid scale along with the world.)
    // ----------------------------------------------------------------
    const gridGraphics = new PIXI.Graphics()
    container.addChild(gridGraphics)

    // ----------------------------------------------------------------
    // 3. Create a container for your nodes (so the grid appears behind them).
    // ----------------------------------------------------------------
    const nodesContainer = new PIXI.Container()
    container.addChild(nodesContainer)

    // ----------------------------------------------------------------
    // 4. Grid settings:
    //    - minorSpacing: the world-unit spacing for the fine grid.
    //    - groupFactor: how many minor cells per major cell.
    //      (The major grid lines will be drawn every groupFactor * minorSpacing.)
    // ----------------------------------------------------------------
    const minorSpacing = 100 // Adjust this to change the size of the small squares.
    const groupFactor = 5    // Every 5 minor cells, draw a thicker major line.
    const majorSpacing = minorSpacing * groupFactor

    // ----------------------------------------------------------------
    // 5. Update grid function:
    //    Computes the visible area in world coordinates and draws both minor
    //    and major grid lines.
    //    We adjust the line thickness so that it remains constant in screen space.
    // ----------------------------------------------------------------
    const updateGrid = () => {
      gridGraphics.clear()

      // Compute the visible area in world coordinates.
      const scale = container.scale.x // assume uniform scale (x === y)
      const visibleLeft = -container.x / scale
      const visibleTop = -container.y / scale
      const visibleRight = visibleLeft + window.innerWidth / scale
      const visibleBottom = visibleTop + window.innerHeight / scale

      // --- Draw minor grid lines (desired 1px thickness on screen) ---
      const desiredMinorThickness = 1 // in screen pixels
      const minorThickness = desiredMinorThickness / scale
      gridGraphics.lineStyle(minorThickness, 0xeeeeee, 1)
      const startX_minor = Math.floor(visibleLeft / minorSpacing) * minorSpacing
      const startY_minor = Math.floor(visibleTop / minorSpacing) * minorSpacing
      for (let x = startX_minor; x <= visibleRight; x += minorSpacing) {
        gridGraphics.moveTo(x, visibleTop)
        gridGraphics.lineTo(x, visibleBottom)
      }
      for (let y = startY_minor; y <= visibleBottom; y += minorSpacing) {
        gridGraphics.moveTo(visibleLeft, y)
        gridGraphics.lineTo(visibleRight, y)
      }

      // --- Draw major grid lines (desired 2px thickness on screen) ---
      const desiredMajorThickness = 2 // in screen pixels
      const majorThickness = desiredMajorThickness / scale
      gridGraphics.lineStyle(majorThickness, 0xcccccc, 1)
      const startX_major = Math.floor(visibleLeft / majorSpacing) * majorSpacing
      const startY_major = Math.floor(visibleTop / majorSpacing) * majorSpacing
      for (let x = startX_major; x <= visibleRight; x += majorSpacing) {
        gridGraphics.moveTo(x, visibleTop)
        gridGraphics.lineTo(x, visibleBottom)
      }
      for (let y = startY_major; y <= visibleBottom; y += majorSpacing) {
        gridGraphics.moveTo(visibleLeft, y)
        gridGraphics.lineTo(visibleRight, y)
      }
    }

    // Draw the grid initially.
    updateGrid()

    // ----------------------------------------------------------------
    // 6. Add sample node(s).
    // ----------------------------------------------------------------
    nodes.forEach(({ x, y }) => {
      const node = new PIXI.Graphics()
      node.beginFill(0xff0000)
      node.drawCircle(0, 0, 20)
      node.endFill()
      node.x = x
      node.y = y
      nodesContainer.addChild(node)
    })

    // ----------------------------------------------------------------
    // 7. Set up panning and zooming.
    //    (After each update, call updateGrid() so the grid redraws correctly.)
    // ----------------------------------------------------------------
    const minScale = 0.2
    const maxScale = 3
    let isDragging = false
    let dragStart = { x: 0, y: 0 }
    let containerStart = { x: 0, y: 0 }

    app.view!.addEventListener('mousedown', (e: Event) => {
      const me = e as MouseEvent
      isDragging = true
      dragStart = { x: me.clientX, y: me.clientY }
      containerStart = { x: container.x, y: container.y }
    })
    app.view!.addEventListener('mouseup', () => {
      isDragging = false
    })
    app.view!.addEventListener('mousemove', (e: Event) => {
      if (!isDragging) return
      const me = e as MouseEvent
      container.x = containerStart.x + (me.clientX - dragStart.x)
      container.y = containerStart.y + (me.clientY - dragStart.y)
      updateGrid()
    })
    app.view!.addEventListener('wheel', (e: Event) => {
      e.preventDefault()
      const me = e as WheelEvent
      const scaleFactor = me.deltaY > 0 ? 0.9 : 1.1
      // Use non-null assertion on getBoundingClientRect() since app.view is attached.
      const rect = (app.view as HTMLCanvasElement).getBoundingClientRect()
      const mouseX = me.clientX - rect.left
      const mouseY = me.clientY - rect.top
      // Compute the world coordinate under the mouse before zoom.
      const worldX = (mouseX - container.x) / container.scale.x
      const worldY = (mouseY - container.y) / container.scale.y
      let newScale = container.scale.x * scaleFactor
      newScale = Math.max(minScale, Math.min(maxScale, newScale))
      container.scale.set(newScale)
      // Adjust container position so the zoom centers on the mouse.
      container.x = mouseX - worldX * newScale
      container.y = mouseY - worldY * newScale
      updateGrid()
    })

    // ----------------------------------------------------------------
    // 8. Cleanup when the component unmounts.
    // ----------------------------------------------------------------
    return () => {
      app.destroy(true, { children: true, texture: true })
    }
  }, [nodes])

  const handleAddNode = () => {
    setNodes((prev) => [
      ...prev,
      {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      }
    ])
  }

  return (
    <Column className="items-center fixed">
      <button type="button" onClick={handleAddNode}>Add Node</button>
      <div
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid black'
        }}
      />
    </Column>
  )
}

export default Brainstorming
