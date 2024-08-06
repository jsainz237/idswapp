// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./idswapp-factory.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";


contract IDSwappAccount is Ownable {
    IDSwappFactory public idSwappFactory;

    uint32 private _subdomain;
    string private _forwardEmail;
    
    string public description;
    uint32 public price;
    bool public purchasable;

    constructor(address owner, uint32 subdomain, IDSwappFactory factoryContract) Ownable(owner) {
        _subdomain = subdomain;
        idSwappFactory = factoryContract;
    }

    function _resetContract() private {
        delete price;
        delete _forwardEmail;
        purchasable = false;
    }

    function _transferOwnership(address newOwner) internal override {
        super._transferOwnership(newOwner);

        if (_subdomain != 0 && owner() != address(0)) {
            idSwappFactory.setSubdomainOwner(_subdomain, owner());
        }
    }

    function renounceOwnership() public override onlyOwner {
        _resetContract();
        purchasable = true;
        _transferOwnership(address(idSwappFactory));
    }

    function setForwardEmail(string calldata email) public onlyOwner {
        _forwardEmail = email;
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
        if (idSwappFactory.isAdmin(msg.sender)) {
            return (_subdomain, _forwardEmail);
        }

        require(owner() == msg.sender, "Account details are restricted to Owner and Admins");
        return (_subdomain, _forwardEmail);
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