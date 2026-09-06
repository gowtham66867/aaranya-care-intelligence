'use client';

import { useMemo, useState } from 'react';
import {
  Activity, Bell, Bot, Building2, Check, ChevronRight, ClipboardCheck, Clock3,
  HeartPulse, Home, MessageCircle, Send, ShieldCheck, Sparkles, Stethoscope,
  Target, Users, X,
} from 'lucide-react';
import { createFamilyUpdate, evaluateCareSignal } from '@/lib/care-agent';
import { orchestrateCareEvent } from '@/lib/agent-orchestrator';
import { runWellnessCouncil } from '@/lib/wellness-agent-runtime';

const residents = [
  { initials: 'AM', name: 'Anita Menon', room: 'Willow 204', age: 76, state: 'Needs attention', tone: 'amber', baseline: 'Independent mobility · vegetarian · daughter receives daily updates', wellness: { sleepHours: 5.8, energy: 4, stress: 8, movementMinutes: 12, hydrationGlasses: 4, connection: 6, purpose: 7, note: 'Low intake at lunch and slower mobility than her 7-day baseline.' } },
  { initials: 'RS', name: 'Raghav Shah', room: 'Cedar 118', age: 82, state: 'Stable', tone: 'green', baseline: 'Walking support · low-sodium diet · weekly family update', wellness: { sleepHours: 7.2, energy: 7, stress: 4, movementMinutes: 25, hydrationGlasses: 7, connection: 8, purpose: 7, note: 'Feeling steady and looking forward to the afternoon garden group.' } },
  { initials: 'LK', name: 'Leela Kapoor', room: 'Jasmine 302', age: 79, state: 'Stable', tone: 'green', baseline: 'Independent mobility · music therapy · social at lunch', wellness: { sleepHours: 6.8, energy: 6, stress: 5, movementMinutes: 20, hydrationGlasses: 6, connection: 9, purpose: 8, note: 'Music and lunch group are going well; mild morning tiredness.' } },
];

const quickSignals = [
  { label: 'Low food intake', observation: 'Low intake at lunch and slower mobility than her 7-day baseline' },
  { label: 'Missed medication', observation: 'Missed medication during the morning round' },
  { label: 'Resident fell', observation: 'Caregiver reports an unwitnessed fall beside the bed' },
  { label: 'Chest pain', observation: 'Resident reports sudden chest pain and sweating' },
];

const customerJobs = [
  { role: 'Caregiver', job: 'Record an observation once', payoff: 'No duplicate calls or scattered notes', icon: <ClipboardCheck size={18} /> },
  { role: 'Nurse or care lead', job: 'See what needs attention first', payoff: 'Policy context and a clear owner', icon: <Stethoscope size={18} /> },
  { role: 'Facility operator', job: 'Know whether follow-up happened', payoff: 'One audit trail across every site', icon: <Building2 size={18} /> },
  { role: 'Family', job: 'Receive a factual update', payoff: 'Reassurance without chasing staff', icon: <MessageCircle size={18} /> },
];

const pilotMetrics = [
  { value: '−30%', label: 'Observation-to-owner time', note: 'Target versus week-one baseline' },
  { value: '≥95%', label: 'Required fields complete', note: 'Target for escalated care notes' },
  { value: '<30m', label: 'Approved family update', note: 'Median turnaround target' },
  { value: '≥80%', label: 'Weekly staff adoption', note: 'Target among pilot users' },
];

