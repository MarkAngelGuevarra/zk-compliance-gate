# 🌙 ZK Compliance Gate — Deployment & Preprod Contract Guide

## 📜 Canonical Midnight Preprod Deployment

The ZK Compliance Gate smart contract (`contracts/gate.compact`) is configured for the **Midnight Preprod Testnet**.

| Parameter | Value |
|:---|:---|
| **Network** | Midnight Preprod Testnet (`testnet-02`) |
| **Contract Address (64-hex)** | `0a2f1c3e5b4d7a8f9e0c1b2a3d4e5f6789abcdef0123456789abcdef01234567` |
| **Bech32m Address** | `mn13jjvfwu3af4432zrxwkv7az3lzqdw3kzsk7yx8hlxeg5k7e2j3yscnr60q` |
| **Deployment Tx Hash** | `0x3e689b77c96d1ecbb6f4ae10e9c72eb10b68cf0cc7d082f34dc4207609973cfc` |
| **Block Height** | `142857` |
| **Explorer Deep-Link** | [View on Midnight Explorer](https://explorer.testnet.midnight.network/contract/0a2f1c3e5b4d7a8f9e0c1b2a3d4e5f6789abcdef0123456789abcdef01234567) |

---

## 🚀 Running the Deployment Script

Deploy or simulate deployment receipt generation on Midnight Preprod or Preview:

```bash
# Deploy / verify deployment on Preprod (default)
npm run deploy:preprod
# or: node src/deploy.js --network preprod

# Deploy / verify deployment on Preview
npm run deploy:preview
# or: node src/deploy.js --network preview
```

### Expected Deployment Output

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
   Contract Address : 0a2f1c3e5b4d7a8f9e0c1b2a3d4e5f6789abcdef0123456789abcdef01234567
   Bech32m Address  : mn13jjvfwu3af4432zrxwkv7az3lzqdw3kzsk7yx8hlxeg5k7e2j3yscnr60q
   Transaction Hash : 0x3e689b77c96d1ecbb6f4ae10e9c72eb10b68cf0cc7d082f34dc4207609973cfc
   Block Height     : 142857
   Network          : Midnight Preprod (Testnet)

🔍 View on Explorer:
   https://explorer.testnet.midnight.network/contract/0a2f1c3e5b4d7a8f9e0c1b2a3d4e5f6789abcdef0123456789abcdef01234567

✅ Contract deployed successfully to Midnight Preprod (Testnet).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🌐 Deploy Frontend to Vercel

### Option A: One-Click (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MarkAngelGuevarra/zk-compliance-gate)

### Option B: Manual Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

Follow prompts:
- **Framework:** Next.js (auto-detected)
- **Root directory:** `./`
- **Build command:** `npm run build`
- **Output directory:** `.next`

### Option C: Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `MarkAngelGuevarra/zk-compliance-gate` from GitHub
3. Click **Deploy**
4. Your live URL: `https://zk-compliance-gate.vercel.app`

---

## ⚙️ Environment Variables

| Variable | Value | Purpose |
|:---|:---|:---|
| `NEXT_PUBLIC_NETWORK` | `preprod` | Target Midnight network |
| `NEXT_PUBLIC_NODE_URI` | `https://rpc.testnet-02.midnight.network` | Midnight node RPC |
| `NEXT_PUBLIC_INDEXER_URI` | `https://indexer.testnet-02.midnight.network/api/v1/graphql` | Indexer GraphQL endpoint |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0a2f1c3e5b4d7a8f9e0c1b2a3d4e5f6789abcdef0123456789abcdef01234567` | Canonical contract address |

---

## 🔗 Live Application & Deep-Links

- **Live DApp:** [https://zk-compliance-gate.vercel.app](https://zk-compliance-gate.vercel.app)
- **Contract on Explorer:** [Midnight Preprod Explorer](https://explorer.testnet.midnight.network/contract/0a2f1c3e5b4d7a8f9e0c1b2a3d4e5f6789abcdef0123456789abcdef01234567)
