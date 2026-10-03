import { useState } from 'react'
import IonIcon from './IonIcon'

const EDUCATION = [
  {
    title: 'BSc Engineering Mathematics – University of Bristol',
    period: 'September 2016 - July 2019',
    text: 'Completed a rigorous program combining advanced mathematical theories and practical problem-solving, laying a strong foundation for analytical and technical excellence.'
  }
]

const EXPERIENCE = [
  {
    title: 'AI Engineer – Hudson and Hayes',
    period: 'April 2026 – Present',
    bullets: [
      'Architecting production voice agents on Azure AI Foundry, using the GPT-4o Realtime API for low-latency speech-to-speech conversations with function calling that executes tools and actions during live calls.',
      'Wiring Azure Communication Services for telephony and Azure Speech Services for speech-to-text and text-to-speech, combined with custom knowledge grounding to deliver domain-specific responses across inbound and outbound call flows.',
      'Building evaluation and observability pipelines that track call quality, latency, and tool-call accuracy in production — feeding live conversation data back into iterative prompt and agent refinement.'
    ]
  },
  {
    title: 'AI & Full Stack Engineer – Coex (Client: Ardonagh Specialty)',
    period: 'February 2026 – April 2026',
    bullets: [
      'Designed and shipped a KYC onboarding platform end-to-end for Ardonagh Specialty — React/TypeScript frontend, Python FastAPI backend, Azure-hosted — replacing a manual analyst workflow and cutting time-to-onboard from multiple days/weeks to hours.',
      'Built a multi-agent system on Azure AI Foundry (GPT-4o) that autonomously gathers and reconciles client data across Companies House, LexisNexis WorldCompliance, and internal PAS, producing structured risk summaries that analysts review rather than assemble.',
      'Engineered resilient API integrations with Companies House (PSC/UBO lookups), LexisNexis (sanctions, PEP, adverse media screening), and internal databases — including caching, retry, and rate-limit handling — keeping end-to-end agent runs under 30 seconds per case.',
      'Productionised the end-to-end workflow with Azure Logic Apps as the orchestration backbone — monitoring inboxes, triggering on inbound client emails, routing attachments through Azure Document Intelligence to extract PDF and structured data, and automatically creating cases in MongoDB ready for agent enrichment — alongside the full-stack foundations (auth, audit logging, role-based access) needed to run agents safely in a regulated compliance environment.'
    ]
  },
  {
    id: 'experience-nhs',
    title: 'Gen AI Engineer & Data Architecture Specialist - NHS - South Yorkshire ICB',
    period: 'May 2025 - February 2026',
    bullets: [
      'Built a generic web scraper using Crawl4AI to extract healthcare service data from 50+ regional websites, supporting unemployment and healthcare access initiatives in South Yorkshire.',
      'Engineered a daily data pipeline running on Azure Functions with queue and timer triggers, automating ingestion, transformation, and enrichment of scraped data.',
      'Standardised outputs into AI-ready JSON schemas, enabling seamless integration with NHS systems and downstream applications.',
      'Integrated the pipeline with Azure AI Search using vector embeddings for semantic retrieval, improving discoverability and relevance of healthcare services across diverse datasets.',
      'Deployed a Microsoft open-source chatbot framework, connected to the indexed data, allowing citizens to query healthcare/unemployment services via natural-language search.',
      'Applied LLM-oriented enrichment techniques (auto-tagging, summarisation, service clustering, and missing metadata generation) to improve data quality and categorisation.',
      'Leveraged LangChain orchestration to combine retrieval-augmented generation (RAG) with Azure AI Search, ensuring consistent, context-aware chatbot responses aligned to NHS data sources.',
      'Experimented with generative AI for synthetic data generation to test pipeline robustness and fill gaps in underrepresented service categories.',
      'Collaborated with NHS stakeholders to ensure the solution aligned with regional healthcare accessibility and unemployment support goals.'
    ]
  },
  {
    id: 'experience-tsg',
    title: 'Sage Intacct Full Stack Developer & Solutions Architect – TSG/Dayta (Sage Partner)',
    period: 'June 2024 – April 2025',
    bullets: [
      'Designed and implemented robust backend systems and RESTful APIs to power modern web applications.',
      'Managed and optimized cloud infrastructure to ensure high availability and peak performance.',
      'Automated deployment workflows using Kubernetes and Terraform, reducing manual overhead.',
      'Integrated CI/CD pipelines to streamline continuous delivery and accelerate time-to-market.',
      'Developed a Node.js/Express integration connecting Sage Intacct with IMP, a budgeting software tool, for seamless financial data exchange.',
      'Led the transition to a microservices architecture, reducing downtime by 40% and doubling system capacity.'
    ]
  },
  {
    id: 'experience-citadel-health',
    title: 'Full Stack Engineer – Citadel Health',
    period: 'Jan 2022 – Feb 2024',
    bullets: [
      'Laboratory Information Management System (LIMS): Developed a comprehensive LIMS leveraging Python, integrating custom APIs designed in Django for efficient laboratory data management.',
      "Enhanced the user interface with a React-based front-end and utilized Python's data handling capabilities (using libraries such as Pandas and NumPy) to process and manage complex laboratory data sets.",
      'Optimized API performance, reducing response times and improving data retrieval efficiency.',
      'Delivered a fully serverless API, minimizing infrastructure costs and maintenance overhead.',
      'Improved security and scalability using AWS Cognito, API Gateway, and Lambda.'
    ]
  },
  {
    title: 'Software/Data Engineer – Chalkys.com',
    period: 'Jan 2019 – Jan 2022',
    bullets: [
      'Developed and maintained Chalkys.com, a Shopify-based e-commerce platform, improving functionality and user experience.',
      'Integrated OpenAI API to generate AI-powered product descriptions, enhancing content quality and efficiency.',
      'Implemented Google Search API and Discogs API to automate data scraping and fill in missing product information, ensuring accurate and comprehensive listings.',
      'Designed machine learning models to extract, verify, and format critical data like tracklists, reducing manual workload and improving accuracy.',
      'Designed and implemented ETL pipelines using AWS services and Python, optimizing data workflows and enhancing backend processes for increased operational efficiency.'
    ]
  }
]

