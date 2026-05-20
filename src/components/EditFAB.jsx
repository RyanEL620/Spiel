export default function EditFAB({ onAdd }) {
  return (
    <button className="edit-fab" onClick={onAdd} aria-label="Add new button">
      +
    </button>
  )
}