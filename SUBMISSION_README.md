# Aaranya Care Intelligence — Submission Guide

**One-line pitch:** Aaranya is a supervised multi-agent operating system that turns one senior-care observation into an evidence-grounded decision, a seven-dimension WholeLife plan and a family-ready update—without removing human authority.

## The 90-second judge flow

1. Start with the morning-shift queue and select a resident.
2. Choose a care signal such as low food intake, missed medication or a fall.
3. Inspect Anita's seven-dimension WholeLife Pulse, evidence cards and six supervised agent stages.
4. Inspect the five care agents, their retrieved context, policy checks and tool status.
5. Approve the proposed assignment and generate the factual family update; both remain human-governed.
6. Try `Anita reports sudden chest pain and sweating` to see safety-first escalation override normal planning.

## Whose problem this solves

- The caregiver records an observation once instead of repeating it across notes and calls.
- The nurse or care lead sees the priority, relevant context and responsible owner.
- The facility operator gets one auditable view of open decisions and follow-through.
- The family receives a clear, factual update without repeatedly chasing staff.

These are customer hypotheses for discovery, not validated traction claims.

## What is genuinely implemented

- A deterministic, typed care-orchestration workflow with safety-first routing.
- Five bounded agents covering memory, coordination, clinical safety, operations and family communication.
- Versioned policy/context retrieval linked to each recommendation.
- Typed tool-call traces, deterministic run identifiers and explicit action states.
- A hard escalation path for acute physical danger signals.
- A human approval gate before assignments or family messages are released.
- A seven-dimension WholeLife Pulse covering sleep, energy, stress, movement, nourishment, connection and purpose.
- Evidence-grounded wellness micro-actions with a critic agent and explicit human acceptance gate.
- A 30-scenario evaluation harness spanning 350 behavioral checks.

## Proposed 90-day pilot scorecard

- Reduce observation-to-owner time by 30% versus the week-one baseline.
- Reach at least 95% required-field completion for escalated care notes.
- Produce an approved family update in under 30 minutes at the median.
- Reach at least 80% weekly adoption among invited pilot staff.

These figures are targets to validate with a design partner, not current results.

## Honest system boundary

Aaranya is a decision-support prototype, not a medical device. It does not diagnose, prescribe, change treatment or contact emergency services. The current resident records and policies are curated prototype data. Production deployment would require clinical governance, privacy controls, qualified validation, monitored model serving and jurisdiction-specific escalation pathways.

## Reproduce the evidence

```bash
npm test
npm run eval
npm run lint
npm run build
```

The submission threshold is 9.9/10. The evaluation command exits unsuccessfully if the aggregate contract score falls below that threshold.

## Production evolution

The typed runtime is intentionally model-agnostic. A production adapter can add LangGraph.js durable execution, BGE-M3 or Qwen3 embeddings, a reranker, OpenTelemetry/OpenInference traces, Phoenix experiments and Inspect AI/Promptfoo adversarial evaluation without changing the user-facing safety contract.