const FREELANCE = [
  {
    title: 'Full Stack Engineer – Mozaic Consulting (Client: SBTi)',
    period: 'Nov 2025 – Present',
    bullets: [
      'Extensively debugged and resolved complex issues across a React frontend and FastAPI backend application for SBTi, a company helping organizations achieve net zero emissions.',
      'Worked with BigQuery and PostgreSQL databases to investigate and fix data-related issues.',
      'Deployed and managed infrastructure on Google Cloud Platform (GCP).'
    ]
  },
  {
    title: 'Full Stack & DevOps Engineer – TIC.UK',
    period: 'July 2024 – Present',
    bullets: [
      'Manage PHP/Laravel based ATOL application and a custom CRM application for travel industry operations.',
      'Built a FastAPI-based API from scratch for Myatol, serving 20+ clients with real-time travel booking functionality.',
      'Built out automation workflows to streamline business processes and improve operational efficiency.',
      'Migrated infrastructure from AWS to Digital Ocean, optimizing costs and performance.',
      'Built a comprehensive CI/CD pipeline using GitHub Actions for automated testing and deployment.',
      'Managed and enhanced company WordPress website, improving user experience and functionality.',
      'Used low-code tools like Lovable to build out custom applications for travel agencies, accelerating development timelines.'
    ]
  },
  {
    title: 'API Engineer – Anglestack',
    period: 'Jan 2024 – July 2024',
    bullets: [
      'Developed serverless APIs using AWS API Gateway, Lambda, and DynamoDB to provide construction companies access to building data.',
      'Implemented authentication & role-based access control with AWS Cognito for secure API access.',
      'Built the frontend using React & Next.js, integrating AWS Amplify for deployment and scalability.',
      'Managed source control and CI/CD workflows using Bitbucket, ensuring efficient collaboration and deployment.'
    ]
  }
]

