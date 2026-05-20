export default function TopBar({ editMode, onSettingsClick }) {
  return (
    <div className="topbar">
      <h1>SPIEL</h1>
      {editMode && <div className="edit-banner">✏️ EDIT MODE ACTIVE</div>}
      <button className="settings-btn" onClick={onSettingsClick}>⚙ Settings</button>
    </div>
  )
}