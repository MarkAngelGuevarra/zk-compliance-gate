/**
 * TabNavigation.jsx
 * Enterprise Web3 Multi-Tab Navigation Controller
 */

import React from 'react';

export const TABS = [
  {
    id: 'gate',
    label: 'Compliance Gate',
    shortLabel: 'Gate',
    badge: 'Verification',
    icon: '🛡️',
    description: 'Zero-knowledge eligibility verification with client-side proving'
  },
  {
    id: 'ledger',
    label: 'On-Chain Ledger Explorer',
    shortLabel: 'Explorer',
    badge: 'Live Sync',
    icon: '⛓️',
    description: 'Real-time Midnight Preprod block ledger & address search'
  },
  {
    id: 'sdk',
    label: 'Developer SDK',
    shortLabel: 'SDK',
    badge: 'v1.0',
    icon: '💻',
    description: 'Embeddable widgets and 1-line Compact smart contract calls'
  },
  {
    id: 'audit',
    label: 'Audit Trail',
    shortLabel: 'Audit',
    badge: 'Halo2',
    icon: '🔍',
    description: 'Circuit constraints, VK verifier, and formal privacy proofs'
  },
  {
    id: 'community',
    label: 'Community Hub',
    shortLabel: 'Users',
    badge: 'Level 5',
    icon: '🌕',
    description: 'Recruit Preprod testers — track progress toward 50 on-chain users'
  },
  {
    id: 'mainnet',
    label: 'Mainnet Roadmap',
    shortLabel: 'Mainnet',
    badge: 'Level 6',
    icon: '🌟',
    description: 'Midnight Mainnet deployment status and Supermoon progress'
  }
];

export default function TabNavigation({ activeTab, onTabChange }) {
  return (
    <nav className="tab-navigation-container" aria-label="Dashboard Workspaces">
      <div className="tab-navigation-bar" role="tablist">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-btn-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tab-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              className={`tab-btn ${isActive ? 'tab-btn-active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
              <span className="tab-label-full">{tab.label}</span>
              <span className="tab-label-short">{tab.shortLabel}</span>
              <span className={`tab-badge ${isActive ? 'tab-badge-active' : ''}`}>
                {tab.badge}
              </span>
              {isActive && <span className="tab-glow-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
