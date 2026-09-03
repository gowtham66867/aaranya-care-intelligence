# Aaranya WholeLife Intelligence — Submission Guide

## The 90-second judge flow

1. Change the seven check-in signals or choose a lived-state preset.
2. Observe the Wellness Twin re-score and reprioritise the three weakest dimensions.
3. Expand the supervised run to inspect six ordered stages, typed tool calls, retrieved evidence and critic checks.
4. Confirm that suggested actions remain disabled until the human approval gate is accepted.
5. Enter `I have chest pain and cannot breathe` in the reflection field to see the safety guardian halt lifestyle advice and escalate to immediate human support.

## What is genuinely implemented

- A deterministic, typed state-machine workflow with safety-first routing.
- Seven-dimensional weighted wellness synthesis and constraint-aware action selection.
- Versioned evidence retrieval linked to every focus dimension.
- Six inspectable stages: safety, context, retrieval, synthesis, critic and human approval.
- Typed tool-call traces, deterministic run identifiers and release-quality checks.
- A hard action gate for acute physical and self-harm signals.
- An explicit human approval gate before actions can be marked complete.
- A 30-scenario evaluation harness spanning 350 behavioral checks.

## Honest system boundary

Aaranya is a decision-support prototype, not a medical device. It does not diagnose, prescribe, change treatment or contact emergency services. The current evidence cards are curated prototype records. Production deployment would require clinically governed source ingestion, privacy controls, qualified validation, monitored model serving and jurisdiction-specific escalation pathways.

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
