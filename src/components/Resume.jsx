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
    id: 'experience-rolls-royce',
    title: 'AI Engineer – Rolls-Royce (Rolls-Royce & Partners Finance)',
    period: 'July 2026 – September 2026',
    bullets: [
      'Architected an AI-assisted airworthiness compliance proof of concept that traces every applicable EASA and FAA Airworthiness Directive and service bulletin through engine records.',
      'Targeted a cut from 8–24 hours of manual review per engine to about 3 hours, with the final safety judgement remaining with human engineers.',
      'Delivered the proof of concept as sole engineer, end to end.',
      'Designed a bounded multi-stage LLM pipeline — OCR, classification, identifier extraction, an evidence graph, rule extraction, and per-requirement reasoning — with deterministic guardrails and evaluation against an SME golden set.',
      'Built the system with Python, FastAPI, Postgres, Azure OpenAI, Document Intelligence, and React/TypeScript.'
    ]
  },
  {
    id: 'experience-hudson',
    title: 'AI Engineer – Hudson & Hayes',
    period: 'January 2026 – Present',
    bullets: [
      'Sole engineer on the Serco DWP Restart outbound AI voice agent: Azure Communication Services with Azure OpenAI Realtime speech-to-speech, barge-in, Dynamics 365 integration, safeguards, and A/B testing.',
      'Shipped the AKG Employment Coach Companion to production. Load tests cut median latency from about 980ms to about 33ms, and the companion publishes action plans to the government PICS system.',
      'Provide production support for the Network Rail Contract Agent, an AI contract-redaction pipeline using Document Intelligence, Presidio/spaCy, and GPT-5.1.'
    ]
  },
  {
    id: 'experience-ardonagh',
    title: 'Lead Agentic AI Engineer – Ardonagh Specialty',
    period: 'February 2026 – April 2026',
    bullets: [
      'Designed and shipped a KYC onboarding platform end-to-end for Ardonagh Specialty (insurance) — React/TypeScript frontend, Python FastAPI backend, Azure-hosted — replacing a manual analyst workflow and cutting time-to-onboard from multiple days/weeks to hours.',
      'Built a multi-agent system on Azure AI Foundry (GPT-4o) that autonomously gathers and reconciles client data across Companies House, LexisNexis WorldCompliance, and internal PAS, producing structured risk summaries that analysts review rather than assemble.',
      'Engineered resilient API integrations with Companies House (PSC/UBO lookups), LexisNexis (sanctions, PEP, adverse media screening), and internal databases — including caching, retry, and rate-limit handling — keeping end-to-end agent runs under 30 seconds per case.',
      'Productionised the end-to-end workflow with Azure Logic Apps as the orchestration backbone — monitoring inboxes, triggering on inbound client emails, routing attachments through Azure Document Intelligence to extract PDF and structured data, and automatically creating cases in MongoDB ready for agent enrichment — alongside the full-stack foundations (auth, audit logging, role-based access) needed to run agents safely in a regulated compliance environment.'
    ]
  },
  {
    id: 'experience-nhs',
    title: 'Gen AI Engineer – NHS South Yorkshire ICB',
    period: 'May 2025 – February 2026',
    bullets: [
      'Delivered a production RAG platform serving 1.4 million residents, with 3,000+ monthly active users.',
      'Reached 90% accuracy against clinical guidelines and recorded zero hallucination incidents in production.',
      'Cut query resolution from 12 minutes to under 30 seconds at a 94% success rate, using Azure AI Search, LangGraph, and LangChain.'
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
