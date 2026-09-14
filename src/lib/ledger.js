/**
 * On-Chain Ledger Explorer Domain Logic
 * Simulates Midnight's hybrid public/private ledger state, block telemetry, and caller address lookup.
 */

const { CONTRACT_ADDRESS, BECH32M_ADDRESS, BLOCK_HEIGHT } = require('../constants/contract');

const INITIAL_TRANSACTIONS = [
  {
    txHash: '0x3e689b77c96d1ecbb6f4ae10e9c72eb10b68cf0cc7d082f34dc4207609973cfc',
    blockNumber: BLOCK_HEIGHT,
    caller: 'mn1q8a9fd3k82m5zcx7012y4vpwle9r7k8e2c5f7a',
    predicate: 'Age >= 18',
    outcome: true,
    timestamp: '1 min ago',
    gasUsed: '1,420 uDUST',
    status: 'Finalized'
  },
  {
    txHash: '0x8f2a1b9e4c6f8a2d5b3e7c9f1a4d6b8e2c5f7a01d4c2b9a7e5f3c1d8b6a4e2f0',
    blockNumber: BLOCK_HEIGHT - 3,
    caller: 'mn1q4b2c8e9f1a3d5b7c9e0f2a4b6d8e0f2a4b6d',
    predicate: 'Accredited ($1M+)',
    outcome: true,
    timestamp: '4 mins ago',
    gasUsed: '1,890 uDUST',
    status: 'Finalized'
  },
  {
    txHash: '0x5c7d9a1f3e5b7a9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c',
    blockNumber: BLOCK_HEIGHT - 8,
    caller: 'mn1q7c9e1f3a5b7d9e1f3a5b7c9e1f3a5b7c9e1f',
    predicate: 'Age >= 21',
    outcome: false,
    timestamp: '12 mins ago',
    gasUsed: '1,310 uDUST',
    status: 'Finalized'
  },
  {
    txHash: '0x2b4d6f8a0c2e4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4a6c8e0b2d4f6a8c0e2b4d',
    blockNumber: BLOCK_HEIGHT - 15,
    caller: 'mn1q9f1a3b5c7d9e1f3a5b7c9e1f3a5b7c9e1f3a',
    predicate: 'Jurisdiction Allowlist',
    outcome: true,
    timestamp: '25 mins ago',
    gasUsed: '1,540 uDUST',
    status: 'Finalized'
  }
];

const INITIAL_VERIFICATIONS = {
  'mn1q8a9fd3k82m5zcx7012y4vpwle9r7k8e2c5f7a': true,
  'mn1q4b2c8e9f1a3d5b7c9e0f2a4b6d8e0f2a4b6d': true,
  'mn1q7c9e1f3a5b7d9e1f3a5b7c9e1f3a5b7c9e1f': false,
  'mn1q9f1a3b5c7d9e1f3a5b7c9e1f3a5b7c9e1f3a': true
};

/**
 * Creates the initial ledger state
 * @returns {object} Initial state
 */
function createInitialLedgerState() {
  return {
    contractAddress: CONTRACT_ADDRESS,
    bech32mAddress: BECH32M_ADDRESS,
    totalChecks: 1482,
    blockHeight: BLOCK_HEIGHT,
    verifications: { ...INITIAL_VERIFICATIONS },
    recentTransactions: [...INITIAL_TRANSACTIONS],
    networkStatus: 'Synced',
    activeEpoch: 482
  };
}

/**
 * Records a new compliance verification in the simulated ledger
 * @param {object} currentState
 * @param {object} txParams
 * @returns {object} Updated ledger state
 */
function recordLedgerVerification(currentState, {
  caller,
  predicate,
  outcome,
  blockHeight = BLOCK_HEIGHT + 1,
  txHash = null
}) {
  const newTxHash = txHash || `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`.padEnd(66, '0');
  const callerAddr = caller || 'mn1q8a9fd3k82m5zcx7012y4vpwle9r7k8e2c5f7a';

  const newTx = {
    txHash: newTxHash,
    blockNumber: blockHeight,
    caller: callerAddr,
    predicate: predicate || 'Age >= 18',
    outcome: Boolean(outcome),
    timestamp: 'Just now',
    gasUsed: '1,420 uDUST',
    status: 'Finalized'
  };

  return {
    ...currentState,
    totalChecks: currentState.totalChecks + 1,
    blockHeight,
    verifications: {
      ...currentState.verifications,
      [callerAddr]: Boolean(outcome)
    },
    recentTransactions: [newTx, ...currentState.recentTransactions.slice(0, 19)]
  };
}

/**
 * Looks up a caller address in the public ledger
 * @param {object} ledgerState
 * @param {string} query
 * @returns {object|null}
 */
function lookupAddress(ledgerState, query) {
  if (!query || typeof query !== 'string') return null;
  const sanitized = query.trim().toLowerCase();

  // Find exact or substring match in verifications map
  const matchingKey = Object.keys(ledgerState.verifications).find(
    k => k.toLowerCase() === sanitized || k.toLowerCase().includes(sanitized)
  );

  if (!matchingKey) {
    // Check if it matches any transaction caller
    const txMatch = ledgerState.recentTransactions.find(
      t => t.caller.toLowerCase() === sanitized || t.caller.toLowerCase().includes(sanitized)
    );
    if (txMatch) {
      return {
        address: txMatch.caller,
        isVerified: txMatch.outcome,
        status: txMatch.outcome ? 'Verified' : 'Failed Verification',
        lastBlock: txMatch.blockNumber,
        lastTimestamp: txMatch.timestamp,
        predicate: txMatch.predicate,
        existsInLedger: true
      };
    }
    return {
      address: query.trim(),
      isVerified: false,
      status: 'Unregistered / No Records',
      lastBlock: null,
      lastTimestamp: null,
      predicate: 'None',
      existsInLedger: false
    };
  }

  const isVerified = ledgerState.verifications[matchingKey];
  const lastTx = ledgerState.recentTransactions.find(t => t.caller.toLowerCase() === matchingKey.toLowerCase());

  return {
    address: matchingKey,
    isVerified,
    status: isVerified ? 'Verified & Active' : 'Revoked / Inactive',
    lastBlock: lastTx ? lastTx.blockNumber : ledgerState.blockHeight,
    lastTimestamp: lastTx ? lastTx.timestamp : 'Recent',
    predicate: lastTx ? lastTx.predicate : 'ZK Eligibility',
    existsInLedger: true
  };
}

module.exports = {
  createInitialLedgerState,
  recordLedgerVerification,
  lookupAddress
};
