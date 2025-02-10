// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/NFT_Certification.sol";

contract DeployAndMintScript is Script {
    function run() external {
        // Récupération des clés privées depuis les variables d'environnement
        uint256 adminPrivateKey   = vm.envUint("ADMIN_PRIVATE_KEY");
        uint256 managerPrivateKey = vm.envUint("MANAGER_PRIVATE_KEY");
        // Adresse du destinataire du NFT (étudiant, par exemple)
        address student           = vm.envAddress("STUDENT");

        // Calcul des adresses correspondantes aux clés privées
        address admin   = vm.addr(adminPrivateKey);
        address manager = vm.addr(managerPrivateKey);

        // --- Étape 1 : Déploiement du contrat et attribution du rôle ---
        // L'administrateur déploie le contrat et accorde le rôle MANAGER_ROLE au compte manager
        vm.startBroadcast(adminPrivateKey);
            NFT_Certification nft = new NFT_Certification();
            // Accord du rôle MANAGER_ROLE au compte manager
            nft.grantRole(nft.MANAGER_ROLE(), manager);
        vm.stopBroadcast();

        // --- Étape 2 : Mint d'un NFT (diplôme) par le manager ---
        // Le compte manager (détenant le rôle MANAGER_ROLE) appelle mintDiploma
        vm.startBroadcast(managerPrivateKey);
            // Remplacez "ipfs://votre_tokenURI" par l'URI réel de vos métadonnées
            nft.mintDiploma(student, "ipfs://votre_tokenURI");
        vm.stopBroadcast();
    }
}
