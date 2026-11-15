import { useEffect, useMemo, useState } from 'react'
import IonIcon from './IonIcon'

const PORTFOLIO_STATS = [
  { number: 'VB', label: 'VacancyBot' },
  { number: 'AI', label: 'Team Training' },
  { number: 'BPSS', label: 'Screened' },
  { number: 'DBS', label: 'Checked' }
]

const PORTFOLIO_FILTERS = [
  { id: 'all', label: 'All', icon: '🌟' },
  { id: 'web development', label: 'Web Development', icon: '🌐' },
  { id: 'cloud & devops', label: 'Cloud & DevOps', icon: '☁️' },
  { id: 'ai & machine learning', label: 'AI & Machine Learning', icon: '🤖' }
]

const PORTFOLIO_SELECT_OPTIONS = [
  'All',
  'Applications',
  'Web Development',
  'Cloud & Devops',
  'Ai and Machine Learning'
]

const PROJECTS = [
  {
    href: 'https://vacancybot.co.uk',
    category: 'ai & machine learning',
    image: './assets/images/project-7.png',
    alt: 'VacancyBot',
    tooltip:
      'VacancyBot prepares and submits job applications, starting with Reed. You review every application before it is sent. The code is private.',
    title: 'VacancyBot',
    tech: ['AI assistant', 'Reed', 'Human review'],
    categoryLabel: 'AI & Machine Learning'
  },
  {
    href: 'https://github.com/UsmanBuk/Headroom',
    category: 'ai & machine learning',
    image: './assets/images/project-6.png',
    alt: 'Headroom',
    tooltip:
      'Usage-limits dashboard for Claude Code and Codex. When one account runs out, it moves the chat to the next account.',
    title: 'Headroom',
    tech: ['Python', 'Claude Code', 'Codex'],
    categoryLabel: 'AI & Machine Learning'
  },
  {
    href: 'https://github.com/UsmanBuk/Hindsight',
    category: 'ai & machine learning',
    image: './assets/images/project-9.png',
    alt: 'Hindsight',
    tooltip:
      'Offline Linux meeting recorder. Local Parakeet transcription and local LLM notes via Ollama. Nothing leaves the machine.',
    title: 'Hindsight',
    tech: ['Python', 'Parakeet', 'Ollama'],
    categoryLabel: 'AI & Machine Learning'
  },
  {
    href: 'https://github.com/UsmanBuk/Skills',
    category: 'ai & machine learning',
    image: './assets/images/project-5.png',
    alt: 'Skills',
    tooltip:
      'Agent skills for Claude Code and Codex CLI, including gauntlet and bugfix.',
    title: 'Skills',
    tech: ['Claude Code', 'Codex CLI', 'Agents'],
    categoryLabel: 'AI & Machine Learning'
  },
  {
    category: 'ai & machine learning',
    image: './assets/images/project-2.png',
    alt: 'Trading 212 AI Investment Platform',
    tooltip:
      'AI-powered trading system. Uses DeepSeek AI, news analysis, and market research to make daily investment decisions via the Trading 212 API. The repository is private.',
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
  }
]

function ProjectBody({ project }) {
  return (
    <>
      <figure className="project-img">
        {project.href ? (
          <div className="project-item-icon-box">
            <IonIcon name="eye-outline" />
          </div>
        ) : null}
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
    </>
  )
}

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
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} (opens in a new tab)`}
                  >
                    <ProjectBody project={project} />
                  </a>
                ) : (
                  <div className="project-card">
                    <ProjectBody project={project} />
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </section>
    </article>
  )
}
