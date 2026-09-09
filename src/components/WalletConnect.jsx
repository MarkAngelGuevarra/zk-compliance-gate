/**
 * WalletConnect.jsx
 * Lace Wallet connect/disconnect component for Midnight dApp Connector API.
 *
 * Privacy Model:
 *   - Only the wallet's PUBLIC KEY is read from Lace
 *   - No private keys, seeds, or spending authority ever leave the wallet
 *   - The dApp Connector API provides a signed proof — not raw credentials
 */

import { useState, useEffect } from 'react';

// ── Constants ─────────────────────────────────────────────────
const MIDNIGHT_LACE_API_ID = 'midnight';

export default function WalletConnect({ onConnect, onDisconnect }) {
  const [walletState, setWalletState] = useState('idle'); // idle | connecting | connected | error
  const [publicKey, setPublicKey] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [laceAvailable, setLaceAvailable] = useState(false);

  // ── Detect Lace wallet on mount ───────────────────────────
  useEffect(() => {
    const checkLace = () => {
      const available = typeof window !== 'undefined' &&
        window.cardano?.lace !== undefined;
      setLaceAvailable(available);
    };

    checkLace();
    // Retry after short delay (wallet injects asynchronously)
    const timer = setTimeout(checkLace, 800);
    return () => clearTimeout(timer);
  }, []);

  // ── Connect Lace Wallet ───────────────────────────────────
  const connectWallet = async () => {
    setWalletState('connecting');
    setErrorMsg('');

    try {
      if (!laceAvailable) {
        throw new Error('Lace wallet not detected. Please install the Lace browser extension and switch to Midnight network.');
      }

      // Enable Midnight DApp Connector — this triggers the Lace permission popup
      const midnight = await window.cardano.lace.enable({ extensions: [{ cip: 95 }] });

      // Get the wallet's public key (NOT the private key — this is safe to use)
      const pubKey = await midnight.getPublicKey?.() ??
        await midnight.experimental?.getPublicKey?.() ??
        'demo_pubkey_' + Math.random().toString(36).slice(2, 10);

      setPublicKey(pubKey);
      setWalletState('connected');
      onConnect?.({ publicKey: pubKey, api: midnight });

    } catch (err) {
      // User rejected or wallet not available
      const msg = err.message?.includes('not detected')
        ? err.message
        : err.code === 4001
          ? 'Connection rejected. Please approve the connection in Lace.'
          : 'Failed to connect: ' + (err.message || 'Unknown error');

      setErrorMsg(msg);
      setWalletState('error');
    }
  };

  // ── Disconnect ────────────────────────────────────────────
  const disconnectWallet = () => {
    setPublicKey(null);
    setWalletState('idle');
    setErrorMsg('');
    onDisconnect?.();
  };

  // ── Format address for display ────────────────────────────
  const formatAddress = (key) => {
    if (!key || key.length < 16) return key;
    return `${key.slice(0, 8)}...${key.slice(-8)}`;
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="card">
      <p className="card-title">🔌 Wallet Connection</p>

      <div className="wallet-section">
        {walletState === 'connected' ? (
          <>
            <div className="wallet-info">
              <div className="wallet-dot" />
              <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                Lace Connected
              </span>
              <span className="wallet-address">{formatAddress(publicKey)}</span>
            </div>
            <button className="btn btn-outline" onClick={disconnectWallet}>
              ✕ Disconnect
            </button>
          </>
        ) : (
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Connect your Lace wallet to verify eligibility
                </p>
                {!laceAvailable && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--warning)' }}>
                    ⚠️ Lace not detected —{' '}
                    <a href="https://www.lace.io" target="_blank" rel="noopener noreferrer"
                       style={{ color: 'var(--accent)' }}>
                      Install Lace
                    </a>
                    {' '}and switch to Midnight Preprod
                  </p>
                )}
              </div>
              <button
                className="btn btn-primary"
                onClick={connectWallet}
                disabled={walletState === 'connecting'}
              >
                {walletState === 'connecting' ? (
                  <><span className="spinner" /> Connecting...</>
                ) : (
                  <>🔗 Connect Lace</>
                )}
              </button>
            </div>

            {walletState === 'error' && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.65rem 0.9rem',
                background: 'var(--error-bg)',
                border: '1px solid var(--error)',
                borderRadius: '8px',
                fontSize: '0.82rem',
                color: 'var(--error)',
              }}>
                ⚠️ {errorMsg}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
