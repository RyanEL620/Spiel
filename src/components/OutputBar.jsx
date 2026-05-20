export default function OutputBar({ output, onClear }) {
  return (
    <div className="output-bar">
      <span className={output ? 'output active' : 'output'}>
        {output || 'Tap a button to speak...'}
      </span>
      {output && <button className="clear-btn" onClick={onClear}>Clear</button>}
    </div>
  )
}