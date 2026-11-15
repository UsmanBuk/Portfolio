import IonIcon from './IonIcon'

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <aside className={`sidebar${isOpen ? ' active' : ''}`} data-sidebar>
      <div className="sidebar-info">
        <figure className="avatar-box">
          <img src="./assets/images/my-avatar.png" alt="Syed Usman Bukhari portrait" width="80" />
        </figure>
        <div className="info-content">
          <h1 className="name" title="Syed Usman Bukhari">Syed Usman Bukhari</h1>
          <p className="title">Founder / AI Engineer</p>
        </div>

        <section className="featured-case-study" aria-label="VacancyBot">
          <div className="featured-case-study-top">
            <p className="featured-case-study-kicker">VacancyBot · Bukhari Consulting</p>
            <p className="featured-case-study-title">VacancyBot</p>
          </div>

          <div className="featured-case-study-body">
            <img
              className="featured-case-study-thumb"
              src="./assets/images/project-7.png"
              alt="VacancyBot"
              loading="lazy"
            />

            <div className="featured-case-study-metrics" aria-label="Product facts">
              <span className="featured-case-study-chip">Reed</span>
              <span className="featured-case-study-chip">You review</span>
              <span className="featured-case-study-chip">Coventry</span>
            </div>

            <a
              className="featured-case-study-cta"
              href="https://vacancybot.co.uk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IonIcon name="open-outline" />
              <span>Visit VacancyBot</span>
            </a>
          </div>
        </section>

        <button
          className="info_more-btn"
          data-sidebar-btn
          type="button"
          aria-expanded={isOpen}
          onClick={onToggle}
        >
          <span>{isOpen ? 'Show Less' : 'Show More'}</span>
          <IonIcon name="chevron-down" />
        </button>
      </div>
    </aside>
  )
}
