# Contributing to ZK Compliance Gate

Thank you for contributing to ZK Compliance Gate — a zero-knowledge compliance tool built on Midnight Network.

## Getting Started

### Prerequisites
- Node.js v18+ or v20+
- npm v9+
- For contract development: Linux or WSL2 + Compact Compiler v0.18.0

### Setup
```bash
git clone https://github.com/MarkAngelGuevarra/zk-compliance-gate.git
cd zk-compliance-gate
npm install
npm test
npm run dev  # http://localhost:3000
```

## Development Workflow

### Branch Strategy
- `main` — production branch (Vercel auto-deploys)
- `feat/<name>` — new features
- `fix/<name>` — bug fixes

### Commit Conventions
We use [Conventional Commits](https://www.conventionalcommits.org/):
```
feat(scope): description
fix(scope): description
ci(scope): description
docs(scope): description
test(scope): description
```

Examples:
- `feat(ui): add wallet disconnect animation`
- `fix(contract): correct witness callback signature`
- `test(indexer): add fallback coverage for unreachable network`

## Compact Contract Development

### Editing `contracts/gate.compact`

The Compact smart contract source is at `contracts/gate.compact`. After editing:

1. **Compile locally** (requires Linux/WSL2 with Compact Compiler installed):
   ```bash
   compact compile contracts/gate.compact managed/gate
   ```

2. **Commit the managed/ artifacts** — the CI/CD pipeline also compiles on every push to `main`.

3. **Run tests** to ensure circuit logic is correct:
   ```bash
   npm test
   ```

### Compact Compiler Installation
```bash
# Linux / WSL2
curl --proto '=https' --tlsv1.2 -LsSf \
  https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh

# Verify
compact --version  # Should print: compactc v0.18.0
```

## Testing

We maintain a 4-suite test structure:

| Suite | File | Coverage |
|:---|:---|:---|
| Core ZK Circuits | `tests/gate.test.js` | 11 tests — circuit logic, witnesses, revocation |
| Enterprise Frontend | `tests/enterprise_frontend.test.js` | 27 tests — presets, compliance rules |
| Contract Address | `tests/contract_address.test.js` | 13 tests — address format, managed/ structure |
| Integration | `tests/integration.test.js` | 9 tests — multi-tab workflow, redaction |
| Indexer Client | `tests/indexer_client.test.js` | 4 tests — live + fallback Indexer queries |

Run all tests:
```bash
npm test
```

## Privacy Architecture

ZK Compliance Gate enforces a strict privacy boundary:

- **Private witnesses** (`getPrivateAge()`) are evaluated LOCALLY on the prover's machine.
- Private values NEVER appear in the transaction payload or on-chain.
- Only the boolean result (`eligible: true/false`) and caller's `ZswapCoinPublicKey` are disclosed.

Do NOT add any code that logs, sends, or stores private witness values.

## Deployment

### Preprod Deployment
```bash
npm run deploy:preprod
```

This reads compiled artifacts from `managed/gate/deployed-address.json` and prints the deployment receipt.

### CI/CD

The GitHub Actions pipelines:
- **`ci.yml`**: Runs `npm install`, `npm test`, `npm run build` on every push.
- **`compile-contract.yml`**: Compiles `gate.compact` → `managed/gate/` via Compact Compiler on Ubuntu runner.

## Questions

Open an issue or reach out via [@ZKComplianceGate](https://x.com/ZKComplianceGate) on X.
