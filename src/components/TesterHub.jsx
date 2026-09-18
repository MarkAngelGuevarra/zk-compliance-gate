/**
 * src/components/TesterHub.jsx
 *
 * Level 5: User Recruitment & Tester Community Hub
 * Invites community members to become Preprod testers for ZK-ComplianceGate.
 * Tracks participation and guides users through the Lace Wallet + Midnight Preprod setup.
 *
 * Level 5 Goal: 50 verified on-chain Preprod users
 */

import React, { useState } from 'react';
import { CONTRACT_ADDRESS, RPC_ENDPOINT, INDEXER_ENDPOINT } from '../constants/contract';

const TESTER_STEPS = [
  {
    id: 1,
    icon: '🦭',
    title: 'Install Lace Wallet',
    description: 'Lace is the official Midnight-compatible wallet. Install the browser extension.',
    action: 'Install Lace',
    link: 'https://www.lace.io',
    done: false
  },
  {
    id: 2,
    icon: '🌙',
    title: 'Configure Midnight Preprod',
    description: 'Open Lace → Settings → Networks → Enable Midnight Preprod. Your wallet address starts with mn1q...',
    action: 'View Guide',
    link: 'https://docs.midnight.network/develop/tutorial/using-the-lace-wallet-extension',
    done: false
  },
  {
    id: 3,
    icon: '💧',
    title: 'Get tDUST Testnet Tokens',
    description: 'Visit the Midnight Preprod faucet and paste your Lace wallet address to receive free test tokens.',
    action: 'Open Faucet',
    link: 'https://faucet.preprod.midnight.network',
    done: false
  },
  {
    id: 4,
    icon: '🛡️',
    title: 'Run ZK Eligibility Proof',
    description: 'Visit the Compliance Gate tab, connect your Lace wallet, and run a verification. This creates a real on-chain ZK proof!',
    action: 'Go to Gate',
    link: '#gate',
    done: false
  },
  {
    id: 5,
    icon: '✅',
    title: 'You\'re On-Chain!',
    description: 'Your ZswapCoinPublicKey is now in the public ledger. The Midnight Indexer records your verification as a Preprod user.',
    action: null,
    link: null,
    done: false
  }
];

const SHARE_TEXT = `🌙 I just ran a real ZK proof on Midnight Preprod!

ZK-ComplianceGate lets you prove regulatory compliance (18+, KYC, investor accreditation) WITHOUT revealing your private data.

Zero-Knowledge. On-chain. Private.

Try it: https://zk-compliance-gate.vercel.app/
Contract: ${CONTRACT_ADDRESS.slice(0, 10)}...${CONTRACT_ADDRESS.slice(-8)}

#MidnightNetwork #ZeroKnowledge #Web3Privacy @ZKComplianceGate`;

