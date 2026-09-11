/**
 * WalletConnect.jsx
 * Lace Wallet connect/disconnect component for the Midnight DApp Connector API.
 *
 * Privacy Model:
 *   - Only the wallet's COIN PUBLIC KEY is read from Lace (ZswapCoinPublicKey)
 *   - No private keys, seeds, or spending authority ever leave the wallet
 *   - Midnight uses window.midnight.lace — NOT the Cardano CIP-95 connector
 *
 * Midnight DApp Connector reference:
 *   https://docs.midnight.network/develop/tutorial/using-the-midnight-lace-wallet
 */

import { useState, useEffect } from 'react';

// ── Constants ─────────────────────────────────────────────────
// Midnight exposes its own connector at window.midnight.lace
// (distinct from Cardano's window.cardano.lace)
const MIDNIGHT_CONNECTOR_KEY = 'midnight';
const MIDNIGHT_WALLET_KEY    = 'lace';

export default function WalletConnect({ onConnect, onDisconnect }) {
  const [walletState, setWalletState] = useState('idle'); // idle | connecting | connected | error
  const [publicKey, setPublicKey] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [laceAvailable, setLaceAvailable] = useState(false);

  // ── Detect Midnight Lace wallet on mount ─────────────────
  useEffect(() => {
    const checkLace = () => {
      // Midnight DApp Connector injects at window.midnight.lace
      const available = typeof window !== 'undefined' &&
        window[MIDNIGHT_CONNECTOR_KEY]?.[MIDNIGHT_WALLET_KEY] !== undefined;
      setLaceAvailable(available);
    };

    checkLace();
    // Retry after short delay (wallet extension injects asynchronously)
    const timer = setTimeout(checkLace, 1000);
    return () => clearTimeout(timer);
  }, []);

  // ── Connect Midnight Lace Wallet ─────────────────────────
  const connectWallet = async () => {
    setWalletState('connecting');
    setErrorMsg('');

    try {
      if (!laceAvailable) {
        throw new Error(
          'Midnight Lace wallet not detected. ' +
          'Please install Lace and switch to Midnight Testnet (Preprod).'
        );
      }

      // Step 1: Request enable from Midnight DApp Connector
      // This triggers the Lace permission popup for the Midnight connector
      const connector = window[MIDNIGHT_CONNECTOR_KEY][MIDNIGHT_WALLET_KEY];
      const api = await connector.enable();

      // Step 2: Retrieve the Midnight coin public key
      // This is the ZswapCoinPublicKey used as the key in ledger.verifications
      // It is safe to expose — it is the public half of the user's key pair
      const coinPublicKey = await api.coinPublicKey();

      setPublicKey(coinPublicKey);
      setWalletState('connected');
      onConnect?.({ publicKey: coinPublicKey, api });

    } catch (err) {
      const msg = err.message?.includes('not detected')
        ? err.message
        : err.code === 4001 || err.message?.toLowerCase().includes('reject')
          ? 'Connection rejected. Please approve the connection request in Lace.'
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
                    ⚠️ Midnight Lace wallet not detected —{' '}
                    <a href="https://www.lace.io" target="_blank" rel="noopener noreferrer"
                       style={{ color: 'var(--accent)' }}>
                      Install Lace
                    </a>
                    {' '}then switch to{' '}
                    <strong>Midnight Testnet (Preprod)</strong>
                    {' '}in wallet settings.
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
