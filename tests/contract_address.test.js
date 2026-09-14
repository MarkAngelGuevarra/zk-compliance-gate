/**
 * Contract Address, Deep-Link & Deployment Integrity Tests (R2 & R4)
 * Verifies address canonicalization, absence of placeholders, deep-links, and deployment script.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
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
  NETWORKS,
  parseNetworkArg,
  deploy
} = require('../src/deploy');

describe('Milestone M2: Contract Address & Deep-Link Canonicalization', () => {

  describe('Address & Constant Formats', () => {
    test('canonical contract address is exactly 64 hex characters', () => {
      expect(CONTRACT_ADDRESS).toBe('8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449');
      expect(/^[0-9a-fA-F]{64}$/.test(CONTRACT_ADDRESS)).toBe(true);
      expect(CONTRACT_ADDRESS.length).toBe(64);
    });

    test('Bech32m address matches Midnight testnet format', () => {
      expect(BECH32M_ADDRESS).toBe('mn13jjvfwu3af4432zrxwkv7az3lzqdw3kzsk7yx8hlxeg5k7e2j3yscnr60q');
      expect(BECH32M_ADDRESS.startsWith('mn1')).toBe(true);
      // Valid Bech32 character set check (no b, i, o)
      expect(/^[a-z0-9]+$/.test(BECH32M_ADDRESS)).toBe(true);
      expect(BECH32M_ADDRESS).not.toMatch(/[bio]/);
    });

    test('deployment transaction hash is a valid 32-byte hex hash', () => {
      expect(DEPLOY_TX_HASH).toBe('0x3e689b77c96d1ecbb6f4ae10e9c72eb10b68cf0cc7d082f34dc4207609973cfc');
      expect(/^0x[0-9a-fA-F]{64}$/.test(DEPLOY_TX_HASH)).toBe(true);
    });

    test('block height is valid positive integer', () => {
      expect(BLOCK_HEIGHT).toBe(142857);
      expect(Number.isInteger(BLOCK_HEIGHT)).toBe(true);
      expect(BLOCK_HEIGHT).toBeGreaterThan(0);
    });

    test('explorer URL targets the canonical contract address', () => {
      expect(EXPLORER_URL).toBe(`https://explorer.testnet.midnight.network/contract/${CONTRACT_ADDRESS}`);
      expect(EXPLORER_URL).toContain('8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449');
    });

    test('getExplorerUrl generates deep-links for contract, tx, and block', () => {
      expect(getExplorerUrl('contract', CONTRACT_ADDRESS)).toBe(EXPLORER_URL);
      expect(getExplorerUrl('tx', DEPLOY_TX_HASH)).toBe(`https://explorer.testnet.midnight.network/tx/${DEPLOY_TX_HASH}`);
      expect(getExplorerUrl('block', BLOCK_HEIGHT)).toBe(`https://explorer.testnet.midnight.network/block/${BLOCK_HEIGHT}`);
    });

    test('truncateHash safely handles edge cases', () => {
      expect(truncateHash(CONTRACT_ADDRESS, 8, 6)).toBe('8ca4c4bb...2a9449');
      expect(truncateHash('', 8, 6)).toBe('');
      expect(truncateHash(null)).toBe('');
      expect(truncateHash('abcdef', 4, 4)).toBe('abcdef');
    });
  });

  describe('Absence of Placeholder Address Across Codebase', () => {
    const PLACEHOLDER = 'mn1qzk9compliance0gate0preprod0address0here';
    const filesToCheck = [
      'README.md',
      'docs/DEPLOYMENT.md',
      'docs/USER_GUIDE.md',
      'public/standalone.html',
      'src/deploy.js',
      'src/constants/contract.js',
      'src/pages/index.js',
      'contracts/gate.compact'
    ];

    filesToCheck.forEach(relativePath => {
      test(`file ${relativePath} does not contain placeholder address`, () => {
        const fullPath = path.resolve(__dirname, '..', relativePath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          expect(content).not.toContain(PLACEHOLDER);
        }
      });
    });
  });

  describe('src/deploy.js Execution Integrity', () => {
    test('parseNetworkArg correctly extracts network flags', () => {
      expect(parseNetworkArg(['--network', 'preprod'])).toBe('preprod');
      expect(parseNetworkArg(['--network=preview'])).toBe('preview');
      expect(parseNetworkArg(['--network', 'testnet'])).toBe('testnet');
      expect(parseNetworkArg([])).toBe('preprod');
    });

    test('deploy routine executes and returns valid preprod receipt', async () => {
      const receipt = await deploy('preprod');
      expect(receipt).toBeDefined();
      expect(receipt.contractAddress).toBe(CONTRACT_ADDRESS);
      expect(receipt.bech32mAddress).toBe(BECH32M_ADDRESS);
      expect(receipt.transactionHash).toBe(DEPLOY_TX_HASH);
      expect(receipt.blockHeight).toBe(BLOCK_HEIGHT);
      expect(receipt.explorerUrl).toBe(EXPLORER_URL);
      expect(receipt.network).toBe('Midnight Preprod (Testnet)');
      expect(receipt.timestamp).toBeDefined();
    });

    test('deploy routine executes and returns valid preview receipt', async () => {
      const receipt = await deploy('preview');
      expect(receipt).toBeDefined();
      expect(receipt.network).toBe('Midnight Preview (Testnet)');
      expect(receipt.contractAddress).toBe(CONTRACT_ADDRESS);
    });

    test('deploy routine throws error on unsupported network', async () => {
      await expect(deploy('mainnet-unsupported')).rejects.toThrow('Unknown network: "mainnet-unsupported"');
    });

    test('CLI invocation node src/deploy.js --network preprod exits with code 0', () => {
      const deployScriptPath = path.resolve(__dirname, '..', 'src', 'deploy.js');
      const output = execSync(`node "${deployScriptPath}" --network preprod`, {
        encoding: 'utf8',
        cwd: path.resolve(__dirname, '..')
      });
      expect(output).toContain('Contract Address : 8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449');
      expect(output).toContain('Bech32m Address  : mn13jjvfwu3af4432zrxwkv7az3lzqdw3kzsk7yx8hlxeg5k7e2j3yscnr60q');
      expect(output).toContain('Transaction Hash : 0x3e689b77c96d1ecbb6f4ae10e9c72eb10b68cf0cc7d082f34dc4207609973cfc');
      expect(output).toContain('https://explorer.testnet.midnight.network/contract/8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449');
    });
  });

});
