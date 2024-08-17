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
    uint256 public price;
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

    function _updateFactory() private {
        idSwappFactory.setSubdomainProperties(_subdomain, owner(), this);
    }

    function _transferOwnership(address newOwner) internal override {
        super._transferOwnership(newOwner);

        if (_subdomain != 0 && owner() != address(0)) {
            _updateFactory();
        }
    }

    function renounceOwnership() public override onlyOwner {
        _resetContract();
        purchasable = true;
        _transferOwnership(address(idSwappFactory));
    }

    function setDetails(
        string calldata email,
        string calldata description_,
        uint256 price_,
        bool purchasable_
    ) public onlyOwner {
        _forwardEmail = email;
        description = description_;
        price = price_;
        purchasable = purchasable_;

        _updateFactory();
    }

    function privateDetails() public view returns (uint32, string memory) {
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
        _forwardEmail = email;
        _updateFactory();
    }
}