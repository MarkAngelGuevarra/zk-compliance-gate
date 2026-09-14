/**
 * Enterprise Frontend & Domain Logic Unit Tests
 * Tests R1 and R3 implementation modules: contract constants, compliance presets,
 * witness redaction, simulated ledger state, SDK snippets, audit verifier, and telemetry stats.
 */

const {
  CONTRACT_ADDRESS,
  BECH32M_ADDRESS,
  DEPLOY_TX_HASH,
  EXPLORER_URL,
  BLOCK_HEIGHT,
  NETWORK,
  truncateHash,
  getExplorerUrl
} = require('../src/constants/contract');

const {
  COMPLIANCE_PRESETS,
  evaluateComplianceWitness,
  redactWitness,
  getProverTelemetryStages,
  generateAuditReceipt
} = require('../src/lib/compliance');

const {
  createInitialLedgerState,
  recordLedgerVerification,
  lookupAddress
} = require('../src/lib/ledger');

const {
  getReactSnippet,
  getCompactSnippet,
  getIframeSnippet,
  getNodeSnippet
} = require('../src/lib/sdkSnippets');

const {
  ZK_CIRCUIT_SPECS,
  FORMAL_PRIVACY_GUARANTEES,
  verifyProofTranscript
} = require('../src/lib/auditVerifier');

const { getDashboardStats } = require('../src/lib/stats');

