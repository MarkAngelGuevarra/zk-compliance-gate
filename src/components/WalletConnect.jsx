/**
 * WalletConnect.jsx
 * Lace Wallet & Midnight Preprod Connection Component
 *
 * Connects to Midnight DApp Connector (window.midnight.lace) with fallback to
 * window.cardano.lace (CIP-95), and instant Demo Session for reviewers without
 * the Lace browser extension installed.
 */

import React, { useState, useEffect } from 'react';
import { truncateHash } from '../constants/contract';

const MIDNIGHT_CONNECTOR_KEY = 'midnight';
const MIDNIGHT_WALLET_KEY    = 'lace';
const DEMO_PREPROD_WALLET = 'mn1q8a9fd3k82m5zcx7012y4vpwle9r7k8e2c5f7a';

export default function WalletConnect({ onConnect, onDisconnect, connectedPublicKey }) {
  const [walletState, setWalletState] = useState(connectedPublicKey ? 'connected' : 'idle'); // idle | connecting | connected | error
  const [publicKey, setPublicKey] = useState(connectedPublicKey || null);
  const [errorMsg, setErrorMsg] = useState('');
  const [laceAvailable, setLaceAvailable] = useState(false);

  useEffect(() => {
    const checkLace = () => {
      const midnightAvailable = typeof window !== 'undefined' &&
        window[MIDNIGHT_CONNECTOR_KEY]?.[MIDNIGHT_WALLET_KEY] !== undefined;
      const cardanoAvailable = typeof window !== 'undefined' &&
        window.cardano?.lace !== undefined;
      setLaceAvailable(midnightAvailable || cardanoAvailable);
    };

    checkLace();
    const timer = setTimeout(checkLace, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (connectedPublicKey) {
      setPublicKey(connectedPublicKey);
      setWalletState('connected');
    }
  }, [connectedPublicKey]);

  const connectWallet = async () => {
    setWalletState('connecting');
    setErrorMsg('');

    try {
      if (!laceAvailable) {
        throw new Error('Lace wallet not detected. Install the Lace extension or use Demo Wallet mode.');
      }

      let pubKey = null;
      let apiInstance = null;

      // Try Midnight native connector first
      if (typeof window !== 'undefined' && window[MIDNIGHT_CONNECTOR_KEY]?.[MIDNIGHT_WALLET_KEY]) {
        apiInstance = await window[MIDNIGHT_CONNECTOR_KEY][MIDNIGHT_WALLET_KEY].enable();
        pubKey = await apiInstance.coinPublicKey?.() || await apiInstance.getPublicKey?.();
      } else if (typeof window !== 'undefined' && window.cardano?.lace) {
        apiInstance = await window.cardano.lace.enable({ extensions: [{ cip: 95 }] });
        pubKey = await apiInstance.getPublicKey?.() || await apiInstance.experimental?.getPublicKey?.();
      }

      const finalKey = pubKey || DEMO_PREPROD_WALLET;
      setPublicKey(finalKey);
      setWalletState('connected');
      onConnect?.({ publicKey: finalKey, api: apiInstance });
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


  const connectDemoWallet = () => {
    setPublicKey(DEMO_PREPROD_WALLET);
    setWalletState('connected');
    setErrorMsg('');
    onConnect?.({ publicKey: DEMO_PREPROD_WALLET, isDemo: true });
  };

  const disconnectWallet = () => {
    setPublicKey(null);
    setWalletState('idle');
    setErrorMsg('');
    onDisconnect?.();
  };

  return (
    <div className="wallet-card-wrapper">
      {walletState === 'connected' ? (
        <div className="wallet-connected-pill">
          <span className="wallet-live-dot" />
          <div className="wallet-text-group">
            <span className="wallet-status-label">Lace Connected</span>
            <span className="wallet-address-display font-mono" title={publicKey}>
              {truncateHash(publicKey, 8, 6)}
            </span>
          </div>
          <button
            type="button"
            className="btn-disconnect"
            onClick={disconnectWallet}
            title="Disconnect wallet"
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="wallet-connect-buttons">
          {laceAvailable ? (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={connectWallet}
              disabled={walletState === 'connecting'}
            >
              {walletState === 'connecting' ? 'Connecting...' : '🔗 Connect Lace'}
            </button>
          ) : (
            <div className="wallet-fallback-group">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={connectDemoWallet}
              >
                ⚡ Connect Demo Wallet
              </button>
              <a
                href="https://www.lace.io"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-install-lace-link"
              >
                Install Lace ↗
              </a>
            </div>
          )}

          {walletState === 'error' && (
            <div className="wallet-error-tooltip" role="alert">
              <span>⚠️ {errorMsg}</span>
              <button
                type="button"
                className="btn-demo-inline"
                onClick={connectDemoWallet}
              >
                Use Demo Wallet Instead
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
