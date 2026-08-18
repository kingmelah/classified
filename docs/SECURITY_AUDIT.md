# Classified — Mini Security Audit Report

**Protocol:** Classified — On-Chain Attestation Primitive
**Author:** Midas ([@iamkingmelah](https://x.com/iamkingmelah))
**Scope:** `contracts/classified.compact` (attestBalance, verifyAttestation)
**Status:** Early-stage proof-of-concept, not yet deployed to a live devnet

---

## Overview

This report documents findings identified during the design of Classified, an on-chain attestation primitive intended to close ProveIt's Security Audit Finding #5 (unverified self-asserted data). Classified is itself early-stage — this audit reflects a smaller, less mature surface than ProveIt's, and should be revisited as Phase 2 (wallet-based real balance reading) is built.

---

## 1. Self-Asserted Input, One Layer Removed

**Risk:** `attestBalance` takes `balance: Uint<64>` as a plain, directly-passed argument — the same self-reporting problem ProveIt has (Finding #5), just now one layer removed. Classified's hash proves "someone who knows Classified's secret vouched for this number," not "this number reflects a real, verified wallet balance."

**Why it matters:** if Classified is deployed and used as-is (Phase 1 only, before Phase 2's wallet integration), a relying dApp could mistake a Classified attestation for genuine third-party verification, when it is currently no more trustworthy than ProveIt's own raw self-reported witness — it has simply moved the unverified number one step earlier in the pipeline.

**Status:** Open, by design, for Phase 1. This is explicitly why Phase 2 (wallet-based real balance reading) exists in the roadmap — Phase 1 alone should not be presented to relying dApps as a solved trust problem.

---

## 2. Secret Key Management (Single Point of Trust)

**Risk:** `classifiedSecret()` is a single witness value. Whoever holds this secret can produce attestations for *any* address and *any* value — there is currently no mechanism limiting who can call `attestBalance`, nor any way to distinguish a legitimate attestation from one made carelessly or maliciously by whoever controls the secret.

**Why it matters:** this makes Classified's secret a high-value target — if it were ever exposed or misused, every attestation ever produced with it becomes suspect, and there's no revocation or key-rotation mechanism designed yet.

**Recommendation:** design a key management and rotation strategy before any production use — including how a compromised secret would be detected and how existing attestations would be handled if that happens. Not yet designed.

**Status:** Open. Not addressed in Phase 1.

---

## 3. No Live Devnet Validation Yet

**Risk:** unlike ProveIt, Classified's circuits have only been confirmed to *compile* — they have not been deployed or tested end-to-end on a live devnet. Compiling clean does not guarantee correct runtime behavior (ProveIt itself surfaced real runtime-only issues today that compilation alone did not catch).

**Why it matters:** any claims about Classified "working" should be treated as provisional until a real deploy → attest → verify cycle is run and confirmed, the same standard ProveIt was held to before declaring Phase 1 complete.

**Status:** Open. Tracked in the roadmap as the next concrete step before Phase 2 begins.

---

## Summary Table

| # | Finding | Layer | Status |
|---|---|---|---|
| 1 | Self-Asserted Input, One Layer Removed | Trust model / design | Open — by design for Phase 1; Phase 2 (wallet reading) is the intended fix |
| 2 | Secret Key Management | Infrastructure / trust boundary | Open — no key management or rotation strategy designed yet |
| 3 | No Live Devnet Validation Yet | Verification / process | Open — circuits compile, but are unconfirmed at runtime |

---

## Notes

This audit reflects Classified's earliest stage — a compiling but unvalidated attestation primitive. It should not yet be treated as a solved trust layer for ProveIt or any other consuming dApp. The most urgent next step is live devnet validation (Finding #3), followed by an honest reassessment of Finding #1 once Phase 2's wallet-based reading is designed and built.