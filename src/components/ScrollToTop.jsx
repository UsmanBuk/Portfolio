import { useEffect, useState } from 'react'
import IonIcon from './IonIcon'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.pageYOffset > 300)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      className={`scroll-to-top${visible ? ' visible' : ''}`}
      id="scroll-to-top"
      type="button"
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <IonIcon name="chevron-up-outline" />
    </button>
  )
}
