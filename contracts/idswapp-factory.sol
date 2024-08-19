// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import "./idswapp-account.sol";

contract IDSwappFactory is Ownable, AccessControl {
    struct PublicAccountInfo {
        address _owner;
        address _contract;

        string description;
        uint256 price;
        bool purchasable;
    }

    bytes32 public constant ADMIN = keccak256("ADMIN");
    uint32 public constant SUBDOMAIN_START = 1000;

    uint32 public subdomainCounter = SUBDOMAIN_START;
    mapping(uint32 => PublicAccountInfo) private accountMap;
    mapping(address => bool) public whitelistedContracts;

    event IDSwappAccountCreated(
        address indexed account,
        address indexed owner
    );

    constructor() Ownable(msg.sender) {
        _grantRole(ADMIN, msg.sender);
    }

    function _whitelistContract(address acctContract) private {
        whitelistedContracts[acctContract] = true;
    }

    function _setSubdomainProperties(uint32 subdomain, address owner, IDSwappAccount account) private {
        accountMap[subdomain] = PublicAccountInfo({
            _owner: owner,
            _contract: address(account),
            description: account.description(),
            price: account.price(),
            purchasable: account.purchasable()
        });
    }

    function isAdmin(address account) public view returns (bool) {
        return hasRole(ADMIN, account);
    }

    function grantAdmin(address account) public onlyRole(ADMIN) {
        _grantRole(ADMIN, account);
    }

    function revokeAdmin(address account) public onlyRole(ADMIN) {
        require(account != msg.sender, "Cannot revoke own admin privelages");
        _revokeRole(ADMIN, account);
    }

    /** Only allows whitelisted account contracts to edit the account map */
    function setSubdomainProperties(uint32 subdomain, address owner, IDSwappAccount account) public {
        require(whitelistedContracts[msg.sender], "Permission denied");
        _setSubdomainProperties(subdomain, owner, account);
    }

    function getSubdomainDetails(uint32 subdomain) public view returns (PublicAccountInfo memory) {
        return accountMap[subdomain];
    }

    function getAll() public view returns (PublicAccountInfo[] memory) {
        uint32 count = subdomainCounter - 1000;

        PublicAccountInfo[] memory accts = new PublicAccountInfo[](count);
        for (uint32 i = 0; i < count; i++) {
            accts[i] = accountMap[i + 1000];
        }
        return accts;
    }

    /** Creates an account contract, then whiteslists that contract to the root's whitelisted addresses */
    function createAccount(string calldata email) public returns (address) {
        address owner = msg.sender;
    
        IDSwappAccount account = new IDSwappAccount(owner, subdomainCounter, email, this);
        _setSubdomainProperties(subdomainCounter, owner, account);
        _whitelistContract(address(account));

        emit IDSwappAccountCreated(address(account), owner);

        subdomainCounter++;
        return address(account);
    }
}