# Junior Developer Checklist

## Week 1 — Start React Migration

- [ ] Create a React application for the portfolio.
- [ ] Move the main layout, sidebar, navigation, and About section into React components.
- [ ] Reuse the existing CSS and design.
- [ ] Make sure the site works on mobile and desktop.
- [ ] Keep the old website available until the React version is working.

## Week 2 — Complete React Migration

- [ ] Move the Resume, Portfolio, Courses, Contact, Schedule, and Chatbot sections into React.
- [ ] Rebuild the filters, modals, accordions, navigation, and chatbot interface.
- [ ] Check that links, images, CV downloads, forms, and Cal.com still work.
- [ ] Fix keyboard and accessibility issues found during the migration.
- [ ] Test the React site and match the current design as closely as possible.

## Week 3 — Python Chatbot Backend

- [ ] Create a small Python FastAPI backend.
- [ ] Add a `POST /api/chat` endpoint.
- [ ] Load portfolio information from `chatbot-context.json`.
- [ ] Connect the endpoint to the OpenAI API.
- [ ] **Stop here and request API-key setup from the owner. Do not add a key to the code or Git.**
- [ ] Connect the React chatbot to the Python endpoint.
- [ ] Limit question and response length and add basic rate limiting.
- [ ] Show useful loading and error messages in the chatbot.
- [ ] Add simple tests using a mocked OpenAI response.
- [ ] Test common questions about experience, skills, projects, and contact details.

## Deployment and Handover

- [ ] Do not change hosting, DNS, or production settings alone.
- [ ] Deploy the React frontend and Python backend together with the owner.
- [ ] Add required environment variables to `.env.example` without real values.
- [ ] Update the README with setup, testing, and deployment instructions.
- [x] Confirm no API keys are exposed in browser code or Git.

The three-week schedule is a guide. Prioritise a working, tested migration over rushing unfinished work.
