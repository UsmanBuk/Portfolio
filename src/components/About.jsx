import { useCallback, useRef, useState } from 'react'
import IonIcon from './IonIcon'
import useFocusTrap from '../hooks/useFocusTrap'

const HIGHLIGHTS = [
  { icon: '🚀', text: 'Cloud-Native Solutions', page: 'resume', scrollTarget: '#experience-citadel-health' },
  { icon: '🤖', text: 'AI Integration Expert', page: 'resume', scrollTarget: '#experience-nhs' },
  { icon: '⚡', text: 'Performance Optimization', page: 'resume', scrollTarget: '#experience-tsg' },
  { icon: '🔧', text: 'DevOps & Automation', page: 'portfolio' }
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
    alt: 'design icon',
    title: 'Full Stack Web Development',
    text: 'Crafting responsive, scalable, and secure web applications using modern technologies.'
  },
  {
    icon: './assets/images/icon-dev.svg',
    alt: 'Web development icon',
    title: 'API Design and Integration',
    text: 'Building robust APIs and integrating them seamlessly for efficient data exchange.'
  },
  {
    icon: './assets/images/icon-photo.svg',
    alt: 'camera icon',
    title: 'AI Integration',
    text: 'Leveraging advanced AI solutions to automate processes and enhance user experiences.'
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
            I'm a <strong>Senior AI Engineer</strong> contracting into the NHS and regulated financial services. I build enterprise RAG systems, LLM orchestration pipelines, and the cloud infrastructure that runs them &mdash; currently production voice agents on Azure AI Foundry for Hudson and Hayes, following a multi-agent KYC platform for Ardonagh Specialty that took client onboarding from weeks to hours.
          </p>
        </div>

        <div className="specialization-section">
          <p>
            At NHS South Yorkshire ICB I delivered a production RAG platform serving <strong>1.4 million residents</strong> with <strong>zero hallucination incidents</strong>, 90% accuracy validated against NHS clinical guidelines, and query resolution cut from 12 minutes to under 30 seconds &mdash; 3,000+ monthly active users at a 94% success rate. That work runs on Azure AI Agent SDK, LangGraph, LangChain, and Azure AI Search, on Full Stack and DevOps foundations of CI/CD, Kubernetes, and Terraform.
          </p>
        </div>

        <div className="passion-section">
          <p className="passion-statement">
            I've contracted since 2022 &mdash; Citadel Health, TSG, NHS South Yorkshire, Ardonagh &mdash; and I take <em>one or two engagements at a time</em>, full-time, fractional, or advisory. I stay through production handover, not just the build. If you have an AI system that has to survive real users, real data, and a real audit, that's the work I do.
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
