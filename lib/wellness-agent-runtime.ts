import {
  analyseWellness,
  type WellnessCheckIn,
  type WellnessDimensionId,
  type WellnessPlan,
} from './wellness-engine.ts';

export type EvidenceCard = {
  id: string;
  title: string;
  source: string;
  appliesTo: WellnessDimensionId | 'safety';
  guidance: string;
};

export type RuntimeToolCall = {
  tool: 'profile.read' | 'evidence.retrieve' | 'safety.classify' | 'plan.validate' | 'approval.request';
  status: 'success' | 'held';
  summary: string;
  evidenceIds: string[];
};

export type WorkflowStage = {
  id: 'safety' | 'context' | 'evidence' | 'synthesis' | 'critic' | 'approval';
  agent: string;
  role: string;
  status: 'completed' | 'guarded' | 'awaiting-human';
  finding: string;
  toolCalls: RuntimeToolCall[];
};

export type WellnessAgentRun = {
  runId: string;
  createdAt: string;
  plan: WellnessPlan;
  evidence: EvidenceCard[];
  stages: WorkflowStage[];
  trace: string[];
  approval: {
    required: true;
    status: 'awaiting-human';
    scope: string;
  };
  quality: {
    grounded: boolean;
    safe: boolean;
    actionable: boolean;
    criticPassed: boolean;
  };
};

const evidenceLibrary: EvidenceCard[] = [
  { id: 'E-SLEEP-01', title: 'Sleep regularity', source: 'Aaranya evidence library · Sleep v1.2', appliesTo: 'sleep', guidance: 'Use a consistent wind-down cue and protect a realistic sleep window.' },
  { id: 'E-ENERGY-01', title: 'Daylight and alertness', source: 'Aaranya evidence library · Circadian v1.1', appliesTo: 'energy', guidance: 'Brief morning daylight and gentle movement can support daytime alertness.' },
  { id: 'E-STRESS-01', title: 'Brief paced breathing', source: 'Aaranya evidence library · Stress v1.3', appliesTo: 'stress', guidance: 'A slower exhale can be used as a short self-regulation practice.' },
  { id: 'E-MOVE-01', title: 'Movement snacks', source: 'Aaranya evidence library · Movement v1.0', appliesTo: 'movement', guidance: 'Short bouts of comfortable movement can make activity easier to sustain.' },
  { id: 'E-NOURISH-01', title: 'Hydration cueing', source: 'Aaranya evidence library · Nourishment v1.0', appliesTo: 'nourishment', guidance: 'Visible, routine-linked hydration cues can reduce reliance on memory.' },
  { id: 'E-CONNECT-01', title: 'Intentional connection', source: 'Aaranya evidence library · Social wellbeing v1.1', appliesTo: 'connection', guidance: 'A specific, low-pressure invitation can make social contact more achievable.' },
  { id: 'E-PURPOSE-01', title: 'Meaningful micro-goals', source: 'Aaranya evidence library · Purpose v1.0', appliesTo: 'purpose', guidance: 'A small value-aligned action can create momentum without overload.' },
  { id: 'P-SAFETY-01', title: 'Human escalation boundary', source: 'Aaranya Safety Policy §1.0', appliesTo: 'safety', guidance: 'Acute physical or self-harm signals pause wellness guidance and require immediate human support.' },
];

