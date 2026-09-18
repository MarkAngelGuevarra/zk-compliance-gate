/**
 * tests/level5_community.test.js
 *
 * Level 5: Community Hub and User Onboarding Tests
 * Verifies TesterHub and UserLeaderboard component logic,
 * the POWER_START.md guide, and Preprod tester data structures.
 */

const fs = require('fs');
const path = require('path');
const { CONTRACT_ADDRESS, RPC_ENDPOINT, INDEXER_ENDPOINT } = require('../src/constants/contract');

describe('Level 5: Community Hub & User Onboarding', () => {

  describe('TesterHub Component Existence', () => {
    test('src/components/TesterHub.jsx exists', () => {
      const p = path.resolve(__dirname, '..', 'src', 'components', 'TesterHub.jsx');
      expect(fs.existsSync(p)).toBe(true);
    });

    test('TesterHub contains 5-step onboarding guide', () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, '..', 'src', 'components', 'TesterHub.jsx'), 'utf8'
      );
      expect(content).toContain('Install Lace Wallet');
      expect(content).toContain('Configure Midnight Preprod');
      expect(content).toContain('Get tDUST Testnet Tokens');
      expect(content).toContain('Run ZK Eligibility Proof');
      expect(content).toContain('faucet.preprod.midnight.network');
    });

    test('TesterHub references the correct contract address', () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, '..', 'src', 'components', 'TesterHub.jsx'), 'utf8'
      );
      // Should import from constants, not hardcode
      expect(content).toContain('CONTRACT_ADDRESS');
      expect(content).not.toContain('8ca4c4bb');
    });

    test('TesterHub includes share-to-X functionality', () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, '..', 'src', 'components', 'TesterHub.jsx'), 'utf8'
      );
      expect(content).toContain('twitter.com/intent/tweet');
      expect(content).toContain('ZKComplianceGate');
    });
  });

  describe('UserLeaderboard Component Existence', () => {
    test('src/components/UserLeaderboard.jsx exists', () => {
      const p = path.resolve(__dirname, '..', 'src', 'components', 'UserLeaderboard.jsx');
      expect(fs.existsSync(p)).toBe(true);
    });

    test('UserLeaderboard queries Midnight Preprod Indexer v4 API', () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, '..', 'src', 'components', 'UserLeaderboard.jsx'), 'utf8'
      );
      expect(content).toContain('indexer.preprod.midnight.network');
      expect(content).toContain('/api/v4/graphql');
      expect(content).toContain('contractTransactions');
    });

    test('UserLeaderboard sets 50-user Level 5 goal', () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, '..', 'src', 'components', 'UserLeaderboard.jsx'), 'utf8'
      );
      expect(content).toContain('50');
      expect(content).toContain('goal');
    });

    test('UserLeaderboard falls back gracefully when Indexer unreachable', () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, '..', 'src', 'components', 'UserLeaderboard.jsx'), 'utf8'
      );
      expect(content).toContain('Demo Mode');
      expect(content).toContain('DEMO_VERIFICATIONS');
      expect(content).toContain('catch');
    });
  });

  describe('MainnetRoadmap Component Existence', () => {
    test('src/components/MainnetRoadmap.jsx exists', () => {
      const p = path.resolve(__dirname, '..', 'src', 'components', 'MainnetRoadmap.jsx');
      expect(fs.existsSync(p)).toBe(true);
    });

    test('MainnetRoadmap references correct Mainnet RPC endpoint', () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, '..', 'src', 'components', 'MainnetRoadmap.jsx'), 'utf8'
      );
      expect(content).toContain('rpc.midnight.network');
      expect(content).toContain('indexer.midnight.network');
    });

    test('MainnetRoadmap includes Docker proof server instructions', () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, '..', 'src', 'components', 'MainnetRoadmap.jsx'), 'utf8'
      );
      expect(content).toContain('docker run');
      expect(content).toContain('proof-server');
      expect(content).toContain('6300');
    });
  });

  describe('POWER_START.md Documentation', () => {
    test('docs/POWER_START.md exists', () => {
      const p = path.resolve(__dirname, '..', 'docs', 'POWER_START.md');
      expect(fs.existsSync(p)).toBe(true);
    });

    test('POWER_START.md contains all 3 usage options', () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, '..', 'docs', 'POWER_START.md'), 'utf8'
      );
      expect(content).toContain('Option A');
      expect(content).toContain('Option B');
      expect(content).toContain('Option C');
      expect(content).toContain('Lace Wallet');
      expect(content).toContain('faucet.preprod.midnight.network');
    });

    test('POWER_START.md references ZK architecture diagram', () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, '..', 'docs', 'POWER_START.md'), 'utf8'
      );
      expect(content).toContain('ZK Circuit');
      expect(content).toContain('privateAge');
      expect(content).toContain('witness getPrivateAge');
    });
  });

  describe('Level 5 Network Config Correctness', () => {
    test('INDEXER_ENDPOINT is the correct Midnight Preprod v4 URL', () => {
      expect(INDEXER_ENDPOINT).toBe('https://indexer.preprod.midnight.network/api/v4/graphql');
    });

    test('RPC_ENDPOINT is the correct Midnight Preprod URL', () => {
      expect(RPC_ENDPOINT).toBe('https://rpc.preprod.midnight.network');
    });

    test('CONTRACT_ADDRESS is a valid 64-hex Midnight contract address', () => {
      expect(/^[0-9a-fA-F]{64}$/.test(CONTRACT_ADDRESS)).toBe(true);
    });
  });
});
