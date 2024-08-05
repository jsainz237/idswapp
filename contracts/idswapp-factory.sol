// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./idswapp-root.sol";
import "./idswapp-account.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract IDSwappFactory {
    IDSwappRoot private idSwappRootContract;
    uint32 public subdomainCounter = 1000;

    event IDSwappAccountCreated(
        address indexed accountContractAddr,
        address indexed owner
    );

    constructor (address rootContract) {
        idSwappRootContract = IDSwappRoot(rootContract);
    }

    /** Creates an account contract, then whiteslists that contract to the root's whitelisted addresses */
    function createAccount() public returns (address) {
        address owner = msg.sender;
    
        IDSwappAccount account = new IDSwappAccount(owner, subdomainCounter, idSwappRootContract);
        idSwappRootContract.whitelistAddress(address(account));
        emit IDSwappAccountCreated(address(account), owner);

        subdomainCounter++;
        return address(account);
    }
}