import { useState } from 'react'

const DEFAULT_PIN = '1234'

export default function PinPrompt({ onSuccess, onCancel }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  function tryPin() {
    if (value === DEFAULT_PIN) {
      setValue('')
      setError('')
      onSuccess()
    } else {
      setError('Incorrect password. Try again.')
      setValue('')
    }
  }

  return (
    <div className="overlay">
      <div className="pin-box">
        <h2>🔒 Caregiver Access</h2>
        <p className="pin-hint">Default password: 1234</p>
        <input
          type="password"
          placeholder="Password"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && tryPin()}
          autoFocus
        />
        {error && <p className="pin-error">{error}</p>}
        <div className="pin-row">
          <button onClick={onCancel}>Cancel</button>
          <button className="pin-enter" onClick={tryPin}>Unlock</button>
        </div>
      </div>
    </div>
  )
}