import TopContactBar from './TopContactBar'
import Sidebar from './Sidebar'

export default function Layout({ sidebarOpen, onToggleSidebar, children }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <TopContactBar />
      <main id="main-content">
        <Sidebar isOpen={sidebarOpen} onToggle={onToggleSidebar} />
        <div className="main-content">{children}</div>
      </main>
    </>
  )
}
