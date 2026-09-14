/**
 * AuditTrail.jsx
 * Cryptographic Audit Trail & ZK Constraint Verifier Inspection Panel
 * Displays circuit constraint parameters, verification keys (VK), formal guarantees, and interactive proof validation.
 */

import React, { useState } from 'react';
import {
  ZK_CIRCUIT_SPECS,
  FORMAL_PRIVACY_GUARANTEES,
  verifyProofTranscript
} from '../lib/auditVerifier';
import { CONTRACT_ADDRESS, BECH32M_ADDRESS } from '../constants/contract';

export default function AuditTrail({ latestReceipt }) {
  const [verificationReport, setVerificationReport] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Fallback sample receipt if no verification performed yet in current session
  const activeReceipt = latestReceipt || {
    id: 'rcpt_sample_canonical_01',
    timestamp: new Date().toISOString(),
    blockHeight: 142857,
    txHash: '0x3e689b77c96d1ecbb6f4ae10e9c72eb10b68cf0cc7d082f34dc4207609973cfc',
    proofHash: '0x9a8f23b7e41c6d852a10e8f3b29c7d4102e5b8719f3a2c6d4e8b01a75c3f912e',
    caller: 'mn1q8a9fd3k82m5zcx7012y4vpwle9r7k8e2c5f7a',
    verificationKey: 'vk_midnight_preprod_gate_v1_0_compact_8f29e1',
    publicState: {
      eligible: true,
      status: 'PASS',
      discloseCall: 'disclose(true)',
      thresholdEnforced: '18'
    },
    privateShield: {
      redactedWitness: '[SHIELDED: 0x8f2ac7b1...halo2-vector]',
      leakageRate: '0 bytes transmitted to RPC or Indexer'
    }
  };

  const handleRunAudit = async () => {
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 600)); // Short simulation delay
    const report = verifyProofTranscript(activeReceipt);
    setVerificationReport(report);
    setIsVerifying(false);
  };

  return (
    <div className="audit-trail-container" id="tab-panel-audit" role="tabpanel">
      {/* Header Info */}
      <div className="card audit-intro-card">
        <div className="card-header-row">
          <div>
            <span className="section-category-tag">Midnight Formal Verification</span>
            <h2 className="card-heading">ZK Constraint &amp; Cryptographic Audit Trail</h2>
            <p className="card-subheading">
              Technical inspection suite for compliance officers, security auditors, and protocol risk committees.
            </p>
          </div>
          <span className="halo2-seal-pill">Verified Halo2 / Compact 0.14</span>
        </div>

        {/* Circuit Specifications Table */}
        <div className="specs-table-wrapper">
          <table className="specs-table">
            <thead>
              <tr>
                <th>Constraint Parameter</th>
                <th>Cryptographic Specification</th>
                <th>Formal Description</th>
              </tr>
            </thead>
            <tbody>
              {ZK_CIRCUIT_SPECS.map((spec, idx) => (
                <tr key={idx}>
                  <td className="spec-name font-semibold">{spec.parameter}</td>
                  <td>
                    <code className="spec-val font-mono">{spec.value}</code>
                  </td>
                  <td className="spec-desc text-muted">{spec.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Cryptographic Proof Verifier */}
      <div className="card proof-verifier-card">
        <div className="verifier-header">
          <div>
            <h3 className="card-heading">Interactive Proof Verifier</h3>
            <p className="card-subheading">
              Validate proof polynomial commitments against the Midnight SRS verification key.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-run-verifier"
            onClick={handleRunAudit}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <span>⚙️ Verifying Transcript...</span>
            ) : (
              <span>🔍 Run Cryptographic Audit</span>
            )}
          </button>
        </div>

        <div className="verifier-transcript-box">
          <div className="transcript-meta-row">
            <span className="transcript-label">Active Audit Subject:</span>
            <span className="transcript-id font-mono">{activeReceipt.id}</span>
            <span className="transcript-tx font-mono">Tx: {activeReceipt.txHash.slice(0, 10)}...</span>
          </div>

          <div className="transcript-code-view font-mono">
            <div><strong>Verification Key:</strong> {activeReceipt.verificationKey}</div>
            <div><strong>Proof Digest:</strong> {activeReceipt.proofHash}</div>
            <div><strong>Disclosed Consensus Output:</strong> {activeReceipt.publicState?.discloseCall}</div>
            <div><strong>Shielded Invariant:</strong> {activeReceipt.privateShield?.redactedWitness}</div>
          </div>
        </div>

        {verificationReport && (
          <div className="audit-results-panel" role="region" aria-label="Audit Results">
            <div className={`audit-verdict-banner ${verificationReport.isValid ? 'verdict-pass' : 'verdict-fail'}`}>
              <span className="verdict-icon">{verificationReport.isValid ? '🛡️' : '⚠️'}</span>
              <div>
                <h4 className="verdict-title">{verificationReport.verdict}</h4>
                <p className="verdict-time">Audit executed: {new Date(verificationReport.timestamp).toUTCString()}</p>
              </div>
            </div>

            <div className="audit-checklist">
              {verificationReport.checks.map((chk) => (
                <div key={chk.id} className="audit-check-item">
                  <span className={`check-icon ${chk.passed ? 'check-passed' : 'check-failed'}`}>
                    {chk.passed ? '✓' : '✗'}
                  </span>
                  <div className="check-details">
                    <div className="check-title-row">
                      <span className="check-title">{chk.title}</span>
                      <span className="check-status-tag">{chk.passed ? 'PASSED' : 'FAILED'}</span>
                    </div>
                    <p className="check-detail-text">{chk.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Formal Privacy Guarantees Grid */}
      <div className="card formal-guarantees-card">
        <h3 className="card-heading">Formal Privacy &amp; Cryptographic Soundness Guarantees</h3>
        <p className="card-subheading">
          Midnight Network guarantees mathematical non-repudiation and zero-knowledge preservation.
        </p>

        <div className="guarantees-grid">
          {FORMAL_PRIVACY_GUARANTEES.map((g, idx) => (
            <div key={idx} className="guarantee-box">
              <div className="guarantee-top">
                <h4 className="guarantee-title">{g.title}</h4>
                <code className="guarantee-symbol font-mono">{g.symbol}</code>
              </div>
              <p className="guarantee-desc">{g.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
