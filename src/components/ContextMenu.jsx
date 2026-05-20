import { useEffect, useRef } from 'react'

const MENU_ITEMS = [
  { id: 'photo',   icon: '🖼️', label: 'Replace Photo'  },
  { id: 'audio',   icon: '🎵', label: 'Replace Audio'  },
  { id: 'label',   icon: '🏷️', label: 'Edit Label'     },
  { id: 'submenu', icon: '📂', label: 'Go to Sub-Menu' },
  { id: 'remove',  icon: '🗑️', label: 'Remove Button'  },
]

export default function ContextMenu({ btn, position, onAction, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('pointerdown', handleClick)
    return () => document.removeEventListener('pointerdown', handleClick)
  }, [onClose])

  return (
    <div
      className="context-menu"
      ref={ref}
      style={{ top: position.y, left: position.x }}
    >
      <div className="context-menu-title">{btn.label}</div>
      {MENU_ITEMS.map(item => (
        <button
          key={item.id}
          className={`context-item ${item.id === 'remove' ? 'danger' : ''}`}
          onClick={() => { onAction(item.id, btn); onClose() }}
        >
          <span className="context-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}