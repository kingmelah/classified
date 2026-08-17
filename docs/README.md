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

### Open — Not Yet Solved
1. **UTXO aggregation** — NIGHT (and similar native tokens) have no single stored balance; balance is the sum of UTXOs a wallet controls. How to correctly and completely aggregate this into one honest, hashable number is unsolved.
2. **Tamper-evidence of the wallet-computed hash** — currently just an assumption ("the wallet computed it, so it's trustworthy"). No actual mechanism yet prevents a modified/malicious wallet from hashing a fabricated number.
3. **Classified ↔ ProveIt integration flow** — the actual TypeScript-layer handoff (Classified's hash → ProveIt's witness) is undesigned and untested.
4. **Witness safety** — OpenZeppelin's own Compact library explicitly states its example witnesses are reference test doubles, not production-ready. Classified needs its own audited witness implementation.
5. **No code written yet** — everything to this point is architecture and scoping. Implementation has not started.

---

## Technical Foundation

Build on OpenZeppelin's Compact contracts library (`OpenZeppelin/compact-contracts`) rather than writing token-tracking logic from scratch — respecting its explicitly experimental, "use at your own risk" status, and auditing/rewriting witnesses ourselves rather than trusting their reference examples for production use.

## Scope Boundary

Classified solves trust for **on-chain-native assets only** (NIGHT, contract tokens, NFTs). Off-chain real-world facts (actual bank balance, age, employment, credentials) remain a separate, harder, explicitly out-of-scope problem for v1.

## Status

Concept and architecture scoped. No code written. Next step: tackle open problems one at a time, starting with the simplest case (contract tokens — simple mapping, no UTXO aggregation) before attempting NIGHT/UTXO-based assets.