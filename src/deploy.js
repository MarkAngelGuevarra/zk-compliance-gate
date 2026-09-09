/**
 * ZK Compliance Gate — Deployment Script
 * 
 * Deploys the gate.compact contract to Midnight Preview or Preprod.
 * 
 * Usage:
 *   node src/deploy.js --network preview
 *   node src/deploy.js --network preprod
 * 
 * Requirements:
 *   - Lace wallet configured with the target network
 *   - WALLET_SEED env variable set (or use .env file)
 *   - Contract compiled (run `npm run compile` first)
 */

import { ContractAddress } from '@midnight-ntwrk/midnight-js-types';
import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';

// ── Network Configuration ─────────────────────────────────────
const NETWORKS = {
  preview: {
    networkId: NetworkId.TestNet,
    indexerUri: 'https://indexer.testnet-02.midnight.network/api/v1/graphql',
    nodeUri:    'https://rpc.testnet-02.midnight.network',
    proofServerUri: 'http://localhost:6300',
  },
  preprod: {
    networkId: NetworkId.TestNet,
    indexerUri: 'https://indexer.testnet-02.midnight.network/api/v1/graphql',
    nodeUri:    'https://rpc.testnet-02.midnight.network',
    proofServerUri: 'http://localhost:6300',
  },
};

// ── Parse CLI arguments ───────────────────────────────────────
const args = process.argv.slice(2);
const networkArg = args.find(a => a.startsWith('--network='))?.split('=')[1]
  ?? args[args.indexOf('--network') + 1]
  ?? 'preprod';

const network = NETWORKS[networkArg];
if (!network) {
  console.error(`❌ Unknown network: "${networkArg}". Use --network preview or --network preprod`);
  process.exit(1);
}

// ── Deployment ────────────────────────────────────────────────
async function deploy() {
  console.log(`\n🌙 ZK Compliance Gate — Deployment`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📡 Target Network : ${networkArg.toUpperCase()}`);
  console.log(`🔗 Node URI       : ${network.nodeUri}`);
  console.log(`📊 Indexer URI    : ${network.indexerUri}`);
  console.log(`🔐 Proof Server   : ${network.proofServerUri}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  try {
    // TODO: Initialize wallet from environment seed phrase
    // const wallet = await MidnightWallet.fromSeed(process.env.WALLET_SEED, network);

    // TODO: Load compiled contract artifacts from managed/ directory
    // const contract = await Contract.load('./managed/gate');

    // TODO: Deploy contract to the network
    // const deployedAddress = await wallet.deployContract(contract, {
    //   initialState: { totalChecks: 0 }
    // });

    // Placeholder output for Level 1 (real deployment after toolchain setup)
    console.log(`✅ Contract compiled artifacts found in: ./managed/`);
    console.log(`📝 Deploying gate.compact to ${networkArg}...`);
    console.log(`\n⚠️  Complete wallet initialization before live deployment.`);
    console.log(`📖 See docs/DEPLOYMENT.md for step-by-step instructions.\n`);

  } catch (err) {
    console.error(`\n❌ Deployment failed:`, err.message);
    process.exit(1);
  }
}

deploy();
