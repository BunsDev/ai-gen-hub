// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

interface IRegistry {
    function fallbackImageAdGenAddress() external;
}

contract ImageAdGen is FunctionsClient, ConfirmedOwner, ERC721URIStorage {

     address registryAddress;

     constructor(address _registryAddress) FunctionsClient(router) ConfirmedOwner(msg.sender) ERC721("Poster Ad", "PAd") {
        registryAddress = _registryAddress;
     }

    using FunctionsRequest for FunctionsRequest.Request;
    uint256 public _tokenId = 0;

    event ModelMinted(
        uint256 indexed tokenId
    );

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    address public s_lastMint_address;
    bool public isFullfilled;

    error UnexpectedRequestID(bytes32 requestId);

    // mumbai
    address router = 0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C;
    uint64 subscriptionId = 1068;
    bytes32 donID =
        0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000;

    uint32 gasLimit = 300000;
    string public result;

    string AdImg =
        "const prompt = args[0];"
        "const modelImage = args[1];"
        "const productImage = args[2];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://adgen.pythonanywhere.com/generate-ad-poster/${prompt}/${modelImage}/${productImage}`"
        "});"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "return Functions.encodeString(data[0].url);";

    function createImgAdNFT(
        address _mint_address,
        string[] calldata args
    ) public returns (uint256) {
        isFullfilled = false;
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(AdImg);
        
        if (args.length > 0) req.setArgs(args);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        s_lastMint_address = _mint_address;
        return _tokenId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override{
        if (s_lastRequestId != requestId) {
            revert UnexpectedRequestID(requestId);
        }
        result = string(response);
        ++_tokenId;
        string memory tokenURI = result;
        uint256 newTokenId = _tokenId;
        _mint(s_lastMint_address, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        s_lastResponse = response;
        s_lastError = err;
        isFullfilled = true;
        emit ModelMinted(_tokenId);
    }
}