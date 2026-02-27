const categoryKeywords = {
  communication: ["slack", "teams", "zoom", "meet"],
  projectManagement: ["asana", "jira", "trello", "linear", "clickup", "monday"],
  documentation: ["notion", "confluence", "coda", "airtable"],
  design: ["figma", "canva", "miro", "sketch"],
  crm: ["salesforce", "hubspot", "pipedrive", "zoho"],
  support: ["zendesk", "intercom", "freshdesk", "helpscout"]
};

const sampleCsv = `tool_name,monthly_cost,seats,active_users,owner,last_activity_days
Slack Enterprise,4200,120,98,IT,2
Microsoft Teams,3100,120,87,IT,3
Asana,1800,90,41,PMO,4
Jira Cloud,2200,95,82,Engineering,1
Notion Enterprise,1600,80,32,Ops,5
Confluence,1450,80,66,Engineering,2
Figma,1200,55,28,Design,7
Canva Teams,900,60,14,Marketing,19
HubSpot Sales,5100,75,57,Revenue Ops,1
Salesforce CRM,7400,75,62,Revenue Ops,1
Intercom,1850,42,18,Support,6
Zendesk,2100,42,39,Support,3`;

function toNumber(value) {
  const num = Number(String(value).replace(/[$,]/g, "").trim());
  return Number.isFinite(num) ? num : 0;
}

export function parseCsv(csv) {
  const rows = csv
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].split(",").map((h) => h.trim());
  return rows.slice(1).map((row) => {
    const cols = row.split(",").map((c) => c.trim());
    const record = Object.fromEntries(headers.map((header, index) => [header, cols[index] ?? ""]));
    return {
      toolName: record.tool_name,
      monthlyCost: toNumber(record.monthly_cost),
      seats: toNumber(record.seats),
      activeUsers: toNumber(record.active_users),
      owner: record.owner,
      lastActivityDays: toNumber(record.last_activity_days)
    };
  });
}

export function categorizeTool(toolName) {
  const normalized = toolName.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return category;
    }
  }
  return "other";
}

export function detectWaste(records) {
  const opportunities = [];
  const byCategory = new Map();

  for (const record of records) {
    const category = categorizeTool(record.toolName);
    const utilization = record.seats > 0 ? record.activeUsers / record.seats : 0;
    const annualCost = record.monthlyCost * 12;
    const wasteByUtilization = utilization < 0.5 ? annualCost * (0.5 - utilization) : 0;
    const stalePenalty = record.lastActivityDays > 14 ? annualCost * 0.15 : 0;

    opportunities.push({
      toolName: record.toolName,
      category,
      owner: record.owner,
      annualCost,
      utilization: Number((utilization * 100).toFixed(1)),
      estWaste: Number((wasteByUtilization + stalePenalty).toFixed(2)),
      reason:
        utilization < 0.5
          ? "Low license utilization"
          : record.lastActivityDays > 14
            ? "Low recent activity"
            : "Healthy usage"
    });

    if (!byCategory.has(category)) {
      byCategory.set(category, []);
    }
    byCategory.get(category).push(record);
  }

  const duplicateStacks = [];
  for (const [category, tools] of byCategory.entries()) {
    if (category === "other" || tools.length < 2) {
      continue;
    }
    const sortedByCost = [...tools].sort((a, b) => b.monthlyCost - a.monthlyCost);
    const keep = sortedByCost[0];
    const removable = sortedByCost.slice(1);
    const annualSavings = removable.reduce((sum, item) => sum + item.monthlyCost * 12 * 0.7, 0);
    duplicateStacks.push({
      category,
      keep: keep.toolName,
      remove: removable.map((item) => item.toolName),
      annualSavings: Number(annualSavings.toFixed(2))
    });
  }

  return { opportunities, duplicateStacks };
}

export function summarizePortfolio(records) {
  const { opportunities, duplicateStacks } = detectWaste(records);
  const totalAnnualSpend = records.reduce((sum, item) => sum + item.monthlyCost * 12, 0);
  const lowUtilizationWaste = opportunities.reduce((sum, item) => sum + item.estWaste, 0);
  const duplicateSavings = duplicateStacks.reduce((sum, item) => sum + item.annualSavings, 0);
  const totalPotentialSavings = Number((lowUtilizationWaste + duplicateSavings).toFixed(2));

  return {
    totalAnnualSpend: Number(totalAnnualSpend.toFixed(2)),
    lowUtilizationWaste: Number(lowUtilizationWaste.toFixed(2)),
    duplicateSavings: Number(duplicateSavings.toFixed(2)),
    totalPotentialSavings
  };
}

function renderReport(records) {
  const metrics = summarizePortfolio(records);
  const { opportunities, duplicateStacks } = detectWaste(records);

  const metricsContainer = document.querySelector("[data-metrics]");
  metricsContainer.innerHTML = `
    <article class="metric">
      <h3>Total annual spend</h3>
      <p>$${metrics.totalAnnualSpend.toLocaleString()}</p>
    </article>
    <article class="metric">
      <h3>Low-utilization waste</h3>
      <p>$${metrics.lowUtilizationWaste.toLocaleString()}</p>
    </article>
    <article class="metric">
      <h3>Duplicate-stack savings</h3>
      <p>$${metrics.duplicateSavings.toLocaleString()}</p>
    </article>
    <article class="metric">
      <h3>Total potential savings</h3>
      <p>$${metrics.totalPotentialSavings.toLocaleString()}</p>
    </article>
  `;

  const stackList = document.querySelector("[data-stacks]");
  if (!duplicateStacks.length) {
    stackList.innerHTML = "<li>No duplicate stacks detected in the current dataset.</li>";
  } else {
    stackList.innerHTML = duplicateStacks
      .map(
        (stack) => `
      <li>
        <strong>${stack.category}</strong>: keep ${stack.keep}, consolidate ${stack.remove.join(", ")}.
        Estimated annual savings: $${stack.annualSavings.toLocaleString()}.
      </li>
    `
      )
      .join("");
  }

  const tableBody = document.querySelector("[data-opportunities]");
  tableBody.innerHTML = opportunities
    .sort((a, b) => b.estWaste - a.estWaste)
    .map(
      (item) => `
      <tr>
        <td>${item.toolName}</td>
        <td>${item.category}</td>
        <td>${item.owner}</td>
        <td>$${item.annualCost.toLocaleString()}</td>
        <td>${item.utilization}%</td>
        <td>${item.reason}</td>
        <td>$${item.estWaste.toLocaleString()}</td>
      </tr>
    `
    )
    .join("");
}

function setup() {
  const textarea = document.querySelector("[name=portfolioCsv]");
  textarea.value = sampleCsv;

  const form = document.querySelector("[data-analyzer-form]");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const rows = parseCsv(textarea.value);
    renderReport(rows);
  });

  renderReport(parseCsv(sampleCsv));
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.addEventListener("DOMContentLoaded", setup);
}
