import React, { useCallback, useRef, useState } from 'react'
import IonIcon from './IonIcon'
import useFocusTrap from '../hooks/useFocusTrap'

const HIGHLIGHTS = [
  { icon: '🤖', text: 'VacancyBot', page: 'portfolio' },
  { icon: '🎓', text: 'Bukhari Consulting', page: 'contact' },
  { icon: '⚙️', text: 'AI Engineering Contracts', page: 'resume', scrollTarget: '#experience-hudson' },
  { icon: '🛡️', text: 'BPSS Screened, DBS Checked', page: 'resume', scrollTarget: '#experience-rolls-royce' }
]

const CERTIFICATIONS = [
  {
    title: 'AWS Solutions Architect',
    alt: 'AWS Solutions Architect',
    text: 'Completed the AWS Solutions Architect course with extensive training in designing scalable, secure cloud architectures.'
  },
  {
    title: 'AWS Cloud Practitioner',
    alt: 'AWS Cloud Practitioner',
    text: 'Earned the AWS Cloud Practitioner certification, demonstrating a solid understanding of core AWS services and cloud fundamentals.'
  },
  {
    title: 'Shopify Course – SuperHi',
    alt: 'Shopify Course – SuperHi',
    text: 'Completed the Shopify Course at SuperHi, acquiring expertise in building engaging and robust e-commerce platforms.'
  },
  {
    title: 'Data Engineering Program – AI Core',
    alt: 'Data Engineering Program – AI Core',
    text: 'Graduated from the Data Engineering Program at AI Core, specializing in efficient data pipeline design and analytics.'
  }
]

const SERVICES = [
  {
    icon: './assets/images/icon-design.svg',
    alt: 'VacancyBot icon',
    title: 'VacancyBot',
    text: 'An AI assistant that prepares and submits job applications, starting with Reed. You review every application before it is sent.'
  },
  {
    icon: './assets/images/icon-dev.svg',
    alt: 'Bukhari Consulting icon',
    title: 'Bukhari Consulting',
    text: 'AI training for company teams, built around the tools and workflows they already use.'
  },
  {
    icon: './assets/images/icon-photo.svg',
    alt: 'AI engineering icon',
    title: 'AI Engineering Contracts',
    text: 'Production LLM systems for regulated work: voice agents, document pipelines, and multi-agent workflows.'
  }
]

export default function About({ isActive, onNavigate }) {
  const [activeCert, setActiveCert] = useState(null)
  const modalOpen = activeCert !== null
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  const openCert = (cert) => setActiveCert(cert)
  const closeCert = useCallback(() => setActiveCert(null), [])

  useFocusTrap(modalOpen, dialogRef, closeCert, closeButtonRef)

  const handleHighlightActivate = (highlight) => {
    onNavigate(highlight.page, highlight.scrollTarget || null)
  }

  return (
    <article
      className={`about${isActive ? ' active' : ''}`}
      data-page="about"
      {...(!isActive ? { inert: '' } : {})}
    >
      <header>
        <h2 className="h2 article-title">About me</h2>
      </header>
      <section className="about-text">
        <div className="intro-section">
          <p className="intro-paragraph">
            I&apos;m a <strong>Founder / AI Engineer</strong> in Coventry, UK. I build{' '}
            <strong>VacancyBot</strong>, an AI assistant that prepares and submits job applications — starting with Reed — and you review every application before it goes out. I also run{' '}
            <strong>Bukhari Consulting</strong>, training company teams to use AI in their own work.
          </p>
        </div>

        <div className="specialization-section">
          <p>
            I&apos;m open to AI engineering contracts and team training. Recent contracts include a Rolls-Royce &amp; Partners Finance airworthiness proof of concept, delivered as sole engineer end to end, production voice and employment agents at Hudson &amp; Hayes, and a multi-agent KYC platform for Ardonagh Specialty that took insurance onboarding from days or weeks to hours.
          </p>
        </div>

        <div className="passion-section">
          <p className="passion-statement">
            Before that, at NHS South Yorkshire ICB, I delivered a production RAG platform for <strong>1.4 million residents</strong>: <strong>3,000+ monthly active users</strong>, 90% accuracy against clinical guidelines, and <strong>zero hallucination incidents</strong>. I&apos;m BPSS screened and DBS checked.{' '}
            <a href="./case-studies/nhs-south-yorkshire-rag.html">Read the NHS case study</a>.
          </p>
        </div>

        <div className="highlights-grid">
          {HIGHLIGHTS.map((highlight) => (
            <button
              type="button"
              key={highlight.text}
              className="highlight-item"
              data-nav-target={highlight.page}
              data-scroll-target={highlight.scrollTarget}
              onClick={() => handleHighlightActivate(highlight)}
            >
              <span className="highlight-icon">{highlight.icon}</span>
              <span className="highlight-text">{highlight.text}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="service">
        <h3 className="h3 service-title">What I'm doing</h3>
        <ul className="service-list">
          {SERVICES.map((service) => (
            <li className="service-item" key={service.title}>
              <div className="service-icon-box">
                <img src={service.icon} alt={service.alt} width="40" />
              </div>
              <div className="service-content-box">
                <h4 className="h4 service-item-title">{service.title}</h4>
                <p className="service-item-text">{service.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="testimonials">
        <h3 className="h3 testimonials-title">Certifications</h3>
        <ul className="testimonials-list has-scrollbar">
          {CERTIFICATIONS.map((cert) => (
            <li className="testimonials-item" key={cert.title}>
              <button
                type="button"
                className="content-card"
                data-testimonials-item
                aria-haspopup="dialog"
                onClick={() => openCert(cert)}
              >
                <figure className="testimonials-avatar-box">
                  <img
                    src="./assets/images/my-avatar.png"
                    alt={cert.alt}
                    width="60"
                    data-testimonials-avatar
                  />
                </figure>
                <h4 className="h4 testimonials-item-title" data-testimonials-title>
                  {cert.title}
                </h4>
                <div className="testimonials-text" data-testimonials-text>
                  <p>{cert.text}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div
        className={`modal-container${modalOpen ? ' active' : ''}`}
        data-modal-container
        aria-hidden={!modalOpen}
        {...(!modalOpen ? { inert: '' } : {})}
      >
        <div
          className={`overlay${modalOpen ? ' active' : ''}`}
          data-overlay
          onClick={closeCert}
        ></div>
        <section
          className="testimonials-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="certification-modal-title"
          ref={dialogRef}
        >
          <button
            className="modal-close-btn"
            data-modal-close-btn
            type="button"
            aria-label="Close certification details"
            ref={closeButtonRef}
            onClick={closeCert}
          >
            <IonIcon name="close-outline" />
          </button>
          <div className="modal-img-wrapper">
            <figure className="modal-avatar-box">
              <img
                src="./assets/images/my-avatar.png"
                alt={activeCert?.alt || 'AWS Solutions Architect'}
                width="80"
                data-modal-img
              />
            </figure>
            <img src="./assets/images/icon-quote.svg" alt="" />
          </div>
          <div className="modal-content">
            <h4 className="h3 modal-title" id="certification-modal-title" data-modal-title>
              {activeCert?.title || 'AWS Solutions Architect'}
            </h4>
            <time dateTime="2024-01-15">15 Jan, 2024</time>
            <div data-modal-text>
              <p>
                {activeCert?.text ||
                  'Completed the AWS Solutions Architect certification with comprehensive training in designing secure, scalable cloud solutions.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </article>
  )
}
