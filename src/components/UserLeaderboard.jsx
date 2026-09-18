/**
 * src/components/UserLeaderboard.jsx
 *
 * Level 5: On-Chain User Activity Leaderboard
 * Displays recent Preprod verifications fetched from the Midnight Indexer v4 API.
 * Shows progress toward 50-user goal for Level 5 Full Moon.
 */

import React, { useState, useEffect } from 'react';
import { CONTRACT_ADDRESS, BLOCK_HEIGHT } from '../constants/contract';

// Demo data — replaced by live Indexer data when available
const DEMO_VERIFICATIONS = [
  { address: 'mn1q...8f9a', shortKey: '0a2f1c...e01234', circuit: 'verifyEligibility', blockHeight: 158432, timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), eligible: true },
  { address: 'mn1q...2c4e', shortKey: 'b3d5f7...a09c12', circuit: 'verifyEligibility', blockHeight: 158429, timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), eligible: true },
  { address: 'mn1q...7b3f', shortKey: 'f1e3d5...c07a89', circuit: 'verifyEligibility', blockHeight: 158426, timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(), eligible: true },
  { address: 'mn1q...1a5c', shortKey: '9c8b7a...605d43', circuit: 'revokeVerification', blockHeight: 158421, timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), eligible: false },
  { address: 'mn1q...3d7e', shortKey: '4e5f6a...b2c3d4', circuit: 'verifyEligibility', blockHeight: 158415, timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), eligible: true }
];

function formatRelativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function UserRow({ entry, index }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '32px 1fr 120px 80px 80px',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.6rem 0.75rem',
      borderRadius: '8px',
      background: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
      borderBottom: '1px solid rgba(255,255,255,0.04)'
    }}>
      <div style={{
        width: '28px', height: '28px',
        borderRadius: '50%',
        background: index < 3 ? 'linear-gradient(135deg, #7c3aed, #10b981)' : 'rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: index < 3 ? '#fff' : '#64748b',
        fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
      }}>
        {index + 1}
      </div>
      <div>
        <code style={{ color: '#c4b5fd', fontSize: '0.8rem' }}>{entry.shortKey}</code>
        <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{entry.address}</div>
      </div>
      <div>
        <span style={{
          padding: '0.2rem 0.5rem',
          borderRadius: '12px',
          fontSize: '0.72rem',
          background: entry.circuit === 'verifyEligibility' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          color: entry.circuit === 'verifyEligibility' ? '#10b981' : '#ef4444',
          fontWeight: 600
        }}>
          {entry.circuit === 'verifyEligibility' ? '✓ Verified' : '✗ Revoked'}
        </span>
      </div>
      <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontFamily: 'monospace' }}>
        #{entry.blockHeight.toLocaleString()}
      </div>
      <div style={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'right' }}>
        {formatRelativeTime(entry.timestamp)}
      </div>
    </div>
  );
}

export default function UserLeaderboard({ ledgerState }) {
  const [verifications, setVerifications] = useState(DEMO_VERIFICATIONS);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch live data from Midnight Indexer
    const controller = new AbortController();
    (async () => {
      try {
        const resp = await fetch('https://indexer.preprod.midnight.network/api/v4/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `query { contractTransactions(filter: { contractAddress: "${CONTRACT_ADDRESS}" }, first: 20) { nodes { txHash blockHeight timestamp circuitName } } }`
          }),
          signal: AbortSignal.timeout(5000)
        });
        if (resp.ok) {
          const { data } = await resp.json();
          if (data?.contractTransactions?.nodes?.length > 0) {
            const mapped = data.contractTransactions.nodes.map((n, i) => ({
              shortKey: n.txHash?.slice(0, 8) + '...' + n.txHash?.slice(-6) || `tx${i}`,
              address: 'mn1q...' + (n.txHash?.slice(-4) || '0000'),
              circuit: n.circuitName,
              blockHeight: Number(n.blockHeight),
              timestamp: n.timestamp,
              eligible: n.circuitName === 'verifyEligibility'
            }));
            setVerifications(mapped);
            setIsLive(true);
          }
        }
      } catch {
        // Keep demo data
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  const totalChecks = ledgerState?.totalChecks ?? verifications.filter(v => v.eligible).length;
  const goal = 50;
  const progressPct = Math.min(Math.round((totalChecks / goal) * 100), 100);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: '#e9d5ff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🌕 Level 5 — Preprod User Activity
          </h3>
          <span style={{
            padding: '0.25rem 0.6rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            background: isLive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
            color: isLive ? '#10b981' : '#ef4444',
            border: `1px solid ${isLive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.2)'}`,
            fontWeight: 600
          }}>
            {isLive ? '🟢 Live Indexer' : '🔴 Demo Mode'}
          </span>
        </div>

        {/* 50-user progress */}
        <div style={{
          background: 'rgba(15,15,30,0.6)',
          border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ color: '#e9d5ff', fontWeight: 700 }}>Progress to Full Moon (50 users)</span>
            <span style={{ color: '#10b981', fontWeight: 800, fontSize: '1.2rem' }}>{totalChecks} / {goal}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '50px', height: '14px', marginBottom: '0.5rem', overflow: 'hidden' }}>
            <div style={{
              background: 'linear-gradient(90deg, #7c3aed, #10b981)',
              borderRadius: '50px',
              height: '100%',
              width: `${progressPct}%`,
              transition: 'width 0.8s ease',
              position: 'relative'
            }}>
              {progressPct > 10 && (
                <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>
                  {progressPct}%
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Each verified user = 1 real ZK proof on Midnight Preprod</span>
            <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{goal - totalChecks} more needed</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: 'rgba(15,15,30,0.6)',
        border: '1px solid rgba(124,58,237,0.25)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '32px 1fr 120px 80px 80px',
          gap: '0.75rem',
          padding: '0.6rem 0.75rem',
          borderBottom: '1px solid rgba(124,58,237,0.2)',
          background: 'rgba(124,58,237,0.05)'
        }}>
          {['#', 'ZswapCoinPublicKey', 'Status', 'Block', 'When'].map(h => (
            <div key={h} style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {h}
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            Loading Indexer data...
          </div>
        ) : verifications.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            No verifications yet — be the first Preprod tester!
          </div>
        ) : (
          <div>
            {verifications.map((entry, i) => (
              <UserRow key={i} entry={entry} index={i} />
            ))}
          </div>
        )}

        {!isLive && (
          <div style={{
            padding: '0.75rem',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.75rem',
            background: 'rgba(239,68,68,0.04)'
          }}>
            ⚠️ Showing demo data — live data loads when Midnight Preprod Indexer is reachable
          </div>
        )}
      </div>
    </div>
  );
}
