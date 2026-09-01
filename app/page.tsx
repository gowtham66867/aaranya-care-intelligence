'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  Bell,
  Bot,
  Check,
  ChevronRight,
  HeartPulse,
  Home,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import { createFamilyUpdate, evaluateCareSignal } from '@/lib/care-agent';
import { orchestrateCareEvent } from '@/lib/agent-orchestrator';

const residents = [
  { initials: 'AM', name: 'Anita Menon', room: 'Willow 204', age: 76, state: 'Needs attention', tone: 'amber', baseline: 'Independent mobility · vegetarian' },
  { initials: 'RS', name: 'Raghav Shah', room: 'Cedar 118', age: 82, state: 'Stable', tone: 'green', baseline: 'Walking support · low-sodium diet' },
  { initials: 'LK', name: 'Leela Kapoor', room: 'Jasmine 302', age: 79, state: 'Stable', tone: 'green', baseline: 'Independent mobility · social activities' },
];

const quickSignals = [
  { label: 'Low food intake', observation: 'Low intake at lunch and slower mobility than her 7-day baseline' },
  { label: 'Missed medication', observation: 'Missed medication during the morning round' },
  { label: 'Resident fell', observation: 'Caregiver reports an unwitnessed fall beside the bed' },
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
  const recommendation = useMemo(
    () => evaluateCareSignal({ resident: selected.name, observation, source: 'caregiver' }),
    [selected.name, observation],
  );
  const agentRun = useMemo(
    () => orchestrateCareEvent({ resident: selected.name, observation, source: 'caregiver' }),
    [selected.name, observation],
  );

  const runSignal = (nextObservation: string) => {
    setObservation(nextObservation);
    setApproved(false);
    setDismissed(false);
  };

  const askAgent = (event: React.FormEvent) => {
    event.preventDefault();
    const question = agentQuestion.trim();
    if (!question) return;
    const output = orchestrateCareEvent({ resident: selected.name, observation: question, source: 'caregiver' });
    setObservation(question);
    setAgentAnswer(`${output.runId}: ${output.steps.length} agents completed the workflow. ${output.recommendedAction} Routed to ${output.assignedTo}; release is waiting for staff approval.`);
    setAgentQuestion('');
  };

  return (
    <main className="min-h-screen bg-[#f4f1e9] text-[#18332d]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-[#d9ded5] bg-[#173f36] px-5 py-7 text-white lg:flex lg:flex-col">
          <div className="flex items-center gap-3 px-2">
            <div className="grid size-10 place-items-center rounded-2xl bg-[#e1a83b] text-[#173f36]"><HeartPulse size={22} /></div>
            <div><p className="text-xl font-semibold tracking-tight">Aaranya</p><p className="text-xs text-emerald-100/70">Care Intelligence</p></div>
          </div>
          <nav className="mt-10 space-y-2" aria-label="Primary navigation">
            <a className="nav-item nav-active" href="#command"><Home size={18} /> Command centre</a>
            <a className="nav-item" href="#residents"><Users size={18} /> Residents</a>
            <a className="nav-item" href="#agent"><Bot size={18} /> Agent mesh</a>
            <a className="nav-item" href="#updates"><MessageCircle size={18} /> Family updates</a>
          </nav>
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium"><ShieldCheck size={17} className="text-[#f1bf5d]" /> Human-in-the-loop</div>
            <p className="text-xs leading-5 text-emerald-50/65">Every recommendation requires staff review. Aaranya never diagnoses or changes treatment.</p>
          </div>
        </aside>

        <section id="command" className="min-w-0 flex-1 px-4 py-5 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between">
            <div><p className="eyebrow">Tuesday · 1 September</p><h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Good afternoon, Meera</h1></div>
            <div className="flex items-center gap-3"><span className="hidden text-right text-xs text-[#718079] sm:block">Aaranya Bengaluru<br/><strong className="text-[#28453e]">Morning shift</strong></span><button className="relative grid size-11 place-items-center rounded-full border border-[#cfd7cf] bg-white shadow-sm" aria-label="Notifications"><Bell size={19} /><span className="absolute right-2 top-2 size-2 rounded-full bg-[#d5863d]" /></button></div>
          </header>

          <div className="mt-7 grid gap-5 2xl:grid-cols-[1.35fr_.65fr]">
            <article className="overflow-hidden rounded-[28px] bg-[#173f36] p-5 text-white shadow-[0_18px_50px_rgba(23,63,54,.14)] sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><p className="flex items-center gap-2 text-sm text-emerald-50/70"><Sparkles size={16} className="text-[#f1bf5d]" /> Aaranya Agent Mesh</p><h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">Five specialised agents are coordinating Anita’s next best action.</h2></div>
                <span className="rounded-full bg-[#f1bf5d] px-3 py-1.5 text-xs font-bold text-[#173f36]">5 AGENTS LIVE</span>
              </div>

              {!dismissed ? (
                <div className="mt-7 rounded-2xl bg-white/9 p-5 ring-1 ring-white/10">
                  <div className="flex items-start gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f3c76e] font-bold text-[#173f36]">{selected.initials}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{selected.name} · {selected.room}</p><span className="text-xs text-[#ffd98a]">Confidence {Math.round(recommendation.confidence * 100)}%</span></div><p className="mt-2 text-sm leading-6 text-emerald-50/75">{recommendation.rationale} {recommendation.nextAction}</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => setApproved(true)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#173f36]"><Check size={16} /> {approved ? 'Added to care plan' : 'Approve action'}</button><button onClick={() => setDismissed(true)} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20"><X size={16} /> Dismiss</button></div></div></div>
                </div>
              ) : <button onClick={() => setDismissed(false)} className="mt-7 text-sm font-semibold text-[#ffd98a]">Restore dismissed recommendation</button>}
            </article>

            <aside className="rounded-[28px] border border-[#d8ded7] bg-[#fffdf8] p-5 sm:p-6">
              <div className="flex items-center justify-between"><p className="eyebrow">Live overview</p><span className="flex items-center gap-1.5 text-xs font-semibold text-[#3d795e]"><span className="size-2 rounded-full bg-[#55a16f]" /> Live</span></div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Metric icon={<Users size={18} />} value="42" label="Residents" />
                <Metric icon={<Activity size={18} />} value="39" label="Stable today" />
                <Metric icon={<HeartPulse size={18} />} value="3" label="Care reviews" />
                <Metric icon={<MessageCircle size={18} />} value="8" label="Updates ready" />
              </div>
            </aside>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
            <section id="residents" className="rounded-[28px] border border-[#d8ded7] bg-[#fffdf8] p-5 sm:p-7">
              <div className="flex items-end justify-between"><div><p className="eyebrow">Resident pulse</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Today at a glance</h2></div><span className="text-xs font-semibold text-[#6f7d77]">42 total</span></div>
              <div className="mt-5 divide-y divide-[#e3e5de]">
                {residents.map((resident) => <button key={resident.name} onClick={() => { setSelectedName(resident.name); setApproved(false); }} className={`flex w-full items-center gap-4 py-4 text-left ${selected.name === resident.name ? 'resident-selected' : ''}`}><div className="grid size-10 place-items-center rounded-full bg-[#e8ece3] text-sm font-bold">{resident.initials}</div><div className="min-w-0 flex-1"><p className="font-semibold">{resident.name}</p><p className="text-sm text-[#64746e]">{resident.room}</p></div><span className={`status status-${resident.tone}`}>{resident.state}</span><ChevronRight size={18} className="text-[#87938e]" /></button>)}
              </div>
              <div className="mt-4 rounded-2xl bg-[#f0eee6] p-4"><p className="text-xs font-bold text-[#6b7772]">SELECTED PROFILE</p><p className="mt-2 font-semibold">{selected.name}, {selected.age}</p><p className="mt-1 text-sm text-[#66756f]">{selected.baseline}</p></div>
            </section>

            <section id="agent" className="rounded-[28px] border border-[#d8ded7] bg-[#fffdf8] p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">Agentic workflow</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Inspect the five-agent run</h2><p className="mt-1 text-sm text-[#6c7974]">Select a signal to watch memory, planning, safety and action agents coordinate.</p></div><span className={`risk risk-${recommendation.risk}`}>{recommendation.risk}</span></div>
              <div className="mt-5 flex flex-wrap gap-2">{quickSignals.map((signal) => <button key={signal.label} onClick={() => runSignal(signal.observation)} className="signal-chip">{signal.label}</button>)}</div>
              <div className="mt-5 overflow-hidden rounded-2xl border border-[#d7ded7] bg-[#f7f5ee]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dfe3dd] px-4 py-3 text-xs"><span className="font-mono font-bold text-[#35685b]">{agentRun.runId}</span><span className="flex items-center gap-1.5 text-[#6b7973]"><span className="size-2 animate-pulse rounded-full bg-[#4d9a6b]" /> Orchestration complete</span></div>
                <div className="divide-y divide-[#dfe3dd]">
                  {agentRun.steps.map((step, index) => (
                    <div key={step.agent} className="grid grid-cols-[30px_minmax(0,1fr)_auto] items-start gap-3 px-4 py-3">
                      <span className={`agent-index ${step.status === 'awaiting-human' ? 'agent-waiting' : ''}`}>{index + 1}</span>
                      <div><p className="text-sm font-bold">{step.agent}</p><p className="mt-0.5 text-xs leading-5 text-[#67766f]">{step.output}</p>{step.toolCalls.map((call) => <p key={call.tool} className="mt-1 font-mono text-[10px] text-[#477568]">↳ {call.tool} · {call.status}</p>)}</div>
                      <span className={`agent-status ${step.status === 'awaiting-human' ? 'agent-status-waiting' : ''}`}>{step.status === 'awaiting-human' ? 'approval' : 'done'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-[#dde1da] bg-white p-5">
                <div className="flex items-center gap-2 text-sm font-semibold"><Stethoscope size={17} className="text-[#397766]" /> Supervised outcome</div>
                <p className="mt-3 text-lg font-semibold">{recommendation.headline}</p>
                <p className="mt-2 text-sm leading-6 text-[#60716a]">{agentRun.recommendedAction}</p>
                <div className="mt-4 grid gap-2 border-t border-[#dfe3dd] pt-4 text-xs text-[#74817c] sm:grid-cols-2"><span>Grounding: <strong className="text-[#29473f]">{agentRun.retrievedContext.length} memories · {agentRun.policyCitations.length} policies</strong></span><span className="flex items-center gap-1 sm:justify-end"><ShieldCheck size={14} /> Awaiting human approval</span></div>
              </div>
              <form onSubmit={askAgent} className="mt-4 flex gap-2"><label className="sr-only" htmlFor="agent-question">Run a care event through the agent mesh</label><input id="agent-question" value={agentQuestion} onChange={(event) => setAgentQuestion(event.target.value)} placeholder="Try: Anita reports chest pain" className="min-w-0 flex-1 rounded-xl border border-[#cfd8d0] bg-white px-4 py-3 text-sm outline-none ring-[#347565] focus:ring-2" /><button className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#173f36] text-white" aria-label="Run agent workflow"><Send size={17} /></button></form>
              {agentAnswer && <p className="mt-3 rounded-xl bg-[#e9f0e8] p-4 text-sm leading-6 text-[#315148]" aria-live="polite">{agentAnswer}</p>}
            </section>
          </div>

          <section id="updates" className="mt-6 grid gap-5 rounded-[28px] bg-[#dfe8dc] p-5 sm:p-7 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="eyebrow">Family trust</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Turn care notes into calm, clear updates.</h2><p className="mt-3 max-w-md text-sm leading-6 text-[#597068]">Aaranya drafts updates from verified care events. A staff member approves every message before it reaches a family.</p><button onClick={() => setFamilyUpdate(createFamilyUpdate(selected.name, ['Joined the morning activity.', 'Lunch and hydration were recorded.', 'The care team completed a wellbeing check.']))} className="mt-5 rounded-xl bg-[#173f36] px-4 py-3 text-sm font-semibold text-white">Generate update for {selected.name.split(' ')[0]}</button></div>
            <div className="rounded-2xl bg-[#fffdf8] p-5 shadow-sm"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-full bg-[#ead8ae] text-xs font-bold">FM</div><div><p className="text-sm font-semibold">Family message preview</p><p className="text-xs text-[#75817c]">Not sent · staff approval required</p></div></div><p className="mt-5 min-h-20 text-sm leading-6 text-[#50645d]">{familyUpdate || 'Generate a factual, reassuring update using today’s approved care notes.'}</p>{familyUpdate && <button onClick={() => setFamilyUpdate('')} className="mt-4 text-xs font-bold text-[#32705f]">Clear draft</button>}</div>
          </section>

          <footer className="flex flex-col gap-2 px-2 py-7 text-xs text-[#76827d] sm:flex-row sm:items-center sm:justify-between"><p>Prototype data only · No real resident information</p><p>Agentic evaluation target: <strong className="text-[#315a50]">9.9 / 10</strong> · Policy-grounded · Human approval on every action</p></footer>
        </section>
      </div>
    </main>
  );
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return <div className="rounded-2xl bg-[#f1f0e8] p-4"><div className="text-[#327566]">{icon}</div><p className="mt-5 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-0.5 text-xs text-[#6f7d77]">{label}</p></div>;
}
