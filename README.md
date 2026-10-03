# Syed Usman Bukhari - Portfolio Website

## 🚀 Overview

Personal portfolio website showcasing the professional experience and projects of **Syed Usman Bukhari**, a Full Stack & DevOps Engineer specializing in AI integration, cloud architecture, and modern web development.

## 👨‍💻 Current Roles (2025)

### **AI Developer & Data Architecture Specialist - NHS - South Yorkshire ICB** (March 2025 - Present)
- Building healthcare data pipelines with **Azure Functions** and **Crawl4AI**
- Implementing **RAG (Retrieval-Augmented Generation)** with **Azure AI Search**
- Developing AI chatbots for healthcare service discovery using **LangChain**
- Working with vector embeddings and semantic search technologies

### **Full Stack & DevOps Engineer - TIC.UK** (July 2024 - Present)
- Managing **PHP/Laravel** ATOL applications and custom CRM systems
- **Cloud Migration**: Successfully migrated infrastructure from AWS to **Digital Ocean**
- Built **CI/CD pipelines** using **GitHub Actions**
- Enhanced WordPress websites and created low-code applications with **Lovable**

## 🛠 Technical Stack

### **Core Technologies**
- **Languages**: Python, JavaScript, TypeScript, PHP, SQL, HTML/CSS
- **Frameworks**: Django, Flask, Laravel, Node.js, React, Angular
- **Cloud Platforms**: AWS, Azure, Digital Ocean
- **DevOps**: Docker, Kubernetes, Terraform, GitHub Actions
- **AI/ML**: LangChain, Azure AI Search, OpenAI API, IBM Watson

### **Specializations**
- **AI Integration**: RAG systems, vector embeddings, semantic search
- **Cloud Architecture**: Multi-cloud deployments and migrations  
- **Data Engineering**: ETL pipelines, web scraping, data processing
- **Full Stack Development**: End-to-end application development
- **DevOps**: Automated deployments and infrastructure management

## 🎯 Key Features

### **Interactive Portfolio**
- **Responsive Design**: Optimized for all device sizes
- **Project Showcase**: Filterable portfolio with detailed project information
- **Professional Timeline**: Comprehensive experience and education history
- **Skills Display**: Interactive accordion-style skills presentation

### **AI-Powered Chatbot**
- **Intelligent Assistant**: Answers questions about experience and skills
- **Context-Aware**: Trained on comprehensive professional background
- **Secure Implementation**: Key held only by the Lambda backend; rate-limited and throttled
- **Natural Language**: Conversational interface for visitors

### **Performance Optimizations**
- **Loading Screen**: Professional loading animation with spinner
- **Lazy Loading**: Optimized image loading for better performance
- **Clean Code**: Organized CSS and JavaScript with best practices
- **SEO Ready**: Meta tags and structured data for search engines

## 📈 Professional Experience

### **Recent Experience (2024-2025)**
- **NHS**: AI Developer building healthcare chatbots and data pipelines
- **TIC.UK**: Full Stack Engineer managing travel industry applications
- **TSG**: DevOps Engineer with 40% downtime reduction achievements
- **Anglestack**: API Engineer building construction industry solutions

### **Previous Experience**
- **Citadel Health** (2022-2024): LIMS development with 35% processing improvement
- **Chalkys.com** (2019-2022): E-commerce platform handling 500k+ products

## 🎓 Education & Certifications

### **Education**
- **BSc Engineering Mathematics** - University of Bristol (2016-2019)

### **Certifications**
- AWS Solutions Architect & Cloud Practitioner
- Data Engineering Program - AI Core
- Shopify Development - SuperHi
- IBM Full Stack Software Developer Professional

## 🚀 Getting Started

### **Prerequisites**
- Node.js 20+ and npm
- Python 3.12 (only for running the chatbot API locally)

### **Local Development**

```bash
git clone https://github.com/UsmanBuk/Portfolio.git
cd Portfolio
npm ci
npm run dev        # http://localhost:5175
```

The chat window needs the API running locally (`/api` is proxied to port 8000). See [`backend/README.md`](backend/README.md).

```bash
npm run build      # production build into dist/
npm run preview    # serve the build locally
```

## 📁 Project Structure

