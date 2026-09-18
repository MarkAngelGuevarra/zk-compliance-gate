/**
 * src/components/MainnetRoadmap.jsx
 *
 * Level 6: Midnight Mainnet Deployment Roadmap (Supermoon)
 * Shows the deployment checklist, Mainnet configuration, and progress toward:
 * - Mainnet deployment of gate.compact
 * - 20 real Mainnet users
 * - 30+ total commits
 *
 * Level 6 Prize: $150 (Supermoon)
 */

import React, { useState } from 'react';

const MAINNET_CONFIG = {
  rpc: 'https://rpc.midnight.network',
  indexer: 'https://indexer.midnight.network/api/v4/graphql',
  explorer: 'https://midnight.network/explorer',
  faucet: null, // No faucet on Mainnet — requires real DUST tokens
  wallet: 'https://www.lace.io', // Lace Wallet with Mainnet configuration
  docs: 'https://docs.midnight.network/develop/tutorial/deploy-first-contract'
};

const MAINNET_CHECKLIST = [
  {
    id: 'wallet',
    icon: '🦭',
    title: 'Configure Lace Wallet for Mainnet',
    description: 'Open Lace → Settings → Networks → Switch to Midnight Mainnet. Fund with real DUST tokens.',
    status: 'pending',
    link: MAINNET_CONFIG.wallet
  },
  {
    id: 'dust',
    icon: '💰',
    title: 'Acquire DUST Tokens',
    description: 'DUST is the native token of Midnight Mainnet (not testnet). Required to pay deployment fees.',
    status: 'pending',
    link: 'https://midnight.network'
  },
  {
    id: 'proof-server',
    icon: '🐳',
    title: 'Run Midnight Proof Server (Docker)',
    description: 'The proof server generates Halo2 proofs locally. Run: docker run -p 6300:6300 midnightntwrk/proof-server:latest',
    status: 'pending',
    link: 'https://docs.midnight.network/develop/tutorial/deploy-first-contract#proof-server'
  },
  {
    id: 'compile',
    icon: '⚙️',
    title: 'Compile with Compact v0.18.0',
    description: 'Artifacts already in managed/gate/ — re-compile for Mainnet if compiler version changes.',
    status: 'ready',
    link: 'https://github.com/MarkAngelGuevarra/zk-compliance-gate/tree/main/managed/gate'
  },
  {
    id: 'deploy',
    icon: '🚀',
    title: 'Deploy gate.compact to Midnight Mainnet',
    description: 'Run: node src/deploy.js --network mainnet — saves contract address to managed/gate/mainnet-deployed.json',
    status: 'pending',
    link: null
  },
  {
    id: 'update-ui',
    icon: '🌐',
    title: 'Update Frontend to Mainnet Address',
    description: 'Update src/constants/contract.js with Mainnet contract address and push to GitHub (triggers Vercel deploy)',
    status: 'pending',
    link: null
  },
  {
    id: 'recruit-users',
    icon: '👥',
    title: 'Recruit 20 Mainnet Users',
    description: 'Share the live demo link. Each user who runs verifyEligibility() on Mainnet counts toward the 20-user goal.',
    status: 'pending',
    link: 'https://zk-compliance-gate.vercel.app'
  }
];

const STATUS_STYLES = {
  ready: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', color: '#10b981', label: '✅ Ready' },
  done: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', color: '#10b981', label: '✅ Done' },
  pending: { bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.2)', color: '#f87171', label: '⏳ Pending' },
  inprogress: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', color: '#f59e0b', label: '🔄 In Progress' }
};

