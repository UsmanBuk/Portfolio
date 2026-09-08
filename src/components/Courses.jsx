import { useState } from 'react'
import IonIcon from './IonIcon'

const COURSE_STATS = [
  { number: '8+', label: 'Courses Completed' },
  { number: '285+', label: 'Hours of Learning' },
  { number: '4', label: 'Platforms' }
]

const COURSE_FILTERS = [
  { id: 'all', label: 'All Courses', icon: '📚' },
  { id: 'development', label: 'Development', icon: '💻' },
  { id: 'data-ai', label: 'Data & AI', icon: '🤖' },
  { id: 'certification', label: 'Certifications', icon: '🏆' }
]

const COURSES = [
  {
    categories: ['development'],
    logo: './assets/images/logo-2-color.png',
    logoAlt: 'Udemy',
    provider: 'Udemy',
    badge: 'Intensive',
    badgeClass: 'intensive',
    title: 'Master Python by Building 100 Projects in 100 Days',
    description:
      'Intensive Python bootcamp with 100 hands-on projects covering web development, data science, and automation.',
    skills: ['Python', 'Flask', 'Django', 'APIs', 'Automation'],
    duration: '100 days',
    instructor: 'Dr Angela Yu'
  },
  {
    categories: ['development', 'certification'],
    logo: './assets/images/logo-1-color.png',
    logoAlt: 'IBM',
    provider: 'IBM via Coursera',
    badge: 'Professional',
    badgeClass: 'professional',
    title: 'IBM Full Stack Software Developer Professional',
    description:
      'Comprehensive program covering full-stack development with modern technologies and industry best practices.',
    skills: ['React', 'Node.js', 'Python', 'Docker', 'Kubernetes'],
    duration: '6 months',
    status: 'Completed'
  },
  {
    categories: ['development'],
    logo: './assets/images/logo-2-color.png',
    logoAlt: 'Udemy',
    provider: 'Udemy',
    badge: 'Advanced',
    badgeClass: 'advanced',
    title: 'Master JavaScript from Scratch',
    description:
      'Complete JavaScript mastery including jQuery and React JS with hands-on projects and real-world applications.',
    skills: ['JavaScript', 'jQuery', 'React', 'DOM'],
    duration: '40 hours',
    instructor: 'Ryan Dhungel'
  },
  {
    categories: ['data-ai', 'certification'],
    logo: './assets/images/logo-3-color.png',
    logoAlt: 'Databricks',
    provider: 'Databricks via Udemy',
    badge: 'Certification',
    badgeClass: 'certification',
    title: 'Databricks Certified Data Engineer Associate',
    description:
      'Professional certification preparation covering data engineering fundamentals, ETL processes, and big data analytics.',
    skills: ['Spark', 'SQL', 'ETL', 'Data Lakes'],
    duration: '25 hours',
    status: 'Certified'
  },
  {
    categories: ['data-ai'],
    logo: './assets/images/logo-1-color.png',
    logoAlt: 'IBM',
    provider: 'IBM',
    badge: 'Specialization',
    badgeClass: 'specialization',
    title: 'Python for Data Science, AI & Development',
    description:
      'Comprehensive introduction to Python for data analysis, machine learning, and AI application development.',
    skills: ['Python', 'Pandas', 'NumPy', 'Machine Learning'],
    duration: '20 hours',
    status: 'Completed'
  },
  {
    categories: ['data-ai'],
    logo: './assets/images/logo-1-color.png',
    logoAlt: 'IBM',
    provider: 'IBM',
    badge: 'Cutting Edge',
    badgeClass: 'cutting-edge',
    title: 'Generative AI: Introduction and Applications',
    description:
      'Latest developments in generative AI, covering GPT models, prompt engineering, and practical AI applications.',
    skills: ['Generative AI', 'GPT', 'Prompt Engineering', 'LLMs'],
    duration: '15 hours',
    status: 'Completed'
  },
  {
    categories: ['certification'],
    logo: './assets/images/logo-4-color.png',
    logoAlt: 'AWS',
    provider: 'AWS',
    badge: 'Certification',
    badgeClass: 'certification',
    title: 'AWS Solutions Architect Associate',
    description:
      'Comprehensive training in designing scalable, secure, and cost-effective cloud architectures on AWS platform.',
    skills: ['AWS', 'Cloud Architecture', 'EC2', 'S3', 'VPC'],
    duration: '65 hours',
    status: 'Completed'
  },
  {
    categories: ['certification'],
    logo: './assets/images/logo-4-color.png',
    logoAlt: 'AWS',
    provider: 'AWS',
    badge: 'Certification',
    badgeClass: 'certification',
    title: 'AWS Cloud Practitioner',
    description:
      'Foundational understanding of AWS cloud services, security, pricing, and core architectural principles.',
    skills: ['AWS', 'Cloud Fundamentals', 'Security', 'Pricing', 'Best Practices'],
    duration: '20 hours',
    status: 'Completed'
  }
]

export default function Courses({ isActive }) {
  const [filter, setFilter] = useState('all')

  return (
    <article
      className={`courses${isActive ? ' active' : ''}`}
      data-page="courses"
      {...(!isActive ? { inert: '' } : {})}
    >
      <header>
        <h2 className="h2 article-title">Professional Development</h2>
      </header>

      <section className="courses-stats">
        {COURSE_STATS.map((stat) => (
          <div className="stat-item" key={stat.label}>
            <span className="stat-number">{stat.number}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="course-filters">
        <div className="filter-tabs" role="group" aria-label="Filter courses">
          {COURSE_FILTERS.map((item) => (
            <button
              className={`course-filter-btn${filter === item.id ? ' active' : ''}`}
              data-course-filter={item.id}
              type="button"
              aria-pressed={filter === item.id}
              key={item.id}
              onClick={() => setFilter(item.id)}
            >
              <span className="filter-icon">{item.icon}</span>
              <span className="filter-text">{item.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="courses-content">
        <div className="courses-grid">
          {COURSES.filter(
            (course) => filter === 'all' || course.categories.includes(filter)
          ).map((course) => (
            <div
              className="course-card"
              data-course-category={course.categories.join(' ')}
              key={course.title}
            >
              <div className="course-header">
                <div className="course-provider">
                  <img src={course.logo} alt={course.logoAlt} className="provider-logo" />
                  <span className="provider-name">{course.provider}</span>
                </div>
                <div className={`course-badge ${course.badgeClass}`}>{course.badge}</div>
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-skills">
                  {course.skills.map((skill) => (
                    <span className="skill-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="course-footer">
                <div className="course-duration">
                  <IonIcon name="time-outline" />
                  <span>{course.duration}</span>
                </div>
                {course.instructor ? (
                  <div className="course-instructor">
                    <IonIcon name="person-outline" />
                    <span>{course.instructor}</span>
                  </div>
                ) : (
                  <div className="course-status completed">
                    <IonIcon name="checkmark-circle" />
                    <span>{course.status}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}
