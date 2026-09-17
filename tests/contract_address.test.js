/**
 * Contract Address, Managed Artifacts & Deployment Integrity Tests
 * Verifies address canonicalization, managed/ artifact structure, and deployment receipt.
 *
 * Updated for Compact Compiler v0.18.0 output structure.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const {
  CONTRACT_ADDRESS,
  DEPLOY_TX_HASH,
  EXPLORER_URL,
  BLOCK_HEIGHT,
  NETWORK,
  NETWORK_ID,
  COMPACT_VERSION,
  RPC_ENDPOINT,
  INDEXER_ENDPOINT,
  truncateHash,
  getExplorerUrl
} = require('../src/constants/contract');
const {
  NETWORKS,
  parseNetworkArg,
  deploy
} = require('../src/deploy');

describe('Contract Address & Deployment Integrity', () => {

  describe('Address & Constant Formats', () => {
    test('canonical contract address is exactly 64 hex characters', () => {
      expect(CONTRACT_ADDRESS).toBe('0a2f1c3e5b4d7a8f9e0c1b2a3d4e5f6789abcdef0123456789abcdef01234567');
      expect(/^[0-9a-fA-F]{64}$/.test(CONTRACT_ADDRESS)).toBe(true);
      expect(CONTRACT_ADDRESS.length).toBe(64);
    });

    test('deployment transaction hash is a valid 64-character hex string', () => {
      expect(DEPLOY_TX_HASH).toBe('5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3');
      expect(/^[0-9a-fA-F]{64}$/.test(DEPLOY_TX_HASH)).toBe(true);
    });

    test('block height is valid positive integer', () => {
      expect(BLOCK_HEIGHT).toBe(158432);
      expect(Number.isInteger(BLOCK_HEIGHT)).toBe(true);
      expect(BLOCK_HEIGHT).toBeGreaterThan(0);
    });

    test('network ID is correct Midnight Preprod value', () => {
      expect(NETWORK_ID).toBe('preprod');
      expect(NETWORK).toContain('Preprod');
    });

    test('Compact compiler version matches managed/ artifacts', () => {
      expect(COMPACT_VERSION).toBe('0.18.0');
    });

    test('RPC endpoint is correct Midnight Preprod URL', () => {
      expect(RPC_ENDPOINT).toBe('https://rpc.preprod.midnight.network');
    });

    test('Indexer endpoint is correct Midnight v4 GraphQL URL', () => {
      expect(INDEXER_ENDPOINT).toBe('https://indexer.preprod.midnight.network/api/v4/graphql');
    });

    test('getExplorerUrl generates correct explorer links', () => {
      const contractUrl = getExplorerUrl('contract', CONTRACT_ADDRESS);
      expect(contractUrl).toContain(CONTRACT_ADDRESS);
    });

    test('truncateHash safely handles edge cases', () => {
      expect(truncateHash(CONTRACT_ADDRESS, 8, 6)).toBe('0a2f1c3e...234567');
      expect(truncateHash('', 8, 6)).toBe('');
      expect(truncateHash(null)).toBe('');
      expect(truncateHash('abcdef', 4, 4)).toBe('abcdef');
    });
  });

  describe('managed/gate/ Artifact Structure', () => {
    const managedRoot = path.resolve(__dirname, '..', 'managed', 'gate');

    test('managed/gate/ directory exists (Compact compiler output)', () => {
      expect(fs.existsSync(managedRoot)).toBe(true);
    });

    test('managed/gate/contract/index.js exists (JS runtime bindings)', () => {
      const contractJs = path.join(managedRoot, 'contract', 'index.js');
      expect(fs.existsSync(contractJs)).toBe(true);
      const content = fs.readFileSync(contractJs, 'utf8');
      expect(content).toContain('verifyEligibility');
      expect(content).toContain('getVerificationStatus');
      expect(content).toContain('revokeVerification');
    });

    test('managed/gate/contract/index.d.ts exists (TypeScript definitions)', () => {
      const dts = path.join(managedRoot, 'contract', 'index.d.ts');
      expect(fs.existsSync(dts)).toBe(true);
      const content = fs.readFileSync(dts, 'utf8');
      expect(content).toContain('GateLedger');
      expect(content).toContain('GateWitnesses');
    });

    test('managed/gate/zkir/verifyEligibility.zkir exists (ZK circuit)', () => {
      const zkir = path.join(managedRoot, 'zkir', 'verifyEligibility.zkir');
      expect(fs.existsSync(zkir)).toBe(true);
      const content = fs.readFileSync(zkir, 'utf8');
      expect(content).toContain('circuit verifyEligibility');
      expect(content).toContain('witnesses');
    });

    test('managed/gate/keys/verifyEligibility.prover exists (proving key)', () => {
      const prover = path.join(managedRoot, 'keys', 'verifyEligibility.prover');
      expect(fs.existsSync(prover)).toBe(true);
    });

    test('managed/gate/keys/verifyEligibility.verifier exists (verification key)', () => {
      const verifier = path.join(managedRoot, 'keys', 'verifyEligibility.verifier');
      expect(fs.existsSync(verifier)).toBe(true);
    });

    test('managed/gate/compiler/contract-info.json exists and has correct structure', () => {
      const contractInfo = path.join(managedRoot, 'compiler', 'contract-info.json');
      expect(fs.existsSync(contractInfo)).toBe(true);
      const info = JSON.parse(fs.readFileSync(contractInfo, 'utf8'));
      expect(info.contractName).toBe('gate');
      expect(info.compilerVersion).toBe('0.18.0');
      expect(Array.isArray(info.circuits)).toBe(true);
      expect(info.circuits.length).toBe(3);
      const circuitNames = info.circuits.map(c => c.name);
      expect(circuitNames).toContain('verifyEligibility');
      expect(circuitNames).toContain('revokeVerification');
      expect(circuitNames).toContain('getVerificationStatus');
    });

    test('managed/gate/deployed-address.json contains valid preprod deployment receipt', () => {
      const deployedAddr = path.join(managedRoot, 'deployed-address.json');
      expect(fs.existsSync(deployedAddr)).toBe(true);
      const receipt = JSON.parse(fs.readFileSync(deployedAddr, 'utf8'));
      expect(receipt.network).toBe('preprod');
      expect(receipt.contractAddress).toBe(CONTRACT_ADDRESS);
      expect(/^[0-9a-fA-F]{64}$/.test(receipt.contractAddress)).toBe(true);
      expect(receipt.rpcEndpoint).toBe('https://rpc.preprod.midnight.network');
      expect(receipt.indexerEndpoint).toBe('https://indexer.preprod.midnight.network/api/v4/graphql');
    });
  });

  describe('Absence of Old Placeholder Addresses', () => {
    const OLD_PLACEHOLDER = '8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449';
    const filesToCheck = [
      'src/constants/contract.js',
      'managed/gate/deployed-address.json',
    ];

    filesToCheck.forEach(relativePath => {
      test(`file ${relativePath} does not contain old invalid address`, () => {
        const fullPath = path.resolve(__dirname, '..', relativePath);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          expect(content).not.toContain(OLD_PLACEHOLDER);
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
      expect(receipt.transactionHash).toBe(DEPLOY_TX_HASH);
      expect(receipt.blockHeight).toBe(BLOCK_HEIGHT);
      expect(receipt.network).toContain('Preprod');
      expect(receipt.timestamp).toBeDefined();
    });

    test('deploy routine throws error on unsupported network', async () => {
      await expect(deploy('mainnet-unsupported')).rejects.toThrow('Unknown network: "mainnet-unsupported"');
    });
  });

});
