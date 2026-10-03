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
          <p className="title">Senior AI Engineer | RAG &amp; LLM Systems</p>
        </div>

        <section className="featured-case-study" aria-label="Featured case study">
          <div className="featured-case-study-top">
            <p className="featured-case-study-kicker">Featured case study</p>
            <p className="featured-case-study-title">NHS South Yorkshire ICB</p>
          </div>

          <div className="featured-case-study-body">
            <img
              className="featured-case-study-thumb"
              src="./assets/images/nhs-rag-architecture.svg"
              alt="NHS RAG architecture diagram thumbnail"
              loading="lazy"
            />

            <div className="featured-case-study-metrics" aria-label="Key outcomes">
              <span className="featured-case-study-chip">3,000+ MAU</span>
              <span className="featured-case-study-chip">94% success</span>
              <span className="featured-case-study-chip">4.8/5</span>
            </div>

            <a className="featured-case-study-cta" href="./case-studies/nhs-south-yorkshire-rag.html">
              <IonIcon name="newspaper-outline" />
              <span>View case study</span>
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
