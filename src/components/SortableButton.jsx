import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRef } from 'react'

export default function SortableButton({ btn, showLabels, onContextMenu }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: btn.id })

  const holdTimer = useRef(null)

  const style = {
    background: btn.color,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  }

  function handlePointerDown(e) {
    // Don't start context menu timer if touching drag handle
    if (e.target.closest('.drag-handle')) return
    holdTimer.current = setTimeout(() => {
      onContextMenu(btn, e)
    }, 700)
  }

  function handlePointerUp() {
    clearTimeout(holdTimer.current)
  }

  function handlePointerLeave() {
    clearTimeout(holdTimer.current)
  }

  return (
    <button
      ref={setNodeRef}
      style={style}
      className="aac-btn edit-mode"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      {...attributes}
      aria-label={btn.label}
    >
      {/* Drag handle — dnd-kit owns this entirely */}
      <span
        className="drag-handle"
        {...listeners}
      >
        ⠿
      </span>

      {btn.image
        ? <img src={btn.image} alt={btn.label} className="btn-img" />
        : <span className="btn-icon">{btn.icon}</span>
      }
      {showLabels && <span className="btn-label">{btn.label}</span>}
      <span className="btn-id">{btn.id}</span>
    </button>
  )
}