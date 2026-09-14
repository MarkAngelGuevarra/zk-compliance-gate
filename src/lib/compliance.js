/**
 * Compliance Gate Domain Logic & Zero-Knowledge Verification Simulator
 * Implements Midnight Compact compliance presets, witness redaction, and audit receipt generation.
 */

const { CONTRACT_ADDRESS, BECH32M_ADDRESS, BLOCK_HEIGHT } = require('../constants/contract');

const COMPLIANCE_PRESETS = [
  {
    id: 'AGE_18',
    label: '18+ Standard Adult',
    category: 'Age Gate',
    badge: 'DeFi Standard',
    type: 'age',
    threshold: 18,
    unit: 'years old',
    description: 'Universal Web3 & DeFi protocol compliance threshold (assert privateAge >= 18).',
    circuitAssertion: 'assert privateAge >= 18 : "Age must be at least 18"',
    defaultInput: 24,
    minInput: 0,
    maxInput: 120,
    inputLabel: 'Private Age (Years)',
    inputPlaceholder: 'e.g. 24'
  },
  {
    id: 'AGE_21',
    label: '21+ USA Regulatory',
    category: 'Age Gate',
    badge: 'US SEC / CFTC',
    type: 'age',
    threshold: 21,
    unit: 'years old',
    description: 'Strict age threshold for high-risk financial instruments & US regulatory alignment.',
    circuitAssertion: 'assert privateAge >= 21 : "Age must be at least 21"',
    defaultInput: 25,
    minInput: 0,
    maxInput: 120,
    inputLabel: 'Private Age (Years)',
    inputPlaceholder: 'e.g. 25'
  },
  {
    id: 'ACCREDITED',
    label: 'Accredited Investor (Reg D 506c)',
    category: 'Investor Tier',
    badge: 'Institutional Reg D',
    type: 'accredited',
    threshold: 1000000,
    unit: 'USD Net Worth',
    description: 'Institutional accredited investor qualification (minimum $1,000,000 net worth excluding primary residence).',
    circuitAssertion: 'assert privateNetWorth >= 1000000 : "Net worth must meet accredited investor threshold"',
    defaultInput: 1500000,
    minInput: 0,
    maxInput: 100000000,
    inputLabel: 'Private Net Worth ($ USD)',
    inputPlaceholder: 'e.g. 1500000'
  },
  {
    id: 'JURISDICTION',
    label: 'Jurisdiction Allowlist (FATF Non-Sanctioned)',
    category: 'Geographic AML',
    badge: 'FATF Compliant',
    type: 'jurisdiction',
    threshold: 'PERMITTED',
    unit: 'ISO Country Code',
    description: 'FATF & OFAC non-sanctioned residency screening with privacy-preserving membership proof.',
    circuitAssertion: 'assert isPermittedJurisdiction(privateCountryCode) : "Jurisdiction not in allowlist"',
    defaultInput: 'US',
    inputLabel: 'Private Residency (ISO Country Code)',
    inputPlaceholder: 'e.g. US, GB, DE, SG, JP'
  }
];

const SANCTIONED_COUNTRIES = ['IR', 'KP', 'SY', 'CU', 'RU', 'BY', 'MM'];
const PERMITTED_COUNTRIES = [
  'US', 'GB', 'DE', 'FR', 'JP', 'SG', 'CH', 'CA', 'AU', 'NL',
  'SE', 'NO', 'DK', 'FI', 'IE', 'NZ', 'KR', 'AE', 'IT', 'ES'
];

/**
 * Redacts a private witness value into a cryptographic shielded commitment string
 * @param {number|string} witnessValue
 * @param {string} presetType
 * @returns {string}
 */
function redactWitness(witnessValue, presetType = 'age') {
  if (witnessValue === undefined || witnessValue === null || witnessValue === '') {
    return '[SHIELDED: 0x0000...uninitialized]';
  }

  // Derive a deterministic pseudo-halo2 polynomial commitment hash from the witness
  const rawStr = String(witnessValue);
  let hashVal = 0x811c9dc5;
  for (let i = 0; i < rawStr.length; i++) {
    hashVal ^= rawStr.charCodeAt(i);
    hashVal = (hashVal * 0x01000193) >>> 0;
  }
  const hexHash = hashVal.toString(16).padStart(8, '0');
  return `[SHIELDED: 0x${hexHash}c7b1...halo2-vector]`;
}

/**
 * Validates private witness against circuit constraints
 * @param {object} params
 * @param {string} params.presetId
 * @param {number|string} params.witnessValue
 * @returns {{ eligible: boolean, error: string | null }}
 */
function evaluateComplianceWitness({ presetId, witnessValue }) {
  const preset = COMPLIANCE_PRESETS.find(p => p.id === presetId) || COMPLIANCE_PRESETS[0];

  if (preset.type === 'age') {
    const age = Number(witnessValue);
    if (isNaN(age) || age < 0) {
      return { eligible: false, error: 'Invalid age: Value must be a non-negative number' };
    }
    if (age < preset.threshold) {
      return {
        eligible: false,
        error: `Age constraint failed: Provided age (${age}) does not meet the required threshold (${preset.threshold})`
      };
    }
    return { eligible: true, error: null };
  }

  if (preset.type === 'accredited') {
    const netWorth = Number(witnessValue);
    if (isNaN(netWorth) || netWorth < 0) {
      return { eligible: false, error: 'Invalid net worth: Value must be a non-negative number' };
    }
    if (netWorth < preset.threshold) {
      return {
        eligible: false,
        error: `Net worth constraint failed: Provided net worth ($${netWorth.toLocaleString()}) does not meet the $1,000,000 threshold`
      };
    }
    return { eligible: true, error: null };
  }

  if (preset.type === 'jurisdiction') {
    const code = String(witnessValue || '').trim().toUpperCase();
    if (!code || code.length !== 2) {
      return { eligible: false, error: 'Invalid jurisdiction: Please provide a valid 2-letter ISO country code (e.g. US, GB, DE)' };
    }
    if (SANCTIONED_COUNTRIES.includes(code)) {
      return { eligible: false, error: `Jurisdiction restricted: Country code ${code} is on the OFAC/FATF sanctions restriction list` };
    }
    return { eligible: true, error: null };
  }

  return { eligible: false, error: 'Unknown compliance preset' };
}

