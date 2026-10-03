import { useState } from 'react'
import IonIcon from './IonIcon'

const SERVICE_ID = 'service_6wy1ubo'
const TEMPLATE_ID = 'template_hsm76dc'

export default function Contact({ isActive, onNavigate }) {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!window.emailjs) {
      setStatus('Failed to send message. Please try again.')
      alert('Failed to send message. Please try again.')
      return
    }

    window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, '#contact-form').then(
      () => {
        setStatus('Message sent successfully!')
        alert('Message sent successfully!')
        setFullname('')
        setEmail('')
        setMessage('')
      },
      (error) => {
        setStatus('Failed to send message. Please try again.')
        alert('Failed to send message. Please try again.')
        console.error('EmailJS Error:', error)
      }
    )
  }

  return (
    <article
      className={`contact${isActive ? ' active' : ''}`}
      data-page="contact"
      {...(!isActive ? { inert: '' } : {})}
    >
      <header>
        <h2 className="h2 article-title">Contact</h2>
      </header>
      <section className="mapbox" data-mapbox>
        <figure>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2472.768876235105!2d-1.5148906841666382!3d52.40863597973759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48772320d2b3ab1b%3A0x23456789abcdef!2sCoventry%2C%20UK!5e0!3m2!1sen!2suk!4v1680000000000!5m2!1sen!2suk"
            width="400"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Map showing Coventry, UK"
          ></iframe>
        </figure>
      </section>
      <section className="schedule-cta">
        <h3 className="h3 form-title">Prefer a conversation?</h3>
        <p className="schedule-cta-text">
          Book a free 30-minute discovery call to discuss your AI or healthcare technology challenges.
        </p>
        <button type="button" className="schedule-cta-btn" onClick={() => onNavigate('schedule')}>
          <IonIcon name="calendar-outline" />
          Schedule a Consultation
        </button>
      </section>

      <section className="contact-form">
        <h3 className="h3 form-title">Contact Form</h3>
        <form id="contact-form" className="form" data-form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label className="visually-hidden" htmlFor="contact-fullname">
              Full name
            </label>
            <input
              type="text"
              name="fullname"
              id="contact-fullname"
              className="form-input"
              placeholder="Full name"
              required
              autoComplete="name"
              data-form-input
              value={fullname}
              onChange={(event) => setFullname(event.target.value)}
            />
            <label className="visually-hidden" htmlFor="contact-email">
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="contact-email"
              className="form-input"
              placeholder="Email address"
              required
              autoComplete="email"
              data-form-input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <label className="visually-hidden" htmlFor="contact-message">
            Your message
          </label>
          <textarea
            name="message"
            id="contact-message"
            className="form-input"
            placeholder="Your Message"
            required
            data-form-input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          ></textarea>
          <button className="form-btn" type="submit">
            <IonIcon name="paper-plane" />
            <span>Send Message</span>
          </button>
        </form>
        {status ? (
          <p className="schedule-cta-text" role="status" aria-live="polite">
            {status}
          </p>
        ) : null}
      </section>
    </article>
  )
}
