export default function LoadingScreen() {
  return (
    <div id="loading-screen" className="loading-screen" role="status" aria-live="polite" aria-busy="true">
      <div className="loading-spinner" aria-hidden="true"></div>
      <p>Loading Portfolio...</p>
    </div>
  )
}
