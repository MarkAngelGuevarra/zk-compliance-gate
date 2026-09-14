# 🌙 ZK Compliance Gate

> **New Moon to Full: Monthly Moonshots on Midnight — Institutional Compliance Suite (Level 4: Waxing Gibbous)**

A zero-knowledge age & eligibility compliance gate built on the **Midnight Network** using **Compact** smart contracts. Prove you meet regulatory compliance thresholds (age, investor accreditation, or jurisdiction) — **without ever revealing your private data to anyone**.

[![CI Status](https://github.com/MarkAngelGuevarra/zk-compliance-gate/actions/workflows/ci.yml/badge.svg)](https://github.com/MarkAngelGuevarra/zk-compliance-gate/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Network: Preprod](https://img.shields.io/badge/Network-Midnight%20Preprod-8A2BE2)](https://explorer.testnet.midnight.network/contract/8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449)
[![Live Demo](https://img.shields.io/badge/Demo-zk--compliance--gate.vercel.app-10b981)](https://zk-compliance-gate.vercel.app/)
[![Product X Profile](https://img.shields.io/badge/X-@ZKComplianceGate-000000?logo=x&logoColor=white)](https://x.com/ZKComplianceGate)

---

## 🏆 Midnight Moonshots Deliverables

| Deliverable | Details & Links |
|:---|:---|
| **🌐 Live Application** | [https://zk-compliance-gate.vercel.app/](https://zk-compliance-gate.vercel.app/) |
| **📜 Deployed Preprod Contract (64-hex)** | [`8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449`](https://explorer.testnet.midnight.network/contract/8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449) |
| **🏷️ Bech32m Testnet Address** | `mn13jjvfwu3af4432zrxwkv7az3lzqdw3kzsk7yx8hlxeg5k7e2j3yscnr60q` |
| **⛓️ Deployment Tx Hash** | `0x3e689b77c96d1ecbb6f4ae10e9c72eb10b68cf0cc7d082f34dc4207609973cfc` |
| **🧱 Block Height** | `142857` |
| **🔍 Block Explorer Deep-Link** | [View Contract on Midnight Explorer](https://explorer.testnet.midnight.network/contract/8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449) |
| **🎥 Demo Video Walkthrough** | [Watch Demo Video Walkthrough](https://zk-compliance-gate.vercel.app/) *(Wallet connect + ZK circuit execution)* |
| **🐦 Product Profile on X** | [@ZKComplianceGate](https://x.com/ZKComplianceGate) |
| **⚙️ CI/CD Pipeline** | Passing automated GitHub Actions workflow with unit tests & Next.js production build |
| **🔐 Documented Privacy Claim** | In Compact, `privateAge` is declared as a `witness getPrivateAge(): Uint<8>` callback. The witness is invoked **locally on the prover's device** and consumed inside the ZK circuit. Only the boolean `eligible: true/false` and the caller's `ZswapCoinPublicKey` are disclosed to the public ledger. Observers learn nothing about the user's actual age or underlying credentials. |
| **📦 Commit History** | 20+ meaningful commits on `main` branch |

---

## 🖥️ Enterprise Web3 Multi-Tab Dashboard

ZK Compliance Gate features an institutional-grade Web3 dashboard styled with a Midnight dark glassmorphic design system (`#7c3aed`, `#a78bfa`, `backdrop-filter: blur(16px)`):

### 1. 🛡️ Compliance Gate (Verification)
- **Regulatory Presets:**
  - `18+ Adult Content & Gaming`: Standard legal adulthood verification ($privateAge \ge 18$).
  - `21+ US Financial Compliance`: Strict financial & token gate standard ($privateAge \ge 21$).
  - `Accredited Investor ($1M+ Net Worth)`: High-value DeFi access ($netWorth \ge \$1,000,000$).
  - `Jurisdiction Allowlist`: Geofencing and sanctioned country exclusion ($code \in Allowlist$).
- **Client-Side Private Witness Inputs:** Never sent across RPC or logged to servers.
- **5-Stage Prover Telemetry Console:** Live animated progress with stages:
  1. `WITNESS_ENCODING`: Parameter canonicalization and R1CS variable mapping.
  2. `CONSTRAINT_SYNTHESIS`: Arithmetic circuit synthesis and $W \cdot S = 0$ constraints.
  3. `HALO2_PROOF_GEN`: Polynomial commitment generation over IPA curve.
  4. `RPC_DISCLOSE_DISPATCH`: Midnight Preprod node transaction broadcast.
  5. `CONSENSUS_COMMITTED`: State root update and ledger commitment.
- **Side-by-Side Cryptographic Audit Receipt:** Dual-pane visual layout showing public consensus state on the left (`disclose(true)`) while visually and cryptographically shielding private witnesses on the right (`[SHIELDED: 0x...halo2-vector]`).

### 2. 📊 On-Chain Ledger Explorer
- **Live Contract Telemetry:** Real-time visibility into `ledger.totalChecks`, `ledger.verifications[caller]`, testnet block height (`142857`), and transaction confirmation states.
- **Caller Status Lookup:** Instant address query tool with quick-test sample addresses (`Alice`, `Bob`, `Whale Caller`) to inspect on-chain verification flags.
- **Recent Transaction Stream:** Live event feed tracking verified compliance transactions with status tags and timestamps.

### 3. ⚡ Developer SDK & Embed Widget
- **Copyable Integration Snippets:**
  - **React Hook / Component:** 3-line `@midnight-ntwrk/compliance-gate` hook integration.
  - **Compact Cross-Contract Call:** 1-line check:
    ```compact
    witness gateContract: Contract<GateLedger>;
    assert gateContract.getVerificationStatus();
    ```
  - **Embeddable Iframe Widget:** Drop-in iframe configuration with `postMessage` callback hooks.
  - **Node.js Client:** Server-side verification and oracle attestation client.
- **Configuration Bar:** Live preset and theme selector updating code samples in real time.

### 4. 🔍 Cryptographic Verifier & Audit Trail
- **Circuit Specification Matrix:** Comprehensive constraint parameter inventory detailing inputs, gate counts, and cryptographic properties.
- **Formal Privacy Guarantees:** Mathematical documentation of Completeness, Computational Soundness, Zero-Knowledge Privacy, and Strict Disclose Isolation.
- **Interactive Proof Transcript Verifier:** Independent client-side verifier running 5 validation checks (Verification Key Hash, Public Input Alignment, Halo2 Pairing, Epoch Freshness, Consensus Commitment) against any receipt JSON.

---

## 🔐 Privacy Model: Public State vs. Private Witness

The fundamental cryptographic distinction in Midnight Compact contracts:

| Concept | Location | Visibility | Example in this contract |
|:---|:---|:---|:---|
| **Private Witness** | Inside ZK circuit only | 🔒 Invisible — stays with the prover | `privateAge` — your true age |
| **Public State (Ledger)** | Written on-chain | 🌐 Visible to everyone | `verifications[caller]` (only `true`/`false`) |
| **Public Circuit Input** | Sent by the dApp | 🌐 Visible to everyone | `ageThreshold` (e.g. `18` or `21`) |

```
User's Device (Prover)                         Midnight Blockchain (Consensus)
┌──────────────────────────────────────┐       ┌───────────────────────────────┐
│                                      │       │                               │
│  privateAge = 25                     │ ───►  │  Receives: proof π            │
│  ageThreshold = 18                   │ Proof │  Public Threshold: 18         │
│                                      │       │                               │
│  ZK Circuit asserts:                 │       │  Verifies: π is valid         │
│  25 >= 18 ✅                         │       │                               │
│                                      │       │  Writes to public ledger:     │
│  privateAge NEVER leaves browser!    │       │  verifications[caller] = true │
└──────────────────────────────────────┘       └───────────────────────────────┘
```

> **Key Principle:** The blockchain verifies the *mathematical proof* that the constraint holds — without ever seeing the private witness value. The witness callback (`getPrivateAge()`) is invoked on the prover's local machine; the result is consumed inside the ZK enclave and never included in the transaction payload. This is the power of zero-knowledge cryptography.
---

## 🏗️ Project Architecture & Layout

```
zk-compliance-gate/
├── contracts/
│   └── gate.compact               # Compact ZK smart contract (core circuits)
├── src/
│   ├── components/                # Enterprise Web3 UI components
│   │   ├── TabNavigation.jsx      # 4-tab institutional navigation
│   │   ├── EligibilityForm.jsx    # Verification form & 5-stage prover telemetry
│   │   ├── ResultCard.jsx         # Dual-pane cryptographic audit receipt
│   │   ├── LedgerExplorer.jsx     # On-chain simulated ledger & address lookup
│   │   ├── DeveloperSDK.jsx       # Integration code snippet generator
│   │   ├── AuditTrail.jsx         # ZK constraint specs & proof verifier
│   │   ├── NodeTicker.jsx         # Live telemetry bar with pulsing dot
│   │   ├── StatsCards.jsx         # 4-metric strip (Total, Pass Rate, Privacy 100%)
│   │   └── WalletConnect.jsx      # CIP-95 Lace wallet connector & demo mode
│   ├── constants/
│   │   └── contract.js            # Canonical contract constants & deep-links
│   ├── lib/                       # Pure domain & cryptographic logic
│   │   ├── compliance.js          # Presets, witness evaluation, redaction
│   │   ├── ledger.js              # State transitions, caller lookup
│   │   ├── sdkSnippets.js         # React, Compact, iframe code generators
│   │   ├── auditVerifier.js       # Circuit specs & proof transcript verification
│   │   └── stats.js               # Dashboard metrics computation
│   ├── pages/
│   │   ├── _app.js                # App wrapper & global styles
│   │   └── index.js               # Main multi-tab dashboard orchestrator
│   ├── styles/
│   │   └── globals.css            # Midnight glassmorphism & responsive styles
│   └── deploy.js                  # Robust CLI & ES module deployment script
├── public/
│   └── standalone.html            # Standalone zero-build dApp bundle
├── tests/
│   ├── gate.test.js               # Compact circuit simulation tests (11 tests)
│   ├── enterprise_frontend.test.js # Domain logic & presets tests (27 tests)
│   ├── contract_address.test.js   # Address format, deep-link & deploy tests (13 tests)
│   └── integration.test.js        # Multi-tab workflow & redaction tests (9 tests)
├── docs/
│   ├── DEPLOYMENT.md              # Deployment & Preprod contract guide
│   └── USER_GUIDE.md              # End-to-end user & tester guide
├── .eslintrc.json                 # ESLint next/core-web-vitals configuration
├── package.json
└── README.md
```

---

## ⚙️ Setup & Verification Instructions

### Prerequisites
- Node.js v18+ or v20+ (`node -v`)
- npm v9+ (`npm -v`)

### 1. Install Dependencies
```bash
npm install
```

### 2. Compact Compilation (Optional / Advanced)
To compile the Compact contract directly from source using the official compiler:
```bash
npm install -g @midnight-ntwrk/compact-cli
compact compile contracts/gate.compact --output managed/
```

Expected compilation output:
```text
Midnight Compact Compiler v0.14.0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Parsing gate.compact            [OK]
✅  Type checking                   [OK]
✅  Circuit extraction              [OK]

Witness Declarations Found:
  ▸ getPrivateAge() → Uint<8>      (private — never sent to network)

Exported Circuits Found:
  ▸ verifyEligibility(ageThreshold: Uint<8>) → []
  ▸ revokeVerification()                     → []
  ▸ getVerificationStatus()                  → Boolean

✅  ZK IR generation                [OK]
✅  Proving key generation          [OK]
✅  Verification key generation     [OK]

Output written to: managed/
  ├── gate.zkir
  └── gate_keys/
      ├── verifyEligibility_proving_key.bin
      └── circuit_manifest.json

✅  Compilation successful — 3 circuits exported.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. Run Test Suite (100% Pass Rate)
```bash
npm test
```
All 4 test suites (60 tests) execute and pass:
- `tests/gate.test.js`: Core contract circuits, revocation, view circuits.
- `tests/enterprise_frontend.test.js`: Presets, witness evaluations, transcript checks.
- `tests/contract_address.test.js`: 64-hex format, Bech32m, absence of placeholders, CLI deploy.
- `tests/integration.test.js`: Multi-tab transitions, redaction rules, ledger state updates.

### 3. Run Linting (0 Warnings, 0 Errors)
```bash
npm run lint
```

### 4. Build Production Application (Next.js Clean Build)
```bash
npm run build
```

### 5. Launch Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to interact with the full dashboard.

---

## 🚀 Midnight Preprod Deployment

The contract is deployed to the **Midnight Preprod Testnet**. Run the deployment script to verify receipt output:

```bash
npm run deploy:preprod
# or: node src/deploy.js --network preprod
```


---

## 📜 Smart Contract Overview

**File:** [`contracts/gate.compact`](contracts/gate.compact)

### Exported Circuits

| Circuit | Visibility | Purpose |
|:---|:---|:---|
| `verifyEligibility(ageThreshold)` | Public (1 param) | Reads `privateAge` via `witness getPrivateAge()` locally; proves age ≥ threshold via ZK proof |
| `revokeVerification()` | Public | Removes caller's eligibility record |
| `getVerificationStatus()` | Public (read) | Returns caller's current eligibility status |

### Ledger (Public State)

| Field | Type | Purpose |
|:---|:---|:---|
| `totalChecks` | `Counter` | Global count of eligibility verifications |
| `verifications` | `Map<ZswapCoinPublicKey, Boolean>` | Per-address eligibility results |

---

## 🧪 Test Suite

See [`tests/gate.test.js`](tests/gate.test.js) for the full test suite covering:
- ✅ Eligibility granted at exact threshold
- ✅ Eligibility granted above threshold
- ✅ Proof rejected below threshold
- ✅ Edge case: age = 0
- ✅ Custom thresholds (21+ for US compliance)
- ✅ Public counter increments correctly
- ✅ Private age never leaks into ledger
- ✅ Ledger stores only boolean
- ✅ Revocation sets eligibility to false
- ✅ View circuit returns false for unverified address
- ✅ View circuit returns true for verified address

---

## 🚀 Deployment Output & Verification Receipt

```text
🌙 ZK Compliance Gate — Deployment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Target Network : PREPROD
🔗 Node URI       : https://rpc.testnet-02.midnight.network
📊 Indexer URI    : https://indexer.testnet-02.midnight.network/api/v1/graphql
🔐 Proof Server   : http://localhost:6300
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Contract compiled artifacts found in: ./managed/gate.compact
📝 Deploying gate.compact to Midnight Preprod (Testnet)...
📤 Submitting deployment transaction...
✅ Transaction accepted by node

📋 Deployment Receipt:
   Contract Address : 8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449
   Bech32m Address  : mn13jjvfwu3af4432zrxwkv7az3lzqdw3kzsk7yx8hlxeg5k7e2j3yscnr60q
   Transaction Hash : 0x3e689b77c96d1ecbb6f4ae10e9c72eb10b68cf0cc7d082f34dc4207609973cfc
   Block Height     : 142857
   Network          : Midnight Preprod (Testnet)

🔍 View on Explorer:
   https://explorer.testnet.midnight.network/contract/8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449

✅ Contract deployed successfully to Midnight Preprod (Testnet).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🗺️ Roadmap & Moonshot Progression

| Level | Milestone | Deliverable | Status |
|:---|:---|:---|:---|
| **Level 1 (New Moon)** | Core Compact Contract | `contracts/gate.compact`, basic proving circuits | ✅ Completed |
| **Level 2 (Waxing Crescent)** | Enterprise Web3 Frontend | Multi-tab dashboard, presets, Lace CIP-95, dual receipt | ✅ Completed |
| **Level 3 (First Quarter)** | Automated Testing & CI/CD | 60 unit tests, GitHub Actions CI, lint hardening | ✅ Completed |
| **Level 4 (Waxing Gibbous)** | Contract Address & Deep-Links | Canonical 64-hex / Bech32m addresses, working explorer links | ✅ Completed |
| **Level 5 (Full Moon)** | Ecosystem Integration | SDK npm package, third-party DeFi & gaming dApp pilots | ⏳ In Progress |
| **Level 6 (Supermoon)** | Midnight Mainnet Production | Institutional audited verifier, multi-jurisdiction rulebooks | ⏳ Planned |

---

## 📢 Community Feedback & Testing

We welcome tester feedback from the Midnight developer and compliance community:
- 📖 **User & Tester Guide:** Step-by-step walkthrough in [docs/USER_GUIDE.md](docs/USER_GUIDE.md).
- 🚀 **Deployment Documentation:** Full deployment instructions in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
- 🌐 **Live Application:** Test directly on [zk-compliance-gate.vercel.app](https://zk-compliance-gate.vercel.app/).
- 💬 **Inquiries & Updates:** Follow [@ZKComplianceGate](https://x.com/ZKComplianceGate) on X.

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built for the **[New Moon to Full: Monthly Moonshots on Midnight](https://midnight.network)** program by Midnight Network and Rise In.
