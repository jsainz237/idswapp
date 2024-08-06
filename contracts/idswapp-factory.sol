// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import "./idswapp-account.sol";

contract IDSwappFactory is Ownable, AccessControl {
    struct AccountInfo {
        address _owner;
        address _contract;
    }

    bytes32 public constant ADMIN = keccak256("ADMIN");

    uint32 public subdomainCounter = 1000;
    mapping(uint32 => AccountInfo) private accountMap;
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
    function setSubdomainOwner(uint32 subdomain, address owner) public {
        require(whitelistedContracts[msg.sender], "Permission denied");
        accountMap[subdomain] = AccountInfo(owner, msg.sender);
    }

    function getIdOwner(uint32 subdomain) public view returns (address) {
        return accountMap[subdomain]._owner;
    }

    function getIdContract(uint32 subdomain) public view returns (address) {
        return accountMap[subdomain]._contract;
    }

    /** Creates an account contract, then whiteslists that contract to the root's whitelisted addresses */
    function createAccount() public returns (address) {
        address owner = msg.sender;
    
        IDSwappAccount account = new IDSwappAccount(owner, subdomainCounter, this);
        _whitelistContract(address(account));
        emit IDSwappAccountCreated(address(account), owner);

        subdomainCounter++;
        return address(account);
    }
}