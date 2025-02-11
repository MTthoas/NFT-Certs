
# **NFT Certification - Admin Dashboard**

Un **système de certification académique NFT** basé sur **Solidity** et une **application frontend** permettant aux administrateurs de gérer les diplômes et les performances académiques.


## **🛠️ Fonctionnalités du Smart Contract**
### **Certificats académiques dynamiques**
- **🎓 `mintDiploma`** → Génère un **NFT Diplôme** pour un étudiant.
- **📈 `mintPerformance`** → Ajoute un **NFT Performance** lié à un diplôme existant.
- **🛠 `updateCertification`** → Modifie les métadonnées d’un NFT.
- **🔥 `dropCertification`** → Révoque (brûle) un NFT.
- **🔐 Gestion des rôles** → Accès contrôlé pour l’administration.

---

## **🌍 Fonctionnalités du Frontend**
L’application frontend est un **admin dashboard** permettant aux administrateurs de :
✅ **Créer & gérer des diplômes et progressions académiques**  
✅ **Lister tous les NFT créés (diplômes et performances)**  
✅ **Voir les catégories et les types de NFT**  
✅ **Mettre à jour et modifier les certificats existants**  
✅ **Se connecter avec Metamask et interagir avec le smart contract**  

---

## **🛠️ Installation & Exécution du Frontend**
### **1️⃣ Installer les dépendances**
```bash
pnpm install
```

### **2️⃣ Lancer l’application**
```bash
pnpm run dev
```
🔹 Cela démarre un **serveur local** sur `http://localhost:3000`

---

## **🏗 Déploiement du Smart Contract**
### **📌 Prérequis**
- Solidity `^0.8.17`
- OpenZeppelin Contracts
- Foundry (pour le testing & le déploiement)

### Coverage

Suite result: ok. 16 passed; 0 failed; 0 skipped; finished in 3.81ms (23.04ms CPU time)

Ran 1 test suite in 9.72ms (3.81ms CPU time): 16 tests passed, 0 failed, 0 skipped (16 total tests)

```bash
forge coverage
```

### **📌 Résultats**
| File                      | % Lines           | % Statements      | % Branches     | % Funcs         |
|---------------------------|-------------------|-------------------|----------------|-----------------|
| `src/NFT_Certification.sol` | **100.00%** (108/108) | **100.00%** (112/112) | **85.00%** (17/20) | **100.00%** (14/14) |
| **Total**                 | **100.00%** (108/108) | **100.00%** (112/112) | **85.00%** (17/20) | **100.00%** (14/14) |

### **1️⃣ Installer Foundry**
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### **2️⃣ Initialiser le projet**
```bash
forge init
git clone https://github.com/OpenZeppelin/openzeppelin-contracts.git lib/openzeppelin-contracts
```

### **3️⃣ Exécuter les tests**
```bash
forge test
```
## **🔗 Interaction avec le Smart Contract**
L'application frontend **utilise Wagmi & Viem** pour interagir avec le smart contract.  
Tu peux directement **mint, modifier, consulter et gérer les certificats** via l’interface.

### **📡 Récupérer la liste des NFT**
```tsx
const { data: nfts } = useContractRead({
  address: contractAddress,
  abi: contractAbi,
  functionName: "getListNfts",
})

if (nfts) {
  const [tokens, tokenURIs, tokenTypes] = nfts
  tokens.forEach((tokenId, index) => {
    console.log(`Token ID: ${tokenId}, URI: ${tokenURIs[index]}, Type: ${tokenTypes[index]}`)
  })
}
```

---

### **1️⃣ How to use Avalanche L1 with Avlanache-CLI ?**

1. First, you need to install the Avalanche-CLI. You can find the installation instructions [here](https://build.avax.network/docs/tooling/get-avalanche-cli).

2. In your console : 
```bash
avalanche blockchain create <name>
```

3. Then on your terminal, select : 
* Subnet-EVM
* Proof of Authority
* Select the admin's wallet of your blockchain
* I don't want to use default values
* Use latest release version
* Set the Chain Id
* Set the token symbol
* Define a custom allocation
* Add an address to the initial token allocation
* Paste the Admin Address
* Confirm and finalize the initial token allocation and approuve it
* Yes, I want to be able to mint additionnal the native token (Native Minter Precompile On)
* Add an address for a role to the allow list
* Now, you can setup all addresses that you want to be Admin, Manager or just Activated
* When it's done, confirm allow list and approuve it
* Low block size
* No, I prefer to have constant gas fees
* Yes, I want the transaction fees to be burned 
* Yes

Now, your blockchain is created, if you want to see the details, you can run : 
```bash
avalanche blockchain describe <name>
```

4. To deploy the blockchain locally, you can run : 
```bash
avalanche blockchain deploy <name> --local
```

Now wait and you will see the address of your blockchain on your local network. 

5. Stop and start the network with : 
```bash
avalanche network stop
avalanche network start
```

COOL ! Now you have your own blockchain on Avalanche L1.

### **2️⃣ How to deploy a smart contract on Avalanche L1 ?**

To deploy your smart contract, you need to have a .sol file and a script to deploy it.

When you have your .sol file, you can deploy it with : 
```bash
forge script <path/deployScript> --rpc-url <rpc_blockchain_local> --broadcast -vvvv
```

You will have you contract address on your local blockchain.

### **3️⃣ How to interact with your smart contract on Avalanche L1 ?**

First of all, you need to copy the out of your smart contract on /contracts/out/<ContractName>/<ContractName>.json

Paste it on /frontend/src/abi/<ContractName>.ts

After this, you need to configure your provider to your local blockchain

And now, you can use wagmi to interact with your smart contract !

---

## **📜 License**
Ce projet est sous **MIT License**.

---

**🚀 Prêt à créer et gérer des certificats académiques sous forme de NFT ?**  
Lance **`pnpm run dev`** et commence dès maintenant ! 💡
