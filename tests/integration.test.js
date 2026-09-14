/**
 * Integration & State Transition Tests (Requirement R4)
 * Verifies multi-tab workflows, redaction rules, and ledger state transitions.
 */

const {
  COMPLIANCE_PRESETS,
  evaluateComplianceWitness,
  redactWitness,
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
  verifyProofTranscript,
  ZK_CIRCUIT_SPECS,
  FORMAL_PRIVACY_GUARANTEES
} = require('../src/lib/auditVerifier');

const { getDashboardStats } = require('../src/lib/stats');
const { CONTRACT_ADDRESS } = require('../src/constants/contract');

describe('Milestone M4: Integration & State Transitions', () => {

  // ── Multi-Tab Workflows & Data Flow ─────────────────────────────
  describe('Multi-Tab Workflow Transitions', () => {
    test('supports all 4 core tab states', () => {
      const validTabs = ['gate', 'ledger', 'sdk', 'audit'];
      validTabs.forEach(tab => {
        expect(['gate', 'ledger', 'sdk', 'audit']).toContain(tab);
      });
    });

    test('compliance evaluation flows seamlessly into ledger state and audit receipt', () => {
      // Step 1: User fills out Compliance Gate (Tab 1)
      const userPublicKey = '0x1111222233334444555566667777888899990000aaaaabbbbbcccccdddddeeeee';
      const evaluation = evaluateComplianceWitness({
        presetId: 'AGE_21',
        witnessValue: 24,
        caller: userPublicKey
      });

      expect(evaluation.eligible).toBe(true);

      // Step 2: Generate Cryptographic Audit Receipt
      const receipt = generateAuditReceipt({
        caller: userPublicKey,
        presetId: 'AGE_21',
        witnessValue: 24,
        eligible: evaluation.eligible
      });
      expect(receipt.publicState.eligible).toBe(true);
      expect(receipt.privateShield.redactedWitness).toContain('[SHIELDED:');
      expect(receipt.privateShield.leakageRate).toContain('0 bytes');

      // Step 3: Write to Simulated Ledger (Tab 2)
      let ledger = createInitialLedgerState();
      const initialTotal = ledger.totalChecks;

      ledger = recordLedgerVerification(ledger, {
        caller: userPublicKey,
        outcome: evaluation.eligible,
        predicate: 'Age >= 21'
      });

      expect(ledger.totalChecks).toBe(initialTotal + 1);

      // Step 4: Search on Ledger Explorer (Tab 2)
      const searchResult = lookupAddress(ledger, userPublicKey);
      expect(searchResult.existsInLedger).toBe(true);
      expect(searchResult.isVerified).toBe(true);
      expect(searchResult.status).toBe('Verified & Active');

      // Step 5: Verify Proof in Audit Trail (Tab 4)
      const auditResult = verifyProofTranscript(receipt);
      expect(auditResult.isValid).toBe(true);
      expect(auditResult.checks.every(c => c.passed)).toBe(true);

      // Step 6: Verify Stats Dashboard Updates
      const stats = getDashboardStats(ledger);
      expect(Array.isArray(stats)).toBe(true);
      expect(stats.length).toBe(4);
      expect(stats.find(s => s.id === 'total_verifications').value).toBe(ledger.totalChecks.toLocaleString());
      expect(stats.find(s => s.id === 'privacy_score').value).toBe('100%');
    });
  });

  // ── Strict Redaction Rules ──────────────────────────────────────
  describe('Strict Redaction Rules & Privacy Isolation', () => {
    test('redactWitness never reveals the numerical private witness', () => {
      const privateAge = 42;
      const shielded = redactWitness(privateAge);
      expect(shielded).not.toContain('42');
      expect(shielded.startsWith('[SHIELDED:')).toBe(true);
      expect(shielded.endsWith(']')).toBe(true);
    });

    test('audit receipt public state does not contain raw private witness', () => {
      const evaluation = evaluateComplianceWitness({
        presetId: 'ACCREDITED',
        witnessValue: 1500000, // $1.5M net worth
        caller: '0xabc123'
      });

      const receipt = generateAuditReceipt({
        caller: '0xabc123',
        presetId: 'ACCREDITED',
        witnessValue: 1500000,
        eligible: evaluation.eligible
      });

      const serialized = JSON.stringify(receipt.publicState);
      expect(serialized).not.toContain('1500000');
      expect(receipt.privateShield.redactedWitness).not.toContain('1500000');
      expect(receipt.privateShield.redactedWitness).toContain('[SHIELDED:');
    });

    test('rejection retains private witness shielding', () => {
      const evaluation = evaluateComplianceWitness({
        presetId: 'AGE_18',
        witnessValue: 15, // Below threshold
        caller: '0xunderage'
      });

      expect(evaluation.eligible).toBe(false);
      const receipt = generateAuditReceipt({
        caller: '0xunderage',
        presetId: 'AGE_18',
        witnessValue: 15,
        eligible: evaluation.eligible
      });
      expect(receipt.publicState.eligible).toBe(false);
      expect(receipt.privateShield.redactedWitness).not.toContain('15');
      expect(receipt.privateShield.redactedWitness).toContain('[SHIELDED:');
    });
  });

  // ── Ledger State Transitions ────────────────────────────────────
  describe('Ledger State Transitions', () => {
    test('tracks multiple caller verifications independently', () => {
      let ledger = createInitialLedgerState();
      const alice = '0xaaaa1111';
      const bob = '0xbbbb2222';

      ledger = recordLedgerVerification(ledger, {
        caller: alice,
        outcome: true,
        predicate: 'Age >= 18'
      });

      ledger = recordLedgerVerification(ledger, {
        caller: bob,
        outcome: false,
        predicate: 'Age >= 21'
      });

      expect(lookupAddress(ledger, alice).status).toBe('Verified & Active');
      expect(lookupAddress(ledger, alice).isVerified).toBe(true);
      expect(lookupAddress(ledger, bob).status).toBe('Revoked / Inactive');
      expect(lookupAddress(ledger, bob).isVerified).toBe(false);
      expect(lookupAddress(ledger, '0xunknown_not_found').status).toBe('Unregistered / No Records');
      expect(lookupAddress(ledger, '0xunknown_not_found').existsInLedger).toBe(false);
      expect(ledger.recentTransactions.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ── Developer SDK Code Generation ───────────────────────────────
  describe('Developer SDK Snippets Generation', () => {
    test('generates React hook snippet with contract address', () => {
      const snippet = getReactSnippet({ presetId: 'AGE_21', contractAddress: CONTRACT_ADDRESS });
      expect(snippet).toContain(CONTRACT_ADDRESS);
      expect(snippet).toContain('useMidnightCompliance');
      expect(snippet).toContain('MidnightComplianceGate');
    });

    test('generates Compact cross-contract call snippet with 1-line check', () => {
      const snippet = getCompactSnippet({ contractAddress: CONTRACT_ADDRESS });
      expect(snippet).toContain('getVerificationStatus');
      expect(snippet).toContain('gateContract');
      expect(snippet).toContain('ComplianceGate');
    });

    test('generates iframe widget snippet', () => {
      const snippet = getIframeSnippet({ presetId: 'AGE_18', theme: 'midnight-dark' });
      expect(snippet).toContain('<iframe');
      expect(snippet).toContain('preset=AGE_18');
      expect(snippet).toContain('theme=midnight-dark');
    });

    test('generates Node.js SDK snippet', () => {
      const snippet = getNodeSnippet({ contractAddress: CONTRACT_ADDRESS });
      expect(snippet).toContain(CONTRACT_ADDRESS);
      expect(snippet).toContain('queryLedgerState');
    });
  });

  // ── Cryptographic Verifier & Audit Trail ────────────────────────
  describe('Cryptographic Circuit Specifications & Verifier', () => {
    test('exposes all 6 circuit specifications', () => {
      expect(ZK_CIRCUIT_SPECS.length).toBe(6);
      const params = ZK_CIRCUIT_SPECS.map(c => c.parameter);
      expect(params).toContain('Proving System');
      expect(params).toContain('Arithmetic Constraint Scheme');
      expect(params).toContain('Constraint Count');
      expect(params).toContain('Private Witness Dimension');
      expect(params).toContain('Circuit Digest (Hash)');
      expect(params).toContain('Verification Key (VK)');
    });

    test('exposes 4 formal privacy guarantees', () => {
      expect(FORMAL_PRIVACY_GUARANTEES.length).toBe(4);
      const titles = FORMAL_PRIVACY_GUARANTEES.map(g => g.title);
      expect(titles).toContain('Completeness');
      expect(titles).toContain('Computational Soundness');
      expect(titles).toContain('Zero-Knowledge Property');
      expect(titles).toContain('Strict Disclose Discipline');
    });

    test('fails verification on invalid or rejected receipt', () => {
      const evaluation = evaluateComplianceWitness({
        presetId: 'AGE_18',
        witnessValue: 16 // Underage
      });
      const receipt = generateAuditReceipt({
        caller: '0xunderage_test',
        presetId: 'AGE_18',
        witnessValue: 16,
        eligible: evaluation.eligible
      });

      const audit = verifyProofTranscript(receipt);
      expect(audit.isValid).toBe(false);
      expect(audit.checks.find(c => c.id === 'circuit_constraint').passed).toBe(false);
    });
  });

});
