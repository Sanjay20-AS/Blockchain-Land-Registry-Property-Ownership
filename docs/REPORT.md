# Project Report

## Abstract
This project presents an educational prototype of a blockchain-based land registry and property ownership system. The system uses Solidity smart contracts to register synthetic properties, verify records, associate ownership with wallet addresses, execute ownership transfers, preserve history and anchor document hashes.

## Introduction
Property registration involves multiple records, authorities and supporting documents. A blockchain-based approach can provide a shared, tamper-evident event history while keeping large or sensitive documents off-chain.

## Problem Statement
Traditional records may be fragmented, manually reconciled and difficult to audit. Duplicate or manipulated records can contribute to ownership disputes. The prototype explores whether deterministic smart-contract rules can improve traceability.

## Proposed System
An EVM smart contract provides role-based registration and verification, owner-controlled transfer, notary-completed multi-step transfer, status management and ownership history. A React frontend provides a simple verification interface.

## Architecture
The architecture consists of a React/Ethers.js frontend, MetaMask wallet, Solidity `LandRegistry` contract, local EVM network, and off-chain document files/hashes. Only compact identifiers, addresses, states, hashes and timestamps are anchored on-chain.

## Smart Contract Design
The contract contains role mappings, a `Property` struct, owner-property mappings, ownership-history arrays, modifiers and events. Registration validates uniqueness and required fields. Verification is restricted to authorized verifiers. Transfers validate ownership and verification.

## Document Hashing
`property_001.json` is synthetic. A SHA-256 fingerprint is generated locally. Any modification to the file results in a different fingerprint, demonstrating integrity checking without putting the complete document on-chain.

## Security
The prototype includes access control, duplicate prevention, zero-address checks, state validation, owner checks, verified-property requirements and event logging.

## Testing
Hardhat tests cover positive and negative scenarios including unauthorized access, duplicate registration, invalid owner, verification, transfer, history and multi-step notary completion.

## Results
The prototype demonstrates an executable registration-to-transfer workflow on a local blockchain with test wallets and synthetic data. Ownership history can be queried and transaction events provide an auditable trail.

## Applications
Potential applications include government registry pilots, property management, real-estate due diligence, title verification, mortgage/lien workflows and document provenance.

## Advantages
- Tamper-evident audit trail
- Deterministic access rules
- Traceable ownership history
- Hash-based document integrity
- Local/testnet demonstration without real property or cryptocurrency

## Limitations and Legal Considerations
The blockchain cannot verify whether the initial property information is legally correct. Wallet addresses are not equivalent to verified legal identities. Real systems must handle government authority, cadastral records, identity, court orders, inheritance, mortgages, liens, disputes, privacy and applicable law.

## Future Scope
IPFS, decentralized identity, multi-signature approval, GIS integration, event indexing, permissioned EVM networks and official registrar integration could extend the prototype.

## Conclusion
The project demonstrates how blockchain primitives can support a transparent and auditable property-record workflow while clearly separating technical integrity from legal ownership.
