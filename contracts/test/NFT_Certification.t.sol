// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/NFT_Certification.sol";

contract NFT_CertificationTest is Test {
    NFT_Certification nft;
    address admin   = address(0x1);
    address manager = address(0x2);
    address student = address(0x3);

    event DiplomaMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI);

    bytes32 constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    function setUp() public {
        vm.startPrank(admin);
        nft = new NFT_Certification();
        nft.grantRole(MANAGER_ROLE, manager);
        vm.stopPrank();
    }

    function testIssueDiploma() public {
        vm.startPrank(manager);

        string memory diplomaURI = "ipfs://diploma_metadata_uri";
        emit DiplomaMinted(student, 1, diplomaURI);

        uint256 tokenId = nft.mintDiploma(student, diplomaURI);

        // Verify that the tokenId is 1
        assertEq(tokenId, 1);
        assertEq(nft.ownerOf(tokenId), student);
        assertEq(nft.tokenURI(tokenId), diplomaURI);

        vm.stopPrank();
    }

    function testIssuePerformance() public {
        vm.startPrank(manager);

        string memory diplomaURI = "ipfs://diploma_metadata_uri";
        emit DiplomaMinted(student, 1, diplomaURI);

        uint256 diplomaId = nft.mintDiploma(student, diplomaURI);

        string memory performanceURI = "ipfs://performance_metadata_uri";
        emit DiplomaMinted(student, 2, performanceURI);

        uint256 performanceId = nft.mintPerformance(student, diplomaId, performanceURI);

        // Verify that the tokenId is 2
        assertEq(performanceId, 2);
        assertEq(nft.ownerOf(performanceId), student);
        assertEq(nft.tokenURI(performanceId), performanceURI);

        vm.stopPrank();
    }

    function testSupportsInterface() public {
        assertTrue(nft.supportsInterface(0x80ac58cd));
        assertTrue(nft.supportsInterface(0x01ffc9a7));
    }

    function testUpdateCertification() public {
        vm.startPrank(manager);

        string memory diplomaURI = "ipfs://diploma_metadata_uri";
        emit DiplomaMinted(student, 1, diplomaURI);

        uint256 tokenId = nft.mintDiploma(student, diplomaURI);

        string memory newDiplomaURI = "ipfs://new_diploma_metadata_uri";
        nft.updateCertification(tokenId, newDiplomaURI);

        assertEq(nft.tokenURI(tokenId), newDiplomaURI);

        vm.stopPrank();
    }
}
