export default function TopBar({ editMode, onSettingsClick, onMyStuffClick, showMyStuff }) {
  return (
    <div className="topbar">
      <h1 onClick={showMyStuff ? onMyStuffClick : undefined} style={{cursor: showMyStuff ? 'default' : 'pointer'}}>
        SPIEL
      </h1>
      {editMode && <div className="edit-banner">✏️ EDIT MODE ACTIVE</div>}
      <div className="topbar-right">
        <button className="mystuff-btn" onClick={onMyStuffClick}>
          {showMyStuff ? '🎮 Board' : '⭐ My Stuff'}
        </button>
        <button className="settings-btn" onClick={onSettingsClick}>⚙</button>
      </div>
    </div>
  )
}