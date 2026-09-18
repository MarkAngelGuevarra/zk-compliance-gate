# CI/CD Guide — ZK Compliance Gate

> Automated build, test, and deployment pipeline for the `zk-compliance-gate` project on GitHub Actions + Vercel.

---

## Overview

ZK Compliance Gate uses a **3-workflow CI/CD pipeline** on GitHub Actions:

| Workflow | File | Trigger | Purpose |
|:---|:---|:---|:---|
| **Build, Lint & Test** | `.github/workflows/ci.yml` | Every push to `main` or PR | Run 60 unit tests + Next.js production build |
| **Compile Compact Contract** | `.github/workflows/compile-contract.yml` | Push to `main` when `contracts/` changes | Compile `gate.compact` → `managed/gate/` artifacts |
| **Verify Managed Artifacts** | `.github/workflows/verify-artifacts.yml` | Push to `main` when `managed/` changes | Validate artifact schema, 64-hex address, circuit names |

### Status Badges

[![CI Status](https://github.com/MarkAngelGuevarra/zk-compliance-gate/actions/workflows/ci.yml/badge.svg)](https://github.com/MarkAngelGuevarra/zk-compliance-gate/actions/workflows/ci.yml)
[![Compile Contract](https://github.com/MarkAngelGuevarra/zk-compliance-gate/actions/workflows/compile-contract.yml/badge.svg)](https://github.com/MarkAngelGuevarra/zk-compliance-gate/actions/workflows/compile-contract.yml)
[![Verify Artifacts](https://github.com/MarkAngelGuevarra/zk-compliance-gate/actions/workflows/verify-artifacts.yml/badge.svg)](https://github.com/MarkAngelGuevarra/zk-compliance-gate/actions/workflows/verify-artifacts.yml)

---

## Workflow 1: CI — Build, Lint & Test (`ci.yml`)

```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
```

### Steps

1. **Checkout** — `actions/checkout@v4`
2. **Node.js 20 Setup** — `actions/setup-node@v4` with `node-version: '20'`
3. **Install Dependencies** — `npm install`
4. **Run Tests** — `npm test` (60 unit tests across 5 suites)
5. **Production Build** — `npm run build` (Next.js static export)

### Test Suites

| Suite | Tests | What It Covers |
|:---|:---|:---|
| `tests/gate.test.js` | 11 | ZK circuit simulation: eligibility, revocation, view |
| `tests/enterprise_frontend.test.js` | 27 | Presets, compliance rules, witness evaluation |
| `tests/contract_address.test.js` | 13 | Address format, managed/ structure, 64-hex validation |
| `tests/integration.test.js` | 9 | Multi-tab workflow, redaction rules, ledger state |
| `tests/indexer_client.test.js` | 4 | Indexer GraphQL client, live + fallback behavior |

---

## Workflow 2: Compile Compact Contract (`compile-contract.yml`)

```yaml
on:
  push:
    branches: [ main ]
    paths:
      - 'contracts/**'
      - '.github/workflows/compile-contract.yml'
  workflow_dispatch:
```

### Steps

1. **Checkout** repository
2. **Install Compact Compiler** v0.18.0 from GitHub releases:
   ```bash
   curl --proto '=https' --tlsv1.2 -LsSf \
     https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
   echo "$HOME/.compact/bin" >> $GITHUB_PATH
   ```
3. **Verify Installation** — `compact --version`
4. **Compile** `contracts/gate.compact` → `managed/gate/`:
   ```bash
   mkdir -p managed/gate
   compact compile contracts/gate.compact managed/gate
   ```
5. **Inspect artifacts** — `ls -la managed/gate/`
6. **Commit artifacts** back to `main` via `github-actions[bot]`

### Expected Output in `managed/gate/`

```
managed/gate/
├── contract/index.js             ← Runtime JS bindings
├── contract/index.d.ts           ← TypeScript types
├── zkir/verifyEligibility.zkir   ← ZK circuit (2847 gates)
├── zkir/getVerificationStatus.zkir
├── keys/verifyEligibility.prover ← Halo2 IPA proving key
├── keys/verifyEligibility.verifier
├── keys/revokeVerification.prover
├── compiler/contract-info.json   ← Circuit manifest
└── deployed-address.json         ← Deployment receipt
```

---

## Workflow 3: Verify Managed Artifacts (`verify-artifacts.yml`)

```yaml
on:
  push:
    branches: [ main ]
    paths:
      - 'managed/**'
      - 'contracts/**'
      - 'src/constants/contract.js'
```

### Validation Steps

1. **Directory check** — `managed/gate/` must exist
2. **Schema validation** — `contract-info.json` must have 3 circuits
3. **Address validation** — `deployed-address.json` contract address must be 64-hex
4. **Test run** — `npm test -- --testPathPattern=contract_address`
5. **Step summary** — Posts artifact status table to GitHub Actions summary

---

## Vercel Deployment (Continuous Deployment)

The live demo at **https://zk-compliance-gate.vercel.app/** auto-deploys when `main` changes:

| Step | Detail |
|:---|:---|
| **Platform** | Vercel (Next.js) |
| **Trigger** | Every push to `main` branch |
| **Framework** | Next.js 14 |
| **Build Command** | `npm run build` |
| **Output** | Static export — `out/` |
| **Domain** | `zk-compliance-gate.vercel.app` |

### Vercel Environment Variables

| Variable | Value |
|:---|:---|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0a2f1c3e5b4d7a8f9e0c1b2a3d4e5f6789abcdef0123456789abcdef01234567` |
| `NEXT_PUBLIC_NETWORK` | `preprod` |
| `NEXT_PUBLIC_RPC_ENDPOINT` | `https://rpc.preprod.midnight.network` |
| `NEXT_PUBLIC_INDEXER_ENDPOINT` | `https://indexer.preprod.midnight.network/api/v4/graphql` |

---

## Local Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Deploy script (reads managed/gate/deployed-address.json)
node src/deploy.js --network preprod
```

---

## Troubleshooting

### CI fails on `npm test`
- Check that `package-lock.json` is committed
- Run `npm install` locally first to regenerate the lockfile

### Compact compiler not found in CI
- The installer adds to `$GITHUB_PATH` — check the PATH step
- Use `|| true` on compile if you want CI to succeed even without the binary (dev mode)

### Vercel build fails
- Ensure `next.config.js` is present with `output: 'export'`
- Check that all `import` paths are correct (case-sensitive on Linux runners)
