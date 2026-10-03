import { useEffect, useMemo, useState } from 'react'
import IonIcon from './IonIcon'

const PORTFOLIO_STATS = [
  { number: '50+', label: 'Debug Exercises' },
  { number: '2', label: 'AI Products' },
  { number: '5+', label: 'Years Experience' },
  { number: 'NHS', label: 'Current Role' }
]

const PORTFOLIO_FILTERS = [
  { id: 'all', label: 'All', icon: '🌟' },
  { id: 'web development', label: 'Web Development', icon: '🌐' },
  { id: 'cloud & devops', label: 'Cloud & DevOps', icon: '☁️' },
  { id: 'ai & machine learning', label: 'AI & Machine Learning', icon: '🤖' },
  { id: 'systems programming', label: 'Systems Programming', icon: '⚙️' }
]

const PORTFOLIO_SELECT_OPTIONS = [
  'All',
  'Applications',
  'Web Development',
  'Cloud & Devops',
  'Ai and Machine Learning',
  'Systems Programming'
]

const PROJECTS = [
  {
    href: 'https://github.com/UsmanBuk/PyDebug',
    category: 'ai & machine learning',
    image: './assets/images/project-1.jpg',
    alt: 'PyDebug - Python Debugging Academy',
    tooltip:
      '🚀 PyDebug - Revolutionary debugging education platform. The only dedicated debugging skills trainer for Python developers. SaaS potential: £10M+ market opportunity.',
    title: 'PyDebug - Debugging Academy',
    tech: ['React', 'TypeScript', 'Supabase', 'Python', 'SaaS'],
    categoryLabel: 'AI & Machine Learning'
  },
  {
    href: 'https://github.com/UsmanBuk/Trading',
    category: 'ai & machine learning',
    image: './assets/images/project-2.jpg',
    alt: 'Trading 212 AI Investment Platform',
    tooltip:
      '💰 AI-powered autonomous trading system. Uses DeepSeek AI, news analysis, and market research to make daily investment decisions automatically via Trading 212 API.',
    title: 'Trading 212 AI Platform',
    tech: ['FastAPI', 'DeepSeek AI', 'Trading 212', 'Python', 'Automation'],
    categoryLabel: 'AI & Machine Learning'
  },
  {
    href: 'https://chalkys.com',
    category: 'web development',
    image: './assets/images/ChalkysNew.png',
    alt: 'Chalkys',
    tooltip:
      'A modern ecommerce project for Chalkys handling 500,000 products with a focus on performance and scalability.',
    title: 'Chalkys',
    tech: ['Shopify', 'Liquid', 'Python', 'OpenAI API', 'AWS'],
    categoryLabel: 'Web Development'
  },
  {
    href: 'https://myatol.co.uk',
    category: 'web development',
    image: './assets/images/myatol.png',
    alt: 'myAtol',
    tooltip:
      'Myatol – a PHP Laravel-based business application that enables customers to securely manage their operations with the same reliability and assurance that ATOL provides in the travel industry.',
    title: 'myAtol',
    tech: ['PHP', 'Laravel', 'MySQL', 'Bootstrap'],
    categoryLabel: 'Web Development'
  },
  {
    href: 'https://umrahtaxi.app',
    category: 'web development',
    image: './assets/images/umrahtaxi.png',
    alt: 'Umrah Taxi Booking',
    tooltip:
      "A web application built using co.dev low-code platform with integrated Stripe payment processing and email functionality for Umrah pilgrims' taxi booking needs.",
    title: 'Umrah Taxi Booking',
    categoryLabel: 'Web Development'
  },
  {
    href: 'https://umrah.online',
    category: 'web development',
    image: './assets/images/umrahonline.png',
    alt: 'Umrah Online',
    tooltip:
      'A comparison website to verify umrah agencies across the world built using Lovable and Supabase for database management.',
    title: 'Umrah Online',
    categoryLabel: 'Web Development'
  },
  {
    href: 'http://www.dayta.co.uk',
    category: 'web development',
    image: './assets/images/Dayta.png',
    alt: 'Dayta/TSG',
    tooltip:
      'A comprehensive web development solution for Dayta/TSG using Wordpress, WooCommerce, and custom PHP code.',
    title: 'Dayta/TSG',
    categoryLabel: 'Web Development'
  },
  {
    href: 'https://ticsys.uk',
    category: 'web development',
    image: './assets/images/ticsys.png',
    alt: 'Ticsys CRM',
    tooltip: 'A custom CRM platform built using PHP, Laravel, and MySQL.',
    title: 'Ticsys CRM',
    categoryLabel: 'Web Development'
  },
  {
    href: 'https://github.com/UsmanBuk/ai-sentiment-analyze',
    category: 'ai & machine learning',
    image: './assets/images/ai.png',
    alt: 'AI Sentiment Analysis',
    tooltip:
      "AI-powered sentiment analysis tool using IBM Watson's BERT-based NLP service to analyze emotional tone and sentiment from text input.",
    title: 'AI Sentiment Analysis',
    tech: ['Python', 'IBM Watson', 'BERT', 'NLP'],
    categoryLabel: 'AI and Machine Learning'
  },
  {
    href: 'https://github.com/UsmanBukari/UsmanBukari-codecrafters-http-server-python',
    category: 'systems programming',
    image: './assets/images/http-server.png',
    alt: 'CodeCrafters HTTP Server',
    tooltip: 'A hand-crafted HTTP/1.1 server in Python, built from the ground up for CodeCrafters.',
    title: 'Custom HTTP Server',
    categoryLabel: 'Systems Programming'
  },
  {
    href: 'https://github.com/UsmanBuk/RamOptimise',
    category: 'systems programming',
    image: './assets/images/RamImage.png',
    alt: 'RAM Optimiser',
    tooltip: 'A tool to optimize RAM usage by identifying and cleaning up unused memory segments.',
    title: 'RAM Optimiser',
    categoryLabel: 'Systems Programming'
  }
]

