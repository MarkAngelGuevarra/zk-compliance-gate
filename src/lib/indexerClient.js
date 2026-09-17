/**
 * src/lib/indexerClient.js
 *
 * Midnight Preprod Indexer GraphQL Client
 * Polls the live Midnight Network Indexer API for contract events and block height.
 *
 * Midnight Network Indexer v4 API:
 *   Endpoint: https://indexer.preprod.midnight.network/api/v4/graphql
 *   Docs:     https://docs.midnight.network/develop/reference/indexer-api
 *
 * Uses: React-friendly polling with configurable interval
 *       Falls back to static values when Indexer is unreachable (CORS/network)
 */

'use client';

const { INDEXER_ENDPOINT, CONTRACT_ADDRESS, BLOCK_HEIGHT } = require('../constants/contract');

// GraphQL query to get current block height and contract events
const BLOCK_HEIGHT_QUERY = `
  query LatestBlock {
    latestBlock {
      height
      hash
      timestamp
    }
  }
`;

const CONTRACT_EVENTS_QUERY = `
  query ContractEvents($contractAddress: String!, $after: String) {
    contractTransactions(
      filter: { contractAddress: $contractAddress }
      first: 20
      after: $after
    ) {
      nodes {
        txHash
        blockHeight
        timestamp
        circuitName
        publicInputs
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Fetches the latest Midnight Preprod block height.
 * Falls back to the static BLOCK_HEIGHT constant if unreachable.
 *
 * @returns {Promise<{height: number, hash: string, live: boolean}>}
 */
async function fetchLatestBlock() {
  try {
    const response = await fetch(INDEXER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: BLOCK_HEIGHT_QUERY }),
      signal: AbortSignal.timeout(4000)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const { data, errors } = await response.json();
    if (errors?.length) throw new Error(errors[0].message);

    return {
      live: true,
      height: Number(data.latestBlock.height),
      hash: data.latestBlock.hash,
      timestamp: data.latestBlock.timestamp
    };
  } catch {
    return { live: false, height: BLOCK_HEIGHT, hash: null, timestamp: null };
  }
}

/**
 * Fetches recent transactions for the gate contract.
 *
 * @param {string} [cursor] - Pagination cursor for next page
 * @returns {Promise<{events: Array, hasNextPage: boolean, endCursor: string|null, live: boolean}>}
 */
async function fetchContractEvents(cursor = null) {
  try {
    const response = await fetch(INDEXER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: CONTRACT_EVENTS_QUERY,
        variables: { contractAddress: CONTRACT_ADDRESS, after: cursor }
      }),
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const { data, errors } = await response.json();
    if (errors?.length) throw new Error(errors[0].message);

    const result = data.contractTransactions;
    return {
      live: true,
      events: result.nodes,
      hasNextPage: result.pageInfo.hasNextPage,
      endCursor: result.pageInfo.endCursor
    };
  } catch {
    // Fallback demo events for UI rendering when Indexer is unreachable
    return {
      live: false,
      events: [
        { txHash: '5f4e3d2c...6a5f4e3', blockHeight: 158432, circuitName: 'verifyEligibility', timestamp: new Date().toISOString() },
        { txHash: 'a1b2c3d4...8e9f0a1', blockHeight: 158430, circuitName: 'verifyEligibility', timestamp: new Date(Date.now() - 60000).toISOString() },
        { txHash: 'f9e8d7c6...2b3a4f5', blockHeight: 158428, circuitName: 'revokeVerification', timestamp: new Date(Date.now() - 120000).toISOString() }
      ],
      hasNextPage: false,
      endCursor: null
    };
  }
}

module.exports = { fetchLatestBlock, fetchContractEvents };
