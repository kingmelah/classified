# Classified — Roadmap

---

## Phase 1 — Attestation Primitive (current)

**Theme:** Prove that a witness-secret + commitment mechanism can vouch for a piece of data, closing part of ProveIt's Finding #5 gap — without needing genuine external institutional signatures, which Compact does not currently support safely.

**Status:**

| Item | Status |
|---|---|
| `attestBalance`, `verifyAttestation` circuits written | ✅ Done |
| Circuits compile clean (attestBalance k=13/rows=4616, verifyAttestation k=9/rows=377) | ✅ Done |
| Project scoped, README written with honest solved/open problem breakdown | ✅ Done |
| Pushed to private GitHub repo (`github.com/kingmelah/classified`) | ✅ Done |
| TypeScript/deploy layer built | ⬜ Not started |
| Live devnet test (commit → verify, same pattern as ProveIt) | ⬜ Not started |
| Wallet-based real balance reading (Milestone 2) | ⬜ Not started |

**Known limitation (see README's Open Problems list):** `attestBalance` currently takes `balance` as a plain, directly-passed argument — not real, indexed on-chain wallet state. This means Phase 1, on its own, does not fully solve self-reported data; it proves "someone who knows Classified's secret vouched for this value," not "this value reflects real wallet state." Milestone 2 (wallet-based reading) is required before that fuller claim is true.

**What "Phase 1 complete" actually means:** same standard as ProveIt — not just compiling, but a live devnet deploy, a real commit/attest transaction, and a real verification read confirming the mechanism works end-to-end.

---

## Phase 2 — Wallet-Based Real Balance Reading

**Theme:** Replace the plain `balance` argument with a genuine, wallet-verified number — starting with the simplest case (contract tokens) before attempting the harder case (NIGHT/UTXO aggregation).

**Status:** Not started. Depends on Phase 1's live devnet confirmation first.

### Step 1: Contract Token Balances
- **Why first:** confirmed simple address→balance mapping, no UTXO aggregation complexity
- **Approach:** read a deployed contract token's balance for a given address directly, feed that real number into `attestBalance` instead of a manually typed one

### Step 2: NIGHT / UTXO-Based Balances
- **Why harder:** no single stored balance — it's the sum of UTXOs a wallet controls (confirmed from Midnight's own docs)
- **Approach:** not yet designed. Likely requires wallet-side aggregation (same as any wallet already does to display a balance), then feeding that aggregated result into `attestBalance` in a way that's still verifiably tied to real state, not just trusted blindly

---

## Phase 3 — ProveIt Integration

**Theme:** Close the loop — have ProveIt actually consume a Classified attestation as a witness input, instead of a raw self-reported number, directly addressing Security Audit Finding #5 in practice, not just in design.

**Status:** Not started. No contract-to-contract calls are supported in Compact, so this is a TypeScript/application-layer integration (Classified produces a hash → application passes it into ProveIt's witness), not an on-chain call between the two contracts.

---

## Open Questions

- Confirm whether Compact will add genuine external signature verification primitives in a future version — would change Classified's fundamental approach if so
- Design the tamper-evidence guarantee for Milestone 2 — right now, "the wallet computed it, so it's trustworthy" is an assumption, not a proven mechanism
- Decide whether Classified stays a "wallet-adjacent tool" or becomes a genuine standalone wallet, once Phase 1/2 prove the core mechanism works (deferred decision from earlier scoping discussion)