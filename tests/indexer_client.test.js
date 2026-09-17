/**
 * Indexer Client Integration Tests
 * Tests the Midnight Preprod Indexer GraphQL client with fallback behavior
 */

const { fetchLatestBlock, fetchContractEvents } = require('../src/lib/indexerClient');

describe('Midnight Indexer Client', () => {
  describe('fetchLatestBlock', () => {
    test('returns a block object with height and live status', async () => {
      const block = await fetchLatestBlock();
      expect(block).toBeDefined();
      expect(typeof block.height).toBe('number');
      expect(block.height).toBeGreaterThan(0);
      expect(typeof block.live).toBe('boolean');
    });

    test('falls back gracefully when Indexer is unreachable', async () => {
      // The Indexer may be unreachable in CI — fallback should still return valid data
      const block = await fetchLatestBlock();
      if (!block.live) {
        expect(block.height).toBeGreaterThan(100000); // static fallback BLOCK_HEIGHT
        expect(block.hash).toBeNull();
      }
    });
  });

  describe('fetchContractEvents', () => {
    test('returns event array with expected structure', async () => {
      const result = await fetchContractEvents();
      expect(result).toBeDefined();
      expect(Array.isArray(result.events)).toBe(true);
      expect(typeof result.live).toBe('boolean');
      expect(typeof result.hasNextPage).toBe('boolean');
    });

    test('fallback demo events contain verifyEligibility circuit calls', async () => {
      const result = await fetchContractEvents();
      if (!result.live) {
        // Demo fallback should include verifyEligibility events
        const circuitNames = result.events.map(e => e.circuitName);
        expect(circuitNames).toContain('verifyEligibility');
        expect(result.events[0]).toHaveProperty('txHash');
        expect(result.events[0]).toHaveProperty('blockHeight');
        expect(result.events[0]).toHaveProperty('timestamp');
      }
    });
  });
});
