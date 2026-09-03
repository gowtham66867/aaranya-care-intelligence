export type WellnessDimensionId =
  | 'sleep'
  | 'energy'
  | 'stress'
  | 'movement'
  | 'nourishment'
  | 'connection'
  | 'purpose';

export type WellnessCheckIn = {
  sleepHours: number;
  energy: number;
  stress: number;
  movementMinutes: number;
  hydrationGlasses: number;
  connection: number;
  purpose: number;
  note?: string;
};

export type WellnessDimension = {
  id: WellnessDimensionId;
  label: string;
  score: number;
  status: 'strong' | 'steady' | 'support';
  context: string;
};

export type WellnessAction = {
  id: string;
  title: string;
  detail: string;
  duration: string;
  dimension: WellnessDimensionId;
  effort: 'light' | 'moderate';
};

export type WellnessAgent = {
  name: string;
  role: string;
  finding: string;
  status: 'analysed' | 'guarded';
};

export type WellnessPlan = {
  score: number;
  state: 'Restore' | 'Rebalance' | 'Build' | 'Thrive';
  headline: string;
  focus: WellnessDimensionId[];
  dimensions: WellnessDimension[];
  actions: WellnessAction[];
  agents: WellnessAgent[];
  safety: {
    level: 'standard' | 'urgent' | 'crisis';
    message: string;
    requiresProfessionalHelp: boolean;
  };
  explanation: string;
};

const urgentPattern = /chest (?:pain|pressure|tightness)|(?:pain|pressure|tightness) (?:in|across) (?:my |the )?chest|cannot breathe|can't breathe|shortness of breath|collapsed|unresponsive|severe bleeding/i;
const crisisPattern = /suicid|self[- ]?harm|end my life|kill myself|hurt myself|better off dead|don't want to live|do not want to live/i;

export function analyseWellness(checkIn: WellnessCheckIn): WellnessPlan {
  const clean = sanitize(checkIn);
  const dimensions: WellnessDimension[] = [
    dimension('sleep', 'Sleep', sleepScore(clean.sleepHours), sleepContext(clean.sleepHours)),
    dimension('energy', 'Energy', clean.energy * 10, energyContext(clean.energy)),
    dimension('stress', 'Stress balance', (11 - clean.stress) * 10, stressContext(clean.stress)),
    dimension('movement', 'Movement', clamp((clean.movementMinutes / 35) * 100), movementContext(clean.movementMinutes)),
    dimension('nourishment', 'Nourishment', clamp((clean.hydrationGlasses / 8) * 100), nourishmentContext(clean.hydrationGlasses)),
    dimension('connection', 'Connection', clean.connection * 10, connectionContext(clean.connection)),
    dimension('purpose', 'Purpose', clean.purpose * 10, purposeContext(clean.purpose)),
  ];

  const score = Math.round(
    dimensions.reduce((total, item) => total + item.score * dimensionWeight(item.id), 0),
  );
  const focus = [...dimensions]
    .sort((a, b) => a.score - b.score || a.id.localeCompare(b.id))
    .slice(0, 3)
    .map((item) => item.id);
  const state = score < 45 ? 'Restore' : score < 65 ? 'Rebalance' : score < 82 ? 'Build' : 'Thrive';
  const safety = assessSafety(clean.note ?? '');

  return {
    score,
    state,
    headline: headlineFor(state, dimensions),
    focus,
    dimensions,
    actions: safety.level === 'standard' ? focus.map((id, index) => actionFor(id, index)) : [],
    agents: buildAgents(dimensions, focus, safety.level),
    safety,
    explanation: `Your Wellness Twin weighted ${dimensions.length} dimensions, prioritising recovery signals without treating any single metric as the whole story.`,
  };
}

export function assessSafety(note: string): WellnessPlan['safety'] {
  const safetyText = Array.from(note.normalize('NFKC'), (character) => {
    const code = character.charCodeAt(0);
    return code < 32 || code === 127 ? ' ' : character;
  }).join('').slice(0, 500);
  if (containsAffirmedSignal(safetyText, crisisPattern)) {
    return {
      level: 'crisis',
      requiresProfessionalHelp: true,
      message: 'You deserve immediate human support. Contact local emergency services or a crisis helpline now, and reach out to someone you trust.',
    };
  }
  if (containsAffirmedSignal(safetyText, urgentPattern)) {
    return {
      level: 'urgent',
      requiresProfessionalHelp: true,
      message: 'This may need urgent medical attention. Contact local emergency services now. Do not rely on a wellness plan for acute symptoms.',
    };
  }
  return {
    level: 'standard',
    requiresProfessionalHelp: false,
    message: 'Wellness guidance only—not diagnosis or treatment. Adapt recommendations with a qualified professional when needed.',
  };
}

function containsAffirmedSignal(text: string, pattern: RegExp): boolean {
  for (const sentence of text.split(/[.!?;\n]+/)) {
    pattern.lastIndex = 0;
    const match = pattern.exec(sentence);
    if (!match) continue;
    const prefix = sentence.slice(Math.max(0, match.index - 32), match.index).toLowerCase();
    if (!/(?:\bno\b|\bnot\b|\bnever\b|\bdeny\b|\bdenies\b|\bwithout\b)\s+(?:feeling\s+|having\s+|any\s+)?$/.test(prefix)) return true;
  }
  return false;
}

