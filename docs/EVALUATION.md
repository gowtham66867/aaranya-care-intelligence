# Evaluation methodology

The submission uses executable behavioural contracts rather than a subjective AI demo score.

## Coverage

| Suite | Scenarios | Checks | What it verifies |
|---|---:|---:|---|
| Care orchestration | 10 | 150 | risk routing, policy grounding, task ownership, family safety, determinism and human approval |
| WholeLife runtime | 20 | 200 | seven dimensions, focus/actions, evidence, critic, safety escalation, adversarial inputs and deterministic traces |
| **Total** | **30** | **350** | end-to-end software contract |

The target is **9.9/10**. `npm run eval` exits with an error if the aggregate score is below that threshold. Automated checks are software evidence only; they do not establish clinical effectiveness.

## Adversarial cases

- Acute physical danger and self-harm language.
- Negated danger statements to limit false escalation.
- Prompt-injection attempts that ask the system to bypass policy.
- Unicode control characters and oversized notes.
- Non-finite and extreme numeric inputs.
- Repeat runs to verify deterministic IDs and results.

## Reproduce

```bash
npm ci
npm test
npm run eval
npm run lint
npm run build
```

