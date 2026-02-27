const denialPlaybook = {
  "CO-16": {
    title: "Missing information",
    rootCause: "Claim is missing required documentation or coding detail.",
    correction: "Attach missing clinical documentation and corrected claim form.",
    appealAnchor: "The missing information has now been supplied in full.",
    recoverability: 0.72,
    effortScore: 2
  },
  "CO-50": {
    title: "Medical necessity denied",
    rootCause: "Payer did not find the service sufficiently justified.",
    correction: "Submit guideline-aligned rationale and supporting chart excerpts.",
    appealAnchor: "Clinical evidence confirms medical necessity for this encounter.",
    recoverability: 0.61,
    effortScore: 3
  },
  "CO-197": {
    title: "Authorization missing",
    rootCause: "Pre-authorization was missing, invalid, or mismatched.",
    correction: "Include authorization proof and timeline of prior contact.",
    appealAnchor: "Authorization context and timeline are documented for review.",
    recoverability: 0.57,
    effortScore: 4
  },
  "CO-109": {
    title: "Provider not covered",
    rootCause: "Provider enrollment data did not align with payer records.",
    correction: "Attach enrollment validation and service coverage confirmation.",
    appealAnchor: "Provider eligibility and enrollment status are validated.",
    recoverability: 0.49,
    effortScore: 4
  },
  "CO-45": {
    title: "Charge exceeds allowed amount",
    rootCause: "Billed amount exceeded contracted reimbursement schedule.",
    correction: "Provide contracted fee schedule references and adjudication comparison.",
    appealAnchor: "Contracted reimbursement terms support this correction request.",
    recoverability: 0.54,
    effortScore: 3
  }
};

const defaultSamples = [
  {
    claimId: "DG-1001",
    payer: "United Health",
    denialCode: "CO-16",
    claimAmount: 3840,
    daysOutstanding: 17,
    clinicalSummary: "ER chest pain evaluation with ECG and follow-up diagnostics."
  },
  {
    claimId: "DG-1002",
    payer: "Aetna",
    denialCode: "CO-50",
    claimAmount: 6250,
    daysOutstanding: 26,
    clinicalSummary: "Inpatient observation extended after acute kidney injury risk."
  },
  {
    claimId: "DG-1003",
    payer: "Blue Shield",
    denialCode: "CO-197",
    claimAmount: 2190,
    daysOutstanding: 34,
    clinicalSummary: "Outpatient imaging performed under urgent referral pathway."
  }
];

export function calculatePriority(claimAmount, daysOutstanding, recoverability, effortScore) {
  const urgencyFactor = Math.max(1, 45 - Number(daysOutstanding || 0));
  const valueSignal = Number(claimAmount || 0) * Number(recoverability || 0);
  const rawScore = (valueSignal / Number(effortScore || 1)) * (urgencyFactor / 10);
  const priorityScore = Number(rawScore.toFixed(2));

  let tier = "Low";
  if (priorityScore >= 750) {
    tier = "High";
  } else if (priorityScore >= 350) {
    tier = "Medium";
  }

  return { priorityScore, tier };
}

export function generateAppeal(claim) {
  const play = denialPlaybook[claim.denialCode] || denialPlaybook["CO-16"];
  return `To: ${claim.payer} Appeals Department
Subject: Formal Appeal for Claim ${claim.claimId}

I am submitting this appeal regarding denied claim ${claim.claimId} for patient reference ${claim.patientId || "N/A"}.

Denial reason received: ${claim.denialCode} (${play.title}).
Claim value under review: $${Number(claim.claimAmount || 0).toLocaleString()}.

${play.appealAnchor}
Clinical context: ${claim.clinicalSummary}

Corrective actions submitted:
- ${play.correction}
- Full supporting evidence package attached
- Requesting expedited reconsideration due to avoidable revenue delay

Please reprocess this claim and issue a revised adjudication.

Sincerely,
Revenue Cycle Team`;
}

export function buildRecoveryPlan(claim) {
  const play = denialPlaybook[claim.denialCode] || denialPlaybook["CO-16"];
  const priority = calculatePriority(
    claim.claimAmount,
    claim.daysOutstanding,
    play.recoverability,
    play.effortScore
  );
  const likelyRecovered = Number((claim.claimAmount * play.recoverability).toFixed(2));
  const appealDraft = generateAppeal(claim);

  return {
    ...claim,
    play,
    priority,
    likelyRecovered,
    appealDraft
  };
}

