import FractalExplorer from '../toys/FractalExplorer'

export default function MyStuff() {
  return (
    <div className="mystuff">
      <div className="mystuff-header">
        <h2>⭐ My Stuff</h2>
      </div>
      <div className="mystuff-content">
        <div className="toy-card">
          <h3>🌀 Fractal Explorer</h3>
          <p>Pinch and zoom into infinity</p>
          <FractalExplorer />
        </div>
      </div>
    </div>
  )
}