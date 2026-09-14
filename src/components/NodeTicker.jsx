/**
 * NodeTicker.jsx
 * Top Telemetry Bar with animated live connection dot, node health metrics, and explorer link.
 */

import React from 'react';
import { BLOCK_HEIGHT, NETWORK, EXPLORER_URL } from '../constants/contract';

export default function NodeTicker({ blockHeight = BLOCK_HEIGHT }) {
  return (
    <aside className="node-ticker-strip" aria-label="Network Telemetry">
      <div className="ticker-content">
        <div className="ticker-status-group">
          <span className="live-pulsing-dot" aria-hidden="true" />
          <span className="ticker-network-name">{NETWORK}</span>
          <span className="ticker-badge-live">LIVE</span>
        </div>

        <div className="ticker-metrics-group">
          <div className="ticker-metric-item">
            <span className="ticker-metric-label">Uptime</span>
            <span className="ticker-metric-val">99.98%</span>
          </div>

          <div className="ticker-divider" aria-hidden="true">/</div>

          <div className="ticker-metric-item">
            <span className="ticker-metric-label">Height</span>
            <span className="ticker-metric-val">#{blockHeight.toLocaleString()}</span>
          </div>

          <div className="ticker-divider" aria-hidden="true">/</div>

          <div className="ticker-metric-item">
            <span className="ticker-metric-label">Latency</span>
            <span className="ticker-metric-val">42ms</span>
          </div>

          <div className="ticker-divider" aria-hidden="true">/</div>

          <div className="ticker-metric-item">
            <span className="ticker-metric-label">Prover</span>
            <span className="ticker-metric-val">Halo2 Enclave Active</span>
          </div>
        </div>

        <div className="ticker-action-group">
          <a
            href={EXPLORER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ticker-explorer-link"
            title="Open Midnight Network Explorer"
          >
            <span>Explorer</span>
            <span aria-hidden="true"> ↗</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
