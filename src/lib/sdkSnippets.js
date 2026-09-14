/**
 * Developer SDK Code Snippet Generator
 * Provides copyable snippets for React hooks, Compact smart contracts, and iframe widgets.
 */

const { CONTRACT_ADDRESS, BECH32M_ADDRESS } = require('../constants/contract');

/**
 * Generates React component integration snippet
 * @param {object} options
 * @returns {string}
 */
function getReactSnippet({
  contractAddress = BECH32M_ADDRESS,
  preset = 'AGE_18',
  theme = 'midnight-glass'
} = {}) {
  return `import React from 'react';
import { MidnightComplianceGate, useMidnightCompliance } from '@midnight-ntwrk/compliance-gate-react';

export function RestrictedDeFiVault() {
  // Query on-chain compliance status without leaking user identity
  const { isCompliant, proofReceipt, isLoading, verify } = useMidnightCompliance({
    contractAddress: "${contractAddress}",
    preset: "${preset}",
    network: "preprod"
  });

  if (isLoading) {
    return <div className="loading-spinner">Verifying ZK state on Midnight...</div>;
  }

  return (
    <div className="vault-container">
      {isCompliant ? (
        <DeFiDepositDashboard proof={proofReceipt} />
      ) : (
        <div className="compliance-banner">
          <h3>Compliance Verification Required</h3>
          <p>Prove eligibility via zero-knowledge proof without disclosing private information.</p>
          <MidnightComplianceGate
            preset="${preset}"
            theme="${theme}"
            onSuccess={(receipt) => {
              console.log("ZK compliance verified on-chain:", receipt.txHash);
            }}
          />
        </div>
      )}
    </div>
  );
}`;
}

/**
 * Generates Compact smart contract cross-contract call snippet
 * @param {object} options
 * @returns {string}
 */
function getCompactSnippet({
  contractAddress = BECH32M_ADDRESS
} = {}) {
  return `// Compact 0.14.0 — Cross-Contract Zero-Knowledge Compliance Call
import { ComplianceGate } from "zk-compliance-gate/gate.compact";

export ledger {
  depositedAmount: Map<Address, Uint<64>>;
}

export circuit depositToRestrictedPool(
  gateContract: ComplianceGate,
  amount: Uint<64>
): [] {
  // 1-LINE COMPLIANCE CHECK:
  // Reads caller's zero-knowledge verification boolean from ComplianceGate ledger
  assert gateContract.getVerificationStatus() : "Caller failed zero-knowledge compliance gate";

  // State update executes only if caller proved eligibility in zero-knowledge
  depositedAmount[caller()] = depositedAmount[caller()] + amount;
}`;
}

/**
 * Generates embeddable iframe widget snippet
 * @param {object} options
 * @returns {string}
 */
function getIframeSnippet({
  contractAddress = BECH32M_ADDRESS,
  preset = 'AGE_18',
  theme = 'midnight-glass',
  baseUrl = 'https://zk-compliance-gate.vercel.app'
} = {}) {
  return `<!-- Midnight ZK-ComplianceGate Embeddable Widget -->
<iframe
  src="${baseUrl}/embed?preset=${preset}&theme=${theme}&contract=${contractAddress}"
  width="440"
  height="580"
  frameborder="0"
  scrolling="no"
  style="border-radius: 16px; border: 1px solid rgba(167, 139, 250, 0.2); box-shadow: 0 8px 32px rgba(124, 58, 237, 0.25);"
  allow="clipboard-write"
  title="Midnight Zero-Knowledge Compliance Gate"
></iframe>`;
}

/**
 * Generates cURL / Node.js RPC query snippet
 * @param {object} options
 * @returns {string}
 */
function getNodeSnippet({
  contractAddress = CONTRACT_ADDRESS
} = {}) {
  return `import { MidnightClient } from '@midnight-ntwrk/midnight-js-node-client';

const client = new MidnightClient({
  indexerUrl: 'https://indexer.testnet.midnight.network/api/v1/graphql',
  network: 'preprod'
});

// Query caller's verification status
const caller = 'mn1q8a9fd3k82m5zcx7012y4vpwle9r7k8e2c5f7a';
const isVerified = await client.contracts.queryLedgerState({
  contractAddress: '${contractAddress}',
  field: 'verifications',
  key: caller
});

console.log(\`Caller \${caller} compliance status:\`, isVerified);`;
}

module.exports = {
  getReactSnippet,
  getCompactSnippet,
  getIframeSnippet,
  getNodeSnippet
};
