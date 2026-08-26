# Blockchain-Based Land Registry & Property Ownership System

> Educational blockchain prototype built with Solidity and Hardhat. Uses **synthetic property data and local/test wallets only**. It does **not** create or prove legally valid property ownership.

## Overview
This project demonstrates how a tamper-evident digital registry can record property registration, authority verification, ownership transfers, document hashes, roles, timestamps, and ownership history on an EVM-compatible blockchain.

## Problem Statement
Traditional property records can be fragmented across offices, difficult to reconcile, vulnerable to unauthorized modification, and slow to verify. A blockchain can provide a shared audit trail where each accepted state change is cryptographically linked to a transaction.

## Objectives
- Register synthetic properties through an authorized registrar.
- Verify records through an authorized verifier/surveyor.
- Link current ownership to wallet addresses.
- Transfer ownership with validation and events.
- Preserve historical ownership records.
- Demonstrate document integrity through hashes.
- Test security controls automatically.

## Industry Relevance
The architecture is relevant to land registries, property-management systems, real-estate technology, title verification, due diligence, housing societies, mortgage/lien workflows, and document provenance. Production systems would require government authority, identity verification, cadastral databases, legal procedures, dispute resolution, and registrar integration.

## Educational Disclaimer
Blockchain records are only as trustworthy as the information and authority that enters them. This project does not establish legal title, replace a registrar, or represent real government land records. It follows a **garbage-in, garbage-out** model: an immutable record of incorrect input is still incorrect.

## Technology Stack
- Solidity 0.8.20
- Hardhat 2.x
- Ethers.js 6 through Hardhat Toolbox / frontend
- React + Vite frontend
- MetaMask for wallet interaction
- Local Hardhat network / Remix VM
- SHA-256 for sample document integrity demonstration

## Actors
| Actor | Responsibility |
|---|---|
| Admin | Bootstrap contract and assign roles |
| Registrar | Register new property records |
| Surveyor / Verifier | Verify property records |
| Notary | Complete multi-step transfer; administer future production workflows |
| Property Owner | Own and transfer a verified property |
| Buyer | Receive ownership in a test wallet |

## Architecture
```text
Authority / Registrar
        |
        v
+-----------------------+
| LandRegistry.sol      |
| - Property registry   |
| - Role control        |
| - Verification        |
| - Transfer logic      |
| - Ownership history   |
| - Events              |
+-----------+-----------+
            |
            v
       EVM Blockchain
            ^
            |
   React + Ethers.js
            |
         MetaMask

Off-chain: sample documents / IPFS-ready URIs
On-chain: IDs, owner wallets, status, document hashes, timestamps, events
```

## Property Data Model
`Property` contains property ID, property number, location, area, type, current owner, previous owner, document hash, verification state, status, registration timestamp, transfer timestamp, existence flag.

Statuses: `REGISTERED`, `VERIFIED`, `TRANSFER_PENDING`, `TRANSFERRED`, `DISPUTED`.

## Main Workflows
### Registration
Registrar validates uniqueness, owner address, area, required strings and document hash, then stores the property and emits `PropertyRegistered`.

### Verification
An authorized verifier changes `verified` to true and status to `VERIFIED`. Registration and verification are deliberately separate so a newly entered record is not automatically treated as approved.

### Ownership Transfer
Two flows are available:
1. `transferOwnership()` — simple classroom flow: current owner transfers a verified property.
2. `requestTransfer()` + `completeTransfer()` — multi-step industry-oriented flow: owner requests, notary completes.

Every successful transfer updates current/previous owner, timestamp, document/deed hash, status, history, and emits `OwnershipTransferred`.

## Document Hash Verification
`sample_documents/property_001.json` contains synthetic property information. Generate its SHA-256 hash with:

```bash
node scripts/hash-document.js sample_documents/property_001.json
```

Change any field and run the command again. The SHA-256 value changes, demonstrating file-integrity detection. The Solidity contract stores a bytes32 hash for the on-chain proof rather than the full document.

## Folder Structure
```text
Blockchain-Land-Registry-Property-Ownership/
├── contracts/LandRegistry.sol
├── scripts/deploy.js
├── scripts/hash-document.js
├── test/LandRegistry.test.js
├── frontend/
├── sample_documents/property_001.json
├── hashes/
├── screenshots/
├── reports/
├── docs/
├── README.md
├── hardhat.config.js
├── package.json
└── .gitignore
```

## Installation
```bash
npm install
npm run compile
npm test
```

