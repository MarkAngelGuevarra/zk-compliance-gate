/**
 * pages/index.js — ZK Compliance Gate Main Page
 * Root-level entry for Vercel/Next.js deployment
 *
 * Level 2 (Waxing Crescent) Submission:
 *   ✅ Lace wallet connect/disconnect
 *   ✅ Circuit called from frontend (verifyEligibility)
 *   ✅ Privacy behavior demonstrated (result shows boolean, not age)
 *   ✅ Public/Private ledger state display
 */

import { useState } from 'react';
import Head from 'next/head';
import WalletConnect from '../components/WalletConnect';
import EligibilityForm from '../components/EligibilityForm';
import ResultCard from '../components/ResultCard';
import LedgerState from '../components/LedgerState';


export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [result, setResult] = useState(null);
  const [checkCount, setCheckCount] = useState(0);

  const handleConnect = (walletData) => { setWallet(walletData); setResult(null); };
  const handleDisconnect = () => { setWallet(null); setResult(null); };
  const handleResult = (res) => {
    setResult(res);
    if (res?.eligible) setCheckCount(c => c + 1);
  };

  return (
    <>
      <Head>
        <title>ZK Compliance Gate — Midnight Network</title>
        <meta name="description" content="Zero-knowledge age eligibility verification on Midnight Network. Prove you meet a threshold without revealing your age." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="container">

        {/* ── Header ───────────────────────────────────── */}
        <div className="header">
          <span className="moon">🌙</span>
          <h1>ZK Compliance Gate</h1>
          <p>Prove eligibility on Midnight Network — without revealing your age</p>
        </div>

        {/* ── Privacy Banner ───────────────────────────── */}
        <div className="privacy-banner">
          <span className="icon">🔐</span>
          <p>
            <strong>How privacy works here:</strong> Your age is a{' '}
            <strong>private witness</strong> — it stays inside the ZK circuit on your device.
            The blockchain only records <strong>true</strong> or <strong>false</strong>.
            An observer can verify you passed the check, but learns nothing about your actual age.
          </p>
        </div>

        {/* ── Wallet ───────────────────────────────────── */}
        <WalletConnect onConnect={handleConnect} onDisconnect={handleDisconnect} />

        {/* ── Result ───────────────────────────────────── */}
        {result && <ResultCard result={result} />}

        {/* ── Form ─────────────────────────────────────── */}
        <EligibilityForm walletPublicKey={wallet?.publicKey} onResult={handleResult} />

        {/* ── Ledger State ─────────────────────────────── */}
        <LedgerState result={result} checkCount={checkCount} />

        {/* ── Privacy Model ────────────────────────────── */}
        <div className="card">
          <p className="card-title">📖 Privacy Model — What Observers Can & Cannot Learn</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

            <div style={{ padding: '0.9rem', background: 'var(--success-bg)', border: '1px solid var(--success)', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.5rem' }}>🌐 PUBLIC (On-Chain)</p>
              {['Caller\'s Midnight address', 'Result: eligible (true/false)', 'Threshold used (e.g. 18)', 'Block timestamp', 'Total verification count'].map(i => (
                <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.15rem 0' }}>✓ {i}</div>
              ))}
            </div>

            <div style={{ padding: '0.9rem', background: 'var(--error-bg)', border: '1px solid var(--error)', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--error)', marginBottom: '0.5rem' }}>🔒 PRIVATE (ZK Circuit Only)</p>
              {['Actual age value', 'Any number > threshold', 'Any number < threshold', 'Identity information', 'Raw credential data'].map(i => (
                <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0.15rem 0' }}>✕ {i}</div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Footer ───────────────────────────────────── */}
        <footer className="footer">
          <p>Built for <a href="https://midnight.network" target="_blank" rel="noopener noreferrer">Midnight Network</a> · New Moon to Full: Monthly Moonshots on Midnight</p>
          <p style={{ marginTop: '0.4rem' }}>
            <a href="https://github.com/MarkAngelGuevarra/zk-compliance-gate" target="_blank" rel="noopener noreferrer">View on GitHub</a>
            {' · '}
            <a href="https://explorer.testnet.midnight.network" target="_blank" rel="noopener noreferrer">Midnight Explorer</a>
          </p>
        </footer>

      </main>
    </>
  );
}
