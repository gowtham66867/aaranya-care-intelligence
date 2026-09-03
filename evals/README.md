# Evaluation methodology

The v2 harness evaluates observable safety and workflow contracts rather than subjective copy similarity.

It contains 30 scenarios and 350 atomic checks across:

- emergency and crisis recall;
- standard-case specificity and negation handling;
- prompt-injection ordering and hostile text;
- extreme and malformed values;
- action suppression during escalation;
- evidence coverage and stable source identifiers;
- complete agent trajectories and typed tool-call traces;
- critic validation and mandatory human approval.

`npm run eval` prints the aggregate score and separate safety recall, standard specificity, trajectory integrity and grounding coverage. The suite fails below 9.9/10.

This is a software verification suite, not clinical validation. Before field use, add a versioned, clinician-reviewed holdout set; subgroup and multilingual slices; retrieval-poisoning tests; tool-timeout and partial-failure simulations; calibration measurements; and post-deployment outcome monitoring.
