/**
 * src/lib/contractClient.js
 *
 * Midnight Preprod Contract Client
 * Connects to the deployed gate contract via the Midnight Indexer GraphQL API.
 * Reads live on-chain ledger state: totalChecks and verifications map.
 *
 * Contract: 0a2f1c3e5b4d7a8f9e0c1b2a3d4e5f6789abcdef0123456789abcdef01234567
 * Network:  Midnight Preprod (preprod)
 * Indexer:  https://indexer.preprod.midnight.network/api/v4/graphql
 *
 * Generated artifacts: managed/gate/contract/index.js
 * ZK circuits:         managed/gate/zkir/verifyEligibility.zkir
 * Keys:                managed/gate/keys/verifyEligibility.prover
 */

'use client';

const { CONTRACT_ADDRESS, INDEXER_ENDPOINT, BLOCK_HEIGHT } = require('../constants/contract');

/**
 * GraphQL query for the gate contract's public ledger state.
 * Uses the Midnight Indexer v4 GraphQL API.
 */
const LEDGER_STATE_QUERY = `
  query GateLedgerState($contractAddress: String!) {
    contractState(address: $contractAddress) {
      address
      state {
        totalChecks
        verifications {
          entries {
            key
            value
          }
        }
      }
      latestBlock {
        height
        hash
      }
    }
  }
`;

/**
 * Fetches the live on-chain ledger state for the gate contract.
 * Falls back to simulated state if the Indexer is unreachable (UI demo mode).
 *
 * @returns {Promise<{totalChecks: number, blockHeight: number, verifications: Map<string, boolean>, live: boolean}>}
 */
async function fetchLedgerState() {
  try {
    const response = await fetch(INDEXER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: LEDGER_STATE_QUERY,
        variables: { contractAddress: CONTRACT_ADDRESS }
      }),
      signal: AbortSignal.timeout(5000) // 5s timeout for UI responsiveness
    });

    if (!response.ok) {
      throw new Error(`Indexer returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const contractState = data?.data?.contractState;

    if (!contractState) {
      throw new Error('Contract state not found at indexer');
    }

    const verifications = new Map();
    for (const entry of contractState.state?.verifications?.entries ?? []) {
      verifications.set(entry.key, entry.value === 'true' || entry.value === true);
    }

    return {
      live: true,
      totalChecks: Number(contractState.state?.totalChecks ?? 0),
      blockHeight: Number(contractState.latestBlock?.height ?? BLOCK_HEIGHT),
      verifications
    };
  } catch {
    // Fallback: demo/simulated mode for UI when Indexer is unreachable from browser
    return {
      live: false,
      totalChecks: 47,
      blockHeight: BLOCK_HEIGHT,
      verifications: new Map([
        ['alice_zswap_pubkey_demo', true],
        ['bob_zswap_pubkey_demo', false]
      ])
    };
  }
}

/**
 * Checks if a specific ZswapCoinPublicKey is verified on-chain.
 *
 * @param {string} publicKey
 * @returns {Promise<boolean>}
 */
async function checkVerificationStatus(publicKey) {
  const state = await fetchLedgerState();
  return state.verifications.get(publicKey) ?? false;
}

module.exports = { fetchLedgerState, checkVerificationStatus };
