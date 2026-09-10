# 📖 ZK Compliance Gate — End-to-End User & Tester Guide

Welcome to the **ZK Compliance Gate** user guide. This guide explains how to connect your Lace wallet, configure Midnight Preprod, execute zero-knowledge eligibility checks, and verify on-chain privacy guarantees.

---

## 🚀 Quick Start (30 Seconds)

1. Open the live dApp: [https://zk-compliance-gate.vercel.app/](https://zk-compliance-gate.vercel.app/)
2. Click **🔗 Connect Lace Wallet**.
3. Select an age threshold preset (e.g., `18+` or `21+`).
4. Enter your age in the **Private Witness** field.
5. Click **🚀 Generate ZK Proof & Verify**.
6. View your **Eligibility Confirmed** receipt and on-chain public state.

---

## 🛠️ Detailed Setup Instructions

### Step 1: Install & Set Up Lace Wallet
The dApp uses the **Midnight DApp Connector API (CIP-95)** to interface with your browser wallet.
1. Install the [Lace Wallet Extension](https://www.lace.io/) for Chrome, Brave, or Edge.
2. Create or restore a wallet.
3. Open Lace **Settings ⚙️ → Network** and select **Midnight Testnet (Preprod)**.

> *Note: If you do not have Lace installed, the dApp automatically provides a mock testing session so you can preview the zero-knowledge verification workflow immediately.*

### Step 2: Request Preprod Testnet Tokens (Optional)
To interact directly with live Midnight smart contracts:
1. Copy your Midnight Preprod address from Lace (`mn1q...`).
2. Visit the [Midnight Faucet](https://faucet.midnight.network).
3. Request testnet tokens to fund your transaction gas fees.

---

## 🔐 How to Run an Eligibility Verification

### 1. Connecting Your Wallet
* Click **🔗 Connect Lace** at the top of the dApp.
* Approve the connection request in the Lace pop-up window.
* Once connected, your public key (`0x...` or `mn1q...`) and an active green status indicator will appear.
* **Privacy Guarantee:** Only your public address is shared with the dApp. Private keys and spending authority never leave your wallet.

### 2. Choosing Compliance Parameters
* **Age Threshold (Public Input):** Select a standard regulatory preset (`18+ Adult`, `21+ US Compliance`, `25+ Exclusive`, `65+ Senior`) or enter a custom threshold. This threshold is recorded publicly on the ledger.
* **Your Actual Age (Private Witness):** Enter your true age in years.
  * 🔒 **Zero-Knowledge Guarantee:** This number is kept strictly within your browser's local memory. It is passed into the Compact arithmetic circuit as a private witness. **It is never transmitted over the network or saved to any database.**

### 3. Generating the ZK-SNARK Proof
* Click **🚀 Generate ZK Proof & Verify**.
* The Compact circuit executes locally:
  1. *Encoding private witness into arithmetic constraints.*
  2. *Asserting $privateAge \ge threshold$.*
  3. *Generating zero-knowledge proof $\pi$.*
  4. *Submitting proof and declassified boolean outcome (`disclose(true)`) to Midnight Preprod.*

---

## 📊 Understanding Your Verification Receipt

Upon successful verification, the dApp renders a cryptographic audit panel:

### 🌐 What the Blockchain Sees (Public Domain)
* **`caller_address`**: Your Midnight public key.
* **`eligible`**: `true` (Disclosed boolean outcome).
* **`threshold_used`**: The required threshold (e.g. `18`).
* **`timestamp`**: Transaction execution time.
* **`ledger.totalChecks`**: Global counter incremented by 1.

### 🔒 What the Blockchain DOES NOT See (Private Domain)
* **`private_age`**: `██████ (Concealed inside ZK circuit)`.
* An external observer or smart contract inspector learns **only** that you met the required bar, but learns zero information about your exact age.

---

## 🔄 Privacy Hygiene: Revoking Verification

If you wish to remove your eligibility record from the public ledger:
1. Execute the `revokeVerification()` circuit.
2. The contract commits `disclose(false)` to `ledger.verifications[own_public_key()]`.
3. Your on-chain eligibility record is reset.

---

## ❓ Frequently Asked Questions (FAQ)

**Q: Can anyone figure out my age from the transaction?**  
**A:** No. Midnight's ZK-SNARKs mathematically guarantee zero-knowledge. The blockchain verifier only verifies that the mathematical statement $privateAge \ge threshold$ evaluated to true.

**Q: Does this work on mobile?**  
**A:** The dApp is fully mobile-responsive. Mobile wallet support will expand as Midnight connector extensions become available on mobile browsers.

**Q: Where can I inspect the contract on the block explorer?**  
**A:** You can view testnet activity on the [Midnight Testnet Explorer](https://explorer.testnet.midnight.network).
