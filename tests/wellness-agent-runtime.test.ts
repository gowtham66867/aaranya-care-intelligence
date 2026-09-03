import assert from 'node:assert/strict';
import test from 'node:test';
import { runWellnessCouncil } from '../lib/wellness-agent-runtime.ts';
import type { WellnessCheckIn } from '../lib/wellness-engine.ts';

const baseline: WellnessCheckIn = {
  sleepHours: 6.2,
  energy: 6,
  stress: 7,
  movementMinutes: 18,
  hydrationGlasses: 4,
  connection: 5,
  purpose: 7,
  note: '',
};

test('executes a typed six-stage supervised workflow', () => {
  const run = runWellnessCouncil(baseline);
  assert.deepEqual(run.stages.map((stage) => stage.id), ['safety', 'context', 'evidence', 'synthesis', 'critic', 'approval']);
  assert.equal(run.stages.at(-1)?.status, 'awaiting-human');
  assert.equal(run.approval.required, true);
});

test('grounds each focus dimension in retrieved evidence', () => {
  const run = runWellnessCouncil(baseline);
  for (const focus of run.plan.focus) assert.ok(run.evidence.some((item) => item.appliesTo === focus));
  assert.ok(run.evidence.every((item) => item.id.length > 0 && item.source.length > 0));
  assert.equal(run.quality.grounded, true);
});

test('records auditable typed tool calls and a deterministic trace', () => {
  const run = runWellnessCouncil(baseline);
  assert.ok(run.stages.flatMap((stage) => stage.toolCalls).length >= 5);
  assert.equal(run.trace.length, run.stages.length);
  assert.equal(run.runId, runWellnessCouncil(baseline).runId);
  assert.match(run.runId, /^WELL-[A-F0-9]{10}$/);
});

test('safety guardian halts recommendations before other agents can release them', () => {
  const run = runWellnessCouncil({ ...baseline, note: 'I have crushing chest pain and cannot breathe.' });
  assert.equal(run.plan.actions.length, 0);
  assert.equal(run.stages[0].status, 'guarded');
  assert.equal(run.plan.safety.requiresProfessionalHelp, true);
  assert.equal(run.quality.safe, true);
});

test('critic validates actionability and grounding before human review', () => {
  const run = runWellnessCouncil(baseline);
  assert.equal(run.quality.criticPassed, true);
  assert.equal(run.quality.actionable, true);
  assert.equal(run.stages.find((stage) => stage.id === 'critic')?.status, 'completed');
});
