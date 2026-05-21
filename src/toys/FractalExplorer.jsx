import { useEffect, useRef, useState } from 'react'

const MAX_ITER = 100
const MAX_ZOOM = 1e12

function mandelbrot(cx, cy) {
  let x = 0, y = 0, iter = 0
  while (x * x + y * y <= 4 && iter < MAX_ITER) {
    let xNew = x * x - y * y + cx
    y = 2 * x * y + cy
    x = xNew
    iter++
  }
  return iter
}

function getColor(iter) {
  if (iter === MAX_ITER) return [0, 0, 0]
  const t = iter / MAX_ITER
  const r = Math.floor(9 * (1 - t) * t * t * t * 255)
  const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255)
  const b = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255)
  return [r, g, b]
}

export default function FractalExplorer() {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    cx: -0.5,
    cy: 0,
    zoom: 200,
    rendering: false,
  })
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  // Touch tracking
  const touchRef = useRef({
    lastX: 0,
    lastY: 0,
    lastDist: 0,
    touching: false,
  })

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    const { cx, cy, zoom } = stateRef.current
    const imageData = ctx.createImageData(W, H)
    const data = imageData.data

    for (let px = 0; px < W; px++) {
      for (let py = 0; py < H; py++) {
        const x = (px - W / 2) / zoom + cx
        const y = (py - H / 2) / zoom + cy
        const iter = mandelbrot(x, y)
        const [r, g, b] = getColor(iter)
        const idx = (py * W + px) * 4
        data[idx] = r
        data[idx + 1] = g
        data[idx + 2] = b
        data[idx + 3] = 255
      }
    }
    ctx.putImageData(imageData, 0, 0)
  }

  function scheduleDraw() {
    requestAnimationFrame(draw)
  }

  // Touch handlers
  function handleTouchStart(e) {
    e.preventDefault()
    const t = touchRef.current
    if (e.touches.length === 1) {
      t.lastX = e.touches[0].clientX
      t.lastY = e.touches[0].clientY
      t.touching = true
    } else if (e.touches.length === 2) {
      t.lastDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
    }
  }

  function handleTouchMove(e) {
    e.preventDefault()
    const t = touchRef.current
    const s = stateRef.current
    const canvas = canvasRef.current

    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - t.lastX
      const dy = e.touches[0].clientY - t.lastY
      s.cx -= dx / s.zoom
      s.cy -= dy / s.zoom
      t.lastX = e.touches[0].clientX
      t.lastY = e.touches[0].clientY
      scheduleDraw()
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      )
      const scale = dist / t.lastDist
      const newZoom = s.zoom * scale

      // Max zoom guard — no void!
      if (newZoom < MAX_ZOOM) {
        s.zoom = newZoom
      }

      t.lastDist = dist
      scheduleDraw()
    }
  }

  function handleTouchEnd(e) {
    touchRef.current.touching = false
  }

  // Mouse handlers for desktop testing
  const mouseRef = useRef({ down: false, lastX: 0, lastY: 0 })

  function handleMouseDown(e) {
    mouseRef.current = { down: true, lastX: e.clientX, lastY: e.clientY }
  }

  function handleMouseMove(e) {
    if (!mouseRef.current.down) return
    const s = stateRef.current
    const dx = e.clientX - mouseRef.current.lastX
    const dy = e.clientY - mouseRef.current.lastY
    s.cx -= dx / s.zoom
    s.cy -= dy / s.zoom
    mouseRef.current.lastX = e.clientX
    mouseRef.current.lastY = e.clientY
    scheduleDraw()
  }

  function handleMouseUp() {
    mouseRef.current.down = false
  }

  function handleWheel(e) {
    e.preventDefault()
    const s = stateRef.current
    const scale = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = s.zoom * scale
    if (newZoom < MAX_ZOOM) {
      s.zoom = newZoom
      scheduleDraw()
    }
  }

  function handleReset() {
    stateRef.current.cx = -0.5
    stateRef.current.cy = 0
    stateRef.current.zoom = 200
    scheduleDraw()
  }

  function toggleMusic() {
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/AppTune1.mp3')
      audioRef.current.loop = true
    }
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => console.log('No audio file found'))
    }
    setPlaying(!playing)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    draw()

    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  return (
    <div className="fractal-container">
      <canvas
        ref={canvasRef}
        className="fractal-canvas"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />
      <div className="fractal-controls">
        <button className="fractal-btn" onClick={toggleMusic}>
          {playing ? '🔊' : '🔈'}
        </button>
        <button className="fractal-btn" onClick={handleReset}>
          🏠
        </button>
      </div>
    </div>
  )
}