## Local Deployment
Terminal 1:
```bash
npm run node
```

Terminal 2:
```bash
npm run deploy:local
```

The deploy script assigns test roles and registers synthetic property `P001`.

## Remix Simulation
1. Open Remix IDE.
2. Create `LandRegistry.sol` and paste `contracts/LandRegistry.sol`.
3. Compile with Solidity 0.8.20.
4. Select Remix VM.
5. Deploy using Account 1 as admin.
6. Use separate Remix accounts for registrar, verifier, owner, buyer and unauthorized user.
7. Register property P001.
8. Query `getProperty(1)`.
9. Verify with the verifier account.
10. Transfer from Owner A to Buyer B.
11. Query the property again and inspect `OwnershipTransferred` logs.
12. Attempt the same transfer from the old owner and confirm rejection.

## Hardhat Tests
The test suite covers deployment, role checks, registration, duplicate IDs, invalid owner/area, verification, unauthorized verification, transfer rules, old-owner rejection, zero-address rejection, history, owner listing, multi-step transfer and notary authorization.

Run:
```bash
npm test
```

## Frontend
```bash
cd frontend
npm install
```

Set `CONTRACT_ADDRESS` in `frontend/src/App.jsx` to the local deployed address, then:
```bash
npm run dev
```

Connect MetaMask to the Hardhat local network. The UI provides wallet connection, property lookup, verification, ownership transfer, and ownership history.

## Security Controls
- Role-based access control.
- Unique property IDs.
- Zero-address checks.
- Positive-area validation.
- Required document hashes.
- Verified-property requirement before transfer.
- Current-owner authorization for simple transfer.
- Notary authorization for multi-step completion.
- Disputed-state blocking.
- Events for auditable state changes.
- No personal identity documents stored directly on-chain.

## Real-World Limitations
- Wallet identity is not the same as legal identity.
- Private-key compromise can compromise an account.
- Incorrect source records remain incorrect even if immutable.
- Legal disputes, inheritance, mortgages, liens and court orders require external governance.
- Government/cadastral integration is required for a production registry.
- Sensitive documents should be encrypted and stored off-chain; only hashes or content-addressed references should be anchored on-chain.
- Production deployments require security audits, key-management procedures, privacy controls and legal review.

## Suggested Screenshots
Save evidence in `screenshots/` with names such as:
- `01-folder-structure.png`
- `02-solidity-contract.png`
- `03-successful-compilation.png`
- `04-contract-deployment.png`
- `05-property-registration.png`
- `06-property-details.png`
- `07-unauthorized-rejected.png`
- `08-property-verified.png`
- `09-ownership-transfer.png`
- `10-new-owner.png`
- `11-old-owner-rejected.png`
- `12-document-hash.png`
- `13-hash-mismatch.png`
- `14-ownership-events.png`
- `15-hardhat-tests.png`
- `16-frontend.png`

## GitHub Strategy
Repository name: `Blockchain-Land-Registry-Property-Ownership`

Suggested topics: `blockchain`, `solidity`, `land-registry`, `real-estate`, `property`, `ethereum`, `smart-contract`, `web3`, `proptech`, `hardhat`, `ethersjs`, `dapp`.

Suggested commits:
```text
Initialize blockchain land registry project
Add property data model
Implement authority-based property registration
Add property verification workflow
Implement secure ownership transfer
Add property document hash verification
Add ownership history events
Add Hardhat tests
Add Remix simulation proof
Complete README and documentation
```

## Git Commands
```bash
git init
git add .
git commit -m "Initialize blockchain land registry project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Blockchain-Land-Registry-Property-Ownership.git
git push -u origin main
```

## Future Improvements
- IPFS document storage with encrypted documents.
- Registrar/surveyor/notary multi-signature approvals.
- Encumbrance and mortgage management.
- GIS/cadastral integration.
- Decentralized identity.
- Event indexing with The Graph or a custom read model.
- Production key rotation and hardware-backed keys.
- Permissioned EVM deployment for government/consortium environments.

## Learning Outcomes
This project demonstrates Solidity structs, mappings, arrays, enums, modifiers, access control, `msg.sender`, events, transaction history, hashes, timestamps, local EVM testing, React/Ethers.js integration, and security-oriented smart-contract design.

## Author
Student blockchain course project — synthetic data only.
#   B l o c k c h a i n - L a n d - R e g i s t r y - P r o p e r t y - O w n e r s h i p  
 