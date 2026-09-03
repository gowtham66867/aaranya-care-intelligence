'use client';

import { useMemo, useState } from 'react';
import {
  Activity, ArrowUpRight, Brain, Check, ChevronRight, CircleUserRound, Compass,
  Database, Droplets, FileCheck2, HeartHandshake, Leaf, MoonStar, RefreshCw, ShieldCheck, Sparkles,
  Sun, Waves, Zap,
} from 'lucide-react';
import { runWellnessCouncil } from '@/lib/wellness-agent-runtime';
import type { WellnessCheckIn, WellnessDimensionId } from '@/lib/wellness-engine';

const initialCheckIn: WellnessCheckIn = {
  sleepHours: 6.2, energy: 6, stress: 7, movementMinutes: 18,
  hydrationGlasses: 4, connection: 5, purpose: 7, note: '',
};

const presets: { label: string; detail: string; values: WellnessCheckIn }[] = [
  { label: 'Stretched thin', detail: 'High load · low recovery', values: { sleepHours: 5.1, energy: 3, stress: 9, movementMinutes: 8, hydrationGlasses: 3, connection: 4, purpose: 6, note: '' } },
  { label: 'Finding rhythm', detail: 'Steady · building capacity', values: { sleepHours: 7.2, energy: 7, stress: 4, movementMinutes: 28, hydrationGlasses: 7, connection: 7, purpose: 8, note: '' } },
  { label: 'In my element', detail: 'Rested · connected · clear', values: { sleepHours: 7.6, energy: 9, stress: 2, movementMinutes: 42, hydrationGlasses: 8, connection: 9, purpose: 9, note: '' } },
];

const dimensionIcons: Record<WellnessDimensionId, React.ReactNode> = {
  sleep: <MoonStar size={16} />, energy: <Zap size={16} />, stress: <Waves size={16} />,
  movement: <Activity size={16} />, nourishment: <Droplets size={16} />,
  connection: <HeartHandshake size={16} />, purpose: <Compass size={16} />,
};

