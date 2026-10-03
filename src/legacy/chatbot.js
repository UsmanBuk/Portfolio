export function getMockResponse(message) {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
    return "Usman has 5+ years of experience as a Full Stack Engineer. He's currently working as an AI Developer & Data Architecture Specialist at NHS - South Yorkshire ICB building healthcare data pipelines and AI chatbots, plus freelancing as Full Stack & DevOps Engineer at TIC.UK managing Laravel/PHP applications and CI/CD pipelines. Previously at TSG, Citadel Health (LIMS), and created the Chalkys e-commerce platform. Expert in Python, JavaScript, PHP, AWS, Azure, and AI integration!"
  }

  if (
    lowerMessage.includes('skills') ||
    lowerMessage.includes('technology') ||
    lowerMessage.includes('php') ||
    lowerMessage.includes('laravel')
  ) {
    return "Usman's tech stack includes Python, JavaScript, TypeScript, PHP/Laravel, Node.js, React, cloud services (AWS, Azure, Digital Ocean), Docker, Kubernetes, GitHub Actions for CI/CD, and AI tools like LangChain and Azure AI Search. He's also experienced with WordPress, Shopify, and low-code platforms like Lovable."
  }

  if (lowerMessage.includes('projects') || lowerMessage.includes('portfolio')) {
    return 'Check out his key projects: Chalkys (500k product e-commerce), AI Sentiment Analysis (IBM Watson), Umrah platforms (taxi booking & agency comparison), and systems programming projects. Each showcases different aspects of his full-stack and AI capabilities!'
  }

  if (lowerMessage.includes('contact') || lowerMessage.includes('hire')) {
    return "You can contact Usman at usmanbukhari541@gmail.com or +44 7462 660889. He's based in Coventry, UK and available for full-stack development, DevOps, and AI integration projects. Use the contact form on this site to get in touch!"
  }

  if (
    lowerMessage.includes('aws') ||
    lowerMessage.includes('cloud') ||
    lowerMessage.includes('azure') ||
    lowerMessage.includes('digital ocean')
  ) {
    return "Usman has extensive multi-cloud experience! Currently using Azure Functions and Azure AI Search for NHS healthcare pipelines, plus managing Digital Ocean infrastructure for TIC.UK travel applications. He's migrated from AWS to Digital Ocean, optimizing costs and performance. Expert with AWS services (Lambda, API Gateway, DynamoDB, EC2), CI/CD pipelines, and cloud migrations."
  }

  if (lowerMessage.includes('ai') || lowerMessage.includes('machine learning')) {
    return "Usman has extensive AI experience! Currently at NHS building healthcare chatbots with RAG, Azure AI Search, and LangChain. He's created web scrapers with Crawl4AI, built data pipelines with Azure Functions, and implemented vector embeddings for semantic search. Also has experience with OpenAI API, IBM Watson's NLP services, and AI-powered e-commerce features."
  }

  return "I'd be happy to tell you more about Usman's experience, skills, projects, or how to contact him. Try asking about his AWS expertise, AI projects, or recent work at TSG!"
}
