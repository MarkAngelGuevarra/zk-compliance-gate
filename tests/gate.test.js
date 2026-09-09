/**
 * ZK Compliance Gate — Contract Logic Tests
 * Level 1: Verifies the core contract behavior and ZK circuit constraints.
 *
 * Test Coverage:
 *   1. Eligibility granted when age meets threshold
 *   2. Proof rejected when age is below threshold
 *   3. Revocation removes eligibility record
 *   4. Public counter increments correctly
 *   5. Private age is never leaked into public state
 */

describe('ZK Compliance Gate — gate.compact', () => {

  // ── Test Suite 1: Core Eligibility Logic ─────────────────
  describe('verifyEligibility circuit', () => {

    test('should PASS when private age equals the threshold exactly', () => {
      // User age = 18, threshold = 18 → should be eligible
      const privateAge = 18;
      const ageThreshold = 18;
      const result = simulateEligibilityCheck(privateAge, ageThreshold);
      expect(result.eligible).toBe(true);
    });

    test('should PASS when private age exceeds the threshold', () => {
      // User age = 25, threshold = 18 → should be eligible
      const privateAge = 25;
      const ageThreshold = 18;
      const result = simulateEligibilityCheck(privateAge, ageThreshold);
      expect(result.eligible).toBe(true);
    });

    test('should FAIL when private age is below the threshold', () => {
      // User age = 16, threshold = 18 → proof should be rejected
      const privateAge = 16;
      const ageThreshold = 18;
      expect(() => {
        simulateEligibilityCheck(privateAge, ageThreshold);
      }).toThrow('Age does not meet the required threshold');
    });

    test('should FAIL when private age is zero', () => {
      // Edge case: age = 0, threshold = 18
      const privateAge = 0;
      const ageThreshold = 18;
      expect(() => {
        simulateEligibilityCheck(privateAge, ageThreshold);
      }).toThrow('Age does not meet the required threshold');
    });

    test('should PASS with a custom threshold (e.g., 21 for USA compliance)', () => {
      const privateAge = 22;
      const ageThreshold = 21;
      const result = simulateEligibilityCheck(privateAge, ageThreshold);
      expect(result.eligible).toBe(true);
    });

  });

  // ── Test Suite 2: Public Ledger Integrity ─────────────────
  describe('Public Ledger State', () => {

    test('should increment totalChecks counter on each successful verification', () => {
      const ledger = createMockLedger();
      simulateEligibilityCheck(20, 18, ledger);
      simulateEligibilityCheck(25, 18, ledger);
      expect(ledger.totalChecks).toBe(2);
    });

    test('should NOT expose private age in ledger state', () => {
      const ledger = createMockLedger();
      simulateEligibilityCheck(20, 18, ledger);
      // The ledger must never contain the raw age value
      expect(JSON.stringify(ledger)).not.toContain('20');
    });

    test('should store ONLY boolean result in verifications map', () => {
      const ledger = createMockLedger();
      const caller = 'mock-public-key-abc123';
      simulateEligibilityCheck(20, 18, ledger, caller);
      expect(ledger.verifications[caller]).toBe(true);
    });

  });

  // ── Test Suite 3: Revocation ───────────────────────────────
  describe('revokeVerification circuit', () => {

    test('should set eligibility to false after revocation', () => {
      const ledger = createMockLedger();
      const caller = 'mock-public-key-xyz789';
      simulateEligibilityCheck(20, 18, ledger, caller);
      expect(ledger.verifications[caller]).toBe(true);
      simulateRevocation(ledger, caller);
      expect(ledger.verifications[caller]).toBe(false);
    });

  });

  // ── Test Suite 4: View Circuit ─────────────────────────────
  describe('getVerificationStatus circuit', () => {

    test('should return false for an address that has never verified', () => {
      const ledger = createMockLedger();
      const status = getStatus(ledger, 'unknown-key');
      expect(status).toBe(false);
    });

    test('should return true for a verified address', () => {
      const ledger = createMockLedger();
      const caller = 'verified-key-001';
      simulateEligibilityCheck(18, 18, ledger, caller);
      const status = getStatus(ledger, caller);
      expect(status).toBe(true);
    });

  });

});

// ── Simulation Helpers ─────────────────────────────────────────
// These simulate Compact circuit behavior for off-chain unit testing.
// Actual ZK proof generation requires the Compact compiler + proof server.

function createMockLedger() {
  return {
    totalChecks: 0,
    verifications: {},
  };
}

function simulateEligibilityCheck(privateAge, ageThreshold, ledger = createMockLedger(), caller = 'default-caller') {
  // Replicate the ZK assertion from the contract
  if (privateAge < ageThreshold) {
    throw new Error('Age does not meet the required threshold');
  }
  ledger.totalChecks += 1;
  ledger.verifications[caller] = true; // Only the boolean is written
  return { eligible: true, ledger };
}

function simulateRevocation(ledger, caller) {
  ledger.verifications[caller] = false;
}

function getStatus(ledger, caller) {
  return ledger.verifications[caller] ?? false;
}
