# Blockchain-Based Land Registry & Property Ownership System

> An educational blockchain prototype for registering properties, verifying records, transferring ownership, and maintaining an auditable ownership history using Solidity, Hardhat, React, and Ethers.js.

**Educational project only:** This system uses synthetic property data and local/test wallets. It does **not** create, prove, or transfer legally valid property ownership.

---

## 📌 Overview

The **Blockchain-Based Land Registry & Property Ownership System** demonstrates how blockchain technology can be used to create a tamper-evident digital property registry.

The system records:

* Property registration
* Authority verification
* Current and previous ownership
* Ownership transfers
* Document hashes
* Registration and transfer timestamps
* Role-based permissions
* Ownership history
* Smart-contract events

The project runs on a local EVM blockchain using Hardhat and provides a React-based frontend for interacting with the smart contract through MetaMask.

---

## 🎯 Problem Statement

Traditional property records may be distributed across multiple offices and databases, making them difficult to reconcile and verify. Manual processes can also introduce delays and create opportunities for unauthorized modification.

Blockchain provides a shared, append-only audit trail where accepted state changes are cryptographically linked to transactions.

This project explores how that concept can be applied to a simplified land-registry workflow.

---

## ✨ Objectives

* Register synthetic property records through an authorized registrar.
* Verify property records through authorized authorities.
* Associate property ownership with blockchain wallet addresses.
* Transfer ownership with authorization and validation.
* Maintain historical ownership records.
* Demonstrate document integrity using cryptographic hashes.
* Enforce role-based access control.
* Prevent unauthorized property modifications.
* Test smart-contract security controls automatically.

---

## 🏗️ System Architecture

```text
                 Authority / Registrar
                         |
                         v
              +-----------------------+
              |    LandRegistry.sol   |
              |-----------------------|
              | Property Registry     |
              | Role Management        |
              | Verification           |
              | Transfer Logic         |
              | Ownership History      |
              | Document Hashes        |
              | Events                 |
              +-----------+-----------+
                          |
                          v
                   EVM Blockchain
                          ^
                          |
                    Ethers.js
                          ^
                          |
                   React Frontend
                          ^
                          |
                       MetaMask

       Off-chain                    On-chain
       ---------                    --------
       Documents                   Property IDs
       JSON files                  Owner addresses
       IPFS-ready files            Status
                                   Document hashes
                                   Timestamps
                                   Events
```

---

## 🛠️ Technology Stack

| Technology          | Purpose                                   |
| ------------------- | ----------------------------------------- |
| **Solidity 0.8.20** | Smart-contract development                |
| **Hardhat 2.x**     | Local blockchain, compilation and testing |
| **Ethers.js 6**     | Blockchain interaction                    |
| **React + Vite**    | Frontend application                      |
| **MetaMask**        | Wallet and transaction signing            |
| **Node.js**         | Development environment                   |
| **SHA-256**         | Sample document integrity verification    |
| **Remix IDE**       | Optional smart-contract simulation        |

---

## 👥 System Actors

| Actor                   | Responsibility                                |
| ----------------------- | --------------------------------------------- |
| **Admin**               | Deploys the contract and manages roles        |
| **Registrar**           | Registers new property records                |
| **Surveyor / Verifier** | Verifies registered properties                |
| **Notary**              | Authorizes completion of multi-step transfers |
| **Property Owner**      | Owns and transfers verified properties        |
| **Buyer**               | Receives ownership using a test wallet        |

---

## 🧱 Property Data Model

Each property record contains information such as:

* Property ID
* Property number
* Location
* Area
* Property type
* Current owner
* Previous owner
* Document hash
* Verification state
* Property status
* Registration timestamp
* Transfer timestamp
* Existence flag

### Property Statuses

```text
REGISTERED
VERIFIED
TRANSFER_PENDING
TRANSFERRED
DISPUTED
```

---

## 🔄 Main Workflows

### 1. Property Registration