export default function HomePage() {
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [completed, setCompleted] = useState<string[]>([]);
  const [showAgents, setShowAgents] = useState(true);
  const [approvedRun, setApprovedRun] = useState<string | null>(null);
  const run = useMemo(() => runWellnessCouncil(checkIn), [checkIn]);
  const plan = run.plan;

  const update = <K extends keyof WellnessCheckIn>(key: K, value: WellnessCheckIn[K]) => {
    setCheckIn((current) => ({ ...current, [key]: value }));
    setCompleted([]);
    setApprovedRun(null);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f3f1e9] text-[#163a32]">
      <div className="wellness-glow wellness-glow-one" /><div className="wellness-glow wellness-glow-two" />
      <header className="relative z-10 mx-auto flex max-w-[1500px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-[18px] bg-[#163a32] text-[#d8f56a] shadow-lg shadow-emerald-950/10"><Leaf size={22} /></div><div><p className="text-lg font-bold tracking-[-.03em]">Aaranya</p><p className="text-[10px] font-bold uppercase tracking-[.19em] text-[#75827c]">WholeLife Intelligence</p></div></div>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#52645e] md:flex" aria-label="Product navigation"><a href="#twin">Wellness Twin</a><a href="#plan">Daily plan</a><a href="#agents">Agent council</a></nav>
        <button className="flex items-center gap-2 rounded-full border border-[#d3d9d0] bg-white/70 px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur"><CircleUserRound size={19} /><span className="hidden sm:inline">Gowtham</span></button>
      </header>

      <section className="relative z-[1] mx-auto max-w-[1500px] px-5 pb-20 sm:px-8 lg:px-12">
        <div className="grid items-end gap-8 pb-10 pt-8 lg:grid-cols-[1.1fr_.9fr] lg:pt-14">
          <div>
            <div className="flex flex-wrap gap-2"><div className="inline-flex items-center gap-2 rounded-full border border-[#cad9c9] bg-white/60 px-3 py-1.5 text-xs font-bold uppercase tracking-[.12em] text-[#386558] backdrop-blur"><Sparkles size={14} className="text-[#9a6bee]" /> Supervised multi-agent wellness AI</div><div className="inline-flex items-center gap-2 rounded-full border border-[#d8c9ef] bg-[#f5efff]/75 px-3 py-1.5 text-xs font-bold uppercase tracking-[.12em] text-[#6f49bb]"><ShieldCheck size={14} /> Eval target ≥ 9.9</div></div>
            <h1 className="mt-6 max-w-4xl text-[clamp(3.4rem,7vw,7.8rem)] font-semibold leading-[.86] tracking-[-.075em] text-[#153b32]">Your body isn’t a dashboard.<br/><span className="font-light italic text-[#8c63d5]">It’s a living system.</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-[#526760] sm:text-lg">Aaranya connects the signals that shape how you feel—sleep, energy, stress, movement, nourishment, connection and purpose—then finds the smallest action with the greatest return.</p>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/55 p-5 shadow-[0_24px_70px_rgba(42,71,61,.08)] backdrop-blur-xl">
            <div className="flex items-center justify-between"><div><p className="wellness-eyebrow">Try a lived state</p><p className="mt-1 text-sm text-[#687a74]">See how the twin adapts in real time.</p></div><RefreshCw size={18} className="text-[#8b9a94]" /></div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">{presets.map((preset) => <button key={preset.label} onClick={() => { setCheckIn(preset.values); setCompleted([]); setApprovedRun(null); }} className="group rounded-2xl border border-[#dfe3dc] bg-white/70 p-4 text-left transition hover:-translate-y-0.5 hover:border-[#9f82d7] hover:shadow-lg"><p className="font-bold">{preset.label}</p><p className="mt-1 text-xs text-[#71817b]">{preset.detail}</p><ArrowUpRight size={15} className="mt-4 text-[#8c63d5] opacity-40 transition group-hover:opacity-100" /></button>)}</div>
          </div>
        </div>

        <div id="twin" className="grid gap-5 xl:grid-cols-[.78fr_1.22fr]">
          <section className="wellness-card p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><p className="wellness-eyebrow">60-second check-in</p><h2 className="mt-2 text-2xl font-bold tracking-[-.035em]">Meet yourself where you are.</h2></div><span className="rounded-full bg-[#e9f3df] px-3 py-1.5 text-xs font-bold text-[#426c4d]">Private by design</span></div>
            <div className="mt-7 space-y-5">
              <Range label="Sleep" value={checkIn.sleepHours} min={3} max={10} step={0.1} suffix="h" onChange={(value) => update('sleepHours', value)} />
              <Range label="Energy" value={checkIn.energy} min={1} max={10} suffix="/10" onChange={(value) => update('energy', value)} />
              <Range label="Stress load" value={checkIn.stress} min={1} max={10} suffix="/10" onChange={(value) => update('stress', value)} inverse />
              <Range label="Movement" value={checkIn.movementMinutes} min={0} max={60} suffix=" min" onChange={(value) => update('movementMinutes', value)} />
              <Range label="Hydration" value={checkIn.hydrationGlasses} min={0} max={12} suffix=" glasses" onChange={(value) => update('hydrationGlasses', value)} />
              <div className="grid grid-cols-2 gap-4"><Range label="Connection" value={checkIn.connection} min={1} max={10} suffix="/10" onChange={(value) => update('connection', value)} /><Range label="Purpose" value={checkIn.purpose} min={1} max={10} suffix="/10" onChange={(value) => update('purpose', value)} /></div>
            </div>
            <label className="mt-6 block"><span className="wellness-eyebrow">What is present today?</span><textarea value={checkIn.note} onChange={(event) => update('note', event.target.value)} placeholder="Optional reflection—e.g. restless night, important meeting, feeling disconnected…" className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-[#d8dfd6] bg-[#fbfaf6] p-4 text-sm leading-6 outline-none transition focus:border-[#8c63d5] focus:ring-4 focus:ring-[#8c63d5]/10" /></label>
          </section>

          <section className="overflow-hidden rounded-[32px] bg-[#143a32] text-white shadow-[0_30px_90px_rgba(20,58,50,.22)]">
            <div className="grid gap-5 p-5 sm:p-8 lg:grid-cols-[.8fr_1.2fr]">
              <div className="flex flex-col rounded-[26px] bg-white/[.07] p-5 ring-1 ring-white/10">
                <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-100/65">Live Wellness Twin</p><span className="flex items-center gap-1.5 text-xs text-[#d8f56a]"><span className="size-2 animate-pulse rounded-full bg-[#d8f56a]" /> Synthesised</span></div>
                <div className="mx-auto mt-8 grid size-48 place-items-center rounded-full p-3" style={{ background: `conic-gradient(#d8f56a ${plan.score * 3.6}deg, rgba(255,255,255,.1) 0deg)` }}><div className="grid size-full place-items-center rounded-full bg-[#143a32] text-center"><div><p className="text-6xl font-semibold tracking-[-.07em]">{plan.score}</p><p className="mt-1 text-xs font-bold uppercase tracking-[.14em] text-emerald-100/55">WholeLife score</p></div></div></div>
                <div className="mt-7"><span className="rounded-full bg-[#d8f56a] px-3 py-1.5 text-xs font-black uppercase tracking-[.11em] text-[#143a32]">{plan.state} mode</span><h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-.035em]">{plan.headline}</h2><p className="mt-3 text-sm leading-6 text-emerald-50/60">{plan.explanation}</p></div>
                <div className="mt-auto pt-6"><div className="flex items-center gap-2 text-xs text-emerald-50/60"><ShieldCheck size={15} className="text-[#d8f56a]" /> Wellness guidance, never diagnosis</div></div>
              </div>
              <div className="rounded-[26px] bg-[#f6f4ed] p-5 text-[#173b33] sm:p-6">
                <div className="flex items-center justify-between"><div><p className="wellness-eyebrow">Signal map</p><h3 className="mt-1 text-xl font-bold tracking-tight">Seven dimensions. One system.</h3></div><Brain size={22} className="text-[#8c63d5]" /></div>
                <div className="mt-6 space-y-3">{plan.dimensions.map((dimension) => <div key={dimension.id} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2"><div className="flex items-center gap-2 text-sm font-semibold"><span className={`dimension-icon dimension-${dimension.status}`}>{dimensionIcons[dimension.id]}</span>{dimension.label}</div><span className="text-sm font-black tabular-nums">{dimension.score}</span><div className="col-span-2 h-1.5 overflow-hidden rounded-full bg-[#e1e4dc]"><div className={`h-full rounded-full dimension-bar-${dimension.status}`} style={{ width: `${dimension.score}%` }} /></div></div>)}</div>
                <div className="mt-6 rounded-2xl border border-[#dedfd8] bg-white/70 p-4"><p className="text-xs font-bold uppercase tracking-[.12em] text-[#75827c]">Pattern, not judgement</p><p className="mt-2 text-sm leading-6 text-[#5f716a]">Low scores are invitations—not failures. Aaranya sequences support around capacity, context and safety.</p></div>
              </div>
            </div>
          </section>
        </div>

        {plan.safety.level !== 'standard' ? <section className="mt-5 rounded-[28px] border border-[#d9675d]/30 bg-[#fff0ed] p-6 text-[#7e302b]"><div className="flex items-start gap-4"><ShieldCheck className="mt-1 shrink-0" /><div><p className="text-xs font-black uppercase tracking-[.13em]">Human support comes first</p><h2 className="mt-2 text-2xl font-bold">Lifestyle suggestions paused.</h2><p className="mt-2 max-w-3xl leading-7">{plan.safety.message}</p></div></div></section> : (
          <section id="plan" className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
            <div className="wellness-card p-5 sm:p-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="wellness-eyebrow">Your next 24 hours</p><h2 className="mt-2 text-3xl font-bold tracking-[-.04em]">Tiny actions. Compounding change.</h2></div><span className="text-xs font-semibold text-[#77847f]">{completed.length}/{plan.actions.length} complete</span></div><div className="mt-6 space-y-3">{plan.actions.map((action, index) => { const done = completed.includes(action.id); return <button key={action.id} disabled={approvedRun !== run.runId} onClick={() => setCompleted((current) => done ? current.filter((id) => id !== action.id) : [...current, action.id])} className={`action-card ${done ? 'action-done' : ''} disabled:cursor-not-allowed disabled:opacity-60`}><span className="action-check">{done ? <Check size={16} /> : index + 1}</span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><strong>{action.title}</strong><span className="rounded-full bg-[#eef0e9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#718079]">{action.duration}</span></span><span className="mt-1 block text-sm leading-6 text-[#66766f]">{action.detail}</span></span><ChevronRight size={18} className="text-[#9aa49f]" /></button>; })}</div><div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#d8ded7] bg-[#f4f3ed] p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><FileCheck2 size={19} className="mt-0.5 shrink-0 text-[#7651bd]" /><div><p className="text-sm font-bold">Human approval gate</p><p className="mt-1 text-xs leading-5 text-[#687872]">{approvedRun === run.runId ? 'Plan accepted. You can now mark actions complete.' : 'Review the evidence and accept before activating this plan.'}</p></div></div><button onClick={() => setApprovedRun(run.runId)} disabled={approvedRun === run.runId} className="shrink-0 rounded-full bg-[#173b33] px-4 py-2 text-xs font-black text-[#d8f56a] disabled:opacity-60">{approvedRun === run.runId ? 'Plan accepted' : 'Accept plan'}</button></div></div>
            <aside className="overflow-hidden rounded-[30px] bg-[#d9c9fa] p-6 sm:p-8"><Sun size={28} className="text-[#6f49bb]" /><p className="mt-8 text-xs font-black uppercase tracking-[.13em] text-[#6f49bb]">Why this works</p><blockquote className="mt-3 text-3xl font-semibold leading-tight tracking-[-.04em] text-[#2d2340]">“The best plan is the one your nervous system can actually carry.”</blockquote><p className="mt-5 text-sm leading-6 text-[#594d6d]">Instead of maximising every metric, Aaranya finds the current constraint and recommends a dose small enough to complete today.</p><div className="mt-8 grid grid-cols-3 gap-2 text-center"><Proof value="7" label="signals" /><Proof value="6" label="stages" /><Proof value="100%" label="traceable" /></div></aside>
          </section>
        )}

        <section id="agents" className="mt-5 wellness-card p-5 sm:p-7">
          <button onClick={() => setShowAgents((value) => !value)} className="flex w-full items-center justify-between gap-4 text-left"><div><p className="wellness-eyebrow">Supervised agent run · {run.runId}</p><h2 className="mt-2 text-2xl font-bold tracking-[-.035em]">Six inspectable stages. One human decision.</h2></div><span className="rounded-full bg-[#edf1e8] px-3 py-2 text-xs font-bold text-[#4d675f]">{showAgents ? 'Hide trace' : 'Show trace'}</span></button>
          {showAgents && <><div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{run.stages.map((stage, index) => <article key={stage.id} className="rounded-2xl border border-[#dce1d9] bg-[#faf9f4] p-5"><div className="flex items-center justify-between"><span className="grid size-8 place-items-center rounded-full bg-[#173b33] text-xs font-black text-[#d8f56a]">0{index + 1}</span><span className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wide ${stage.status === 'awaiting-human' ? 'bg-[#f4dfca] text-[#9b5c2d]' : stage.status === 'guarded' ? 'bg-[#e8def8] text-[#704caf]' : 'bg-[#dfeedd] text-[#3d764d]'}`}>{stage.status}</span></div><p className="mt-5 font-bold">{stage.agent}</p><p className="mt-1 text-[10px] font-black uppercase tracking-[.12em] text-[#8a9691]">{stage.role}</p><p className="mt-3 text-sm leading-6 text-[#64746e]">{stage.finding}</p>{stage.toolCalls.length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">{stage.toolCalls.map((call) => <span key={call.tool} className="rounded-md bg-[#ecefe9] px-2 py-1 font-mono text-[9px] text-[#53645e]">{call.tool}</span>)}</div>}</article>)}</div><div className="mt-4 grid gap-4 rounded-2xl bg-[#173b33] p-5 text-white lg:grid-cols-[.75fr_1.25fr]"><div><div className="flex items-center gap-2 text-[#d8f56a]"><Database size={17} /><p className="text-xs font-black uppercase tracking-[.13em]">Evidence retrieved</p></div><p className="mt-3 text-sm leading-6 text-emerald-50/60">Every recommendation maps to a versioned evidence card. The safety policy is always retrieved and cannot be overridden by reflection text.</p><div className="mt-4 flex flex-wrap gap-2"><Quality passed={run.quality.grounded} label="Grounded" /><Quality passed={run.quality.safe} label="Safe" /><Quality passed={run.quality.actionable} label="Actionable" /><Quality passed={run.quality.criticPassed} label="Critic passed" /></div></div><div className="grid gap-2 sm:grid-cols-2">{run.evidence.map((item) => <article key={item.id} className="rounded-xl bg-white/[.08] p-3 ring-1 ring-white/10"><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold">{item.title}</p><span className="font-mono text-[9px] text-[#d8f56a]">{item.id}</span></div><p className="mt-1.5 text-[11px] leading-5 text-emerald-50/55">{item.guidance}</p><p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-emerald-50/35">{item.source}</p></article>)}</div></div></>}
        </section>
        <footer className="mt-5 flex flex-col gap-4 rounded-[28px] bg-[#173b33] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8"><div><p className="text-lg font-bold">Aaranya WholeLife Intelligence</p><p className="mt-1 text-sm text-emerald-50/55">Prototype data only · No diagnosis · No autonomous treatment</p></div><div className="flex items-center gap-2 text-sm font-semibold text-[#d8f56a]"><ShieldCheck size={18} /> Safety guardian active</div></footer>
      </section>
    </main>
  );
}

function Range({ label, value, min, max, step = 1, suffix, onChange, inverse = false }: { label: string; value: number; min: number; max: number; step?: number; suffix: string; onChange: (value: number) => void; inverse?: boolean }) {
  const percentage = ((value - min) / (max - min)) * 100;
  return <label className="block"><span className="flex items-center justify-between text-sm"><strong>{label}</strong><span className={`font-bold tabular-nums ${inverse && value >= 8 ? 'text-[#bf554b]' : 'text-[#6f49bb]'}`}>{Number.isInteger(value) ? value : value.toFixed(1)}{suffix}</span></span><input aria-label={label} className="wellness-range mt-2" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ background: `linear-gradient(90deg, ${inverse ? '#9a6bee' : '#4e8a70'} ${percentage}%, #e1e4dc ${percentage}%)` }} /></label>;
}

function Proof({ value, label }: { value: string; label: string }) { return <div className="rounded-2xl bg-white/40 p-3"><p className="text-xl font-black text-[#35274e]">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[#726587]">{label}</p></div>; }

function Quality({ passed, label }: { passed: boolean; label: string }) { return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${passed ? 'bg-[#d8f56a] text-[#173b33]' : 'bg-[#d9675d] text-white'}`}>{passed ? '✓' : '!'} {label}</span>; }
