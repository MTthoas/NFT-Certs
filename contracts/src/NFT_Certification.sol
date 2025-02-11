// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// On utilise AccessControlEnumerable pour pouvoir énumérer les membres de chaque rôle.
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";

/**
 * @title NFT_Certification
 * @dev Ce contrat permet aux profils autorisés (administrateurs, gestionnaires et activés)
 * de créer, mettre à jour, révoquer et lister des NFTs représentant des certificats académiques.
 * Un portail public permet de vérifier, via un identifiant étudiant, les métadonnées associées.
 */
contract NFT_Certification is ERC721URIStorage, AccessControlEnumerable {
    // Rôles
    bytes32 public constant MANAGER_ROLE   = keccak256("MANAGER_ROLE");
    bytes32 public constant ACTIVATED_ROLE = keccak256("ACTIVED_ROLE"); // Nouveau rôle "activé"

    // Compteur pour l'attribution des tokenIds
    uint256 private _tokenIds;

    enum CertificationType { Diploma, Performance }
    mapping(uint256 => CertificationType) public certificationTypes;
    mapping(uint256 => uint256) public performanceToDiploma;

    // Pour suivre l'existence d'un token (utile lors du listing)
    mapping(uint256 => bool) public tokenExists;
    // Pour associer un tokenId à un identifiant étudiant (pour les diplômes)
    mapping(uint256 => string) public tokenStudentId;
    // Pour indexer, pour chaque identifiant étudiant, les tokenIds correspondants
    mapping(string => uint256[]) private certificatesByStudent;

    event DiplomaMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI);
    event PerformanceMinted(address indexed recipient, uint256 indexed tokenId, uint256 indexed parentDiplomaId, string tokenURI);
    event CertificationUpdated(uint256 indexed tokenId, string tokenURI);
    event CertificationRevoked(uint256 indexed tokenId);

    /// @dev Seuls les comptes possédant DEFAULT_ADMIN_ROLE, MANAGER_ROLE ou ACTIVATED_ROLE sont autorisés pour les opérations sur les certificats.
    modifier onlyAuthorized() {
         require(
             hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
             hasRole(MANAGER_ROLE, msg.sender) ||
             hasRole(ACTIVATED_ROLE, msg.sender),
             "Not authorized"
         );
         _;
    }

    constructor() ERC721("NFT_Certification", "CERT") {
         // Le compte déployeur reçoit le rôle d'administrateur par défaut
         _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, AccessControlEnumerable) returns (bool) {
         return super.supportsInterface(interfaceId);
    }

    /**
     * @notice Fonction permettant à un administrateur (DEFAULT_ADMIN_ROLE) d'ajouter un compte activé.
     * @param account Adresse du compte à activer.
     */
    function addActivatedAccount(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
         grantRole(ACTIVATED_ROLE, account);
    }

    /**
     * @notice Crée un NFT de type Diplôme en associant un identifiant étudiant.
     * @param recipient Adresse du destinataire.
     * @param tokenURI URI pointant vers les métadonnées (ex: sur IPFS).
     * @param studentId Identifiant étudiant (ex: "2025-001").
     * @return tokenId du NFT créé.
     */
    function mintDiploma(
        address recipient,
        string memory tokenURI,
        string memory studentId
    ) external onlyAuthorized returns (uint256) {
        _tokenIds++;
        uint256 tokenId = _tokenIds;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        certificationTypes[tokenId] = CertificationType.Diploma;
        tokenExists[tokenId] = true;
        tokenStudentId[tokenId] = studentId;
        certificatesByStudent[studentId].push(tokenId);

        emit DiplomaMinted(recipient, tokenId, tokenURI);
        return tokenId;
    }

    /**
     * @notice Crée un NFT de type Performance lié à un diplôme existant.
     * @param recipient Adresse du destinataire.
     * @param parentDiplomaId TokenId du diplôme parent.
     * @param tokenURI URI pointant vers les métadonnées.
     * @return tokenId du NFT créé.
     */
    function mintPerformance(
        address recipient,
        uint256 parentDiplomaId,
        string memory tokenURI
    ) external onlyAuthorized returns (uint256) {
        require(ownerOf(parentDiplomaId) != address(0), "Parent token does not exist");

        _tokenIds++;
        uint256 tokenId = _tokenIds;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        certificationTypes[tokenId] = CertificationType.Performance;
        performanceToDiploma[tokenId] = parentDiplomaId;
        tokenExists[tokenId] = true;

        emit PerformanceMinted(recipient, tokenId, parentDiplomaId, tokenURI);
        return tokenId;
    }

    /**
     * @notice Met à jour le tokenURI d'un NFT existant (diplôme ou performance).
     * @param tokenId TokenId du NFT.
     * @param newTokenURI Nouvelle URI des métadonnées.
     */
    function updateCertification(uint256 tokenId, string memory newTokenURI)
        external
        onlyAuthorized
    {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        _setTokenURI(tokenId, newTokenURI);
        emit CertificationUpdated(tokenId, newTokenURI);
    }

    /**
     * @notice Révoque (supprime) un NFT.
     * @param tokenId TokenId du NFT à révoquer.
     */
    function revokeCertification(uint256 tokenId)
        external
        onlyAuthorized
    {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        _burn(tokenId);
        tokenExists[tokenId] = false;
        emit CertificationRevoked(tokenId);
    }

    /**
    * @notice Permet de lister tous les NFTs existants (non révoqués) et de récupérer leurs tokenURIs.
    * @return tokens Tableau des tokenIds existants.
    * @return tokenURIs Tableau des URI associées aux métadonnées des tokens.
    */
    function getListNfts() external view returns (uint256[] memory tokens, string[] memory tokenURIs) {
        uint256 count = 0;
        // Comptabiliser les tokens existants
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (tokenExists[i]) {
                count++;
            }
        }
        
        tokens = new uint256[](count);
        tokenURIs = new string[](count);
        
        uint256 index = 0;
        // Récupérer les tokenIds et leurs URI correspondantes
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (tokenExists[i]) {
                tokens[index] = i;
                tokenURIs[index] = tokenURI(i);
                index++;
            }
        }
    }

    /**
     * @notice Portail public de vérification d'un certificat académique.
     * @param studentId Identifiant étudiant (ex: "2025-001").
     * @return validTokenIds Tableau des tokenIds existants pour cet identifiant.
     * @return tokenURIs Tableau des URI correspondants aux métadonnées des certificats.
     */
    function verifyCertificate(string memory studentId) external view returns (uint256[] memory validTokenIds, string[] memory tokenURIs) {
        uint256[] memory tokenIds = certificatesByStudent[studentId];

        // Compter le nombre de certificats encore existants
        uint256 count = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenExists[tokenIds[i]]) {
                count++;
            }
        }

        validTokenIds = new uint256[](count);
        tokenURIs = new string[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            if (tokenExists[tokenIds[i]]) {
                validTokenIds[index] = tokenIds[i];
                tokenURIs[index] = tokenURI(tokenIds[i]);
                index++;
            }
        }
    }

    // ============================
    // GETTERS POUR LES RÔLES
    // ============================

    /**
     * @notice Retourne la liste des adresses possédant le rôle d'administrateur.
     */
    function getAdmins() external view returns (address[] memory) {
        uint256 count = getRoleMemberCount(DEFAULT_ADMIN_ROLE);
        address[] memory admins = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            admins[i] = getRoleMember(DEFAULT_ADMIN_ROLE, i);
        }
        return admins;
    }

    /**
     * @notice Retourne la liste des adresses possédant le rôle de gestionnaire.
     */
    function getManagers() external view returns (address[] memory) {
        uint256 count = getRoleMemberCount(MANAGER_ROLE);
        address[] memory managers = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            managers[i] = getRoleMember(MANAGER_ROLE, i);
        }
        return managers;
    }

    /**
     * @notice Retourne la liste des adresses possédant le rôle activé.
     */
    function getActivated() external view returns (address[] memory) {
        uint256 count = getRoleMemberCount(ACTIVATED_ROLE);
        address[] memory activated = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            activated[i] = getRoleMember(ACTIVATED_ROLE, i);
        }
        return activated;
    }

    /**
     * @notice Retourne les rôles (sous forme de chaînes) que possède un utilisateur.
     * @param user Adresse de l'utilisateur.
     */
    function getUserRoles(address user) external view returns (string[] memory) {
        uint256 count = 0;
        if (hasRole(DEFAULT_ADMIN_ROLE, user)) {
            count++;
        }
        if (hasRole(MANAGER_ROLE, user)) {
            count++;
        }
        if (hasRole(ACTIVATED_ROLE, user)) {
            count++;
        }

        string[] memory roles = new string[](count);
        uint256 index = 0;
        if (hasRole(DEFAULT_ADMIN_ROLE, user)) {
            roles[index] = "ADMIN";
            index++;
        }
        if (hasRole(MANAGER_ROLE, user)) {
            roles[index] = "MANAGER";
            index++;
        }
        if (hasRole(ACTIVATED_ROLE, user)) {
            roles[index] = "ACTIVATED";
            index++;
        }
        return roles;
    }
}
