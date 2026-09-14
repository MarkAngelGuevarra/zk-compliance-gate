/**
 * LedgerExplorer.jsx
 * On-Chain Simulated Block Explorer for Midnight Preprod
 * Displays ledger.totalChecks, ledger.verifications[caller], block telemetry, and address search.
 */

import React, { useState } from 'react';
import {
  CONTRACT_ADDRESS,
  BECH32M_ADDRESS,
  DEPLOY_TX_HASH,
  EXPLORER_URL,
  truncateHash,
  getExplorerUrl
} from '../constants/contract';
import { lookupAddress } from '../lib/ledger';

export default function LedgerExplorer({ ledgerState, connectedWalletAddress }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [copiedContract, setCopiedContract] = useState(false);

  const totalChecks = ledgerState ? ledgerState.totalChecks : 1482;
  const blockHeight = ledgerState ? ledgerState.blockHeight : 142857;
  const transactions = ledgerState?.recentTransactions || [];

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResult(null);
      return;
    }
    const res = lookupAddress(ledgerState, searchQuery.trim());
    setSearchResult(res);
  };

  const handleQuickSearch = (addr) => {
    setSearchQuery(addr);
    const res = lookupAddress(ledgerState, addr);
    setSearchResult(res);
  };

  const handleCopyContract = (text) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    } catch {
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2000);
    }
  };

  return (
    <div className="ledger-explorer-container" id="tab-panel-ledger" role="tabpanel">
      {/* Contract & Network Telemetry Card */}
      <div className="card ledger-header-card">
        <div className="ledger-header-top">
          <div>
            <div className="contract-title-row">
              <span className="contract-type-pill">Midnight Preprod Smart Contract</span>
              <span className="contract-status-pill">● Synced &amp; Active</span>
            </div>
            <h2 className="contract-main-title">ZK-ComplianceGate Canonical Ledger</h2>
          </div>

          <div className="ledger-header-actions">
            <a
              href={EXPLORER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary"
            >
              <span>Midnight Explorer</span>
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </div>

        {/* Addresses & Hashes Display */}
        <div className="contract-address-box">
          <div className="address-row">
            <span className="address-label">Hex Contract Address (64-char):</span>
            <code className="address-code font-mono">{CONTRACT_ADDRESS}</code>
            <button
              type="button"
              className="btn-copy-mini"
              onClick={() => handleCopyContract(CONTRACT_ADDRESS)}
              title="Copy hex address"
            >
              {copiedContract ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <div className="address-row">
            <span className="address-label">Bech32m Testnet Address:</span>
            <code className="address-code font-mono">{BECH32M_ADDRESS}</code>
            <button
              type="button"
              className="btn-copy-mini"
              onClick={() => handleCopyContract(BECH32M_ADDRESS)}
              title="Copy Bech32m address"
            >
              Copy
            </button>
          </div>

          <div className="address-row">
            <span className="address-label">Deployment Tx Hash:</span>
            <a
              href={getExplorerUrl('tx', DEPLOY_TX_HASH)}
              target="_blank"
              rel="noopener noreferrer"
              className="address-link font-mono"
            >
              {DEPLOY_TX_HASH} ↗
            </a>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="ledger-metrics-strip">
          <div className="ledger-metric">
            <span className="metric-label">Total Verification Calls</span>
            <span className="metric-val font-mono">{totalChecks.toLocaleString()}</span>
            <span className="metric-sub">ledger.totalChecks</span>
          </div>

          <div className="ledger-metric">
            <span className="metric-label">Testnet Block Height</span>
            <span className="metric-val font-mono">#{blockHeight.toLocaleString()}</span>
            <span className="metric-sub">Midnight Preprod</span>
          </div>

          <div className="ledger-metric">
            <span className="metric-label">Proof System Scheme</span>
            <span className="metric-val">Halo2 / Compact</span>
            <span className="metric-sub">0.14.0 Pragma</span>
          </div>

          <div className="ledger-metric">
            <span className="metric-label">Disclosed Privacy Level</span>
            <span className="metric-val text-success">Zero-Knowledge</span>
            <span className="metric-sub">100% Shielded Witness</span>
          </div>
        </div>
      </div>

      {/* Address Search & Caller Verification Lookup */}
      <div className="card ledger-search-card">
        <h3 className="card-heading">On-Chain Caller Lookup (`ledger.verifications[caller]`)</h3>
        <p className="card-subheading">
          Verify if an address has passed the zero-knowledge compliance gate on Midnight Preprod.
        </p>

        <form onSubmit={handleSearch} className="search-form-row">
          <input
            type="text"
            className="form-input search-input"
            placeholder="Enter Midnight address (e.g. mn1q8a9f... or 0x...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary search-btn">
            🔍 Query Ledger
          </button>
        </form>

        <div className="quick-tags-row">
          <span className="quick-tags-label">Quick test callers:</span>
          {connectedWalletAddress && (
            <button
              type="button"
              className="quick-tag-btn"
              onClick={() => handleQuickSearch(connectedWalletAddress)}
            >
              My Connected Wallet
            </button>
          )}
          <button
            type="button"
            className="quick-tag-btn"
            onClick={() => handleQuickSearch('mn1q8a9fd3k82m5zcx7012y4vpwle9r7k8e2c5f7a')}
          >
            Institutional Caller (18+)
          </button>
          <button
            type="button"
            className="quick-tag-btn"
            onClick={() => handleQuickSearch('mn1q4b2c8e9f1a3d5b7c9e0f2a4b6d8e0f2a4b6d')}
          >
            Accredited Pool Verifier
          </button>
          <button
            type="button"
            className="quick-tag-btn"
            onClick={() => handleQuickSearch('mn1q7c9e1f3a5b7d9e1f3a5b7c9e1f3a5b7c9e1f')}
          >
            Failed / Inactive Caller
          </button>
        </div>

        {searchResult && (
          <div className="search-result-panel">
            <div className="result-header">
              <span className="result-title">Ledger Query Result</span>
              <span className={`result-badge ${searchResult.isVerified ? 'badge-verified' : 'badge-unverified'}`}>
                {searchResult.status}
              </span>
            </div>

            <div className="result-grid">
              <div className="result-item">
                <span className="result-key">Caller Address:</span>
                <code className="result-code font-mono">{searchResult.address}</code>
              </div>

              <div className="result-item">
                <span className="result-key">Verification Status:</span>
                <span className={`result-val font-mono ${searchResult.isVerified ? 'text-success' : 'text-danger'}`}>
                  ledger.verifications[caller] = {String(searchResult.isVerified)}
                </span>
              </div>

              <div className="result-item">
                <span className="result-key">Last Block Number:</span>
                <span className="result-val font-mono">
                  {searchResult.lastBlock ? `#${searchResult.lastBlock.toLocaleString()}` : 'None'}
                </span>
              </div>

              <div className="result-item">
                <span className="result-key">Compliance Predicate:</span>
                <span className="result-val">{searchResult.predicate}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Block Transaction Stream */}
      <div className="card ledger-tx-table-card">
        <div className="table-header-row">
          <div>
            <h3 className="card-heading">Recent On-Chain Verification Feed</h3>
            <p className="card-subheading">
              Live event stream of zero-knowledge compliance commitments finalized on Midnight Preprod.
            </p>
          </div>
          <span className="live-counter-pill">
            {transactions.length} Transactions Logged
          </span>
        </div>

        <div className="table-responsive-wrapper">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Tx Hash</th>
                <th>Block</th>
                <th>Caller Address</th>
                <th>Compliance Rule</th>
                <th>Public State</th>
                <th>Private Input</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={`${tx.txHash}-${idx}`}>
                  <td>
                    <a
                      href={getExplorerUrl('tx', tx.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="table-link font-mono"
                      title={tx.txHash}
                    >
                      {truncateHash(tx.txHash, 6, 4)} ↗
                    </a>
                  </td>
                  <td className="font-mono">#{tx.blockNumber.toLocaleString()}</td>
                  <td>
                    <span className="font-mono" title={tx.caller}>
                      {truncateHash(tx.caller, 6, 4)}
                    </span>
                  </td>
                  <td>{tx.predicate}</td>
                  <td>
                    <span className={`pill-boolean ${tx.outcome ? 'pill-true' : 'pill-false'}`}>
                      {tx.outcome ? 'true (PASS)' : 'false (FAIL)'}
                    </span>
                  </td>
                  <td>
                    <span className="pill-shielded">
                      🔒 [SHIELDED]
                    </span>
                  </td>
                  <td>
                    <span className="pill-status-finalized">
                      ● Finalized
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