function sanitize(checkIn: WellnessCheckIn): WellnessCheckIn {
  return {
    sleepHours: finiteBetween(checkIn.sleepHours, 0, 16, 7),
    energy: finiteBetween(checkIn.energy, 1, 10, 5),
    stress: finiteBetween(checkIn.stress, 1, 10, 5),
    movementMinutes: finiteBetween(checkIn.movementMinutes, 0, 300, 0),
    hydrationGlasses: finiteBetween(checkIn.hydrationGlasses, 0, 20, 0),
    connection: finiteBetween(checkIn.connection, 1, 10, 5),
    purpose: finiteBetween(checkIn.purpose, 1, 10, 5),
    note: (checkIn.note ?? '').slice(0, 500),
  };
}

function dimension(id: WellnessDimensionId, label: string, value: number, context: string): WellnessDimension {
  const score = Math.round(clamp(value));
  return { id, label, score, status: score >= 75 ? 'strong' : score >= 55 ? 'steady' : 'support', context };
}

function dimensionWeight(id: WellnessDimensionId): number {
  return ({ sleep: .18, energy: .16, stress: .18, movement: .13, nourishment: .12, connection: .12, purpose: .11 })[id];
}

function sleepScore(hours: number): number {
  return clamp(100 - Math.abs(hours - 7.5) * 18);
}

function actionFor(id: WellnessDimensionId, index: number): WellnessAction {
  const actions: Record<WellnessDimensionId, Omit<WellnessAction, 'id' | 'dimension'>> = {
    sleep: { title: 'Protect your landing zone', detail: 'Dim lights and park tomorrow’s tasks 45 minutes before bed.', duration: '8 min setup', effort: 'light' },
    energy: { title: 'Take a daylight reset', detail: 'Step outside, look toward natural light, and walk without your phone.', duration: '12 min', effort: 'light' },
    stress: { title: 'Downshift your nervous system', detail: 'Try five slow breaths with a longer exhale, then name the next smallest step.', duration: '3 min', effort: 'light' },
    movement: { title: 'Create a movement snack', detail: 'Pair a brisk walk or mobility flow with a transition already in your day.', duration: '10 min', effort: 'moderate' },
    nourishment: { title: 'Front-load hydration', detail: 'Drink one glass now and place the next where you will see it.', duration: '2 min', effort: 'light' },
    connection: { title: 'Send the honest message', detail: 'Reach out to one person with a specific invitation or a genuine check-in.', duration: '5 min', effort: 'light' },
    purpose: { title: 'Choose one meaningful win', detail: 'Write the one action that would make today feel aligned, then start for five minutes.', duration: '5 min', effort: 'moderate' },
  };
  return { id: `${id}-${index + 1}`, dimension: id, ...actions[id] };
}

function buildAgents(dimensions: WellnessDimension[], focus: WellnessDimensionId[], safety: WellnessPlan['safety']['level']): WellnessAgent[] {
  const byId = Object.fromEntries(dimensions.map((item) => [item.id, item])) as Record<WellnessDimensionId, WellnessDimension>;
  if (safety !== 'standard') {
    return [{ name: 'Safety Guardian', role: 'Escalation', finding: 'Paused all lifestyle suggestions and routed to immediate human support.', status: 'guarded' }];
  }
  return [
    { name: 'Rhythm Agent', role: 'Sleep + energy', finding: `${byId.sleep.context} ${byId.energy.context}`, status: 'analysed' },
    { name: 'Vitality Agent', role: 'Movement + nourishment', finding: `${byId.movement.context} ${byId.nourishment.context}`, status: 'analysed' },
    { name: 'Mind Agent', role: 'Stress regulation', finding: byId.stress.context, status: 'analysed' },
    { name: 'Belonging Agent', role: 'Connection + purpose', finding: `${byId.connection.context} ${byId.purpose.context}`, status: 'analysed' },
    { name: 'Wisdom Agent', role: 'Whole-person synthesis', finding: `Protect ${focus[0]} first; sequence the remaining actions around real-life capacity.`, status: 'guarded' },
  ];
}

function headlineFor(state: WellnessPlan['state'], dimensions: WellnessDimension[]): string {
  const lowest = [...dimensions].sort((a, b) => a.score - b.score)[0];
  if (state === 'Restore') return `Your system is asking for recovery—start with ${lowest.label.toLowerCase()}.`;
  if (state === 'Rebalance') return `A small reset in ${lowest.label.toLowerCase()} can change the shape of your day.`;
  if (state === 'Build') return `You have capacity to build—protect the foundations while adding momentum.`;
  return `Your foundations are strong—use the surplus for connection and purpose.`;
}

function sleepContext(hours: number) { return hours < 6.5 ? 'Sleep is below your recovery range.' : hours > 9 ? 'Long sleep may still feel unrefreshing.' : 'Sleep sits inside your recovery range.'; }
function energyContext(value: number) { return value < 5 ? 'Energy is asking for a gentler pace.' : 'Energy can support purposeful action.'; }
function stressContext(value: number) { return value > 7 ? 'Stress load is the strongest friction signal today.' : 'Stress load looks workable with brief regulation.'; }
function movementContext(value: number) { return value < 20 ? 'Movement is below today’s restorative dose.' : 'Movement is contributing positively today.'; }
function nourishmentContext(value: number) { return value < 5 ? 'Hydration is an easy leverage point.' : 'Hydration is tracking steadily.'; }
function connectionContext(value: number) { return value < 5 ? 'Connection could use one intentional moment.' : 'Social connection is a protective factor today.'; }
function purposeContext(value: number) { return value < 5 ? 'Purpose feels diffuse; choose one meaningful win.' : 'Purpose is giving the day a useful anchor.'; }
function clamp(value: number) { return Math.max(0, Math.min(100, value)); }
function finiteBetween(value: number, min: number, max: number, fallback: number) { return Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback; }
