import { useRef } from 'react'

export default function AACButton({ btn, editMode, onSpeak, onHoldSpeak, onContextMenu, showLabels }) {
  const holdTimer = useRef(null)
  const didHold = useRef(false)

  function handlePointerDown(e) {
    e.preventDefault()
    didHold.current = false

    if (editMode) {
      holdTimer.current = setTimeout(() => {
        didHold.current = true
        onContextMenu(btn, e)
      }, 700)
    } else {
      if (btn.dd && btn.dd.length > 0) {
        holdTimer.current = setTimeout(() => {
          didHold.current = true
          onHoldSpeak(btn)
        }, 1000)
      }
    }
  }

  function handlePointerUp() {
    clearTimeout(holdTimer.current)
    if (!didHold.current) {
      if (!editMode) {
        onSpeak(btn)
      }
    }
  }

  function handlePointerLeave() {
    clearTimeout(holdTimer.current)
  }

  const hasDD = btn.dd && btn.dd.length > 0

  return (
    <button
      className={`aac-btn ${editMode ? 'edit-mode' : ''}`}
      style={{ background: btn.color }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      aria-label={btn.label}
    >
      {!editMode && hasDD && <span className="hold-badge">HOLD</span>}
      {editMode && <span className="drag-handle">⠿</span>}

      {btn.image
        ? <img src={btn.image} alt={btn.label} className="btn-img" />
        : <span className="btn-icon">{btn.icon}</span>
      }

      {showLabels && <span className="btn-label">{btn.label}</span>}
      <span className="btn-id">{btn.id}</span>
    </button>
  )
}