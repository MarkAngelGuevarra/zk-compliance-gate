/**
 * StatsCards.jsx
 * 4-Card Institutional Telemetry Strip
 */

import React from 'react';
import { getDashboardStats } from '../lib/stats';

export default function StatsCards({ ledgerState }) {
  const stats = getDashboardStats(ledgerState);

  return (
    <section className="stats-cards-grid" aria-label="Dashboard Metrics">
      {stats.map((item) => (
        <div key={item.id} className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">{item.label}</span>
            <span className="stat-card-badge">{item.badge}</span>
          </div>

          <div className="stat-card-value-row">
            <span className="stat-card-value">{item.value}</span>
          </div>

          <div className="stat-card-footer">
            <span className="stat-card-subtext">{item.subtext}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