An authorized registrar creates a property record.

The contract validates:

* Property ID uniqueness
* Owner address
* Positive property area
* Required property information
* Document hash

A `PropertyRegistered` event is emitted after successful registration.

---

### 2. Property Verification

An authorized verifier verifies a registered property.

The verification process is intentionally separate from registration. A newly registered property is **not automatically considered verified**.

After successful verification:

```text
REGISTERED → VERIFIED
```

---

### 3. Ownership Transfer

The system supports two ownership-transfer approaches.

#### Simple Transfer

```text
transferOwnership()
```

The current owner can directly transfer a verified property to another wallet.

#### Multi-Step Transfer

```text
requestTransfer()
        ↓
TRANSFER_PENDING
        ↓
completeTransfer()
        ↓
TRANSFERRED
```

The multi-step workflow introduces a notary role for completing the transfer.

After a successful transfer, the contract updates:

* Current owner
* Previous owner
* Transfer timestamp
* Property status
* Ownership history
* Document/deed hash

An `OwnershipTransferred` event is also emitted.

---

## 🔐 Document Hash Verification

The project includes a synthetic property document:

```text
sample_documents/property_001.json
```

Generate its SHA-256 hash using:

```bash
node scripts/hash-document.js sample_documents/property_001.json
```

Changing even a small part of the document produces a different hash.

The project demonstrates the principle that:

```text
Original Document
       ↓
    SHA-256
       ↓
 Document Hash
       ↓
Stored on Blockchain
```

The complete document is **not stored directly on-chain**.

---

## 📂 Project Structure

```text
Blockchain-Land-Registry-Property-Ownership/
│
├── contracts/
│   └── LandRegistry.sol
│
├── scripts/
│   ├── deploy.js
│   └── hash-document.js
│
├── test/
│   └── LandRegistry.test.js
│
├── frontend/
│   └── ...
│
├── sample_documents/
│   └── property_001.json
│
├── hashes/
├── screenshots/
├── reports/
├── docs/
│
├── hardhat.config.js
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/Blockchain-Land-Registry-Property-Ownership.git

cd Blockchain-Land-Registry-Property-Ownership

npm install
```

Compile the smart contract:

```bash
npm run compile
```

Run the test suite:

```bash
npm test
```

---

## ⛓️ Local Blockchain Deployment

### Terminal 1 — Start Hardhat Network

```bash
npm run node
```

This starts a local Ethereum-compatible blockchain.

### Terminal 2 — Deploy the Contract

```bash
npm run deploy:local
```

The deployment script configures the test roles and registers the synthetic property `P001`.

The deployed contract address should be copied into the frontend configuration.

---

## 🖥️ Frontend

Install frontend dependencies:

```bash
cd frontend
npm install
```

Configure the deployed contract address in:

```text
frontend/src/App.jsx
```

Then start the development server:

```bash
npm run dev
```

Connect MetaMask to the local Hardhat network.

The frontend supports:

* Wallet connection
* Property lookup
* Property verification
* Ownership transfer
* Ownership history
* Blockchain transaction interaction

---

## 🦊 MetaMask Configuration

For local development, connect MetaMask to the Hardhat network.

Typical configuration:

```text
Network Name: Hardhat Local
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

> **Security:** Only use Hardhat's test accounts and private keys for local development. Never use real wallet credentials or seed phrases.

---

## 🧪 Hardhat Tests

The automated test suite covers:

* Contract deployment
* Role assignment
* Role-based authorization
* Property registration
* Duplicate property IDs
* Invalid owner addresses
* Invalid property areas
* Property verification
* Unauthorized verification
* Ownership transfer
* Old-owner rejection
* Zero-address validation
* Ownership history
* Owner property listing
* Multi-step transfers
* Notary authorization

Run the complete test suite:

```bash
npm test
```

---

## 🧩 Remix Simulation

The smart contract can also be tested using Remix IDE.

1. Open Remix IDE.
2. Create `LandRegistry.sol`.
3. Copy the contract from `contracts/LandRegistry.sol`.
4. Compile using Solidity `0.8.20`.
5. Select **Remix VM**.
6. Deploy using the admin account.
7. Use separate accounts for the registrar, verifier, owner, buyer and unauthorized user.
8. Register property `P001`.
9. Query the property.
10. Verify the property.
11. Transfer ownership from Owner A to Buyer B.
12. Query the property again.
13. Inspect the `OwnershipTransferred` event.
14. Attempt a transfer from the previous owner and verify that it is rejected.

---

## 🔒 Security Controls

The smart contract includes several validation and authorization mechanisms:

* Role-based access control
* Unique property IDs
* Zero-address validation
* Positive-area validation
* Required document hashes
* Verified-property requirement before transfer
* Current-owner authorization
* Notary authorization for multi-step transfers
* Disputed-property transfer blocking
* Ownership history
* Blockchain events for auditability
* No personal identity documents stored directly on-chain

---

## ⚠️ Real-World Limitations

This project is an educational prototype and should **not** be considered a production land-registry system.

Real-world deployment would require:

* Government or authorized registrar integration
* Legal recognition of digital records
* Identity verification
* Cadastral/GIS integration
* Dispute-resolution procedures
* Inheritance handling
* Mortgage and lien management
* Privacy controls
* Secure key management
* Smart-contract security audits
* Legal and regulatory compliance

A blockchain does not automatically make input data correct.

> **Garbage in, garbage out:** an immutable record of incorrect information is still incorrect.

A wallet address also does not inherently represent a legally verified person's identity.

---

## 📸 Suggested Evidence

Project screenshots can be stored in the `screenshots/` directory.

Recommended evidence:

```text
01-folder-structure.png
02-solidity-contract.png
03-successful-compilation.png
04-contract-deployment.png
05-property-registration.png
06-property-details.png
07-unauthorized-rejected.png
08-property-verified.png
09-ownership-transfer.png
10-new-owner.png
11-old-owner-rejected.png
12-document-hash.png
13-hash-mismatch.png
14-ownership-events.png
15-hardhat-tests.png
16-frontend.png
```

---

## 💡 Industry Relevance

The architecture demonstrated in this project can serve as a learning model for applications involving:

* Land registries
* Property management
* Real-estate technology
* Title verification
* Document provenance
* Due diligence
* Housing societies
* Mortgage and lien workflows

A production implementation would require trusted authorities, verified identities, external databases, legal procedures and appropriate governance.

---

## 🔮 Future Improvements

Potential extensions include:

* IPFS-based document storage
* Encrypted off-chain documents
* Multi-signature authority approvals
* Encumbrance and mortgage management
* GIS/cadastral integration
* Decentralized identity
* Blockchain event indexing
* The Graph or custom read models
* Hardware-backed key management
* Key rotation
* Permissioned EVM deployment
* Government/consortium integration
* Advanced privacy mechanisms

---

## 📚 Learning Outcomes

This project provides practical experience with:

* Solidity smart contracts
* Structs and mappings
* Arrays and enums
* Modifiers
* Role-based access control
* `msg.sender`
* Smart-contract events
* Blockchain transactions
* Ownership tracking
* Transaction timestamps
* Cryptographic hashing
* Hardhat development
* Automated smart-contract testing
* React and Ethers.js integration
* MetaMask wallet interaction
* Web3 application architecture
* Security-oriented contract design

---

## 📝 GitHub Topics

Recommended repository topics:

```text
blockchain
solidity
land-registry
real-estate
property
ethereum
smart-contract
web3
proptech
hardhat
ethersjs
dapp
react
vite
```

---

## 👨‍💻 Author

**Student Blockchain Course Project**

Built for educational purposes using synthetic property data and local/test blockchain accounts.

> This project does not represent real government land records or legally valid property ownership.
