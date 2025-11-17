"use strict";

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
const elementToggleFunc = (elem) => elem?.classList.toggle("active");

const EMAILJS_PUBLIC_KEY = "RqEGCYEXwOFGFvqu3";
const EMAILJS_SERVICE_ID = "service_6wy1ubo";
const EMAILJS_TEMPLATE_ID = "template_hsm76dc";
let emailJsPromise = null;

const loadEmailJs = () => {
  if (window.emailjs) {
    return Promise.resolve(window.emailjs);
  }

  if (!emailJsPromise) {
    emailJsPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.emailjs.com/dist/email.min.js";
      script.async = true;
      script.defer = true;
      script.onload = () => (window.emailjs ? resolve(window.emailjs) : reject(new Error("EmailJS failed to initialize")));
      script.onerror = () => reject(new Error("Failed to load EmailJS"));
      document.head.appendChild(script);
    });
  }

  return emailJsPromise;
};

class PortfolioChatbot {
  constructor() {
    this.apiKey = null;
    this.isOpen = false;
    this.contextData = null;
    this.context = "";
    this.contextPromise = null;
    this.setFallbackContext();
  }

  init() {
    if (!this.contextPromise) {
      this.contextPromise = this.loadContext();
    }
    return this.contextPromise;
  }

  async loadContext() {
    try {
      const response = await fetch("./assets/js/chatbot-context.json");
      if (!response.ok) throw new Error("Failed to fetch context");
      this.contextData = await response.json();
      this.updateContextString();
    } catch (error) {
      console.error("Failed to load chatbot context", error);
      this.contextData = null;
      this.setFallbackContext();
    }
  }

  updateContextString() {
    if (!this.contextData) {
      this.setFallbackContext();
      return;
    }

    const { personalInfo, experience, freelance, projects, technicalSkills, professionalTraining, quantifiedResults } = this.contextData;

    this.context = `You are an AI assistant for Usman Bukhari's portfolio website.

PERSONAL INFO & SUMMARY:
- Name: ${personalInfo.name}
- Title: ${personalInfo.title}
- Location: ${personalInfo.location}
- Email: ${personalInfo.email}
- Phone: ${personalInfo.phone}
- Portfolio: ${personalInfo.portfolio}
- GitHub: ${personalInfo.github}

Professional Summary: ${personalInfo.professionalSummary}

CURRENT ROLE & EXPERIENCE:
${experience.map(exp => `${exp.title} at ${exp.company} (${exp.period}):
Key Responsibilities: ${exp.responsibilities?.slice(0, 3).join('. ')}
Major Achievements: ${exp.keyAchievements.join('. ')}`).join("\n\n")}

FREELANCE WORK:
${freelance.map(work => `${work.title} at ${work.company} (${work.period}):
${work.keyAchievements.join('. ')}`).join("\n")}

MAJOR PROJECTS:
${Object.values(projects).map(project => `- ${project.name} (${project.url}): ${project.description}
Technologies: ${project.technologies.join(', ')}
Achievements: ${project.achievements.join(', ')}`).join("\n")}

CORE TECHNICAL COMPETENCIES:
${technicalSkills.coreCompetencies.join(', ')}

PROGRAMMING EXPERTISE:
- Python: Expert level - ${technicalSkills.programmingLanguages.python.frameworks.join(', ')}
- JavaScript/TypeScript: Expert level - ${technicalSkills.programmingLanguages.javascript.frameworks.join(', ')}
- C#: Advanced level - ${technicalSkills.programmingLanguages.csharp.frameworks.join(', ')}

AWS CLOUD EXPERTISE:
${technicalSkills.cloudPlatforms.aws.services.join(', ')}
Specializations: ${technicalSkills.cloudPlatforms.aws.specializations.join(', ')}

DATABASE TECHNOLOGIES:
- Relational: ${technicalSkills.databases.relational.join(', ')}
- NoSQL: ${technicalSkills.databases.nosql.join(', ')}
- Caching: ${technicalSkills.databases.caching.join(', ')}

DEVOPS & CI/CD:
- Containerization: ${technicalSkills.devopsTools.containerization.join(', ')}
- CI/CD: ${technicalSkills.devopsTools.cicd.join(', ')}
- Infrastructure as Code: ${technicalSkills.devopsTools.iac.join(', ')}

CERTIFICATIONS & TRAINING:
${professionalTraining.map(cert => `- ${cert.certification} (${cert.provider})`).join('\n')}

QUANTIFIED ACHIEVEMENTS:
Performance Improvements:
- Downtime Reduction: ${quantifiedResults.performanceImprovements.downtimeReduction}
- Traffic Handling: ${quantifiedResults.performanceImprovements.trafficHandlingIncrease}
- API Response Time: ${quantifiedResults.performanceImprovements.apiResponseTimeImprovement}
- Cost Savings: ${quantifiedResults.performanceImprovements.infrastructureCostSavings}
- Conversion Increase: ${quantifiedResults.performanceImprovements.upsellConversionIncrease}

Security & Scale:
- Security Record: ${quantifiedResults.securityAndCompliance.securityBreaches}
- Scale Handling: ${quantifiedResults.scalabilityMetrics.productHandling}
- Data Processing: ${quantifiedResults.scalabilityMetrics.dataProcessing}

INSTRUCTIONS:
- Keep responses under 150 words, friendly and professional
- Provide specific quantified achievements and metrics when relevant
- Highlight his expertise in AWS, DevOps, full-stack development, and AI integration
- Mention specific technologies and frameworks he's expert in
- Encourage visitors to contact Usman for opportunities
- Reference his portfolio at ${personalInfo.portfolio} for more details
- Emphasize his proven track record with large-scale systems and performance improvements`;
  }

