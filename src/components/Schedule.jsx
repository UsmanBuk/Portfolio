import { useEffect, useRef } from 'react'
import IonIcon from './IonIcon'

const CAL_LINK = 'syed-usman-bukhari-tfe3rr/30min'

function loadCalEmbed() {
  if (window.Cal) {
    window.Cal('init', { origin: 'https://app.cal.com' })
    window.Cal('inline', {
      elementOrSelector: '#cal-inline-embed',
      calLink: CAL_LINK,
      config: { theme: 'dark' }
    })
    window.Cal('ui', {
      theme: 'dark',
      styles: { branding: { brandColor: '#FFB703' } },
      hideEventTypeDetails: false
    })
    return
  }

  ;(function (C, A, L) {
    const p = function (a, ar) {
      a.q.push(ar)
    }
    const d = C.document
    C.Cal =
      C.Cal ||
      function () {
        const cal = C.Cal
        const ar = arguments
        if (!cal.loaded) {
          cal.ns = {}
          cal.q = cal.q || []
          d.head.appendChild(d.createElement('script')).src = A
          cal.loaded = true
        }
        if (ar[0] === L) {
          const api = function () {
            p(api, arguments)
          }
          const namespace = ar[1]
          api.q = api.q || []
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api
            p(cal.ns[namespace], ar)
            p(cal, ['initNamespace', namespace])
          } else {
            p(cal, ar)
          }
          return
        }
        p(cal, ar)
      }
  })(window, 'https://app.cal.com/embed/embed.js', 'init')

  window.Cal('init', { origin: 'https://app.cal.com' })
  window.Cal('inline', {
    elementOrSelector: '#cal-inline-embed',
    calLink: CAL_LINK,
    config: { theme: 'dark' }
  })
  window.Cal('ui', {
    theme: 'dark',
    styles: { branding: { brandColor: '#FFB703' } },
    hideEventTypeDetails: false
  })
}

export default function Schedule({ isActive, onNavigate }) {
  const calLoaded = useRef(false)

  useEffect(() => {
    if (!isActive || calLoaded.current) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      loadCalEmbed()
      calLoaded.current = true
    }, 50)

    return () => window.clearTimeout(timer)
  }, [isActive])

  return (
    <article
      className={`schedule-page${isActive ? ' active' : ''}`}
      data-page="schedule"
      {...(!isActive ? { inert: '' } : {})}
    >
      <header className="schedule-header">
        <button
          type="button"
          className="schedule-backlink"
          aria-label="Back to portfolio"
          onClick={() => onNavigate('contact')}
        >
          <IonIcon name="arrow-back-outline" />
          Back to portfolio
        </button>
        <h2 className="schedule-title">Let's Discuss Your AI Challenge</h2>
        <p className="schedule-subtitle">
          Book a 30-minute discovery call to scope your AI, RAG, or healthcare technology challenge and leave with a
          clearer next-step recommendation.
        </p>
      </header>

      <section className="schedule-details">
        <div className="schedule-detail-card">
          <p className="schedule-detail-title">Duration</p>
          <p className="schedule-detail-text">30 minutes</p>
        </div>
        <div className="schedule-detail-card">
          <p className="schedule-detail-title">Format</p>
          <p className="schedule-detail-text">Video call (Google Meet)</p>
        </div>
        <div className="schedule-detail-card">
          <p className="schedule-detail-title">Cost</p>
          <p className="schedule-detail-text">Complimentary introductory call</p>
        </div>
      </section>

      <section className="schedule-who">
        <h3 className="schedule-who-title">This call is for you if:</h3>
        <ul className="schedule-who-list">
          <li>You're exploring AI or RAG systems for your organisation</li>
          <li>You need to modernise healthcare technology infrastructure</li>
          <li>You want to understand what's feasible before committing to a project</li>
          <li>You're evaluating consultants for an upcoming AI initiative</li>
        </ul>
      </section>

      <section className="schedule-embed">
        <div
          id="cal-inline-embed"
          style={{ width: '100%', height: '100%', minHeight: '550px' }}
          role="region"
          aria-label="Calendar booking widget"
        ></div>
      </section>

      <section className="schedule-note">
        <p className="schedule-note-title">What happens next?</p>
        <p className="schedule-note-text">
          After booking, you'll receive a calendar invite with a video call link. Come prepared to discuss your
          challenge — I'll ask questions to understand your situation and share initial thoughts on potential
          approaches.
        </p>
      </section>
    </article>
  )
}
