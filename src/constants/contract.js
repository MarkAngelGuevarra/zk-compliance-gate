/**
 * Canonical Midnight Preprod Contract Constants
 * ZK-ComplianceGate Enterprise Deployment
 */

const CONTRACT_ADDRESS = '8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449';
const BECH32M_ADDRESS = 'mn13jjvfwu3af4432zrxwkv7az3lzqdw3kzsk7yx8hlxeg5k7e2j3yscnr60q';
const DEPLOY_TX_HASH = '0x3e689b77c96d1ecbb6f4ae10e9c72eb10b68cf0cc7d082f34dc4207609973cfc';
const EXPLORER_URL = 'https://explorer.testnet.midnight.network/contract/8ca4c4bb91ea6b58a84333accf7451f880d746c285bc431eff36514b7b2a9449';
const EXPLORER_BASE_URL = 'https://explorer.testnet.midnight.network';
const BLOCK_HEIGHT = 142857;
const NETWORK = 'Midnight Preprod Testnet';
const NETWORK_ID = 'testnet-02';
const COMPACT_VERSION = '0.14.0';

/**
 * Truncates an address or hash for UI display
 * @param {string} addr
 * @param {number} prefixLen
 * @param {number} suffixLen
 * @returns {string}
 */
function truncateHash(addr, prefixLen = 8, suffixLen = 6) {
  if (!addr || typeof addr !== 'string') return '';
  if (addr.length <= prefixLen + suffixLen) return addr;
  return `${addr.slice(0, prefixLen)}...${addr.slice(-suffixLen)}`;
}

/**
 * Generates an explorer link for a transaction hash or contract
 * @param {'contract'|'tx'|'block'} type
 * @param {string|number} identifier
 * @returns {string}
 */
function getExplorerUrl(type = 'contract', identifier = CONTRACT_ADDRESS) {
  if (type === 'contract') {
    return `${EXPLORER_BASE_URL}/contract/${identifier}`;
  }
  if (type === 'tx') {
    return `${EXPLORER_BASE_URL}/tx/${identifier}`;
  }
  if (type === 'block') {
    return `${EXPLORER_BASE_URL}/block/${identifier}`;
  }
  return EXPLORER_URL;
}

module.exports = {
  CONTRACT_ADDRESS,
  BECH32M_ADDRESS,
  DEPLOY_TX_HASH,
  EXPLORER_URL,
  EXPLORER_BASE_URL,
  BLOCK_HEIGHT,
  NETWORK,
  NETWORK_ID,
  COMPACT_VERSION,
  truncateHash,
  getExplorerUrl
};
