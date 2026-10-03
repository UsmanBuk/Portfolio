import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import Navbar from './components/Navbar'
import About from './components/About'
import Resume from './components/Resume'
import Portfolio from './components/Portfolio'
import Courses from './components/Courses'
import Contact from './components/Contact'
import Schedule from './components/Schedule'
import LoadingScreen from './components/LoadingScreen'
import ScrollToTop from './components/ScrollToTop'
import Chatbot from './components/Chatbot'
import LegacyPages from './legacy/LegacyPages'

function pageFromPath() {
  return /\/schedule(\.html)?\/?$/.test(window.location.pathname) ? 'schedule' : 'about'
}

function syncUrl(pageName) {
  const nextPath = pageName === 'schedule' ? './schedule.html' : './index.html'
  const current = `${window.location.pathname}${window.location.search}`
  const target = new URL(nextPath, window.location.href)
  if (`${target.pathname}${target.search}` !== current) {
    window.history.pushState({ page: pageName }, '', nextPath)
  }
}

export default function App() {
  const [activePage, setActivePage] = useState(pageFromPath)
  const [scrollTarget, setScrollTarget] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const navigateToPage = (pageName, target = null) => {
    setActivePage(pageName)
    setScrollTarget(target)
    syncUrl(pageName)
    if (!target) {
      window.scrollTo(0, 0)
    }
  }

  useEffect(() => {
    const onPopState = () => {
      setActivePage(pageFromPath())
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    let removeTimer
    const hideTimer = setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen')
      if (loadingScreen) {
        loadingScreen.classList.add('hidden')
      }
      removeTimer = setTimeout(() => setLoading(false), 500)
    }, 800)

    return () => {
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  useEffect(() => {
    if (!scrollTarget) {
      return undefined
    }

    const frame = requestAnimationFrame(() => {
      const target = document.querySelector(scrollTarget)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        target.classList.add('timeline-item--highlighted')
        setTimeout(() => target.classList.remove('timeline-item--highlighted'), 2000)
      } else {
        window.scrollTo(0, 0)
      }
      setScrollTarget(null)
    })

    return () => cancelAnimationFrame(frame)
  }, [scrollTarget])

  return (
    <>
      {loading && <LoadingScreen />}
      <Layout sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((open) => !open)}>
        <Navbar activePage={activePage} onNavigate={navigateToPage} />
        <About isActive={activePage === 'about'} onNavigate={navigateToPage} />
        <Resume isActive={activePage === 'resume'} />
        <Portfolio isActive={activePage === 'portfolio'} />
        <LegacyPages activePage={activePage} />
        <Courses isActive={activePage === 'courses'} />
        <Contact isActive={activePage === 'contact'} onNavigate={navigateToPage} />
        <Schedule isActive={activePage === 'schedule'} onNavigate={navigateToPage} />
      </Layout>
      <ScrollToTop />
      <Chatbot />
    </>
  )
}