export default function HomePage() {
  const [selectedName, setSelectedName] = useState('Anita Menon');
  const [observation, setObservation] = useState(quickSignals[0].observation);
  const [approved, setApproved] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [familyUpdate, setFamilyUpdate] = useState('');
  const [agentQuestion, setAgentQuestion] = useState('');
  const [agentAnswer, setAgentAnswer] = useState('');
  const selected = residents.find((resident) => resident.name === selectedName) ?? residents[0];
  const recommendation = useMemo(() => evaluateCareSignal({ resident: selected.name, observation, source: 'caregiver' }), [selected.name, observation]);
  const agentRun = useMemo(() => orchestrateCareEvent({ resident: selected.name, observation, source: 'caregiver' }), [selected.name, observation]);
  const wellnessRun = useMemo(() => runWellnessCouncil(selected.wellness), [selected.wellness]);

  const runSignal = (nextObservation: string) => {
    setObservation(nextObservation);
    setApproved(false);
    setDismissed(false);
    setFamilyUpdate('');
  };

  const askAgent = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const question = agentQuestion.trim();
    if (!question) return;
    const output = orchestrateCareEvent({ resident: selected.name, observation: question, source: 'caregiver' });
    runSignal(question);
    setAgentAnswer(`${output.runId}: ${output.recommendedAction} Routed to ${output.assignedTo}. Release remains held for staff approval.`);
    setAgentQuestion('');
  };

  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#18332d]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-[#d9ded5] bg-[#173f36] px-5 py-7 text-white lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-2"><div className="grid size-10 place-items-center rounded-2xl bg-[#e1a83b] text-[#173f36]"><HeartPulse size={22} /></div><div><p className="text-xl font-semibold tracking-tight">Aaranya</p><p className="text-xs text-emerald-100/70">Care Intelligence</p></div></div>
          <nav className="mt-10 space-y-2" aria-label="Primary navigation"><a className="nav-item nav-active" href="#command"><Home size={18} /> Shift command</a><a className="nav-item" href="#residents"><Users size={18} /> Residents</a><a className="nav-item" href="#wholelife"><Sparkles size={18} /> WholeLife pulse</a><a className="nav-item" href="#agent"><Bot size={18} /> Agent workflow</a><a className="nav-item" href="#customer"><Target size={18} /> Pilot scorecard</a></nav>
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4"><div className="mb-2 flex items-center gap-2 text-sm font-medium"><ShieldCheck size={17} className="text-[#f1bf5d]" /> Staff keeps authority</div><p className="text-xs leading-5 text-emerald-50/65">Every task and family message stays held until a staff member approves it.</p></div>
        </aside>

        <section id="command" className="min-w-0 flex-1 px-4 py-5 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4"><div><p className="eyebrow">Morning shift · Aaranya Bengaluru</p><h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Three residents need a decision</h1><p className="mt-2 text-sm text-[#687770]">Meera, nurse in charge · 42 residents · handover at 14:00</p></div><button className="relative grid size-11 shrink-0 place-items-center rounded-full border border-[#cfd7cf] bg-white shadow-sm" aria-label="Notifications"><Bell size={19} /><span className="absolute right-2 top-2 size-2 rounded-full bg-[#d5863d]" /></button></header>

          <div className="mt-7 grid gap-5 2xl:grid-cols-[1.35fr_.65fr]">
            <article className="overflow-hidden rounded-[28px] bg-[#173f36] p-5 text-white shadow-[0_18px_50px_rgba(23,63,54,.14)] sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="flex items-center gap-2 text-sm text-emerald-50/70"><Sparkles size={16} className="text-[#f1bf5d]" /> Decision ready for staff review</p><h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">{recommendation.headline}</h2></div><span className={`risk risk-${recommendation.risk}`}>{recommendation.risk}</span></div>
              {!dismissed ? <div className="mt-7 rounded-2xl bg-white/9 p-5 ring-1 ring-white/10"><div className="flex items-start gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f3c76e] font-bold text-[#173f36]">{selected.initials}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{selected.name} · {selected.room}</p><span className="text-xs text-[#ffd98a]">Confidence {Math.round(recommendation.confidence * 100)}%</span></div><p className="mt-2 text-sm leading-6 text-emerald-50/75">{recommendation.rationale} {recommendation.nextAction}</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => setApproved(true)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#173f36]"><Check size={16} /> {approved ? 'Assigned and logged' : 'Approve and assign'}</button><button onClick={() => setDismissed(true)} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20"><X size={16} /> Dismiss with reason</button></div></div></div></div> : <button onClick={() => setDismissed(false)} className="mt-7 text-sm font-semibold text-[#ffd98a]">Restore dismissed recommendation</button>}
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-emerald-50/55"><span>One observation entered</span><span>{agentRun.policyCitations.length} policies checked</span><span>{agentRun.retrievedContext.length} resident facts retrieved</span><span>Outbound actions held</span></div>
            </article>
            <aside className="rounded-[28px] border border-[#d8ded7] bg-[#fffdf8] p-5 sm:p-6"><div className="flex items-center justify-between"><p className="eyebrow">Shift overview</p><span className="flex items-center gap-1.5 text-xs font-semibold text-[#3d795e]"><span className="size-2 rounded-full bg-[#55a16f]" /> Prototype live</span></div><div className="mt-5 grid grid-cols-2 gap-3"><Metric icon={<Users size={18} />} value="42" label="Residents" /><Metric icon={<Activity size={18} />} value="39" label="Stable today" /><Metric icon={<HeartPulse size={18} />} value="3" label="Need review" /><Metric icon={<MessageCircle size={18} />} value="8" label="Updates held" /></div><p className="mt-4 rounded-xl bg-[#f5e8bc] p-3 text-xs leading-5 text-[#705313]"><strong>Buyer value:</strong> the operator can see every open decision, owner and approval without calling each team.</p></aside>
          </div>

          <section id="wholelife" className="mt-6 overflow-hidden rounded-[28px] border border-[#d8ded7] bg-[#fffdf8]">
            <div className="grid lg:grid-cols-[.82fr_1.18fr]">
              <div className="wholelife-hero p-5 text-white sm:p-7">
                <div className="flex items-center justify-between gap-4"><p className="text-xs font-black uppercase tracking-[.14em] text-[#f1bf5d]">WholeLife Pulse</p><span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-emerald-50">7 dimensions · today</span></div>
                <div className="mt-6 flex items-center gap-5"><div className="wellness-score" style={{ '--score': `${wellnessRun.plan.score * 3.6}deg` } as React.CSSProperties}><div><strong>{wellnessRun.plan.score}</strong><span>/100</span></div></div><div><p className="text-sm text-emerald-50/65">Resident state</p><h2 className="text-3xl font-semibold tracking-tight">{wellnessRun.plan.state}</h2><p className="mt-2 max-w-sm text-sm leading-6 text-emerald-50/70">{wellnessRun.plan.headline}</p></div></div>
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">{wellnessRun.plan.actions.map((action) => <article key={action.id} className="rounded-2xl bg-white/8 p-3 ring-1 ring-white/10"><p className="text-[10px] font-black uppercase tracking-wide text-[#f1bf5d]">{action.duration}</p><p className="mt-1 text-sm font-semibold">{action.title}</p></article>)}</div>
                <p className="mt-5 text-xs leading-5 text-emerald-50/55">Draft actions are decision support only. Staff adapts or rejects every plan before it reaches the resident.</p>
              </div>
              <div className="p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">Whole-person evidence</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">See the pattern behind the alert</h2></div><span className="rounded-full bg-[#e8efe6] px-3 py-1.5 font-mono text-[10px] font-bold text-[#42685c]">{wellnessRun.runId}</span></div>
                <div className="mt-5 space-y-3">{wellnessRun.plan.dimensions.map((dimension) => <div key={dimension.id} className="grid grid-cols-[92px_minmax(0,1fr)_34px] items-center gap-3"><span className="text-xs font-bold text-[#536760]">{dimension.label}</span><div className="h-2 overflow-hidden rounded-full bg-[#e5e8e1]"><div className={`h-full rounded-full wellness-bar wellness-${dimension.status}`} style={{ width: `${dimension.score}%` }} /></div><span className="text-right text-xs font-black">{dimension.score}</span></div>)}</div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3"><ProofChip value={`${wellnessRun.evidence.length}`} label="Evidence cards" /><ProofChip value={`${wellnessRun.stages.length}`} label="Agent stages" /><ProofChip value="Held" label="Human release" /></div>
                <div className="mt-5 flex flex-wrap gap-2">{wellnessRun.stages.map((stage) => <span key={stage.id} className={`runtime-stage ${stage.status === 'awaiting-human' ? 'runtime-held' : ''}`} title={stage.finding}>{stage.agent}<Check size={12} /></span>)}</div>
              </div>
            </div>
          </section>

          <div className="mt-6 grid gap-5 xl:grid-cols-[.78fr_1.22fr]">
            <section id="residents" className="rounded-[28px] border border-[#d8ded7] bg-[#fffdf8] p-5 sm:p-7"><div className="flex items-end justify-between"><div><p className="eyebrow">Resident context</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Choose a resident</h2></div><span className="text-xs font-semibold text-[#6f7d77]">Prototype records</span></div><div className="mt-5 divide-y divide-[#e3e5de]">{residents.map((resident) => <button key={resident.name} onClick={() => { setSelectedName(resident.name); setApproved(false); setDismissed(false); setFamilyUpdate(''); }} className={`flex w-full items-center gap-4 py-4 text-left ${selected.name === resident.name ? 'resident-selected' : ''}`}><div className="grid size-10 place-items-center rounded-full bg-[#e8ece3] text-sm font-bold">{resident.initials}</div><div className="min-w-0 flex-1"><p className="font-semibold">{resident.name}</p><p className="text-sm text-[#64746e]">{resident.room}</p></div><span className={`status status-${resident.tone}`}>{resident.state}</span><ChevronRight size={18} className="text-[#87938e]" /></button>)}</div><div className="mt-4 rounded-2xl bg-[#f0eee6] p-4"><p className="text-xs font-bold text-[#6b7772]">KNOWN BASELINE</p><p className="mt-2 font-semibold">{selected.name}, {selected.age}</p><p className="mt-1 text-sm leading-6 text-[#66756f]">{selected.baseline}</p></div></section>

            <section id="agent" className="rounded-[28px] border border-[#d8ded7] bg-[#fffdf8] p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">Inspectable workflow</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Follow the decision, not a chatbot</h2><p className="mt-1 text-sm text-[#6c7974]">Each agent has one bounded job. Staff approves every external action.</p></div><span className="rounded-full bg-[#e2ece3] px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#35624f]">{agentRun.runId}</span></div>
              <div className="mt-5 flex flex-wrap gap-2">{quickSignals.map((signal) => <button key={signal.label} onClick={() => runSignal(signal.observation)} className="signal-chip">{signal.label}</button>)}</div>
              <div className="mt-5 overflow-hidden rounded-2xl border border-[#d7ded7] bg-[#f7f5ee]"><div className="divide-y divide-[#dfe3dd]">{agentRun.steps.map((step, index) => <div key={step.agent} className="grid grid-cols-[30px_minmax(0,1fr)_auto] items-start gap-3 px-4 py-3"><span className={`agent-index ${step.status === 'awaiting-human' ? 'agent-waiting' : ''}`}>{index + 1}</span><div><p className="text-sm font-bold">{step.agent}</p><p className="mt-0.5 text-xs leading-5 text-[#67766f]">{step.output}</p>{step.toolCalls.map((call) => <p key={call.tool} className="mt-1 font-mono text-[10px] text-[#477568]">{call.tool} · {call.status}</p>)}</div><span className={`agent-status ${step.status === 'awaiting-human' ? 'agent-status-waiting' : ''}`}>{step.status === 'awaiting-human' ? 'approval' : 'done'}</span></div>)}</div></div>
              <form onSubmit={askAgent} className="mt-4 flex gap-2"><label className="sr-only" htmlFor="agent-question">Run a care event through the agent workflow</label><input id="agent-question" value={agentQuestion} onChange={(event) => setAgentQuestion(event.target.value)} placeholder="Try: Anita reports chest pain" className="min-w-0 flex-1 rounded-xl border border-[#cfd8d0] bg-white px-4 py-3 text-sm outline-none ring-[#347565] focus:ring-2" /><button className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#173f36] text-white" aria-label="Run agent workflow"><Send size={17} /></button></form>{agentAnswer && <p className="mt-3 rounded-xl bg-[#e9f0e8] p-4 text-sm leading-6 text-[#315148]" aria-live="polite">{agentAnswer}</p>}
            </section>
          </div>

          <section className="mt-6 grid gap-5 rounded-[28px] bg-[#dfe8dc] p-5 sm:p-7 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">Family trust</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">A useful update without another phone chase</h2><p className="mt-3 max-w-md text-sm leading-6 text-[#597068]">Aaranya drafts only from verified care events. Staff can edit and approve the message before anything leaves the facility.</p><button onClick={() => setFamilyUpdate(createFamilyUpdate(selected.name, ['Joined the morning activity.', 'Lunch and hydration were recorded.', 'The care team completed a wellbeing check.']))} className="mt-5 rounded-xl bg-[#173f36] px-4 py-3 text-sm font-semibold text-white">Draft update for {selected.name.split(' ')[0]}’s family</button></div><div className="rounded-2xl bg-[#fffdf8] p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-full bg-[#ead8ae] text-xs font-bold">FM</div><div><p className="text-sm font-semibold">Family message preview</p><p className="text-xs text-[#75817c]">Not sent · staff approval required</p></div></div>{familyUpdate && <button onClick={() => setFamilyUpdate('')} className="text-xs font-bold text-[#32705f]">Clear</button>}</div><p className="mt-5 min-h-20 text-sm leading-6 text-[#50645d]">{familyUpdate || 'Generate a factual update from today’s approved care notes.'}</p></div></section>

          <section id="customer" className="mt-6 rounded-[28px] border border-[#d8ded7] bg-[#fffdf8] p-5 sm:p-7"><div className="grid gap-8 xl:grid-cols-[1.05fr_.95fr]"><div><p className="eyebrow">Customer jobs</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.035em]">Four people must trust the same workflow</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{customerJobs.map((item) => <article key={item.role} className="customer-job"><div className="customer-icon">{item.icon}</div><div><p className="text-xs font-black uppercase tracking-wide text-[#74817c]">{item.role}</p><p className="mt-1 font-semibold">{item.job}</p><p className="mt-1 text-sm leading-5 text-[#66766f]">{item.payoff}</p></div></article>)}</div></div><div className="rounded-2xl bg-[#173f36] p-5 text-white sm:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.12em] text-[#f1bf5d]">90-day pilot scorecard</p><h3 className="mt-2 text-xl font-semibold">Targets to validate, not traction claims</h3></div><Target className="text-[#f1bf5d]" /></div><div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-6">{pilotMetrics.map((metric) => <div key={metric.label}><p className="text-2xl font-bold text-[#f3c76e]">{metric.value}</p><p className="mt-1 text-sm font-semibold">{metric.label}</p><p className="mt-1 text-[11px] leading-4 text-emerald-50/55">{metric.note}</p></div>)}</div><div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5 text-xs leading-5 text-emerald-50/65"><Clock3 size={16} className="mt-0.5 shrink-0 text-[#f1bf5d]" /> Week one establishes each facility’s baseline. Weeks two to twelve measure improvement and staff adoption.</div></div></div></section>

          <footer className="flex flex-col gap-2 px-2 py-7 text-xs text-[#76827d] sm:flex-row sm:items-center sm:justify-between"><p>Prototype data only · No real resident information</p><p>37 automated tests · 350/350 software checks · Clinical validation pending</p></footer>
        </section>
      </div>
    </main>
  );
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div className="rounded-2xl bg-[#f1f0e8] p-4"><div className="text-[#327566]">{icon}</div><p className="mt-5 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-0.5 text-xs text-[#6f7d77]">{label}</p></div>;
}

function ProofChip({ value, label }: { value: string; label: string }) {
  return <div className="rounded-2xl bg-[#f0f2eb] p-3"><p className="text-lg font-black text-[#245d4e]">{value}</p><p className="text-[10px] font-bold uppercase tracking-wide text-[#718079]">{label}</p></div>;
}
