import IonIcon from './IonIcon'

export default function TopContactBar() {
  return (
    <aside className="top-contact-bar" aria-label="Contact information">
      <div className="top-contact-bar-inner">
        <ul className="contacts-list top-contacts-list">
          <li className="contact-item">
            <div className="icon-box">
              <IonIcon name="mail-outline" />
            </div>
            <div className="contact-info">
              <p className="contact-title">Email</p>
              <a href="mailto:usmanbukhari541@gmail.com" className="contact-link">
                usmanbukhari541@gmail.com
              </a>
            </div>
          </li>
          <li className="contact-item">
            <div className="icon-box">
              <IonIcon name="phone-portrait-outline" />
            </div>
            <div className="contact-info">
              <p className="contact-title">Phone</p>
              <a href="tel:+447462660889" className="contact-link">
                +44 7462 660889
              </a>
            </div>
          </li>
          <li className="contact-item">
            <div className="icon-box">
              <IonIcon name="location-outline" />
            </div>
            <div className="contact-info">
              <p className="contact-title">Location</p>
              <address>Coventry, West Midlands, UK</address>
            </div>
          </li>
        </ul>
        <ul className="social-list top-social-list">
          <li className="social-item">
            <a
              href="https://leetcode.com/UsmanBuk/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Visit LeetCode profile"
            >
              <IonIcon name="code-slash-outline" />
            </a>
          </li>
          <li className="social-item">
            <a
              href="https://github.com/UsmanBuk"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Visit GitHub profile"
            >
              <IonIcon name="logo-github" />
            </a>
          </li>
          <li className="social-item">
            <a
              href="https://www.linkedin.com/in/syed-usman-bukhari-aideveloper?skipRedirect=true"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Visit LinkedIn profile"
            >
              <IonIcon name="logo-linkedin" />
            </a>
          </li>
        </ul>
      </div>
    </aside>
  )
}
