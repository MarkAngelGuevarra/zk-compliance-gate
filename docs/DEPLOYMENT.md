# 🌙 ZK Compliance Gate — Vercel Deployment Guide

## Deploy to Vercel (Live Demo for Level 2)

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

## Environment Variables (Optional)

| Variable | Value | Purpose |
|:---|:---|:---|
| `NEXT_PUBLIC_NETWORK` | `preprod` | Target Midnight network |
| `NEXT_PUBLIC_NODE_URI` | `https://rpc.testnet-02.midnight.network` | Midnight node |
| `NEXT_PUBLIC_INDEXER_URI` | `https://indexer.testnet-02.midnight.network/api/v1/graphql` | Indexer |

## Live Demo

> 🔗 **Live URL:** https://zk-compliance-gate.vercel.app
> *(Updated after deployment)*
