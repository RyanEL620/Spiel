export default function Settings({ editMode, showLabels, onEditModeChange, onShowLabelsChange, onRestore, onFactoryReset, onClose }) {

  function handleFactoryReset() {
    if (window.confirm('Are you sure you want to factory reset?')) {
      if (window.confirm('Really sure? This deletes ALL customizations.')) {
        if (window.confirm('This cannot be undone. Last chance.')) {
          onFactoryReset()
        }
      }
    }
  }

  return (
    <div className="settings-panel">
      <div className="sp-top">
        <h2>⚙ Settings</h2>
        <button onClick={onClose}>Close</button>
      </div>

      <div className="sp-body">

        <section className="sp-section">
          <h3>Edit Mode</h3>
          <p className="sp-desc">Select a mode to customize the board. Speech is disabled while editing.</p>
          <div className="radio-group">
            <label className={`radio-option ${!editMode ? 'selected' : ''}`}>
              <input
                type="radio"
                name="editMode"
                checked={!editMode}
                onChange={() => onEditModeChange(false)}
              />
              <span>🔒 Normal Mode</span>
            </label>
            <label className={`radio-option ${editMode ? 'selected' : ''}`}>
              <input
                type="radio"
                name="editMode"
                checked={editMode}
                onChange={() => onEditModeChange(true)}
              />
              <span>✏️ Edit Mode</span>
            </label>
          </div>
        </section>

        <section className="sp-section">
          <h3>Display</h3>
          <label className="toggle-row">
            <span>Show Button Labels</span>
            <div
              className={`toggle ${showLabels ? 'on' : 'off'}`}
              onClick={() => onShowLabelsChange(!showLabels)}
            >
              <div className="toggle-thumb" />
            </div>
          </label>
        </section>

        <section className="sp-section">
          <h3>Restore Points</h3>
          <button className="sp-btn" onClick={() => onRestore('session')}>
            🔄 Restore to Last Opened State
          </button>
          <button className="sp-btn" onClick={() => onRestore('edit')}>
            ↩️ Undo Last Edit Session
          </button>
        </section>

        <section className="sp-section danger-zone">
          <h3>⚠️ Danger Zone</h3>
          <button className="sp-btn danger" onClick={handleFactoryReset}>
            💀 You Really F***ed Up (Factory Reset)
          </button>
        </section>

        <section className="sp-section">
          <h3>Board Info</h3>
          <p className="sp-desc">Naming convention: <code>A1</code>–<code>A50</code> main · <code>A1_DD1</code> sub-menus</p>
          <p className="sp-desc">Default password: <code>1234</code></p>
        </section>

      </div>
    </div>
  )
}