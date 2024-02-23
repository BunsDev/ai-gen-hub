// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC6551Account} from "https://github.com/kk-im/tba-tutorial-pinata/blob/master/contracts/ERC6551Account.sol";
import {ERC6551Registry} from "https://github.com/kk-im/tba-tutorial-pinata/blob/master/contracts/ERC6551Registry.sol";

import "./ModelGen.sol";
import "./ImageAdGen.sol";

contract Registry {

    uint chainId;

    ERC6551Account public tbaImplementation;
    ERC6551Registry public erc6551registry;

    ModelGen public modelGen;
    ImageAdGen public imgAdGen;

    uint256 modelIdTracker;

    constructor(uint _chainId) {
        chainId = _chainId;
        tbaImplementation = new ERC6551Account();
        erc6551registry = new ERC6551Registry();
        modelGen = new ModelGen();
    }

    struct ModelAcc {
        address tba;
        address imgAdGen;
        uint256 modelId;
        address modelNFT;
        address creator;
        address owner;
        uint128 price;
        bool sale;
    }

    uint modelId;

    mapping (uint256 => ModelAcc) public idToModelAcc;

    modifier onlyAccOwner(uint256 _modelId) {
        require(idToModelAcc[_modelId].owner == msg.sender);
        _;
    }

    function createModel(string[] calldata _prompt) public returns (address) {
        ++modelIdTracker;
        modelGen.createModelNFT(_prompt);
        address tbaAddress = erc6551registry.account(address(tbaImplementation), chainId, address(modelGen), modelIdTracker, 0);
        erc6551registry.createAccount(address(tbaImplementation), chainId, address(modelGen), modelIdTracker, 0, "");
        modelId++;
        imgAdGen = new ImageAdGen(address(this));
        idToModelAcc[modelId] = ModelAcc(tbaAddress, address(imgAdGen), modelIdTracker, address(modelGen), msg.sender, msg.sender, 0, false);
        return tbaAddress;
    }

    function callImageAdGen(uint256 _modelId, string[] calldata payload) public onlyAccOwner(_modelId) returns (uint256) {
        address _contract = idToModelAcc[_modelId].imgAdGen;
        address tba = idToModelAcc[_modelId].tba;
        ImageAdGen instance = ImageAdGen(_contract);
        uint256 tokenId = instance.createImgAdNFT(tba, payload);
        return tokenId;
    }

    function fallbackImageAdGenAddress(uint256 _modelId, address response) public {
        idToModelAcc[_modelId].imgAdGen = response;
    }

    function listModelForSale(uint256 _modelId, uint128 _price) public {
        require(idToModelAcc[_modelId].owner == msg.sender);
        idToModelAcc[_modelId].sale = true;
        idToModelAcc[_modelId].price = _price;
        modelGen.safeTransferFrom(msg.sender, address(this), idToModelAcc[_modelId].modelId);
    }

    function buyModel(uint256 _modelId) public payable {
        uint256 price = idToModelAcc[_modelId].price;
        require(msg.value == price);
        idToModelAcc[_modelId].sale = false;
        modelGen.safeTransferFrom(address(this), msg.sender, idToModelAcc[_modelId].modelId);
    }

    function fetchAllModel() public view returns(ModelAcc[] memory) {
        uint counter = 0;
        ModelAcc[] memory modelAccs = new ModelAcc[](modelId);
        // for (uint256 i = 0; i < _tokenId.current(); i++) {
        for (uint i = 0; i < modelId; i++) {
            uint currentId = i + 1;
            ModelAcc storage currentItem = idToModelAcc[currentId];
            modelAccs[counter] = currentItem;
            counter++;
        }
        return modelAccs;
    }
}
