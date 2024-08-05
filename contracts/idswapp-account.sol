// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./idswapp-root.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";


contract IDSwappAccount is Ownable {
    IDSwappRoot public idSwappRoot;

    uint32 private subdomain;
    string private forwardEmail;
    
    string public description;
    uint32 public price;
    bool public purchasable;

    constructor(address owner, uint32 _subdomain, IDSwappRoot rootContract) Ownable(owner) {
        subdomain = _subdomain;
        idSwappRoot = rootContract;
    }

    function _resetContract() private {
        delete price;
        delete forwardEmail;
        purchasable = false;
    }

    function _transferOwnership(address newOwner) internal override {
        super._transferOwnership(newOwner);

        if (subdomain != 0 && owner() != address(0)) {
            idSwappRoot.setSubdomainOwner(subdomain, owner());
        }
    }

    function renounceOwnership() public override onlyOwner {
        _resetContract();
        purchasable = true;
        _transferOwnership(address(idSwappRoot));
    }

    function setForwardEmail(string calldata email) public onlyOwner {
        forwardEmail = email;
    }

    function setPurchasable(bool purchasable_) public onlyOwner {
        purchasable = purchasable_;
    }

    function setPrice(uint32 price_) public onlyOwner {
        price = price_;
    }

    function setDescription(string calldata description_) public onlyOwner {
        description = description_;
    }

    function details() public view returns (uint32, string memory) {
        if (idSwappRoot.isAdmin(msg.sender)) {
            return (subdomain, forwardEmail);
        }

        require(owner() == msg.sender, "Account details are restricted to Owner and Admins");
        return (subdomain, forwardEmail);
    }

    function purchaseAccount(string calldata email) public payable {
        require(purchasable, "Account is not for sale");
        require(msg.value >= price, "Not enough ether sent");

        (bool sent,) = owner().call{value: msg.value}("");
        require(sent, "Failed to send ether");
        _transferOwnership(msg.sender);

        _resetContract();
        setForwardEmail(email);
    }
}