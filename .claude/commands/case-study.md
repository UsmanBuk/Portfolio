# Case Study Generator

Generate a new case study HTML file following the established portfolio structure.

## Arguments

Pass project details as `$ARGUMENTS`:
- Project name / client
- Your role
- Key technologies used
- Brief description of the problem and solution

Example: `/case-study "Acme Corp - Built ML pipeline for fraud detection using Python, TensorFlow, AWS"`

## Template Structure

Follow the structure in `case-studies/nhs-south-yorkshire-rag.html`:

1. **Header Section**
   - Breadcrumb back to portfolio
   - Title (client/project name)
   - Subtitle (project type)
   - Technology badges
   - Role callout box

2. **Impact Section** (measured metrics)
   - Use real numbers where possible
   - Translate technical metrics to business value (£ saved, time reduced, etc.)
   - Include footnotes for context

3. **Problem Section**
   - 3-4 bullet points
   - Focus on business problem, not technical

4. **Solution Section**
   - 1-2 paragraphs
   - Technical approach with business justification

5. **Architecture Section** (optional)
   - Diagram placeholder or description
   - Keep it high-level

6. **Key Engineering Highlights**
   - 4-5 bullet points
   - Each starts with action verb
   - Include measurable outcomes

7. **Tech Stack Section**
   - Grouped by category (AI/ML, Application, Platform/Infrastructure)

8. **CTA Section**
   - Contact link
   - CV download

## Premium Positioning

Apply business value translation:
- Downtime reduction → £X annual cost avoidance
- Query success rate → time saved per interaction
- Infrastructure optimization → £X/year savings
- Automation → hours saved × hourly rate

## Output

1. Create new file in `case-studies/` directory
2. Use kebab-case filename: `client-name-project.html`
3. Populate with provided details, asking for missing information
4. Remind to add link in `index.html` project section