describe('ZK-ComplianceGate Enterprise Frontend Logic', () => {

  // ── Contract Constants ──────────────────────────────────────────
  describe('Canonical Contract Constants', () => {
    test('defines correct canonical 64-char hex contract address', () => {
      expect(CONTRACT_ADDRESS).toBe('8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449');
      expect(CONTRACT_ADDRESS.length).toBe(64);
    });

    test('defines correct Bech32m Midnight testnet address', () => {
      expect(BECH32M_ADDRESS).toBe('mn13jjvfwu3af4432zrxwkv7az3lzqdw3kzsk7yx8hlxeg5k7e2j3yscnr60q');
      expect(BECH32M_ADDRESS.startsWith('mn1')).toBe(true);
    });

    test('defines correct deployment transaction hash', () => {
      expect(DEPLOY_TX_HASH).toBe('0x3e689b77c96d1ecbb6f4ae10e9c72eb10b68cf0cc7d082f34dc4207609973cfc');
    });

    test('defines functional Midnight Preprod explorer URL', () => {
      expect(EXPLORER_URL).toBe(`https://explorer.testnet.midnight.network/contract/${CONTRACT_ADDRESS}`);
    });

    test('defines initial block height and network name', () => {
      expect(BLOCK_HEIGHT).toBe(142857);
      expect(NETWORK).toBe('Midnight Preprod Testnet');
    });

    test('truncateHash formats strings cleanly', () => {
      expect(truncateHash(CONTRACT_ADDRESS, 6, 4)).toBe('8ca4c4...9449');
      expect(truncateHash(null)).toBe('');
      expect(truncateHash('short', 8, 6)).toBe('short');
    });

    test('getExplorerUrl generates correct deep-links for tx and block', () => {
      expect(getExplorerUrl('tx', '0xabc')).toBe('https://explorer.testnet.midnight.network/tx/0xabc');
      expect(getExplorerUrl('block', 142857)).toBe('https://explorer.testnet.midnight.network/block/142857');
    });
  });

  // ── Compliance Presets & Witness Logic ──────────────────────────
  describe('Compliance Presets & Witness Evaluation', () => {
    test('provides all 4 required enterprise presets', () => {
      const presetIds = COMPLIANCE_PRESETS.map(p => p.id);
      expect(presetIds).toContain('AGE_18');
      expect(presetIds).toContain('AGE_21');
      expect(presetIds).toContain('ACCREDITED');
      expect(presetIds).toContain('JURISDICTION');
    });

    test('evaluates AGE_18 correctly on boundary, pass, and fail', () => {
      expect(evaluateComplianceWitness({ presetId: 'AGE_18', witnessValue: 18 }).eligible).toBe(true);
      expect(evaluateComplianceWitness({ presetId: 'AGE_18', witnessValue: 24 }).eligible).toBe(true);
      expect(evaluateComplianceWitness({ presetId: 'AGE_18', witnessValue: 17 }).eligible).toBe(false);
      expect(evaluateComplianceWitness({ presetId: 'AGE_18', witnessValue: -1 }).eligible).toBe(false);
    });

    test('evaluates AGE_21 correctly', () => {
      expect(evaluateComplianceWitness({ presetId: 'AGE_21', witnessValue: 21 }).eligible).toBe(true);
      expect(evaluateComplianceWitness({ presetId: 'AGE_21', witnessValue: 20 }).eligible).toBe(false);
    });

    test('evaluates ACCREDITED ($1M net worth) correctly', () => {
      expect(evaluateComplianceWitness({ presetId: 'ACCREDITED', witnessValue: 1000000 }).eligible).toBe(true);
      expect(evaluateComplianceWitness({ presetId: 'ACCREDITED', witnessValue: 2500000 }).eligible).toBe(true);
      expect(evaluateComplianceWitness({ presetId: 'ACCREDITED', witnessValue: 999999 }).eligible).toBe(false);
    });

    test('evaluates JURISDICTION allowlist and sanction checks', () => {
      expect(evaluateComplianceWitness({ presetId: 'JURISDICTION', witnessValue: 'US' }).eligible).toBe(true);
      expect(evaluateComplianceWitness({ presetId: 'JURISDICTION', witnessValue: 'GB' }).eligible).toBe(true);
      expect(evaluateComplianceWitness({ presetId: 'JURISDICTION', witnessValue: 'IR' }).eligible).toBe(false);
      expect(evaluateComplianceWitness({ presetId: 'JURISDICTION', witnessValue: 'KP' }).eligible).toBe(false);
    });

    test('redactWitness conceals raw values with cryptographic commitment format', () => {
      const redacted = redactWitness(25, 'age');
      expect(redacted).toContain('[SHIELDED:');
      expect(redacted).toContain('halo2-vector]');
      expect(redacted).not.toContain('25');
    });

    test('generateAuditReceipt produces dual-pane public/private receipt', () => {
      const receipt = generateAuditReceipt({
        caller: 'mn1q8a9fd3k82m5zcx7012y4vpwle9r7k8e2c5f7a',
        presetId: 'AGE_18',
        witnessValue: 24,
        eligible: true
      });

      expect(receipt.publicState.eligible).toBe(true);
      expect(receipt.publicState.status).toBe('PASS');
      expect(receipt.publicState.discloseCall).toBe('disclose(true)');
      expect(receipt.privateShield.leakageRate).toBe('0 bytes transmitted to RPC or Indexer');
      expect(receipt.privateShield.redactedWitness).toContain('[SHIELDED:');
      // Raw age must not appear anywhere in the receipt object
      expect(JSON.stringify(receipt)).not.toContain('"24"');
    });

    test('getProverTelemetryStages returns 5 realistic stages', () => {
      const stages = getProverTelemetryStages('AGE_18', true);
      expect(stages.length).toBe(5);
      expect(stages[0].label).toBe('Enclave Initialization');
      expect(stages[4].progress).toBe(100);
    });
  });

  // ── Simulated Ledger State ──────────────────────────────────────
  describe('Simulated Ledger State & Address Search', () => {
    test('initializes ledger state with canonical contract and counters', () => {
      const state = createInitialLedgerState();
      expect(state.contractAddress).toBe(CONTRACT_ADDRESS);
      expect(state.totalChecks).toBeGreaterThanOrEqual(1482);
      expect(state.blockHeight).toBe(BLOCK_HEIGHT);
      expect(Array.isArray(state.recentTransactions)).toBe(true);
    });

    test('recordLedgerVerification updates totalChecks and caller status', () => {
      const initial = createInitialLedgerState();
      const testCaller = 'mn1qtestcaller999000111222333444555666777';
      const updated = recordLedgerVerification(initial, {
        caller: testCaller,
        predicate: 'Age >= 18',
        outcome: true,
        blockHeight: 142858
      });

      expect(updated.totalChecks).toBe(initial.totalChecks + 1);
      expect(updated.verifications[testCaller]).toBe(true);
      expect(updated.recentTransactions[0].caller).toBe(testCaller);
      expect(updated.recentTransactions[0].outcome).toBe(true);
    });

    test('lookupAddress resolves known caller and unknown caller', () => {
      const state = createInitialLedgerState();
      const known = lookupAddress(state, 'mn1q8a9fd3k82m5zcx7012y4vpwle9r7k8e2c5f7a');
      expect(known.existsInLedger).toBe(true);
      expect(known.isVerified).toBe(true);

      const unknown = lookupAddress(state, 'mn1qunknownnonexistentaddress000000000000');
      expect(unknown.existsInLedger).toBe(false);
      expect(unknown.isVerified).toBe(false);
    });
  });

  // ── Developer SDK Snippet Generator ─────────────────────────────
  describe('Developer SDK Snippets', () => {
    test('generates React integration snippet with custom contract and preset', () => {
      const snippet = getReactSnippet({ preset: 'AGE_21' });
      expect(snippet).toContain('useMidnightCompliance');
      expect(snippet).toContain('preset: "AGE_21"');
      expect(snippet).toContain(BECH32M_ADDRESS);
    });

    test('generates Compact 1-line cross-contract verification snippet', () => {
      const snippet = getCompactSnippet();
      expect(snippet).toContain('gateContract.getVerificationStatus()');
      expect(snippet).toContain('import { ComplianceGate }');
    });

    test('generates iframe embed code', () => {
      const snippet = getIframeSnippet({ preset: 'ACCREDITED' });
      expect(snippet).toContain('<iframe');
      expect(snippet).toContain('preset=ACCREDITED');
    });

    test('generates Node.js client snippet', () => {
      const snippet = getNodeSnippet();
      expect(snippet).toContain('queryLedgerState');
      expect(snippet).toContain(CONTRACT_ADDRESS);
    });
  });

  // ── Audit Verifier & Privacy Guarantees ─────────────────────────
  describe('Audit Verifier & Formal Guarantees', () => {
    test('defines 6 circuit constraint parameters', () => {
      expect(ZK_CIRCUIT_SPECS.length).toBe(6);
      expect(ZK_CIRCUIT_SPECS.some(s => s.parameter === 'Proving System')).toBe(true);
      expect(ZK_CIRCUIT_SPECS.some(s => s.parameter === 'Verification Key (VK)')).toBe(true);
    });

    test('defines 4 formal privacy guarantees', () => {
      const titles = FORMAL_PRIVACY_GUARANTEES.map(g => g.title);
      expect(titles).toContain('Completeness');
      expect(titles).toContain('Computational Soundness');
      expect(titles).toContain('Zero-Knowledge Property');
      expect(titles).toContain('Strict Disclose Discipline');
    });

    test('verifyProofTranscript validates a passing receipt', () => {
      const sampleReceipt = generateAuditReceipt({
        caller: 'mn1q8a9fd3k82m5zcx7012y4vpwle9r7k8e2c5f7a',
        presetId: 'AGE_18',
        witnessValue: 24,
        eligible: true
      });
      const report = verifyProofTranscript(sampleReceipt);
      expect(report.isValid).toBe(true);
      expect(report.verdict).toContain('PASSED');
      expect(report.checks.length).toBe(5);
    });

    test('verifyProofTranscript fails an ineligible receipt', () => {
      const failedReceipt = generateAuditReceipt({
        caller: 'mn1q8a9fd3k82m5zcx7012y4vpwle9r7k8e2c5f7a',
        presetId: 'AGE_18',
        witnessValue: 16,
        eligible: false
      });
      const report = verifyProofTranscript(failedReceipt);
      expect(report.isValid).toBe(false);
      expect(report.verdict).toContain('FAILED');
    });
  });

  // ── Dashboard Stats ─────────────────────────────────────────────
  describe('Dashboard Telemetry Stats', () => {
    test('calculates 4 metric cards accurately', () => {
      const state = createInitialLedgerState();
      const stats = getDashboardStats(state);
      expect(stats.length).toBe(4);
      expect(stats[0].label).toBe('Total Verifications');
      expect(stats[1].label).toBe('Proof Pass Rate');
      expect(stats[2].value).toBe('100%');
      expect(stats[3].value).toBe('Midnight Preprod');
    });
  });

});
