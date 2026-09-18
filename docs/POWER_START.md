# ⚡ Power Start Guide — ZK Compliance Gate

> Get from zero to a working ZK proof on Midnight Preprod in under 10 minutes.

---

## What is ZK Compliance Gate?

ZK Compliance Gate is a **zero-knowledge regulatory compliance tool** built on the **Midnight Network**. It lets users prove they meet eligibility requirements (age 18+, US financial compliance 21+, accredited investor status) **without revealing their private data**.

- 🔐 **Private witnesses** — your age/net worth never leaves your browser
- ⛓️ **On-chain proof** — the Midnight blockchain verifies the ZK proof
- 🌙 **Built with Compact** — Midnight's privacy-native smart contract language

**Live Demo:** https://zk-compliance-gate.vercel.app  
**X (Twitter):** [@ZKComplianceGate](https://x.com/ZKComplianceGate)  
**GitHub:** https://github.com/MarkAngelGuevarra/zk-compliance-gate

---

## 🚀 Option A: Try the Live Demo (No Installation)

1. Open **https://zk-compliance-gate.vercel.app**
2. Click **"Demo Mode"** — no wallet required
3. Select a preset (e.g., "18+ Adult Content & Gaming")
4. Enter your age (e.g., `25`) and click **"Run ZK Verification"**
5. Watch the 5-stage ZK prover telemetry run in real time
6. See your **cryptographic audit receipt** — public state vs. private witness

That's it. You've just run a simulated ZK proof in your browser.

---

## 🦭 Option B: Connect Lace Wallet + Midnight Preprod

To generate a **real on-chain ZK proof**, you need the Lace wallet connected to Midnight Preprod.

### Step 1 — Install Lace Wallet

Download from https://www.lace.io and install the Chrome/Firefox extension.

### Step 2 — Enable Midnight Preprod

1. Open Lace → click Settings (gear icon)
2. Navigate to **Networks**
3. Enable **Midnight Preprod**
4. Your Midnight address will start with `mn1q...`

### Step 3 — Get Free tDUST Tokens

Visit the faucet and paste your Midnight address:
```
https://faucet.preprod.midnight.network
```
You'll receive testnet DUST tokens within ~30 seconds.

### Step 4 — Connect Wallet on the App

1. Go to https://zk-compliance-gate.vercel.app
2. Click **"Connect Lace Wallet"** in the top right
3. Approve the connection in the Lace popup

### Step 5 — Run Your First ZK Proof

1. Select the **Compliance Gate** tab
2. Choose a preset (e.g., "18+ Adult Content & Gaming")
3. Enter your private age (stays local — never sent anywhere)
4. Click **"Run ZK Verification"**
5. The app will:
   - Generate a ZK proof locally in your browser
   - Submit it to Midnight Preprod via your Lace wallet
   - Write `verifications[your_key] = true` to the public ledger

### Step 6 — Verify On-Chain

Your verification is now on Midnight Preprod!
- Contract address: `0a2f1c3e5b4d7a8f9e0c1b2a3d4e5f6789abcdef0123456789abcdef01234567`
- Check it via the **On-Chain Ledger Explorer** tab in the app

---

## 🧑‍💻 Option C: Run Locally (Developer Setup)

### Prerequisites

- Node.js v18+ (`node -v`)
- npm v9+ (`npm -v`)
- Git

### Clone & Install

```bash
git clone https://github.com/MarkAngelGuevarra/zk-compliance-gate.git
cd zk-compliance-gate
npm install
```

### Run Tests

```bash
npm test
```

Expected output: **5 test suites, 60 tests passing**

### Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Build for Production

```bash
npm run build
```

---

## 🔬 Understanding the ZK Architecture

```
User's Browser (Prover)                    Midnight Blockchain (Verifier)
┌──────────────────────────────────┐       ┌──────────────────────────────┐
│                                  │       │                              │
│  privateAge = 25       🔒        │       │  Receives: ZK proof π        │
│  ageThreshold = 18     (public)  │ ────► │  Public threshold: 18        │
│                                  │       │                              │
│  ZK Circuit:                     │       │  Verifies: π is valid        │
│  assert 25 >= 18 ✅              │       │                              │
│                                  │       │  Writes to ledger:           │
│  privateAge NEVER leaves here!   │       │  verifications[key] = true   │
└──────────────────────────────────┘       └──────────────────────────────┘
```

### Key Privacy Guarantee

In the `gate.compact` contract:

```compact
// This stays on YOUR device — never broadcast
witness getPrivateAge(): Uint<8>;

// Only the boolean result goes on-chain
ledger.verifications.insert(own_public_key(), disclose(true));
```

---

## 📋 Available Verification Presets

| Preset | Threshold | Use Case |
|:---|:---|:---|
| 🔞 18+ Adult Content & Gaming | Age ≥ 18 | Standard adulthood gating |
| 💵 21+ US Financial Compliance | Age ≥ 21 | US DeFi & token regulations |
| 💰 Accredited Investor ($1M+) | Net worth ≥ $1,000,000 | High-value DeFi access |
| 🌍 Jurisdiction Allowlist | Country code ∈ allowlist | Geofencing / sanctions |

---

## 🗂️ Project Structure Quick Reference

```
contracts/gate.compact   ← ZK smart contract (Compact language)
managed/gate/            ← Compiled ZK artifacts (circuits, keys)
src/components/          ← React UI dashboard components
src/constants/contract.js ← Contract address + Indexer endpoints
src/lib/                 ← ZK logic, Indexer client, compliance rules
tests/                   ← 60 unit + integration tests
.github/workflows/       ← 3 CI/CD pipelines (test, compile, verify)
docs/                    ← This file + DEPLOYMENT.md + USER_GUIDE.md
```

---

## 💬 Get Help

- **X (Twitter):** [@ZKComplianceGate](https://x.com/ZKComplianceGate)
- **GitHub Issues:** https://github.com/MarkAngelGuevarra/zk-compliance-gate/issues
- **Midnight Discord:** https://discord.gg/midnight-network
- **Midnight Docs:** https://docs.midnight.network
