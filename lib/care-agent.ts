export type RiskLevel = 'emergency' | 'urgent' | 'watch' | 'routine';

export type CareSignal = {
  resident: string;
  observation: string;
  source?: 'caregiver' | 'sensor' | 'family' | 'resident';
};

export type CareRecommendation = {
  risk: RiskLevel;
  headline: string;
  rationale: string;
  nextAction: string;
  escalationTarget: 'Emergency services' | 'Nurse in charge' | 'Care lead' | 'Care team';
  requiresHumanApproval: true;
  confidence: number;
  safetyNotice: string;
};

const emergencyPattern = /chest pain|not breathing|unresponsive|severe bleeding|stroke|collapsed/i;
const urgentPattern = /fall|missed medication|breathing difficulty|oxygen|fever|confusion|blood pressure/i;
const watchPattern = /low intake|not eating|dehydr|mobility|withdrawn|lonely|sleep|pain|dizzy/i;

export function evaluateCareSignal(signal: CareSignal): CareRecommendation {
  const observation = signal.observation.trim();
  const safeObservation = observation.replace(/ignore (all|previous) instructions?.*/gi, '').trim();

  if (emergencyPattern.test(safeObservation)) {
    return {
      risk: 'emergency',
      headline: `Immediate help may be needed for ${signal.resident}`,
      rationale: `The reported observation (“${clip(safeObservation)}”) matches a high-risk safety pattern.`,
      nextAction: 'Call local emergency services now, stay with the resident, and alert the nurse in charge.',
      escalationTarget: 'Emergency services',
      requiresHumanApproval: true,
      confidence: 0.99,
      safetyNotice: 'Aaranya supports triage; it does not diagnose or replace emergency care.',
    };
  }

  if (urgentPattern.test(safeObservation)) {
    return {
      risk: 'urgent',
      headline: `${signal.resident} needs a prompt clinical review`,
      rationale: `The observation (“${clip(safeObservation)}”) can indicate a meaningful change in safety or health.`,
      nextAction: 'Notify the nurse in charge, complete the approved assessment, and document the outcome.',
      escalationTarget: 'Nurse in charge',
      requiresHumanApproval: true,
      confidence: 0.95,
      safetyNotice: 'Do not change medication or treatment without an authorised clinician.',
    };
  }

  if (watchPattern.test(safeObservation)) {
    return {
      risk: 'watch',
      headline: `A wellbeing check is recommended for ${signal.resident}`,
      rationale: `The observation (“${clip(safeObservation)}”) differs from normal wellbeing or daily-living patterns.`,
      nextAction: 'Ask the care lead to review recent notes, check in with the resident, and monitor the next care touchpoint.',
      escalationTarget: 'Care lead',
      requiresHumanApproval: true,
      confidence: 0.92,
      safetyNotice: 'Escalate promptly if symptoms worsen or the resident appears unsafe.',
    };
  }

  return {
    risk: 'routine',
    headline: `${signal.resident} can continue with the routine care plan`,
    rationale: `No high-risk pattern was identified in “${clip(safeObservation || 'No new concern reported')}”.`,
    nextAction: 'Record the observation and continue the approved care plan.',
    escalationTarget: 'Care team',
    requiresHumanApproval: true,
    confidence: 0.9,
    safetyNotice: 'A staff member should review every generated recommendation before action.',
  };
}

export function createFamilyUpdate(resident: string, facts: string[]): string {
  const cleanFacts = facts.map((fact) => fact.trim()).filter(Boolean);
  const summary = cleanFacts.length ? cleanFacts.join(' ') : 'The care team completed the usual daily check-ins.';
  return `${resident}’s update: ${summary} This message was prepared by Aaranya and approved by the care team.`;
}

function clip(value: string): string {
  return value.length > 140 ? `${value.slice(0, 137)}…` : value;
}
