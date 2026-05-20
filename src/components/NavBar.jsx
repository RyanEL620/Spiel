export default function NavBar({ currentParent, onBack }) {
  return (
    <div className="nav-bar">
      <span className="breadcrumb">
        {currentParent ? `${currentParent.label} → Sub-Menu` : 'Main Board'}
      </span>
      {currentParent && (
        <button className="back-btn" onClick={onBack}>← Back</button>
      )}
    </div>
  )
}