/**
 * LedgerState.jsx
 * Displays the simulated public on-chain ledger state.
 * Shows the ONLY data that is visible on Midnight Preprod —
 * proving that private age NEVER appears in public state.
 */

export default function LedgerState({ result, checkCount }) {
  return (
    <div className="card">
      <p className="card-title">📊 Public Ledger State (On-Chain)</p>

      <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        This is what any observer on the Midnight Preprod network can see:
      </div>

      {/* totalChecks counter */}
      <div className="ledger-row">
        <span className="ledger-key">ledger.totalChecks</span>
        <span className="ledger-val">{checkCount}</span>
      </div>

      {/* verifications map */}
      {result ? (
        <div className="ledger-row">
          <span className="ledger-key">
            ledger.verifications[<span style={{ color: 'var(--accent)' }}>caller</span>]
          </span>
          <span className={`ledger-val ${result.eligible ? 'yes' : 'no'}`}>
            {result.eligible ? 'true ✅' : 'false ❌'}
          </span>
        </div>
      ) : (
        <div className="ledger-row">
          <span className="ledger-key">ledger.verifications[caller]</span>
          <span className="ledger-val" style={{ color: 'var(--text-muted)' }}>— (not verified yet)</span>
        </div>
      )}

      {/* What is NEVER on-chain */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'rgba(245, 158, 11, 0.05)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderRadius: '8px',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
      }}>
        <strong style={{ color: 'var(--warning)' }}>🔒 Never stored on-chain:</strong>{' '}
        <code>private_age</code>, raw credentials, or any identifying data.
        Midnight's ZK circuits ensure these values are consumed locally
        by the prover and discarded after proof generation.
      </div>
    </div>
  );
}
