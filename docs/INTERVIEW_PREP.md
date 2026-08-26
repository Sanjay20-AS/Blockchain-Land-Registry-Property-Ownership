# Interview Preparation — 10 Questions & Answers

## 1. Explain your project.
I developed an educational blockchain-based land registry prototype using Solidity. An authorized registrar can register a synthetic property with its ID, location, area, owner wallet and document hash. An authorized verifier can verify the record, and ownership can then be transferred with validation. The contract stores current and previous owners, timestamps and ownership history and emits events for auditability. I tested the contract with Hardhat and local test wallets. It is a prototype and does not establish legal ownership.

## 2. What problem does it solve?
It demonstrates how property records can be maintained in a tamper-evident audit trail instead of relying only on mutable, fragmented records. It can make ownership history easier to trace and verification easier to automate.

## 3. How did you model a property?
I used a Solidity `struct` containing the property ID, number, location, area, type, current and previous owner, document hash, verification flag, status and timestamps. A mapping connects each numeric property ID to that struct.

## 4. How do you prevent unauthorized registration and transfer?
Registration is protected by the `onlyRegistrar` modifier. Verification is protected by verifier/surveyor roles. Simple transfer checks `msg.sender` against `currentOwner`. The multi-step flow requires the owner to request the transfer and an authorized notary to complete it.

## 5. Why use a document hash?
Full documents are inefficient and potentially sensitive to store on-chain. A cryptographic hash acts like a fingerprint. If the document changes, its new hash differs from the value anchored in the blockchain, so the change can be detected.

## 6. Why are events important?
Events create transaction logs for important actions such as registration, verification and ownership transfer. A frontend or indexing service can consume those events to build an auditable history without repeatedly scanning all contract state.

## 7. Why separate registration and verification?
Registration means the record was entered. Verification means an authorized actor checked it. Separating the two prevents an unverified submission from automatically being treated as an approved record.

## 8. How did you test it?
I used Hardhat signers as the admin, registrar, verifier, notary, owner, buyer and outsider. Tests cover registration, duplicate IDs, invalid addresses, role restrictions, verification, ownership transfer, old-owner rejection, history and multi-step notary transfer.

## 9. Does blockchain prove legal property ownership?
No. It only preserves a tamper-evident record of what authorized participants put into the contract. Legal ownership depends on government records, identity, cadastral data, contracts, courts and applicable property law. This is why my README explicitly calls it an educational prototype.

## 10. How would you improve it for production?
I would add encrypted IPFS documents, decentralized identity, multi-party approvals, formal encumbrance/mortgage workflows, GIS integration, event indexing, secure institutional key management, privacy controls and integration with official registrar and cadastral systems. I would also have the smart contracts independently audited before deployment.