```
Portfolio/
├── index.html, schedule.html   # Vite entry points
├── src/
│   ├── App.jsx                 # Tab switching and routing
│   ├── components/             # One component per section (content lives here)
│   ├── legacy/                 # GitHub tab (raw HTML)
│   └── styles/                 # style.css, enhancements.css, schedule.css
├── assets/                     # Images, CV PDFs, chatbot-context.json
├── case-studies/               # Static case study pages
├── backend/                    # FastAPI chatbot API, AWS template, deploy script
└── amplify.yml                 # AWS Amplify build spec
```

## 🔧 Recent Updates

### **Latest Changes (2025)**
- ✅ **Updated Experience**: Added NHS AI Developer role
- ✅ **New Freelance Work**: Added TIC.UK Full Stack position  
- ✅ **Corrected Dates**: Updated TSG employment period
- ✅ **Enhanced Chatbot**: Updated responses with current roles
- ✅ **Loading Screen**: Added professional loading animation
- ✅ **Security Fix**: Removed hardcoded API credentials

### **Technical Improvements**
- **Performance**: Loading screen and optimized animations
- **Security**: Secure chatbot implementation without exposed keys
- **Content**: Up-to-date professional experience and skills
- **UX**: Better user experience with smooth transitions

## 🌟 Key Projects Highlighted

### **Healthcare AI (NHS)**
- **Crawl4AI Web Scraper**: Extracting data from 30+ healthcare websites
- **Azure AI Pipeline**: Daily data processing with queue/timer triggers
- **RAG Chatbot**: Natural language healthcare service discovery

### **Travel Industry (TIC.UK)**
- **ATOL Application**: PHP/Laravel travel booking system
- **Cloud Migration**: AWS to Digital Ocean infrastructure move
- **Automation**: CI/CD pipelines and workflow automation

### **E-commerce (Chalkys)**
- **500k Product Platform**: Large-scale e-commerce solution
- **AI Integration**: Automated product descriptions and recommendations
- **Performance**: Optimized for high-volume traffic

## 🤖 AI Chatbot Features

### **Knowledge Areas**
- **Professional Experience**: Current and previous roles
- **Technical Skills**: Programming languages and frameworks
- **Cloud Expertise**: AWS, Azure, Digital Ocean experience
- **AI/ML Projects**: Current NHS healthcare AI work
- **Project Portfolio**: Detailed project information

### **Conversation Topics**
Try asking about:
- "What's your current work?"
- "Tell me about your AI experience"
- "What cloud platforms do you use?"
- "Describe your PHP/Laravel projects"

## 📞 Contact Information

**Syed Usman Bukhari**
- **Email**: usmanbukhari541@gmail.com
- **Phone**: +44 7462 660889
- **Location**: Coventry, West Midlands, UK
- **GitHub**: https://github.com/UsmanBuk

## 🚀 Deployment

- **Website**: AWS Amplify Hosting (eu-west-2) builds and deploys `main` automatically using `amplify.yml`. Merging to `main` means a production release at https://www.usmanbukhari.co.uk.
- **Chatbot API**: FastAPI on AWS Lambda behind API Gateway, deployed with `backend/deploy.sh`. Amplify proxies `/api/*` to it.
- **Chatbot knowledge**: `assets/js/chatbot-context.json` is bundled into the Lambda, so redeploy the backend after editing it.

Full runbook (preview branches, rollback, access): see `CLAUDE.md` → Deployment.

## 📊 Performance & SEO

### **Optimizations**
- **Loading Speed**: Lazy loading and optimized resources
- **SEO Ready**: Meta tags and structured data
- **Mobile First**: Responsive design approach
- **Accessibility**: Keyboard navigation and screen reader support

### **Analytics Ready**
- Ready for Google Analytics integration
- Performance monitoring capabilities
- User interaction tracking potential

## 🔄 Maintenance

### **Regular Updates**
- **Experience**: Update roles and achievements
- **Projects**: Add new portfolio pieces
- **Skills**: Keep technology stack current
- **Chatbot**: Update knowledge base with new information

### **Content Management**
- **Resume PDFs**: Replace in `/assets/documents/`
- **Project Images**: Update in `/assets/images/`
- **Section Content**: Edit the component in `src/components/` (e.g. `Resume.jsx`)
- **Chatbot Knowledge**: Edit `assets/js/chatbot-context.json`, then run `backend/deploy.sh`

## 📝 License

This portfolio is personal intellectual property. The code structure and design patterns may be referenced for educational purposes.

---

**Last Updated**: May 2026
**Version**: 2.1 (Enhanced with AI features and current roles)
**Status**: ✅ Production Ready

*Showcasing modern web development with AI integration and professional experience in healthcare and travel industry applications.*