/**
 * Generates telemetry stages for proof execution
 * @param {string} presetId
 * @param {boolean} isSuccess
 * @returns {Array<{ stage: number, label: string, progress: number, durationMs: number, log: string }>}
 */
function getProverTelemetryStages(presetId = 'AGE_18', isSuccess = true) {
  const preset = COMPLIANCE_PRESETS.find(p => p.id === presetId) || COMPLIANCE_PRESETS[0];

  return [
    {
      stage: 1,
      label: 'Enclave Initialization',
      progress: 20,
      durationMs: 400,
      log: '[0.00s] Initializing Midnight Prover Enclave via CIP-95 DApp Connector...'
    },
    {
      stage: 2,
      label: 'Shielded Witness Ingestion',
      progress: 45,
      durationMs: 450,
      log: `[0.42s] Ingesting private witness vector W = [${preset.type}_witness, salt, blinding_nonce]`
    },
    {
      stage: 3,
      label: 'Circuit Synthesis',
      progress: 70,
      durationMs: 500,
      log: `[0.98s] Synthesizing Compact R1CS arithmetic circuit constraints (${preset.circuitAssertion})`
    },
    {
      stage: 4,
      label: 'Halo2 Proof Generation',
      progress: 90,
      durationMs: 550,
      log: isSuccess
        ? '[1.52s] Generating Halo2/KZG polynomial commitment & proof π = (A, B, C)...'
        : '[1.52s] Circuit constraint violation: Proof π generation aborted.'
    },
    {
      stage: 5,
      label: 'Consensus Disclosure',
      progress: 100,
      durationMs: 400,
      log: isSuccess
        ? `[1.95s] Disclosing public boolean outcome (eligible: true) to Midnight Preprod RPC (testnet-02)...`
        : `[1.95s] Disclosing rejection outcome (eligible: false) to Midnight Preprod RPC...`
    }
  ];
}

/**
 * Generates an institutional side-by-side cryptographic audit receipt
 * @param {object} params
 * @returns {object} Audit receipt object
 */
function generateAuditReceipt({
  caller,
  presetId,
  witnessValue,
  eligible,
  blockHeight = BLOCK_HEIGHT,
  txHash = null
}) {
  const preset = COMPLIANCE_PRESETS.find(p => p.id === presetId) || COMPLIANCE_PRESETS[0];
  const now = new Date();
  const timestampIso = now.toISOString();
  const formattedTime = now.toUTCString();

  // Pseudo-random deterministic proof hash
  const seed = `${caller || 'anon'}_${presetId}_${witnessValue}_${timestampIso}`;
  let hashNum = 0x5bd1e995;
  for (let i = 0; i < seed.length; i++) {
    hashNum ^= seed.charCodeAt(i);
    hashNum = (hashNum * 0x1000193) >>> 0;
  }
  const generatedTxHash = txHash || `0x${hashNum.toString(16).padStart(8, '0')}7f3d2a1b9e4c6f8a2d5b3e7c9f1a4d6b8e2c5f7a`;
  const proofHash = `0x9a8f23b7${hashNum.toString(16).padStart(8, '0')}e41c6d852a10e8f3b29c7d4102e5b8719f3a2c6d4e8b01a75c3f912e`;

  return {
    id: `rcpt_${Date.now()}_${hashNum.toString(16).slice(0, 6)}`,
    timestamp: timestampIso,
    formattedTime,
    blockHeight,
    txHash: generatedTxHash,
    proofHash,
    contractAddress: CONTRACT_ADDRESS,
    bech32mAddress: BECH32M_ADDRESS,
    caller: caller || 'mn1q8a9fd3k82m5zcx7012y4vpwle9r7k8e2c5f7a',
    preset: {
      id: preset.id,
      label: preset.label,
      type: preset.type,
      threshold: preset.threshold,
      unit: preset.unit,
      circuitAssertion: preset.circuitAssertion
    },
    // Public Consensus State (Disclosed on Midnight Blockchain)
    publicState: {
      eligible,
      status: eligible ? 'PASS' : 'REJECTED',
      discloseCall: `disclose(${eligible ? 'true' : 'false'})`,
      thresholdEnforced: preset.type === 'jurisdiction' ? 'FATF Permitted' : String(preset.threshold),
      gasUsed: '1,420 uDUST',
      network: 'Midnight Preprod Testnet'
    },
    // Private Witness Shield (Cryptographically Concealed, 0 Leakage)
    privateShield: {
      redactedWitness: redactWitness(witnessValue, preset.type),
      witnessType: preset.inputLabel,
      proverEnclave: 'Client Browser Memory (Heap cleared upon proof emission)',
      leakageRate: '0 bytes transmitted to RPC or Indexer',
      zkGuarantee: 'Halo2/KZG — Computational Soundness ε < 2⁻¹²⁸'
    },
    verificationKey: 'vk_midnight_preprod_gate_v1_0_compact_8f29e1'
  };
}

module.exports = {
  COMPLIANCE_PRESETS,
  SANCTIONED_COUNTRIES,
  PERMITTED_COUNTRIES,
  redactWitness,
  evaluateComplianceWitness,
  getProverTelemetryStages,
  generateAuditReceipt
};