export function estimateMonthlyRecovery(records) {
  const totals = records.reduce(
    (acc, record) => {
      const plan = buildRecoveryPlan(record);
      acc.totalClaims += 1;
      acc.totalClaimValue += Number(record.claimAmount || 0);
      acc.likelyRecovered += plan.likelyRecovered;
      if (plan.priority.tier === "High") acc.highPriority += 1;
      if (plan.priority.tier === "Medium") acc.mediumPriority += 1;
      if (plan.priority.tier === "Low") acc.lowPriority += 1;
      return acc;
    },
    {
      totalClaims: 0,
      totalClaimValue: 0,
      likelyRecovered: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0
    }
  );

  return {
    ...totals,
    totalClaimValue: Number(totals.totalClaimValue.toFixed(2)),
    likelyRecovered: Number(totals.likelyRecovered.toFixed(2))
  };
}

function renderBacklog(records) {
  const metrics = estimateMonthlyRecovery(records);
  const metricsElement = document.querySelector("[data-metrics]");
  const tbody = document.querySelector("[data-backlog]");

  metricsElement.innerHTML = `
    <article class="metric">
      <h3>Total denied value</h3>
      <p>$${metrics.totalClaimValue.toLocaleString()}</p>
    </article>
    <article class="metric">
      <h3>Likely recoverable</h3>
      <p>$${metrics.likelyRecovered.toLocaleString()}</p>
    </article>
    <article class="metric">
      <h3>High-priority claims</h3>
      <p>${metrics.highPriority}</p>
    </article>
    <article class="metric">
      <h3>Denials in queue</h3>
      <p>${metrics.totalClaims}</p>
    </article>
  `;

  tbody.innerHTML = records
    .map((record) => {
      const plan = buildRecoveryPlan(record);
      return `
      <tr>
        <td>${record.claimId}</td>
        <td>${record.payer}</td>
        <td>${record.denialCode}</td>
        <td>$${record.claimAmount.toLocaleString()}</td>
        <td>${plan.priority.tier}</td>
        <td>$${plan.likelyRecovered.toLocaleString()}</td>
      </tr>
    `;
    })
    .join("");
}

function renderPlan(plan) {
  const result = document.querySelector("[data-result]");
  const tierClass = plan.priority.tier.toLowerCase();
  result.innerHTML = `
    <section class="result-card ${tierClass}">
      <h3>Recovery plan for ${plan.claimId}</h3>
      <p><strong>Root cause:</strong> ${plan.play.rootCause}</p>
      <p><strong>Recommended correction:</strong> ${plan.play.correction}</p>
      <p><strong>Priority tier:</strong> ${plan.priority.tier} (${plan.priority.priorityScore})</p>
      <p><strong>Estimated recoverable:</strong> $${plan.likelyRecovered.toLocaleString()}</p>
      <label for="appealDraft"><strong>Appeal draft</strong></label>
      <textarea id="appealDraft" rows="11" readonly>${plan.appealDraft}</textarea>
      <button type="button" data-export>Download appeal draft</button>
    </section>
  `;

  const exportButton = result.querySelector("[data-export]");
  exportButton.addEventListener("click", () => {
    const blob = new Blob([plan.appealDraft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${plan.claimId}-appeal.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  });
}

function setup() {
  const claims = [...defaultSamples];
  renderBacklog(claims);

  const form = document.querySelector("[data-claim-form]");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const claim = {
      claimId: String(formData.get("claimId") || "").trim(),
      patientId: String(formData.get("patientId") || "").trim(),
      payer: String(formData.get("payer") || "").trim(),
      denialCode: String(formData.get("denialCode") || "").trim(),
      claimAmount: Number(formData.get("claimAmount") || 0),
      daysOutstanding: Number(formData.get("daysOutstanding") || 0),
      clinicalSummary: String(formData.get("clinicalSummary") || "").trim()
    };

    claims.unshift(claim);
    renderBacklog(claims);
    renderPlan(buildRecoveryPlan(claim));
  });
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.addEventListener("DOMContentLoaded", setup);
}