  setFallbackContext() {
    this.context = `You are an AI assistant for Usman Bukhari's portfolio website.
    
He's a Full Stack & DevOps Engineer currently at TSG, with experience at Citadel Health and Chalkys.com.
Expert in Python, JavaScript, AWS services, and AI integration.
Built projects like Chalkys (500k products), AI sentiment analysis, and various web applications.
Contact: usmanbukhari541@gmail.com, +44 7462 660889, Coventry, UK.
    
Keep responses concise and professional. Encourage contact for opportunities.`;
  }

  toggleChat() {
    const chatWindow = document.getElementById("chatbot-window");
    if (!chatWindow) return;
    this.isOpen = !this.isOpen;
    chatWindow.style.display = this.isOpen ? "flex" : "none";
    if (this.isOpen) {
      qs("#chatbot-input")?.focus();
    }
  }

  closeChat() {
    const chatWindow = document.getElementById("chatbot-window");
    if (!chatWindow) return;
    chatWindow.style.display = "none";
    this.isOpen = false;
  }

  addMessage(content, isUser = false) {
    const messagesContainer = document.getElementById("chatbot-messages");
    if (!messagesContainer) return;
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${isUser ? "user-message" : "bot-message"}`;
    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  showTyping() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
      typingIndicator.style.display = "block";
    }
    const messagesContainer = document.getElementById("chatbot-messages");
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  hideTyping() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
      typingIndicator.style.display = "none";
    }
  }

  getMockResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("experience") || lowerMessage.includes("work")) {
      return "Usman has 5+ years of experience as a Full Stack Engineer. He works on healthcare data pipelines, AI chatbots, and freelances as a DevOps engineer managing Laravel/PHP systems. Previously at TSG, Citadel Health, and Chalkys.com, with deep expertise across Python, JavaScript, PHP, AWS, Azure, and AI tooling.";
    }

    if (lowerMessage.includes("skills") || lowerMessage.includes("technology") || lowerMessage.includes("php") || lowerMessage.includes("laravel")) {
      return "Tech stack: Python, JavaScript, TypeScript, PHP/Laravel, Node.js, React, AWS, Azure, Digital Ocean, Docker, Kubernetes, GitHub Actions, LangChain, Azure AI Search, plus Shopify/WordPress.";
    }

    if (lowerMessage.includes("projects") || lowerMessage.includes("portfolio")) {
      return "Key projects: Chalkys (500k product e-commerce), AI Sentiment Analysis dashboards, Umrah travel platforms, and bespoke AI chatbots for healthcare. Each highlights his full-stack and cloud strengths.";
    }

    if (lowerMessage.includes("contact") || lowerMessage.includes("hire")) {
      return "Contact Usman at usmanbukhari541@gmail.com or +44 7462 660889 (Coventry, UK). The site contact form also reaches him directly.";
    }

    if (lowerMessage.includes("aws") || lowerMessage.includes("cloud") || lowerMessage.includes("azure") || lowerMessage.includes("digital ocean")) {
      return "Usman runs multi-cloud workloads, migrating from AWS to Digital Ocean for cost savings while using Azure Functions and AI Search for NHS data pipelines. Skilled with Lambda, API Gateway, DynamoDB, EC2, CI/CD, and cloud migrations.";
    }

    if (lowerMessage.includes("ai") || lowerMessage.includes("machine learning")) {
      return "He builds AI chatbots with RAG, Azure AI Search, LangChain, and vector embeddings, plus IBM Watson NLP apps and Crawl4AI data pipelines.";
    }

    return "Ask me about Usman's experience, skills, AWS expertise, or AI projects—happy to help!";
  }

  async sendMessage() {
    const input = document.getElementById("chatbot-input");
    if (!input) return;
    const message = input.value.trim();
    if (!message) return;

    this.init();
    this.addMessage(message, true);
    input.value = "";
    this.showTyping();

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
      let botResponse;

      if (this.apiKey && this.apiKey.startsWith("sk-")) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: this.context },
              { role: "user", content: message }
            ],
            max_tokens: 150,
            temperature: 0.7
          })
        });
        const data = await response.json();
        botResponse = data.choices?.[0]?.message?.content || this.getMockResponse(message);
      } else {
        botResponse = this.getMockResponse(message);
      }

      this.hideTyping();
      this.addMessage(botResponse);
    } catch (error) {
      console.error("Chatbot error", error);
      this.hideTyping();
      this.addMessage("Sorry, I'm having trouble connecting. Please use the contact form below to reach Usman directly!");
    }
  }
}

let chatbotInstance = null;
const getChatbot = () => {
  if (!chatbotInstance) {
    chatbotInstance = new PortfolioChatbot();
  }
  chatbotInstance.init();
  return chatbotInstance;
};

const initSidebarToggle = () => {
  const sidebar = qs("[data-sidebar]");
  const sidebarBtn = qs("[data-sidebar-btn]");
  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener("click", () => elementToggleFunc(sidebar));
  }
};

const initTestimonialsModal = () => {
  const testimonialsItems = qsa("[data-testimonials-item]");
  const modalContainer = qs("[data-modal-container]");
  const modalCloseBtn = qs("[data-modal-close-btn]");
  const overlay = qs("[data-overlay]");
  const modalImg = qs("[data-modal-img]");
  const modalTitle = qs("[data-modal-title]");
  const modalText = qs("[data-modal-text]");

  if (!testimonialsItems.length || !modalContainer || !overlay) return;

  const toggleModal = () => {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  testimonialsItems.forEach((item) => {
    item.addEventListener("click", () => {
      const avatar = item.querySelector("[data-testimonials-avatar]");
      const title = item.querySelector("[data-testimonials-title]");
      const text = item.querySelector("[data-testimonials-text]");
      if (!avatar || !title || !text) return;
      modalImg.src = avatar.src;
      modalImg.alt = avatar.alt;
      modalTitle.innerHTML = title.innerHTML;
      modalText.innerHTML = text.innerHTML;
      toggleModal();
    });
  });

  modalCloseBtn?.addEventListener("click", toggleModal);
  overlay?.addEventListener("click", toggleModal);
};

const initFormValidation = () => {
  const form = qs("[data-form]");
  const formInputs = qsa("[data-form-input]");
  const formBtn = qs("[data-form-btn]");
  if (!form || !formInputs.length || !formBtn) return;

  formInputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });
};

const initAccordion = () => {
  const headers = qsa(".accordion-header");
  headers.forEach((header) => {
    header.addEventListener("click", () => {
      header.classList.toggle("active");
      const content = header.nextElementSibling;
      if (content) {
        content.style.display = content.style.display === "block" ? "none" : "block";
      }
    });
  });
};

const initPortfolioInteractions = () => {
  const projectItems = qsa("[data-filter-item]");
  const filterButtons = qsa("[data-filter-btn]");
  const select = qs("[data-select]");
  const selectItems = qsa("[data-select-item]");
  const selectValue = qs("[data-selecct-value]");
  const searchInput = qs("#portfolio-search");
  const searchClear = qs("#search-clear");
  const projectList = qs(".project-list");

  if (!projectItems.length) return;

  let currentCategory = "all";
  let currentSearch = "";

  const syncActiveButtons = () => {
    filterButtons.forEach((btn) => {
      const matches = btn.textContent.trim().toLowerCase() === currentCategory;
      btn.classList.toggle("active", matches);
    });
  };

  const toggleNoResults = (show) => {
    if (!projectList) return;
    let placeholder = qs(".no-results-message", projectList.parentElement);
    if (show && !placeholder) {
      placeholder = document.createElement("div");
      placeholder.className = "no-results-message";
      placeholder.innerHTML = `
        <div class="no-results-icon">😕</div>
        <h3>No matching projects</h3>
        <p>Try another filter or clear the search box.</p>
      `;
      projectList.insertAdjacentElement("afterend", placeholder);
    } else if (!show && placeholder) {
      placeholder.remove();
    }
  };

  const applyFilters = () => {
    let visibleCount = 0;
    projectItems.forEach((item) => {
      const category = item.dataset.category || "all";
      const title = item.querySelector(".project-title")?.textContent.toLowerCase() ?? "";
      const techBadges = qsa(".tech-badge", item).map((badge) => badge.textContent.toLowerCase()).join(" ");
      const searchTarget = `${title} ${techBadges}`;
      const matchesCategory = currentCategory === "all" || category === currentCategory;
      const matchesSearch = !currentSearch || searchTarget.includes(currentSearch);
      const shouldShow = matchesCategory && matchesSearch;

      if (shouldShow) {
        visibleCount += 1;
        item.style.display = "";
        item.style.opacity = "1";
        item.style.transform = "translateY(0) scale(1)";
        item.style.transitionDelay = `${Math.min(visibleCount, 8) * 40}ms`;
      } else {
        item.style.opacity = "0";
        item.style.transform = "translateY(20px) scale(0.95)";
        item.style.display = "none";
        item.style.transitionDelay = "0ms";
      }
    });

    toggleNoResults(visibleCount === 0);
  };

  const setCategory = (value, labelText) => {
    currentCategory = value;
    if (selectValue && labelText) {
      selectValue.innerText = labelText;
    }
    syncActiveButtons();
    applyFilters();
  };

  select?.addEventListener("click", () => elementToggleFunc(select));

  selectItems.forEach((item) => {
    item.addEventListener("click", () => {
      const value = item.innerText.trim().toLowerCase();
      select?.classList.remove("active");
      setCategory(value, item.innerText.trim());
    });
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const label = button.textContent.trim();
      setCategory(label.toLowerCase(), label);
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      currentSearch = event.target.value.trim().toLowerCase();
      if (searchClear) {
        searchClear.style.display = currentSearch ? "flex" : "none";
      }
      applyFilters();
    });

    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.focus();
      }
    });
  }

  if (searchClear) {
    searchClear.style.display = "none";
  }

  searchClear?.addEventListener("click", () => {
    currentSearch = "";
    if (searchInput) {
      searchInput.value = "";
      searchInput.blur();
    }
    searchClear.style.display = "none";
    applyFilters();
  });

  setCategory(currentCategory, selectValue?.innerText ?? "All");
  applyFilters();
};

const initScrollToTopButton = () => {
  const button = qs("#scroll-to-top");
  if (!button) return;

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      button.classList.add("visible");
    } else {
      button.classList.remove("visible");
    }
  });

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

const initCourseFilters = () => {
  const buttons = qsa(".course-filter-btn[data-course-filter]");
  const cards = qsa(".course-card[data-course-category]");
  if (!buttons.length || !cards.length) return;

  const applyCourseFilter = (filter) => {
    let visible = 0;
    cards.forEach((card) => {
      const categories = (card.dataset.courseCategory || "").split(" ").map((item) => item.trim()).filter(Boolean);
      const shouldShow = filter === "all" || categories.includes(filter);
      if (shouldShow) {
        visible += 1;
        card.style.display = "block";
        card.style.opacity = "1";
        card.style.transform = "translateY(0) scale(1)";
        card.style.transitionDelay = `${Math.min(visible, 6) * 60}ms`;
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(15px) scale(0.95)";
        card.style.display = "none";
        card.style.transitionDelay = "0ms";
      }
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      applyCourseFilter(button.dataset.courseFilter || "all");
    });
  });

  buttons[0]?.classList.add("active");
  applyCourseFilter(buttons[0]?.dataset.courseFilter || "all");
};

const initNavigationSync = () => {
  const navLinks = qsa("[data-nav-link]");
  const pages = qsa("[data-page]");
  if (!navLinks.length || !pages.length) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((nav) => nav.classList.remove("active"));
      pages.forEach((page) => page.classList.remove("active"));
      link.classList.add("active");
      const pageName = link.textContent.trim().toLowerCase();
      qs(`[data-page="${pageName}"]`)?.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
};

const initContactForm = () => {
  const form = qs("#contact-form");
  if (!form) return;

  loadEmailJs()
    .then((emailjs) => {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        emailjs
          .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
          .then(() => {
            alert("Message sent successfully!");
            form.reset();
          })
          .catch((error) => {
            console.error("EmailJS Error", error);
            alert("Failed to send message. Please try again.");
          });
      });
    })
    .catch((error) => {
      console.error("EmailJS failed to load", error);
    });
};

const initChatbotUi = () => {
  const toggle = qs("#chatbot-toggle");
  const closeBtn = qs("#chatbot-close");
  const sendBtn = qs("#chatbot-send");
  const input = qs("#chatbot-input");

  if (!toggle || !closeBtn || !sendBtn || !input) return;

  toggle.addEventListener("click", () => getChatbot().toggleChat());
  closeBtn.addEventListener("click", () => chatbotInstance?.closeChat());
  sendBtn.addEventListener("click", () => getChatbot().sendMessage());
  input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      getChatbot().sendMessage();
    }
  });
};

const initLoadingScreen = () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (!loadingScreen) return;

  setTimeout(() => {
    loadingScreen.classList.add("hidden");
    setTimeout(() => loadingScreen.remove(), 600);
  }, 500);
};

document.addEventListener("DOMContentLoaded", () => {
  initSidebarToggle();
  initTestimonialsModal();
  initFormValidation();
  initAccordion();
  initPortfolioInteractions();
  initCourseFilters();
  initScrollToTopButton();
  initNavigationSync();
  initContactForm();
  initChatbotUi();
});

window.addEventListener("load", initLoadingScreen);
