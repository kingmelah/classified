# Classified

**A wallet that hashes and commits your real, indexed on-chain assets — so other dApps (like ProveIt) can consume verified data instead of self-reported numbers.**

Working name. Concept originated from ProveIt's Security Audit Finding #5 (self-asserted witness data).

---

## Core Idea

ProveIt proves conditions about data ("this balance meets this threshold") but has no way to confirm the underlying data is real — a user can currently type in any number. Classified solves this for **on-chain assets specifically**: since a wallet already has real, synced, first-party access to a user's actual on-chain state, Classified computes and hashes that real state directly — rather than relying on a human to self-report a number.

## Relationship to ProveIt

Separate dApp, separate repo, separate contract. Not merged into ProveIt, to keep each project focused on one responsibility:
- **ProveIt** proves conditions about data
- **Classified** vouches that data is real

No contract-to-contract calls are currently supported in Compact — integration between the two happens at the TypeScript/application layer (Classified produces a hash → app passes it to ProveIt as a witness input), not on-chain directly.

---

## Solved vs. Open Problems (Honest Starting Point)

### Solved
- Hashing mechanism itself — proven and working in ProveIt today (`persistentHash`)
- Trust doesn't need a third-party institution for on-chain assets — the chain itself is the record
- Contract tokens (ERC-20-style) are simple address→balance mappings — directly queryable, no aggregation complexity
- Real token/NFT standards exist to build on — OpenZeppelin's Compact library (`FungibleToken`, `NonFungibleToken`, `Ownable`) is real and importable
- **Attestation/commitment mechanism** — `attestBalance` and `verifyAttestation` circuits written and compiling clean, using a witness-secret + `persistentHash` pattern confirmed idiomatic in real Compact code (see Status below)

### Open — Not Yet Solved
1. **UTXO aggregation** — NIGHT (and similar native tokens) have no single stored balance; balance is the sum of UTXOs a wallet controls. How to correctly and completely aggregate this into one honest, hashable number is unsolved.
2. **Tamper-evidence of the wallet-computed hash** — currently just an assumption ("the wallet computed it, so it's trustworthy"). No actual mechanism yet prevents a modified/malicious wallet from hashing a fabricated number.
3. **Classified ↔ ProveIt integration flow** — the actual TypeScript-layer handoff (Classified's hash → ProveIt's witness) is undesigned and untested.
4. **Witness safety** — OpenZeppelin's own Compact library explicitly states its example witnesses are reference test doubles, not production-ready. Classified needs its own audited witness implementation.
5. **Wallet-based real balance reading** — `attestBalance` currently takes `balance` as a plain, directly-passed argument. It does not yet read genuine, indexed on-chain wallet state. Until this is wired up, the attestation primitive adds a hash/commitment layer but does not fully solve self-reported data on its own.

---

## Technical Foundation

Build on OpenZeppelin's Compact contracts library (`OpenZeppelin/compact-contracts`) rather than writing token-tracking logic from scratch — respecting its explicitly experimental, "use at your own risk" status, and auditing/rewriting witnesses ourselves rather than trusting their reference examples for production use.

**Note on signature verification:** genuine external signature verification (e.g. verifying a bank's ECDSA signature inside a circuit) appears unsupported or non-trivial in Compact today — the confirmed, safe idiom for this class of problem is a witness-secret + `persistentHash` commitment scheme instead (the same pattern ProveIt already uses for its own balance commitment, and what Classified's `attestBalance` circuit is built on).

## Scope Boundary

Classified solves trust for **on-chain-native assets only** (NIGHT, contract tokens, NFTs). Off-chain real-world facts (actual bank balance, age, employment, credentials) remain a separate, harder, explicitly out-of-scope problem for v1.

## Status

**Milestone 1 — Attestation primitive: built and compiling.** `contracts/classified.compact` implements `attestBalance` and `verifyAttestation` — a witness-secret + commitment mechanism, confirmed compiling clean (attestBalance k=13/rows=4616, verifyAttestation k=9/rows=377). A genuine, working building block — but not yet what the "wallet" framing above fully describes, since `balance` is still a plain passed-in argument, not real synced chain state (see Open Problem #5 above).

**Milestone 2 (not started) — wallet-based real balance reading.** Wire Classified to actual indexed on-chain state, starting with the simpler case (contract-token balances — simple address→balance mappings) before attempting NIGHT/UTXO aggregation, so `attestBalance` receives a real, wallet-verified number instead of a self-reported one.

**Next step:** build Classified's TypeScript/deploy layer and confirm Milestone 1 works end-to-end on a live devnet, before starting Milestone 2.