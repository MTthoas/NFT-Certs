# NFT Certification

A Solidity smart contract for dynamic NFT certifications representing academic diplomas and annual performance reports.  

## Features

- **mintDiploma:** Mint a diploma NFT.
- **mintPerformance:** Mint a performance NFT linked to an existing diploma.
- **updateCertification:** Update the NFT metadata.
- **dropCertification:** Revoke (burn) an NFT.
- Access control via a functional programming–inspired role system.

## Requirements

- Solidity ^0.8.17
- Foundry (for testing and deployment)
- OpenZeppelin Contracts

## Installation & Testing

1. Install Foundry:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. Initialize your project and install dependencies:
   ```bash
   forge init
   git clone https://github.com/OpenZeppelin/openzeppelin-contracts.git lib/openzeppelin-contracts
   ```

3. Run the tests:
   ```bash
   forge test
   ```

## License

This project is licensed under the MIT License.
```