function normalizeFilter(value) {
  return value.trim().toLowerCase().replace(/and/g, '&').replace(/\s+/g, ' ')
}

export default function Portfolio({ isActive }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectOpen, setSelectOpen] = useState(false)

  const visibleProjects = useMemo(() => {
    const query = search.trim().toLowerCase()
    return PROJECTS.filter((project) => {
      const matchesFilter = filter === 'all' || project.category === filter
      const searchable = `${project.title} ${(project.tech || []).join(' ')}`.toLowerCase()
      const matchesSearch = query === '' || searchable.includes(query)
      return matchesFilter && matchesSearch
    })
  }, [filter, search])

  const applyFilter = (value) => {
    setFilter(normalizeFilter(value) === 'all' ? 'all' : normalizeFilter(value))
  }

  const selectLabel =
    PORTFOLIO_FILTERS.find((item) => item.id === filter)?.label || 'Select category'

  useEffect(() => {
    if (!selectOpen) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectOpen(false)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [selectOpen])

  return (
    <article
      className={`portfolio${isActive ? ' active' : ''}`}
      data-page="portfolio"
      {...(!isActive ? { inert: '' } : {})}
    >
      <header>
        <h2 className="h2 article-title">Portfolio</h2>
      </header>

      <section className="portfolio-stats">
        {PORTFOLIO_STATS.map((stat) => (
          <div className="stat-item" key={stat.label}>
            <span className="stat-number">{stat.number}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="projects">
        <div className="portfolio-search">
          <div className="search-wrapper">
            <IonIcon name="search-outline" className="search-icon" />
            <label className="visually-hidden" htmlFor="portfolio-search">
              Search projects
            </label>
            <input
              type="text"
              className="search-input"
              placeholder="Search projects..."
              id="portfolio-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search ? (
              <button
                className="search-clear"
                id="search-clear"
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
              >
                <IonIcon name="close-outline" />
              </button>
            ) : null}
          </div>
        </div>

        <ul className="filter-list" aria-label="Filter projects">
          {PORTFOLIO_FILTERS.map((item) => (
            <li className="filter-item" key={item.id}>
              <button
                className={`filter-btn${filter === item.id ? ' active' : ''}`}
                data-filter-btn
                type="button"
                aria-pressed={filter === item.id}
                onClick={() => applyFilter(item.id)}
              >
                <span className="filter-icon">{item.icon}</span>
                <span className="filter-text">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="filter-select-box">
          <button
            className={`filter-select${selectOpen ? ' active' : ''}`}
            data-select
            type="button"
            aria-expanded={selectOpen}
            aria-haspopup="listbox"
            aria-controls="portfolio-filter-list"
            aria-label="Filter projects by category"
            onClick={() => setSelectOpen((open) => !open)}
          >
            <div className="select-value" data-selecct-value>
              {selectLabel}
            </div>
            <div className="select-icon">
              <IonIcon name="chevron-down" />
            </div>
          </button>
          <ul
            className="select-list"
            id="portfolio-filter-list"
            role="listbox"
            aria-label="Project categories"
            hidden={!selectOpen}
          >
            {PORTFOLIO_SELECT_OPTIONS.map((option) => (
              <li className="select-item" key={option}>
                <button
                  data-select-item
                  type="button"
                  role="option"
                  aria-selected={normalizeFilter(option) === filter}
                  tabIndex={selectOpen ? 0 : -1}
                  onClick={() => {
                    applyFilter(option)
                    setSelectOpen(false)
                  }}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <ul className="project-list">
          {visibleProjects.length === 0 ? (
            <li className="no-results-message">
              <div className="no-results-content">
                <IonIcon name="search-outline" className="no-results-icon" />
                <h3>No projects found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            </li>
          ) : (
            visibleProjects.map((project) => (
              <li
                className="project-item active"
                data-filter-item
                data-category={project.category}
                key={project.title}
              >
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} (opens in a new tab)`}
                >
                  <figure className="project-img">
                    <div className="project-item-icon-box">
                      <IonIcon name="eye-outline" />
                    </div>
                    <img src={project.image} alt={project.alt} loading="lazy" />
                    <div className="project-tooltip">{project.tooltip}</div>
                  </figure>
                  {project.tech ? (
                    <div className="project-content">
                      <h3 className="project-title">{project.title}</h3>
                      <div className="project-tech-stack">
                        {project.tech.map((tech) => (
                          <span className="tech-badge" key={tech}>
                            {tech}
                          </span>
                        ))}
                      </div>
                      <p className="project-category">{project.categoryLabel}</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-category">{project.categoryLabel}</p>
                    </>
                  )}
                </a>
              </li>
            ))
          )}
        </ul>
      </section>
    </article>
  )
}