export function runWellnessCouncil(checkIn: WellnessCheckIn): WellnessAgentRun {
  const plan = analyseWellness(checkIn);
  const evidence = retrieveEvidence(plan.focus, plan.safety.level !== 'standard');
  const runId = `WELL-${stableHash(canonicalCheckIn(checkIn)).slice(0, 10).toUpperCase()}`;
  const safetyHeld = plan.safety.level !== 'standard';
  const criticPassed = safetyHeld
    ? plan.actions.length === 0 && plan.safety.requiresProfessionalHelp
    : plan.actions.length === 3 && plan.actions.every((action) => action.detail.length >= 30);

  const stages: WorkflowStage[] = [
    {
      id: 'safety', agent: 'Safety Guardian', role: 'Hard safety boundary', status: safetyHeld ? 'guarded' : 'completed',
      finding: safetyHeld ? 'Lifestyle planning paused; immediate human support takes priority.' : 'No acute escalation signal detected; supervised wellness planning may continue.',
      toolCalls: [{ tool: 'safety.classify', status: 'success', summary: `Classified as ${plan.safety.level}.`, evidenceIds: ['P-SAFETY-01'] }],
    },
    {
      id: 'context', agent: 'Context Agent', role: 'Whole-person state', status: 'completed',
      finding: `Synthesised seven signals; ${plan.focus.join(', ')} carry the highest support need.`,
      toolCalls: [{ tool: 'profile.read', status: 'success', summary: 'Read this check-in only; no hidden personal profile was inferred.', evidenceIds: [] }],
    },
    {
      id: 'evidence', agent: 'Evidence Agent', role: 'Grounding and retrieval', status: 'completed',
      finding: `Retrieved ${evidence.length} applicable evidence cards with stable source identifiers.`,
      toolCalls: [{ tool: 'evidence.retrieve', status: 'success', summary: `Matched ${evidence.length} cards to the current focus.`, evidenceIds: evidence.map((item) => item.id) }],
    },
    {
      id: 'synthesis', agent: 'Planning Agent', role: 'Constraint-aware planning', status: safetyHeld ? 'guarded' : 'completed',
      finding: safetyHeld ? 'No lifestyle actions generated while the safety boundary is active.' : `Sequenced ${plan.actions.length} low-burden actions around current capacity.`,
      toolCalls: [],
    },
    {
      id: 'critic', agent: 'Critic Agent', role: 'Grounding and policy check', status: criticPassed ? 'completed' : 'guarded',
      finding: criticPassed ? 'Plan passed grounding, actionability and safety-boundary checks.' : 'Plan failed a release check and must remain held.',
      toolCalls: [{ tool: 'plan.validate', status: 'success', summary: criticPassed ? 'All release checks passed.' : 'One or more release checks failed.', evidenceIds: evidence.map((item) => item.id) }],
    },
    {
      id: 'approval', agent: 'Human Steward', role: 'Final authority', status: 'awaiting-human',
      finding: safetyHeld ? 'Escalation guidance is visible; a human remains responsible for the response.' : 'The plan is a draft until the user explicitly accepts it.',
      toolCalls: [{ tool: 'approval.request', status: 'held', summary: 'Awaiting explicit human decision.', evidenceIds: [] }],
    },
  ];

  return {
    runId,
    createdAt: 'deterministic-prototype',
    plan,
    evidence,
    stages,
    trace: stages.map((stage, index) => `${index + 1}. ${stage.id}:${stage.status}`),
    approval: { required: true, status: 'awaiting-human', scope: safetyHeld ? 'Acknowledge escalation guidance' : 'Accept today’s suggested plan' },
    quality: {
      grounded: evidence.length >= (safetyHeld ? 1 : plan.focus.length + 1),
      safe: safetyHeld ? plan.actions.length === 0 : true,
      actionable: safetyHeld || plan.actions.every((action) => action.duration.length > 0),
      criticPassed,
    },
  };
}

function retrieveEvidence(focus: WellnessDimensionId[], includeSafety: boolean): EvidenceCard[] {
  const selected = evidenceLibrary.filter((item) => focus.includes(item.appliesTo as WellnessDimensionId));
  const safety = evidenceLibrary.find((item) => item.appliesTo === 'safety');
  return safety && (includeSafety || selected.length > 0) ? [...selected, safety] : selected;
}

function canonicalCheckIn(checkIn: WellnessCheckIn): string {
  return JSON.stringify({
    sleepHours: checkIn.sleepHours,
    energy: checkIn.energy,
    stress: checkIn.stress,
    movementMinutes: checkIn.movementMinutes,
    hydrationGlasses: checkIn.hydrationGlasses,
    connection: checkIn.connection,
    purpose: checkIn.purpose,
    note: checkIn.note?.trim() ?? '',
  });
}

function stableHash(value: string): string {
  let first = 2166136261;
  let second = 2246822507;
  for (let index = 0; index < value.length; index += 1) {
    first = Math.imul(first ^ value.charCodeAt(index), 16777619);
    second = Math.imul(second ^ value.charCodeAt(index), 3266489909);
  }
  return `${(first >>> 0).toString(16).padStart(8, '0')}${(second >>> 0).toString(16).padStart(8, '0')}`;
}