export default function TesterHub({ ledgerState, onSwitchTab }) {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [copySuccess, setCopySuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleStep = (id) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_TEXT);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch {
      // Fallback for non-secure contexts
    }
  };

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const progressPercent = Math.round((completedSteps.size / TESTER_STEPS.length) * 100);
  const totalUsers = ledgerState?.totalChecks ?? 0;

  return (
    <div className="tester-hub-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(16,185,129,0.1) 100%)',
        border: '1px solid rgba(124,58,237,0.4)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌕</div>
        <h2 style={{ color: '#e9d5ff', fontSize: '1.8rem', margin: '0 0 0.5rem' }}>
          Level 5 — Full Moon
        </h2>
        <p style={{ color: '#a78bfa', margin: '0 0 1.5rem', fontSize: '1.05rem' }}>
          Help us reach <strong style={{ color: '#10b981' }}>50 verified Preprod users</strong> on Midnight Network.
          Join as a tester — run a real ZK proof in 5 minutes.
        </p>

        {/* Progress Bar */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50px', height: '12px', margin: '0 auto', maxWidth: '400px', marginBottom: '0.5rem' }}>
          <div style={{
            background: 'linear-gradient(90deg, #7c3aed, #10b981)',
            borderRadius: '50px',
            height: '100%',
            width: `${Math.min((totalUsers / 50) * 100, 100)}%`,
            transition: 'width 0.5s ease'
          }} />
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>
          <strong style={{ color: '#10b981' }}>{totalUsers}</strong> / 50 verified Preprod users
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Left: 5-step guide */}
        <div style={{
          background: 'rgba(15,15,30,0.6)',
          border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <h3 style={{ color: '#e9d5ff', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🚀</span> Become a Preprod Tester
          </h3>

          {/* Progress */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Your progress</span>
              <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>{progressPercent}%</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '50px', height: '6px' }}>
              <div style={{
                background: '#10b981',
                borderRadius: '50px',
                height: '100%',
                width: `${progressPercent}%`,
                transition: 'width 0.3s'
              }} />
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {TESTER_STEPS.map(step => (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: completedSteps.has(step.id) ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${completedSteps.has(step.id) ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.15)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '50%',
                  border: `2px solid ${completedSteps.has(step.id) ? '#10b981' : 'rgba(124,58,237,0.5)'}`,
                  background: completedSteps.has(step.id) ? '#10b981' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: '2px', fontSize: '0.7rem', color: '#fff'
                }}>
                  {completedSteps.has(step.id) ? '✓' : step.id}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <span>{step.icon}</span>
                    <strong style={{ color: completedSteps.has(step.id) ? '#10b981' : '#e9d5ff', fontSize: '0.9rem' }}>
                      {step.title}
                    </strong>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0 0 0.4rem' }}>{step.description}</p>
                  {step.link && (
                    <a
                      href={step.link}
                      target={step.link.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ color: '#a78bfa', fontSize: '0.78rem', textDecoration: 'underline' }}
                    >
                      {step.action} ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSwitchTab?.('gate')}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #7c3aed, #10b981)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            🛡️ Go to Compliance Gate →
          </button>
        </div>

        {/* Right: Share + Community Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Share Card */}
          <div style={{
            background: 'rgba(15,15,30,0.6)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h3 style={{ color: '#e9d5ff', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📢</span> Invite More Testers
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Share with the Midnight Discord or X community to recruit Preprod testers for Level 5.
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '8px',
              padding: '0.75rem',
              fontFamily: 'monospace',
              fontSize: '0.78rem',
              color: '#c4b5fd',
              marginBottom: '0.75rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {SHARE_TEXT}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleCopyShare}
                style={{
                  flex: 1, padding: '0.5rem',
                  background: copySuccess ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)',
                  border: `1px solid ${copySuccess ? '#10b981' : 'rgba(124,58,237,0.4)'}`,
                  borderRadius: '6px', color: copySuccess ? '#10b981' : '#a78bfa',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                }}
              >
                {copySuccess ? '✓ Copied!' : '📋 Copy Text'}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, padding: '0.5rem',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px', color: '#94a3b8',
                  textDecoration: 'none', fontSize: '0.8rem',
                  fontWeight: 600, textAlign: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'
                }}
              >
                𝕏 Post to X
              </a>
            </div>
          </div>

          {/* Network Config Card */}
          <div style={{
            background: 'rgba(15,15,30,0.6)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h3 style={{ color: '#e9d5ff', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚙️</span> Preprod Network Config
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Network', value: 'Midnight Preprod' },
                { label: 'RPC', value: RPC_ENDPOINT },
                { label: 'Indexer', value: INDEXER_ENDPOINT.slice(0, 45) + '...' },
                { label: 'Contract', value: CONTRACT_ADDRESS.slice(0, 12) + '...' + CONTRACT_ADDRESS.slice(-8) },
                { label: 'Faucet', value: 'faucet.preprod.midnight.network' }
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '0.4rem 0.6rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '6px', gap: '0.5rem'
                }}>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', flexShrink: 0 }}>{label}</span>
                  <code style={{ color: '#c4b5fd', fontSize: '0.75rem', textAlign: 'right', wordBreak: 'break-all' }}>{value}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
