import test from "node:test";
import assert from "node:assert/strict";
import { categorizeTool, detectWaste, parseCsv, summarizePortfolio } from "../app.js";

const fixtureCsv = `tool_name,monthly_cost,seats,active_users,owner,last_activity_days
Slack Enterprise,4200,120,98,IT,2
Microsoft Teams,3100,120,87,IT,3
Canva Teams,900,60,14,Marketing,19`;

test("parseCsv reads CSV rows into normalized objects", () => {
  const rows = parseCsv(fixtureCsv);
  assert.equal(rows.length, 3);
  assert.equal(rows[0].toolName, "Slack Enterprise");
  assert.equal(rows[2].monthlyCost, 900);
});

test("categorizeTool maps known tools to canonical categories", () => {
  assert.equal(categorizeTool("Slack Enterprise"), "communication");
  assert.equal(categorizeTool("HubSpot Sales"), "crm");
  assert.equal(categorizeTool("Unknown Tool"), "other");
});

test("detectWaste identifies duplicate stacks and savings", () => {
  const rows = parseCsv(fixtureCsv);
  const result = detectWaste(rows);
  assert.ok(result.duplicateStacks.length >= 1);
  assert.ok(result.duplicateStacks[0].annualSavings > 0);
});

test("summarizePortfolio computes total potential savings", () => {
  const rows = parseCsv(fixtureCsv);
  const metrics = summarizePortfolio(rows);
  assert.equal(metrics.totalAnnualSpend, 98400);
  assert.ok(metrics.totalPotentialSavings > 0);
});
