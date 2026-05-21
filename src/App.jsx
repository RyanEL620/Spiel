import { useState, useRef, useEffect } from 'react'
import { DEFAULT_BOARD, FACTORY_DEFAULT } from './data/board'
import { toAudioPath } from './utils/paths'
import TopBar from './components/TopBar'
import OutputBar from './components/OutputBar'
import NavBar from './components/NavBar'
import Grid from './components/Grid'
import EditFAB from './components/EditFAB'
import ContextMenu from './components/ContextMenu'
import PinPrompt from './components/PinPrompt'
import Settings from './components/Settings'
import MyStuff from './pages/MyStuff'
import './App.css'

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function generateId(board) {
  const ids = board.map(b => parseInt(b.id.replace('A', ''))).filter(n => !isNaN(n))
  const max = ids.length ? Math.max(...ids) : 0
  return `A${max + 1}`
}

function generateDDId(parent) {
  const ids = parent.dd.map(b => parseInt(b.id.split('_DD')[1])).filter(n => !isNaN(n))
  const max = ids.length ? Math.max(...ids) : 0
  return `${parent.id}_DD${max + 1}`
}

export default function App() {
  const [board, setBoard] = useState(() => {
    try {
      const saved = localStorage.getItem('spiel_board')
      return saved ? JSON.parse(saved) : deepClone(DEFAULT_BOARD)
    } catch {
      return deepClone(DEFAULT_BOARD)
    }
  })
  const [currentParent, setCurrentParent] = useState(null)

  const sessionSnapshot = useRef(deepClone(DEFAULT_BOARD))
  const editSnapshot = useRef(null)

  const [output, setOutput] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [showLabels, setShowLabels] = useState(() => {
    try {
      const saved = localStorage.getItem('spiel_showLabels')
      return saved !== null ? JSON.parse(saved) : true
    } catch {
      return true
    }
  })
  const [showPin, setShowPin] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showMyStuff, setShowMyStuff] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)

  useEffect(() => {
    localStorage.setItem('spiel_board', JSON.stringify(board))
  }, [board])

  useEffect(() => {
    localStorage.setItem('spiel_showLabels', JSON.stringify(showLabels))
  }, [showLabels])

  const currentButtons = currentParent
    ? board.find(b => b.id === currentParent.id)?.dd || []
    : board

  function speak(btn) {
    setOutput(btn.label)
    const audioPath = btn.audio || toAudioPath(btn.label)
    const audio = new Audio(audioPath)
    audio.play().catch(() => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
        const u = new SpeechSynthesisUtterance(btn.label)
        u.rate = 0.88
        u.volume = 1

        // Get available voices on this device
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          // Prefer english voice, take whatever is available
          const english = voices.find(v => v.lang.startsWith('en')) || voices[0]
          u.voice = english
        }

        setTimeout(() => {
          window.speechSynthesis.speak(u)
        }, 100)
      }
    })
  }

  function handleDrillDown(btn) {
    setCurrentParent(btn)
  }

  function handleBack() {
    setCurrentParent(null)
  }

  function handleEditModeChange(val) {
    if (val) {
      editSnapshot.current = deepClone(board)
    }
    setEditMode(val)
  }

  function handleContextMenu(btn, e) {
    const rect = e.target.getBoundingClientRect()
    setContextMenu({
      btn,
      position: { x: rect.left, y: rect.bottom + 8 }
    })
  }

  function handleContextAction(action, btn) {
    if (action === 'remove') handleRemoveButton(btn)
    else if (action === 'label') handleEditLabel(btn)
    else if (action === 'photo') handleReplacePhoto(btn)
    else if (action === 'audio') handleReplaceAudio(btn)
    else if (action === 'submenu') handleGoToSubMenu(btn)
  }

  function handleRemoveButton(btn) {
    if (!window.confirm(`Remove "${btn.label}"?`)) return
    setBoard(prev => {
      const next = deepClone(prev)
      if (currentParent) {
        const parent = next.find(b => b.id === currentParent.id)
        parent.dd = parent.dd.filter(b => b.id !== btn.id)
      } else {
        return next.filter(b => b.id !== btn.id)
      }
      return next
    })
  }

  function handleEditLabel(btn) {
    const newLabel = window.prompt('Enter new label:', btn.label)
    if (!newLabel || !newLabel.trim()) return
    setBoard(prev => {
      const next = deepClone(prev)
      if (currentParent) {
        const parent = next.find(b => b.id === currentParent.id)
        const target = parent.dd.find(b => b.id === btn.id)
        target.label = newLabel.trim()
      } else {
        const target = next.find(b => b.id === btn.id)
        target.label = newLabel.trim()
      }
      return next
    })
  }

  function handleReplacePhoto(btn) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      setBoard(prev => {
        const next = deepClone(prev)
        if (currentParent) {
          const parent = next.find(b => b.id === currentParent.id)
          const target = parent.dd.find(b => b.id === btn.id)
          target.image = url
        } else {
          const target = next.find(b => b.id === btn.id)
          target.image = url
        }
        return next
      })
    }
    input.click()
  }

  function handleReplaceAudio(btn) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'audio/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const url = URL.createObjectURL(file)
      setBoard(prev => {
        const next = deepClone(prev)
        if (currentParent) {
          const parent = next.find(b => b.id === currentParent.id)
          const target = parent.dd.find(b => b.id === btn.id)
          target.audio = url
        } else {
          const target = next.find(b => b.id === btn.id)
          target.audio = url
        }
        return next
      })
    }
    input.click()
  }

  function handleGoToSubMenu(btn) {
    const mainBtn = board.find(b => b.id === btn.id)
    if (mainBtn) setCurrentParent(mainBtn)
  }

  function handleReorder(activeId, overId) {
    setBoard(prev => {
      const next = deepClone(prev)
      if (currentParent) {
        const parent = next.find(b => b.id === currentParent.id)
        const oldIndex = parent.dd.findIndex(b => b.id === activeId)
        const newIndex = parent.dd.findIndex(b => b.id === overId)
        const [moved] = parent.dd.splice(oldIndex, 1)
        parent.dd.splice(newIndex, 0, moved)
      } else {
        const oldIndex = next.findIndex(b => b.id === activeId)
        const newIndex = next.findIndex(b => b.id === overId)
        const [moved] = next.splice(oldIndex, 1)
        next.splice(newIndex, 0, moved)
      }
      return next
    })
  }

  function handleAddButton() {
    const label = window.prompt('Button label:')
    if (!label || !label.trim()) return

    const newBtn = {
      id: currentParent
        ? generateDDId(board.find(b => b.id === currentParent.id))
        : generateId(board),
      label: label.trim(),
      icon: '❓',
      color: '#475569',
      image: null,
      audio: null,
      dd: [],
    }

    setBoard(prev => {
      const next = deepClone(prev)
      if (currentParent) {
        const parent = next.find(b => b.id === currentParent.id)
        parent.dd.push(newBtn)
      } else {
        next.push(newBtn)
      }
      return next
    })
  }

  function handleRestore(type) {
    if (type === 'session') {
      if (window.confirm('Restore to the state when the app was opened?')) {
        setBoard(deepClone(sessionSnapshot.current))
        setCurrentParent(null)
      }
    } else if (type === 'edit') {
      if (!editSnapshot.current) {
        alert('No edit session snapshot found.')
        return
      }
      if (window.confirm('Undo all changes from the last edit session?')) {
        setBoard(deepClone(editSnapshot.current))
        setCurrentParent(null)
      }
    }
  }

  function handleFactoryReset() {
    setBoard(deepClone(FACTORY_DEFAULT))
    setCurrentParent(null)
    setEditMode(false)
    setShowSettings(false)
  }

  return (
    <div className="app">
      <TopBar
        editMode={editMode}
        onSettingsClick={() => setShowPin(true)}
        onMyStuffClick={() => setShowMyStuff(!showMyStuff)}
        showMyStuff={showMyStuff}
      />

      {showMyStuff ? (
        <MyStuff />
      ) : (
        <>
          <OutputBar
            output={output}
            onClear={() => setOutput('')}
          />

          <NavBar
            currentParent={currentParent}
            onBack={handleBack}
          />

          <Grid
            buttons={currentButtons}
            editMode={editMode}
            showLabels={showLabels}
            onSpeak={speak}
            onDrillDown={handleDrillDown}
            onContextMenu={handleContextMenu}
            onReorder={handleReorder}
          />

          {editMode && <EditFAB onAdd={handleAddButton} />}

          {!editMode && (
            <div className="hint">Tap to speak · Hold for sub-menu</div>
          )}
        </>
      )}

      {contextMenu && (
        <ContextMenu
          btn={contextMenu.btn}
          position={contextMenu.position}
          onAction={handleContextAction}
          onClose={() => setContextMenu(null)}
        />
      )}

      {showPin && (
        <PinPrompt
          onSuccess={() => { setShowPin(false); setShowSettings(true) }}
          onCancel={() => setShowPin(false)}
        />
      )}

      {showSettings && (
        <Settings
          editMode={editMode}
          showLabels={showLabels}
          onEditModeChange={handleEditModeChange}
          onShowLabelsChange={setShowLabels}
          onRestore={handleRestore}
          onFactoryReset={handleFactoryReset}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}