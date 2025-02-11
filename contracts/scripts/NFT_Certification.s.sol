// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/NFT_Certification.sol";

contract DeployRolesScript is Script {
    function run() external {
        // Récupération des clés et adresses depuis les variables d'environnement
        uint256 adminPrivateKey   = vm.envUint("ADMIN_PRIVATE_KEY");
        uint256 managerPrivateKey = vm.envUint("MANAGER_PRIVATE_KEY");
        address managerAddress    = vm.addr(managerPrivateKey);
        address activatedAddress  = vm.envAddress("ACTIVATED_ACCOUNT");

        // --- Étape 1 : Déploiement du contrat par l'admin ---
        vm.startBroadcast(adminPrivateKey);
            NFT_Certification nft = new NFT_Certification();
        vm.stopBroadcast();

        // --- Étape 2 : Attribution des rôles via le compte admin ---
        vm.startBroadcast(adminPrivateKey);
            // Attribuer le rôle MANAGER au compte manager
        nft.grantRole(nft.MANAGER_ROLE(), managerAddress);
            // Ajouter le compte activé via la fonction dédiée
        nft.addActivatedAccount(activatedAddress);
         vm.stopBroadcast();

        // --- Optionnel : Affichage des listes de rôles ---
        address[] memory admins    = nft.getAdmins();
        address[] memory managers  = nft.getManagers();
        address[] memory activated = nft.getActivated();

        console.log("=== Liste des Admins ===");
        for (uint256 i = 0; i < admins.length; i++) {
            console.log("%s", admins[i]);
        }
        console.log("=== Liste des Managers ===");
        for (uint256 i = 0; i < managers.length; i++) {
            console.log("%s", managers[i]);
        }
        console.log("=== Liste des comptes act ===");
        for (uint256 i = 0; i < activated.length; i++) {
            console.log("%s", activated[i]);
        }

        // --- Optionnel : Affichage des rôles pour chaque compte ---
        string[] memory adminRoles    = nft.getUserRoles(vm.addr(adminPrivateKey));
        string[] memory managerRoles  = nft.getUserRoles(managerAddress);
        string[] memory activatedRoles = nft.getUserRoles(activatedAddress);

        console.log("== Roles admin ===");
        for (uint256 i = 0; i < adminRoles.length; i++) {
            console.log("%s", adminRoles[i]);
        }

        console.log("=== Roles Manager ===");
        for (uint256 i = 0; i < managerRoles.length; i++) {
            console.log("%s", managerRoles[i]);
        }

        console.log("=== Roles Active ===");
        for (uint256 i = 0; i < activatedRoles.length; i++) {
            console.log("%s", activatedRoles[i]);
        }
    }
}
