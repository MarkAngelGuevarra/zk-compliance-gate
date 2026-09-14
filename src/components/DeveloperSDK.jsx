/**
 * DeveloperSDK.jsx
 * Developer SDK & Embed Widget Code Generator
 * Provides copyable snippets for React components, Compact smart contracts, and iframe embeds.
 */

import React, { useState } from 'react';
import { BECH32M_ADDRESS, CONTRACT_ADDRESS } from '../constants/contract';
import {
  getReactSnippet,
  getCompactSnippet,
  getIframeSnippet,
  getNodeSnippet
} from '../lib/sdkSnippets';

export default function DeveloperSDK() {
  const [activeSnippetTab, setActiveSnippetTab] = useState('react');
  const [selectedPreset, setSelectedPreset] = useState('AGE_18');
  const [selectedTheme, setSelectedTheme] = useState('midnight-glass');
  const [copied, setCopied] = useState(false);

  let currentSnippetCode = '';
  if (activeSnippetTab === 'react') {
    currentSnippetCode = getReactSnippet({
      contractAddress: BECH32M_ADDRESS,
      preset: selectedPreset,
      theme: selectedTheme
    });
  } else if (activeSnippetTab === 'compact') {
    currentSnippetCode = getCompactSnippet({
      contractAddress: BECH32M_ADDRESS
    });
  } else if (activeSnippetTab === 'iframe') {
    currentSnippetCode = getIframeSnippet({
      contractAddress: BECH32M_ADDRESS,
      preset: selectedPreset,
      theme: selectedTheme
    });
  } else if (activeSnippetTab === 'node') {
    currentSnippetCode = getNodeSnippet({
      contractAddress: CONTRACT_ADDRESS
    });
  }

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText(currentSnippetCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="card developer-sdk-card" id="tab-panel-sdk" role="tabpanel">
      <div className="card-header-row">
        <div>
          <h2 className="card-heading">Developer SDK &amp; Integration Suite</h2>
          <p className="card-subheading">
            Embed zero-knowledge compliance verification into your DeFi vaults, gaming dApps, or launchpads in minutes.
          </p>
        </div>
        <span className="sdk-version-badge">SDK v1.0 · Midnight 0.14.0</span>
      </div>

      {/* Integration Options & Configuration Bar */}
      <div className="sdk-config-bar">
        <div className="config-item">
          <label className="config-label">Preset Rule:</label>
          <select
            className="config-select"
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
          >
            <option value="AGE_18">18+ (Standard DeFi Adult)</option>
            <option value="AGE_21">21+ (USA Regulatory Gate)</option>
            <option value="ACCREDITED">Accredited Investor ($1M+)</option>
            <option value="JURISDICTION">Jurisdiction Allowlist (FATF)</option>
          </select>
        </div>

        <div className="config-item">
          <label className="config-label">Theme Mode:</label>
          <select
            className="config-select"
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
          >
            <option value="midnight-glass">Midnight Purple Glass (Default)</option>
            <option value="midnight-dark">Midnight Deep Void Dark</option>
          </select>
        </div>

        <div className="config-item contract-badge-item">
          <label className="config-label">Target Contract:</label>
          <code className="target-contract-code font-mono">
            {BECH32M_ADDRESS.slice(0, 10)}...{BECH32M_ADDRESS.slice(-8)}
          </code>
        </div>
      </div>

      {/* Snippet Sub-Tabs */}
      <div className="snippet-subtabs-row" role="tablist" aria-label="Snippet Language">
        <button
          type="button"
          role="tab"
          aria-selected={activeSnippetTab === 'react'}
          className={`snippet-tab-btn ${activeSnippetTab === 'react' ? 'snippet-tab-active' : ''}`}
          onClick={() => setActiveSnippetTab('react')}
        >
          <span className="snippet-lang-icon">⚛️</span> React Component &amp; Hook
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeSnippetTab === 'compact'}
          className={`snippet-tab-btn ${activeSnippetTab === 'compact' ? 'snippet-tab-active' : ''}`}
          onClick={() => setActiveSnippetTab('compact')}
        >
          <span className="snippet-lang-icon">📜</span> Compact Smart Contract (1-Line)
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeSnippetTab === 'iframe'}
          className={`snippet-tab-btn ${activeSnippetTab === 'iframe' ? 'snippet-tab-active' : ''}`}
          onClick={() => setActiveSnippetTab('iframe')}
        >
          <span className="snippet-lang-icon">🖼️</span> Embeddable Iframe Widget
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeSnippetTab === 'node'}
          className={`snippet-tab-btn ${activeSnippetTab === 'node' ? 'snippet-tab-active' : ''}`}
          onClick={() => setActiveSnippetTab('node')}
        >
          <span className="snippet-lang-icon">🟢</span> Node.js / Indexer Client
        </button>
      </div>

      {/* Code Editor Container */}
      <div className="code-editor-container">
        <div className="code-editor-top">
          <div className="editor-controls">
            <span className="editor-dot dot-red" />
            <span className="editor-dot dot-yellow" />
            <span className="editor-dot dot-green" />
            <span className="editor-filename font-mono">
              {activeSnippetTab === 'react' && 'RestrictedDeFiVault.jsx'}
              {activeSnippetTab === 'compact' && 'RestrictedPool.compact'}
              {activeSnippetTab === 'iframe' && 'index.html'}
              {activeSnippetTab === 'node' && 'verify-caller.js'}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline copy-code-btn"
            onClick={handleCopyCode}
          >
            {copied ? '✓ Copied to Clipboard!' : '📋 Copy Code'}
          </button>
        </div>

        <pre className="code-pre-block">
          <code className="code-content font-mono">
            {currentSnippetCode}
          </code>
        </pre>
      </div>

      {/* Architecture Highlights Strip */}
      <div className="sdk-highlights-grid">
        <div className="highlight-box">
          <span className="highlight-icon">⚡</span>
          <div>
            <h4 className="highlight-title">Zero-Knowledge Composable</h4>
            <p className="highlight-desc">
              Other Compact contracts check compliance in 1-line via <code>gateContract.getVerificationStatus()</code> without accessing the user&apos;s private data.
            </p>
          </div>
        </div>

        <div className="highlight-box">
          <span className="highlight-icon">🛡️</span>
          <div>
            <h4 className="highlight-title">CIP-95 Lace Compatibility</h4>
            <p className="highlight-desc">
              Native integration with Lace Midnight wallet. Cryptographic proofs are signed and emitted directly in the user&apos;s browser.
            </p>
          </div>
        </div>

        <div className="highlight-box">
          <span className="highlight-icon">📦</span>
          <div>
            <h4 className="highlight-title">Drop-In Iframe Widget</h4>
            <p className="highlight-desc">
              Web2 sites and Web3 dApps can embed the compliance gate as a standalone iframe with postMessage callbacks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
