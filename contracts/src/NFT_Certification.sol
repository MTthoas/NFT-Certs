// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title NFT_Certification
 * @dev his contract enables the creation of dynamic NFTs representing either academic diplomas
 *  Metadata (such as the student's program, annual results, and grades) is referenced via a tokenURI hosted on IPFS (or another decentralized storage solution).
*/
contract NFT_Certification is ERC721URIStorage, AccessControl {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE"); // Role for minting and revoking certifications
    enum CertificationType { Diploma, Performance }

    uint256 private _tokenIds;

    mapping(uint256 => CertificationType) public certificationTypes; // Mapping from tokenId to certification type
    mapping(uint256 => uint256) public performanceToDiploma; // Mapping from performance tokenId to parent diploma tokenId

    event DiplomaMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI);
    event PerformanceMinted(address indexed recipient, uint256 indexed tokenId, uint256 indexed parentDiplomaId, string tokenURI);
    event CertificationUpdated(uint256 indexed tokenId, string tokenURI);
    event CertificationRevoked(uint256 indexed tokenId);

    /**
     * @dev Constructor initializing the token and granting the admin role.
     */
    constructor() ERC721("NFT_Certification", "CERT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Override supportsInterface to add AccessControl support. (link to https://forum.openzeppelin.com/t/derived-contract-must-override-function-supportsinterface/6315/7
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }


    /**
     * @notice Mint a diploma NFT.
     * @param recipient The address of the recipient.
     * @param tokenURI The URI pointing to the metadata on IPFS.
     * @return tokenId of the minted diploma.
     */
    function mintDiploma(address recipient, string memory tokenURI)
        external
        onlyRole(MANAGER_ROLE)
        returns (uint256)
    {
        _tokenIds++;
        uint256 tokenId = _tokenIds;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        certificationTypes[tokenId] = CertificationType.Diploma;

        emit DiplomaMinted(recipient, tokenId, tokenURI);
        return tokenId;
    }


    /**
     * @notice Mint a performance NFT linked to an existing diploma.
     * @param recipient The address of the recipient.
     * @param parentDiplomaId The tokenId of the diploma to which the performance is linked.
     * @param tokenURI The URI pointing to the metadata on IPFS.
     * @return tokenId of the minted performance NFT.
     */
    function mintPerformance(
        address recipient,
        uint256 parentDiplomaId,
        string memory tokenURI
    )
        external
        onlyRole(MANAGER_ROLE)
        returns (uint256)
    {
        require(ownerOf(parentDiplomaId) != address(0), "Parent token does not exist");

        _tokenIds++;
        uint256 tokenId = _tokenIds;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        certificationTypes[tokenId] = CertificationType.Performance;
        performanceToDiploma[tokenId] = parentDiplomaId;

        emit PerformanceMinted(recipient, tokenId, parentDiplomaId, tokenURI);
        return tokenId;
    }

    /**
     * @notice Update the tokenURI of an existing certification NFT (diploma or performance).
     * @param tokenId The tokenId of the NFT to update.
     * @param newTokenURI The new URI for the metadata.
     */
    function updateCertification(uint256 tokenId, string memory newTokenURI)
        external
        onlyRole(MANAGER_ROLE)
    {
        // require in english
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        _setTokenURI(tokenId, newTokenURI);

        emit CertificationUpdated(tokenId, newTokenURI);
    }

   /**
     * @notice Drops (revokes) a certification NFT.
     * @param tokenId The tokenId of the NFT to drop.
     */
    function revokeCertification(uint256 tokenId)
        external
        onlyRole(MANAGER_ROLE)
    {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        _burn(tokenId);

        emit CertificationRevoked(tokenId);
    }
}
