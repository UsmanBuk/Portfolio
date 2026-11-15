export function getMockResponse(message) {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
    return "Usman is a Founder and AI Engineer in Coventry. He builds VacancyBot, an AI assistant that prepares and submits job applications (starting with Reed, with the user reviewing every application), and runs Bukhari Consulting for company AI training. He is open to AI engineering contracts. Recent contract work includes Rolls-Royce & Partners Finance, Hudson & Hayes, and Ardonagh Specialty. He previously delivered a production RAG platform at NHS South Yorkshire ICB."
  }

  if (
    lowerMessage.includes('skills') ||
    lowerMessage.includes('technology') ||
    lowerMessage.includes('php') ||
    lowerMessage.includes('laravel')
  ) {
    return "Usman's current stack is Python, FastAPI, Postgres, React/TypeScript, and Azure: Azure OpenAI, Azure OpenAI Realtime, Communication Services, Document Intelligence, and Azure AI Foundry. He also works with Dynamics 365, Presidio, and spaCy. Earlier work used LangChain, LangGraph, Azure AI Search, AWS, Docker, and Kubernetes."
  }

  if (lowerMessage.includes('projects') || lowerMessage.includes('portfolio')) {
    return 'His main product is VacancyBot (vacancybot.co.uk). Public tools include Headroom (Claude Code and Codex usage limits), Hindsight (offline Linux meeting recorder), and Skills (agent skills for Claude Code and Codex CLI). The VacancyBot code is private.'
  }

  if (lowerMessage.includes('contact') || lowerMessage.includes('hire')) {
    return "You can contact Usman at usmanbukhari541@gmail.com or +44 7462 660889. He's based in Coventry, UK, BPSS screened and DBS checked, and open to AI engineering contracts and team training through Bukhari Consulting."
  }

  if (
    lowerMessage.includes('aws') ||
    lowerMessage.includes('cloud') ||
    lowerMessage.includes('azure') ||
    lowerMessage.includes('digital ocean')
  ) {
    return "Recent AI engineering work runs on Azure: Azure OpenAI, Communication Services, Document Intelligence, and Azure AI Foundry, with Postgres and FastAPI. Earlier roles used AWS (Lambda, API Gateway, Cognito) and Azure AI Search."
  }

  if (lowerMessage.includes('ai') || lowerMessage.includes('machine learning') || lowerMessage.includes('vacancy')) {
    return "Usman builds VacancyBot, an AI assistant that prepares and submits job applications and lets the user review every one. Bukhari Consulting trains company teams. Contract work covers airworthiness document pipelines, outbound voice agents, and multi-agent KYC. He previously delivered production RAG for NHS South Yorkshire ICB."
  }

  return "I'd be happy to tell you more about Usman's experience, VacancyBot, Bukhari Consulting, or how to contact him."
}
