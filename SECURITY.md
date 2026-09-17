# Security & Privacy Model

## Zero-Knowledge Privacy Guarantee

ZK Compliance Gate is built on a fundamental cryptographic privacy boundary:

### What is NEVER disclosed

| Data | Visibility | How it's protected |
|:---|:---|:---|
| User's actual age | 🔒 **Private** | Declared as `witness getPrivateAge(): Uint<8>` — evaluated locally on prover's device, never broadcast |
| Net worth / financial data | 🔒 **Private** | Same `witness` pattern — stays in browser's prover enclave |
| Jurisdiction / location | 🔒 **Private** | Same `witness` pattern |
| User's identity | 🔒 **Private** | Only `ZswapCoinPublicKey` (a pseudonym) is on-chain |

### What IS disclosed on-chain

| Data | Visibility | Why |
|:---|:---|:---|
| `verifications[caller]` | 🌐 Public | Binary outcome (true/false) — the bare minimum for on-chain verifiability |
| `totalChecks` (counter) | 🌐 Public | Aggregate usage metric — no individual data |
| `ageThreshold` | 🌐 Public | The minimum requirement (e.g., 18) — already public by design |
| ZK proof `π` | 🌐 Public | Mathematical proof that constraint holds — reveals nothing about witnesses |

---

## Threat Model

### ✅ Protected Against

- **Verifier colluding with on-chain observer**: The on-chain state only contains `true/false` — no age or identity data is recoverable.
- **Network surveillance of ZK proof submission**: The proof `π` is zero-knowledge — it proves `age >= threshold` without revealing `age`.
- **Replay attacks**: Each proof is fresh (randomized by the Halo2 IPA scheme — inner product argument with blinding factors).
- **Proof forgery**: Computational soundness under discrete log hardness — the verifier key is on-chain and public.

### ⚠️ Not Protected Against (by design)

- **Timing attacks on the prover's local machine**: If an attacker has full control of the user's device before proof generation, all bets are off. This is out of scope for any ZK system.
- **dApp-level logging**: If the dApp's JavaScript logs the witness value before passing it to the prover, privacy is violated. **This app does not do this** — no witness values are logged.
- **The eligibility outcome itself**: If `verifications[caller] = true`, an observer knows the caller passed the threshold (not what their age is, but that they passed). This is intentional — it enables on-chain access control.

---

## Compact Language Privacy Architecture

The privacy guarantee is enforced at the **language level** by Midnight Compact:

```compact
// ✅ CORRECT: Private witness — value never leaves the prover's device
witness getPrivateAge(): Uint<8>;

export circuit verifyEligibility(ageThreshold: Uint<8>): [] {
  const privateAge: Uint<8> = getPrivateAge();  // Local only
  assert privateAge >= ageThreshold;            // ZK constraint
  ledger.verifications.insert(own_public_key(), disclose(true));  // Only boolean disclosed
}
```

**Why `witness` instead of a circuit parameter?**

If `privateAge` were a circuit parameter (e.g., `export circuit verifyEligibility(ageThreshold: Uint<8>, privateAge: Uint<8>)`), it would be a **public input** visible in the transaction and on-chain. The `witness` keyword ensures it is:

1. Evaluated locally by the prover's JavaScript layer
2. Consumed inside the ZK circuit
3. Discarded — it never appears in the transaction payload

---

## Reporting Security Issues

If you discover a privacy or security issue in ZK Compliance Gate, please report it responsibly:

- **Email:** markangel.guevarra@gmail.com  
- **X (Twitter):** [@ZKComplianceGate](https://x.com/ZKComplianceGate)

Do **not** open a public GitHub issue for security vulnerabilities. We will respond within 48 hours.
