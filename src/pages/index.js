/**
 * pages/index.js — ZK Compliance Gate Enterprise Dashboard
 * Institutional Zero-Knowledge Compliance Dashboard for Midnight Network
 */

import React, { useState } from 'react';
import Head from 'next/head';
import NodeTicker from '../components/NodeTicker';
import StatsCards from '../components/StatsCards';
import TabNavigation from '../components/TabNavigation';
import WalletConnect from '../components/WalletConnect';
import EligibilityForm from '../components/EligibilityForm';
import ResultCard from '../components/ResultCard';
import LedgerExplorer from '../components/LedgerExplorer';
import DeveloperSDK from '../components/DeveloperSDK';
import AuditTrail from '../components/AuditTrail';
import { createInitialLedgerState, recordLedgerVerification } from '../lib/ledger';
import { EXPLORER_URL, CONTRACT_ADDRESS } from '../constants/contract';

export default function Home() {
  const [activeTab, setActiveTab] = useState('gate'); // 'gate' | 'ledger' | 'sdk' | 'audit'
  const [wallet, setWallet] = useState(null);
  const [result, setResult] = useState(null);
  const [ledgerState, setLedgerState] = useState(createInitialLedgerState);

  const handleConnect = (walletData) => {
    setWallet(walletData);
  };

  const handleDisconnect = () => {
    setWallet(null);
    setResult(null);
  };

  const handleResult = (res) => {
    setResult(res);
    if (res) {
      setLedgerState((prevState) =>
        recordLedgerVerification(prevState, {
          caller: res.caller || wallet?.publicKey,
          predicate: res.preset?.label || 'ZK Eligibility',
          outcome: res.publicState?.eligible ?? res.eligible,
          blockHeight: res.blockHeight || prevState.blockHeight + 1,
          txHash: res.txHash
        })
      );
    }
  };

  return (
    <>
      <Head>
        <title>ZK-ComplianceGate — Enterprise Zero-Knowledge Compliance on Midnight</title>
        <meta
          name="description"
          content="Institutional zero-knowledge compliance dashboard on Midnight Network. Prove regulatory eligibility without disclosing private credentials."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Top Telemetry Node Ticker */}
      <NodeTicker blockHeight={ledgerState.blockHeight} />

      <main className="dashboard-container">
        {/* Enterprise Brand Header */}
        <header className="dashboard-header">
          <div className="brand-identity-group">
            <div className="brand-logo-badge">
              <span className="brand-moon-glyph">🌙</span>
              <span className="brand-zk-tag">ZK-GATE</span>
            </div>
            <div>
              <h1 className="brand-title">ZK-ComplianceGate</h1>
              <p className="brand-subtitle">
                Institutional Zero-Knowledge Age &amp; Regulatory Verification on Midnight Network
              </p>
            </div>
          </div>

          <div className="header-controls">
            <WalletConnect
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              connectedPublicKey={wallet?.publicKey}
            />
          </div>
        </header>

        {/* 4-Card Stats Metric Strip */}
        <StatsCards ledgerState={ledgerState} />

        {/* Multi-Tab Workspace Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content Workspace Panels */}
        <div className="tab-panels-wrapper">
          {activeTab === 'gate' && (
            <div className="workspace-tab-panel">
              {/* Privacy Model Callout */}
              <div className="privacy-banner-glass">
                <span className="banner-icon">🔐</span>
                <p className="banner-text">
                  <strong>Zero-Knowledge Architecture:</strong> Your age, net worth, and jurisdiction are evaluated strictly as a{' '}
                  <strong>client-side private witness</strong> inside your browser&apos;s prover enclave.
                  Midnight Network consensus records only a cryptographic boolean confirmation (<code>eligible: true</code>) with zero private credential exposure.
                </p>
              </div>

              {/* Side-by-Side Dual-Pane Cryptographic Audit Receipt (Visible upon verification) */}
              {result && (
                <ResultCard
                  result={result}
                  onSwitchTab={setActiveTab}
                />
              )}

              {/* Multi-Preset Eligibility Verification Form */}
              <EligibilityForm
                walletPublicKey={wallet?.publicKey}
                onResult={handleResult}
                currentBlockHeight={ledgerState.blockHeight}
              />
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="workspace-tab-panel">
              <LedgerExplorer
                ledgerState={ledgerState}
                connectedWalletAddress={wallet?.publicKey}
              />
            </div>
          )}

          {activeTab === 'sdk' && (
            <div className="workspace-tab-panel">
              <DeveloperSDK />
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="workspace-tab-panel">
              <AuditTrail latestReceipt={result} />
            </div>
          )}
        </div>

        {/* Enterprise Institutional Footer */}
        <footer className="dashboard-footer">
          <div className="footer-top-row">
            <div className="footer-brand">
              <span className="footer-logo">🌙 ZK-ComplianceGate</span>
              <p className="footer-tagline">
                Privacy-preserving regulatory compliance built with Midnight Compact smart contracts.
              </p>
            </div>

            <div className="footer-links-group">
              <div className="footer-links-col">
                <span className="footer-col-title">Network &amp; Explorer</span>
                <a href={EXPLORER_URL} target="_blank" rel="noopener noreferrer">
                  Midnight Preprod Contract ↗
                </a>
                <a href="https://explorer.testnet.midnight.network" target="_blank" rel="noopener noreferrer">
                  Testnet Block Explorer ↗
                </a>
                <a href="https://docs.midnight.network" target="_blank" rel="noopener noreferrer">
                  Midnight Documentation ↗
                </a>
              </div>

              <div className="footer-links-col">
                <span className="footer-col-title">Developers &amp; Code</span>
                <a href="https://github.com/MarkAngelGuevarra/zk-compliance-gate" target="_blank" rel="noopener noreferrer">
                  GitHub Repository ↗
                </a>
                <a href="https://midnight.network" target="_blank" rel="noopener noreferrer">
                  Midnight Network Official ↗
                </a>
                <span className="footer-contract-text font-mono">
                  Contract: {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-8)}
                </span>
              </div>
            </div>
          </div>

          <div className="footer-bottom-row">
            <p>© 2026 ZK-ComplianceGate · Built for Midnight Network · Monthly Moonshots Submission</p>
            <p className="footer-privacy-pledge">🛡️ 100% Zero-Knowledge Witness Privacy Guaranteed</p>
          </div>
        </footer>
      </main>
    </>
  );
}