export default function MainnetRoadmap({ commitCount = 26 }) {
  const [checklist, setChecklist] = useState(MAINNET_CHECKLIST);

  const toggleItem = (id) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'done' ? 'pending' : 'done' }
          : item
      )
    );
  };

  const doneCount = checklist.filter(i => i.status === 'done' || i.status === 'ready').length;
  const progressPct = Math.round((doneCount / checklist.length) * 100);
  const commitsNeeded = Math.max(0, 30 - commitCount);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(124,58,237,0.1) 100%)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌟</div>
        <h2 style={{ color: '#fcd34d', fontSize: '1.8rem', margin: '0 0 0.5rem' }}>
          Level 6 — Supermoon
        </h2>
        <p style={{ color: '#fbbf24', margin: '0 0 0.5rem', fontSize: '1rem' }}>
          Deploy ZK-ComplianceGate to <strong>Midnight Mainnet</strong> and onboard 20 real users
        </p>
        <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>
          Prize: <strong style={{ color: '#fcd34d' }}>$150</strong> · Requires: Mainnet deploy + 20 users + 30 commits
        </p>
      </div>

      {/* Progress Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Checklist', value: `${doneCount}/${checklist.length}`, pct: progressPct, color: '#7c3aed', icon: '📋' },
          { label: 'Commits', value: `${commitCount}/30`, pct: Math.min(Math.round((commitCount / 30) * 100), 100), color: '#10b981', icon: '📦', suffix: commitsNeeded > 0 ? `(${commitsNeeded} more needed)` : '✅ Done!' },
          { label: 'Mainnet Users', value: '0/20', pct: 0, color: '#f59e0b', icon: '👥', suffix: 'Pending deployment' }
        ].map(({ label, value, pct, color, icon, suffix }) => (
          <div key={label} style={{
            background: 'rgba(15,15,30,0.6)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: '12px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{icon}</div>
            <div style={{ color: color, fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.25rem' }}>{value}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{label}</div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '50px', height: '6px', overflow: 'hidden' }}>
              <div style={{ background: color, borderRadius: '50px', height: '100%', width: `${pct}%`, transition: 'width 0.5s' }} />
            </div>
            {suffix && <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '0.4rem' }}>{suffix}</div>}
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Deployment Checklist */}
        <div style={{
          background: 'rgba(15,15,30,0.6)',
          border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <h3 style={{ color: '#e9d5ff', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🚀</span> Mainnet Deployment Checklist
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {checklist.map(item => {
              const s = STATUS_STYLES[item.status] || STATUS_STYLES.pending;
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '24px', height: '24px',
                    borderRadius: '50%',
                    border: `2px solid ${s.color}`,
                    background: (item.status === 'done' || item.status === 'ready') ? s.color : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: '1px',
                    fontSize: '0.75rem', color: '#fff', fontWeight: 700
                  }}>
                    {(item.status === 'done' || item.status === 'ready') ? '✓' : ''}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span>{item.icon}</span>
                      <strong style={{ color: s.color, fontSize: '0.85rem' }}>{item.title}</strong>
                      <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: s.color, fontWeight: 600 }}>{s.label}</span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.77rem', margin: '0 0 0.25rem', lineHeight: 1.4 }}>{item.description}</p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ color: '#a78bfa', fontSize: '0.73rem' }}
                      >
                        View Guide ↗
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Mainnet config + commit tracker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Commit Tracker */}
          <div style={{
            background: 'rgba(15,15,30,0.6)',
            border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <h3 style={{ color: '#e9d5ff', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📦</span> Commit Progress (30 required)
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ color: '#10b981', fontSize: '2rem', fontWeight: 800 }}>{commitCount}</div>
              <div>
                <div style={{ color: '#e9d5ff', fontSize: '0.9rem' }}>commits on main</div>
                <div style={{ color: commitsNeeded > 0 ? '#f59e0b' : '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                  {commitsNeeded > 0 ? `${commitsNeeded} more needed for Level 6` : '✅ Commit requirement met!'}
                </div>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '50px', height: '10px', overflow: 'hidden' }}>
              <div style={{
                background: commitCount >= 30 ? '#10b981' : 'linear-gradient(90deg, #7c3aed, #f59e0b)',
                borderRadius: '50px', height: '100%',
                width: `${Math.min(Math.round((commitCount / 30) * 100), 100)}%`,
                transition: 'width 0.5s'
              }} />
            </div>
            <a
              href="https://github.com/MarkAngelGuevarra/zk-compliance-gate/commits/main"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#a78bfa', fontSize: '0.78rem', display: 'block', marginTop: '0.6rem' }}
            >
              View all commits on GitHub ↗
            </a>
          </div>

          {/* Mainnet Config */}
          <div style={{
            background: 'rgba(15,15,30,0.6)',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <h3 style={{ color: '#e9d5ff', margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🌟</span> Mainnet Network Config
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { label: 'Network', value: 'Midnight Mainnet' },
                { label: 'RPC', value: MAINNET_CONFIG.rpc },
                { label: 'Indexer', value: MAINNET_CONFIG.indexer.slice(0, 40) + '...' },
                { label: 'Explorer', value: MAINNET_CONFIG.explorer },
                { label: 'Proof Server', value: 'localhost:6300 (Docker)' },
                { label: 'Compiler', value: 'compactc v0.18.0' }
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '0.35rem 0.55rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '6px', gap: '0.5rem'
                }}>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', flexShrink: 0 }}>{label}</span>
                  <code style={{ color: '#fcd34d', fontSize: '0.73rem', textAlign: 'right', wordBreak: 'break-all' }}>{value}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Deploy command */}
          <div style={{
            background: 'rgba(15,15,30,0.6)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: '12px',
            padding: '1.25rem'
          }}>
            <h3 style={{ color: '#e9d5ff', margin: '0 0 0.75rem', fontSize: '0.95rem' }}>
              🖥️ Mainnet Deploy Command
            </h3>
            <pre style={{
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#10b981',
              fontSize: '0.78rem',
              margin: 0,
              overflowX: 'auto',
              lineHeight: 1.6
            }}>
{`# Step 1: Ensure proof server is running
docker run -p 6300:6300 \\
  midnightntwrk/proof-server:latest

# Step 2: Deploy to Midnight Mainnet
node src/deploy.js --network mainnet

# Step 3: Contract address will be output
# → Saves to managed/gate/mainnet-deployed.json`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
