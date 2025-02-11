---

# **NFT Certification - Admin Dashboard**

Un **système de certification académique NFT** basé sur **Solidity** et une **application frontend** permettant aux administrateurs de gérer les diplômes et les performances académiques.

---

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

## **📜 License**
Ce projet est sous **MIT License**.

---

**🚀 Prêt à créer et gérer des certificats académiques sous forme de NFT ?**  
Lance **`pnpm run dev`** et commence dès maintenant ! 💡