const SKILL_GROUPS = [
  {
    title: 'Programming Languages',
    skills: [
      { name: 'Python', level: 90, description: 'Data processing, web development, and automation scripting.' },
      { name: 'JavaScript', level: 85, description: 'Dynamic UI development and SPA creation.' },
      { name: 'TypeScript', level: 80, description: 'Strongly-typed JavaScript for scalable applications.' },
      { name: 'SQL', level: 85, description: 'Efficient querying and database optimization.' },
      { name: 'Liquid', level: 70, description: 'Shopify templating language for e-commerce.' },
      { name: 'C#', level: 80, description: 'Desktop and web applications using .NET.' },
      { name: 'HTML/CSS', level: 95, description: 'Responsive, semantic, and accessible web layouts.' },
      { name: 'Golang', level: 75, description: 'Efficient, concurrent systems programming.' }
    ]
  },
  {
    title: 'Software Tools / Frameworks',
    skills: [
      { name: 'Node.js/Express', level: 85, description: 'Building scalable APIs and server-side applications.' },
      { name: 'Django', level: 80, description: "Robust web applications with Python's Django framework." },
      { name: 'Flask', level: 75, description: 'Lightweight APIs and web apps with Flask.' },
      { name: 'React', level: 85, description: 'Dynamic and responsive front-end development.' },
      { name: 'Angular', level: 70, description: 'Structured, scalable single-page applications.' },
      { name: 'Git / GitHub', level: 90, description: 'Version control and collaborative development.' },
      { name: 'Docker/Containers', level: 85, description: 'Containerizing applications for consistent deployments.' },
      { name: 'Jira', level: 70, description: 'Agile project and task management.' },
      { name: 'Redis', level: 75, description: 'High-performance caching and data storage.' }
    ]
  },
  {
    title: 'Low Code / Other Tools',
    skills: [
      { name: 'Cursor', level: 70, description: 'Low-code tool for rapid application development.' },
      { name: 'VSCode', level: 95, description: 'Feature-rich code editor with extensive extensions.' },
      { name: 'Codev', level: 70, description: 'Collaborative development and code review tool.' },
      { name: 'OutSystems', level: 60, description: 'Enterprise low-code platform for rapid digital transformation.' },
      { name: 'ChatGPT', level: 85, description: 'AI conversational tool for creative and technical tasks.' },
      { name: 'Midjourney', level: 80, description: 'AI-powered tool for generating creative visuals.' },
      { name: 'DALL·E', level: 75, description: 'Generative AI for creating images from text descriptions.' },
      { name: 'Stable Diffusion', level: 80, description: 'AI tool for high-quality image synthesis and editing.' },
      { name: 'LangChain', level: 70, description: 'Framework for building applications with language models.' }
    ]
  },
  {
    title: 'AWS Services',
    skills: [
      { name: 'AWS Lambda', level: 85, description: 'Serverless compute service for event-driven functions.' },
      { name: 'AWS API Gateway', level: 80, description: 'Managed service for building and hosting APIs.' },
      { name: 'AWS Cognito', level: 75, description: 'User authentication and access control for web and mobile apps.' },
      { name: 'AWS DynamoDB', level: 80, description: 'NoSQL database service with fast performance at scale.' },
      { name: 'AWS CloudFormation', level: 70, description: 'Infrastructure as Code for provisioning AWS resources.' },
      { name: 'AWS EC2', level: 85, description: 'Scalable virtual servers for hosting applications.' },
      { name: 'AWS Fargate', level: 80, description: 'Serverless container management.' },
      { name: 'AWS ECS', level: 80, description: 'Managed container orchestration for Docker applications.' },
      { name: 'AWS ECR', level: 75, description: 'Secure container image registry.' },
      { name: 'AWS EKS', level: 75, description: 'Managed Kubernetes service for containerized applications.' },
      { name: 'AWS Amplify', level: 80, description: 'Deploying full-stack cloud applications.' },
      { name: 'AWS CodeBuild', level: 70, description: 'Continuous integration service for building and testing code.' },
      { name: 'AWS CodePipeline', level: 70, description: 'Automated continuous delivery pipelines.' },
      { name: 'AWS CodeDeploy', level: 70, description: 'Automated application deployment service.' },
      { name: 'AWS Route 53', level: 80, description: 'Scalable DNS and domain management service.' }
    ]
  }
]

