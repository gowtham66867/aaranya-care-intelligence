import { createFamilyUpdate, evaluateCareSignal, type CareSignal, type RiskLevel } from './care-agent.ts';

export type AgentName = 'Memory Agent' | 'Care Coordinator' | 'Clinical Safety' | 'Operations Agent' | 'Family Communications';

export type AgentStep = {
  agent: AgentName;
  status: 'completed' | 'blocked' | 'awaiting-human';
  objective: string;
  output: string;
  toolCalls: ToolCall[];
};

export type ToolCall = {
  tool: 'resident_memory.search' | 'care_policy.retrieve' | 'care_task.create' | 'family_update.draft';
  input: string;
  output: string;
  status: 'success' | 'held';
};

export type AgentRun = {
  runId: string;
  resident: string;
  risk: RiskLevel;
  goal: string;
  plan: string[];
  retrievedContext: string[];
  policyCitations: string[];
  steps: AgentStep[];
  recommendedAction: string;
  assignedTo: string;
  familyDraft: string;
  finalStatus: 'awaiting-human-approval';
  guardrails: string[];
};

const residentMemory: Record<string, string[]> = {
  'Anita Menon': ['Vegetarian diet', 'Independent mobility baseline', 'Prefers tea with meals', 'Daughter Maya receives approved daily updates'],
  'Raghav Shah': ['Low-sodium diet', 'Uses walking support', 'Enjoys morning yoga', 'Son Arjun receives approved weekly updates'],
  'Leela Kapoor': ['Independent mobility', 'Enjoys music therapy', 'Usually social at lunch', 'Niece Priya is primary family contact'],
};

const policyLibrary = [
  { pattern: /chest pain|unresponsive|not breathing|stroke|severe bleeding/i, citation: 'Emergency Response Policy §2.1', instruction: 'Contact emergency services immediately and remain with the resident.' },
  { pattern: /fall/i, citation: 'Falls Protocol §3.2', instruction: 'Notify the nurse, avoid unsafe movement, assess and document.' },
  { pattern: /medication/i, citation: 'Medication Safety Policy §4.1', instruction: 'Only an authorised clinician may change medication or dosage.' },
  { pattern: /intake|food|dehydr|mobility|lonely|withdrawn|sleep/i, citation: 'Wellbeing Monitoring Standard §5.3', instruction: 'Compare with baseline, perform a wellbeing check and monitor.' },
  { pattern: /.*/i, citation: 'Human Oversight Standard §1.0', instruction: 'A staff member must approve every recommendation and outbound message.' },
];

export function orchestrateCareEvent(signal: CareSignal): AgentRun {
  const recommendation = evaluateCareSignal(signal);
  const memory = retrieveMemory(signal.resident, signal.observation);
  const policies = retrievePolicies(signal.observation);
  const taskId = `TASK-${stableHash(`${signal.resident}:${signal.observation}`).slice(0, 6).toUpperCase()}`;
  const runId = `RUN-${stableHash(`${signal.resident}:${signal.observation}:v1`).slice(0, 8).toUpperCase()}`;
  const assignedTo = recommendation.escalationTarget;
  const familyDraft = createFamilyUpdate(signal.resident, [
    'The care team reviewed a change observed today.',
    'A staff member is completing the recommended follow-up.',
  ]);
  const plan = buildPlan(recommendation.risk);

  const memoryTool: ToolCall = {
    tool: 'resident_memory.search',
    input: `Retrieve relevant baseline and preferences for ${signal.resident}`,
    output: memory.join(' · '),
    status: 'success',
  };
  const policyTool: ToolCall = {
    tool: 'care_policy.retrieve',
    input: `Find policies applicable to: ${signal.observation}`,
    output: policies.map((policy) => `${policy.citation}: ${policy.instruction}`).join(' '),
    status: 'success',
  };
  const taskTool: ToolCall = {
    tool: 'care_task.create',
    input: `${recommendation.nextAction} Assign to ${assignedTo}`,
    output: `${taskId} prepared for ${assignedTo}; release requires staff approval.`,
    status: 'held',
  };
  const familyTool: ToolCall = {
    tool: 'family_update.draft',
    input: `Prepare a factual update for ${signal.resident}`,
    output: familyDraft,
    status: 'held',
  };

  const steps: AgentStep[] = [
    {
      agent: 'Memory Agent',
      status: 'completed',
      objective: 'Ground the event in resident-specific context.',
      output: `${memory.length} relevant memory items retrieved.`,
      toolCalls: [memoryTool],
    },
    {
      agent: 'Care Coordinator',
      status: 'completed',
      objective: 'Interpret the event and create a structured care plan.',
      output: `${plan.length}-step plan created with ${recommendation.risk} priority.`,
      toolCalls: [],
    },
    {
      agent: 'Clinical Safety',
      status: 'completed',
      objective: 'Check the plan against clinical and human-oversight policies.',
      output: `Plan grounded in ${policies.length} policies. No autonomous diagnosis or treatment change allowed.`,
      toolCalls: [policyTool],
    },
    {
      agent: 'Operations Agent',
      status: 'awaiting-human',
      objective: 'Route the approved action to the correct owner.',
      output: `${taskId} staged for ${assignedTo}.`,
      toolCalls: [taskTool],
    },
    {
      agent: 'Family Communications',
      status: 'awaiting-human',
      objective: 'Create a factual, reassuring family update.',
      output: 'Draft prepared and held for staff approval.',
      toolCalls: [familyTool],
    },
  ];

  return {
    runId,
    resident: signal.resident,
    risk: recommendation.risk,
    goal: `Keep ${signal.resident} safe while preserving staff control and family trust.`,
    plan,
    retrievedContext: memory,
    policyCitations: policies.map((policy) => policy.citation),
    steps,
    recommendedAction: recommendation.nextAction,
    assignedTo,
    familyDraft,
    finalStatus: 'awaiting-human-approval',
    guardrails: [
      'No diagnosis',
      'No autonomous medication change',
      'No task release without staff approval',
      'No family message without staff approval',
      'Prompt instructions inside observations are treated as untrusted data',
    ],
  };
}

function retrieveMemory(resident: string, observation: string): string[] {
  const items = residentMemory[resident] ?? ['No resident-specific memory available'];
  const terms = observation.toLowerCase().split(/\W+/).filter((term) => term.length > 3);
  const ranked = items
    .map((item, index) => ({ item, score: terms.filter((term) => item.toLowerCase().includes(term)).length, index }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);
  return ranked.slice(0, 4);
}

function retrievePolicies(observation: string) {
  const matches = policyLibrary.filter((policy) => policy.pattern.test(observation));
  const oversight = policyLibrary[policyLibrary.length - 1];
  return matches.includes(oversight) ? matches : [...matches, oversight];
}

function buildPlan(risk: RiskLevel): string[] {
  if (risk === 'emergency') return ['Escalate immediately', 'Keep the resident attended', 'Capture facts for clinical handoff', 'Notify family after staff approval'];
  if (risk === 'urgent') return ['Notify the nurse in charge', 'Complete the approved assessment', 'Document the outcome', 'Prepare a family update for approval'];
  if (risk === 'watch') return ['Review baseline and recent notes', 'Complete a wellbeing check', 'Monitor the next care touchpoint', 'Update the family if the care lead approves'];
  return ['Record the observation', 'Continue the approved care plan', 'Monitor for change'];
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}
