// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract IDSwappRoot is Ownable, AccessControl {
    struct AccountInfo {
        address _owner;
        address _contract;
    }

    bytes32 public constant ADMIN = keccak256("ADMIN");

    address public factory;
    mapping(uint32 => AccountInfo) private accountMap;
    mapping(address => bool) public whitelistedContracts;

    constructor() Ownable(msg.sender) {
        _grantRole(ADMIN, msg.sender);
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

    function setFactoryAddress(address factoryAddr) public onlyRole(ADMIN) {
        factory = factoryAddr;
    }

    /**
    * Only the Factory Contract can whitelist account contracts.
    * This ensures only accounts deployed via IDSwapp directly are whitelisted
    */
    function whitelistAddress (address contractAddr) public {
        require(msg.sender == factory, "Limited to IDSwapp Factory Contract");
        whitelistedContracts[contractAddr] = true;
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
}