function TimelineItem({ item }) {
  return (
    <li className="timeline-item" id={item.id}>
      <h4 className="h4 timeline-item-title">{item.title}</h4>
      <span>{item.period}</span>
      {item.bullets ? (
        <ul className="timeline-text">
          {item.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : (
        <p className="timeline-text">{item.text}</p>
      )}
    </li>
  )
}

function TimelineSection({ icon, title, items }) {
  return (
    <section className="timeline">
      <div className="title-wrapper">
        <div className="icon-box">
          <IonIcon name={icon} />
        </div>
        <h3 className="h3">{title}</h3>
      </div>
      <ol className="timeline-list">
        {items.map((item) => (
          <TimelineItem key={item.title} item={item} />
        ))}
      </ol>
    </section>
  )
}

export default function Resume({ isActive }) {
  const [openGroups, setOpenGroups] = useState(() => new Set())

  const toggleGroup = (title) => {
    setOpenGroups((current) => {
      const next = new Set(current)
      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }
      return next
    })
  }

  return (
    <article
      className={`resume${isActive ? ' active' : ''}`}
      data-page="resume"
      {...(!isActive ? { inert: '' } : {})}
    >
      <header>
        <h2 className="h2 article-title">Resume</h2>
        <div className="cv-download-card">
          <div className="cv-card-content">
            <p className="cv-card-title">
              <IonIcon name="document-text-outline" />
              Professional Resume
            </p>
            <p className="cv-card-description">
              Complete overview of my experience, skills, certifications, and achievements
            </p>
          </div>
          <a
            href="./assets/documents/UsmanCV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="cv-download-btn"
          >
            <IonIcon name="download-outline" />
            Download CV
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="cv-download-card">
          <div className="cv-card-content">
            <p className="cv-card-title">
              <IonIcon name="code-download-outline" />
              Detailed Technical Resume
            </p>
            <p className="cv-card-description">
              In-depth technical documentation with project details, code samples, and comprehensive skill breakdowns
            </p>
          </div>
          <a
            href="./assets/documents/DetailedCV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="cv-download-btn"
          >
            <IonIcon name="download-outline" />
            Download Detailed CV
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
      </header>

      <TimelineSection icon="school-outline" title="Education" items={EDUCATION} />
      <TimelineSection icon="business-outline" title="Experience" items={EXPERIENCE} />
      <TimelineSection icon="briefcase-outline" title="Contract / Freelance Work" items={FREELANCE} />

      <section className="skill">
        <h3 className="h3 skills-title">My Skills</h3>
        <div className="accordion">
          {SKILL_GROUPS.map((group) => {
            const isOpen = openGroups.has(group.title)
            const panelId = `skill-panel-${group.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
            return (
              <div className="accordion-item" key={group.title}>
                <button
                  className={`accordion-header${isOpen ? ' active' : ''}`}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  id={`${panelId}-trigger`}
                  onClick={() => toggleGroup(group.title)}
                >
                  {group.title}
                </button>
                <div
                  className={`accordion-content${isOpen ? ' active' : ''}`}
                  id={panelId}
                  role="region"
                  aria-labelledby={`${panelId}-trigger`}
                >
                  <ul className="skills-list content-card">
                    {group.skills.map((skill) => (
                      <li className="skills-item" key={skill.name}>
                        <div className="title-wrapper">
                          <h5 className="h5">{skill.name}</h5>
                          <data value={skill.level}>{skill.level}%</data>
                        </div>
                        <div className="skill-progress-bg">
                          <div className="skill-progress-fill" style={{ width: `${skill.level}%` }}></div>
                        </div>
                        <p className="skill-description">{skill.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </article>
  )
}
