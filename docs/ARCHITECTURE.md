# Architecture and agent design

Aaranya uses two connected, typed runtimes: one coordinates an observed care event; the other synthesises a resident's seven-dimension WholeLife Pulse. The UI exposes both traces so users can inspect how a recommendation was formed.

## Bounded agents

| Agent | Bounded responsibility | Example tool contract |
|---|---|---|
| Safety Guardian | Detect acute physical or self-harm signals and stop normal planning | `safety.classify` |
| Context Agent | Read only supplied resident/check-in context | `profile.read` |
| Evidence Agent | Retrieve applicable policy and evidence cards | `evidence.retrieve` |
| Planning Agent | Sequence low-burden, context-aware actions | typed plan output |
| Critic Agent | Check grounding, safety and actionability | `plan.validate` |
| Human Steward | Hold every external action for explicit approval | `approval.request` |

The care workflow also assigns specialised Memory, Clinical Safety, Operations and Family Communication roles. Each agent has a single job and returns structured output instead of free-form autonomy.

## Safety invariants

1. Acute-risk language takes priority over convenience or personalisation.
2. Urgent and crisis paths produce no lifestyle actions.
3. Normal negations such as “no chest pain” do not trigger an emergency.
4. Prompt-injection text cannot override policy or approval gates.
5. No agent can release a task or message; that authority belongs to a human.
6. Stable run IDs and evidence IDs make software behaviour reproducible and auditable.

## Production path

The deterministic prototype validates the product contract before adding model variability. A production implementation can introduce durable graph execution, model-backed planning, hybrid retrieval, reranking and OpenTelemetry/OpenInference traces behind the existing typed interfaces. Evaluation gates and human authority remain unchanged.

