import test from "node:test";
import assert from "node:assert/strict";
import { buildRecoveryPlan, calculatePriority, estimateMonthlyRecovery, generateAppeal } from "../app.js";

test("calculatePriority assigns high tier for large urgent claims", () => {
  const result = calculatePriority(10000, 5, 0.72, 2);
  assert.equal(result.tier, "High");
  assert.ok(result.priorityScore > 750);
});

test("generateAppeal includes claim and payer details", () => {
  const letter = generateAppeal({
    payer: "Aetna",
    claimId: "DG-9999",
    patientId: "PT-1010",
    denialCode: "CO-50",
    claimAmount: 4600,
    clinicalSummary: "Clinical review details."
  });
  assert.match(letter, /DG-9999/);
  assert.match(letter, /Aetna Appeals Department/);
  assert.match(letter, /medical necessity/i);
});

test("estimateMonthlyRecovery aggregates totals correctly", () => {
  const rows = [
    {
      claimId: "A",
      payer: "United Health",
      denialCode: "CO-16",
      claimAmount: 1000,
      daysOutstanding: 11,
      clinicalSummary: "Summary A"
    },
    {
      claimId: "B",
      payer: "Aetna",
      denialCode: "CO-50",
      claimAmount: 2000,
      daysOutstanding: 19,
      clinicalSummary: "Summary B"
    }
  ];
  const totals = estimateMonthlyRecovery(rows);
  assert.equal(totals.totalClaims, 2);
  assert.equal(totals.totalClaimValue, 3000);
  assert.ok(totals.likelyRecovered > 0);

  const onePlan = buildRecoveryPlan(rows[0]);
  assert.equal(onePlan.claimId, "A");
  assert.ok(onePlan.appealDraft.length > 20);
});
