// SPDX-License-Identifier: MIT
// Especifica la licencia bajo la cual se distribuye el código fuente. En este caso, la licencia MIT.
pragma solidity ^0.8.9;
// Indica la versión del compilador de Solidity que se utilizará.

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./MyToken.sol";

struct CollectResult {
    address creator;
    address maxBidder;
    uint256 tokenId;
    uint256 maxBid;
}

contract Auction is ERC1155Holder {
    using SafeMath for uint256;
    address public creator; // La dirección del creador de la subasta
    uint256 public startPrice; // Precio inicial de la subasta
    uint256 public minIncrement; // Incremento mínimo de la puja
    uint256 public directBuyPrice; // El precio de compra directa

    IERC1155 nft1155; // El token NFT
    uint256 public tokenId; // El id del token
    string private tokenUri; // El uri del token
    uint256 public startTime; // El timestamp del bloque que marca el inicio de la subasta
    uint256 public endTime; // Tiempo de finalización de la subasta (en segundos)

    Bid[] public bids; // La lista de pujas realizadas por los postores
    uint256 public maxBid; // La puja máxima
    address public maxBidder; // La dirección del postor máximo
    bool public cancelled;

    event NewBid(address indexed _from, uint256 _bid);
    event AuctionEnded(address indexed _winner, uint256 _amount);
    event FundsCollected(address indexed _creator, uint256 _amount);
    event NFTCollected(address indexed _winner);

    struct Bid {
        address sender;
        uint256 bid;
    }

    modifier open() {
        require(block.timestamp < endTime, "The auction has already ended");
        _;
    }

    modifier ended() {
        require(block.timestamp >= endTime, "The auction has not ended yet");
        _;
    }

    modifier onlyCreator() {
        require(
            msg.sender == creator,
            "Only the creator can collect the funds"
        );
        _;
    }

    modifier notCreator() {
        require(msg.sender != creator, "The creator cannot bid");
        _;
    }

    modifier validBid(uint256 bidValue, address wallet) {
        require(bidValue > startPrice, "The bid is lower than the start price");
        require(bidValue > maxBid, "There already is a higher bid");
        require(
            bidValue >= maxBid + minIncrement,
            "The bid has to set a significant increase"
        );
        uint256 nftBalance = nft1155.balanceOf(wallet, 0);
        require(nftBalance >= bidValue);
        _;
    }

    modifier notCancelled() {
        require(cancelled != true);
        _;
    }

    constructor(
        address _creator,
        uint256 _startPrice,
        uint256 _directBuyPrice,
        uint256 _endTime,
        address _myTokenAddress,
        uint256 _tokenId,
        string memory _uri
    ) {
        creator = _creator;
        directBuyPrice = _directBuyPrice;
        startPrice = _startPrice;

        nft1155 = MyToken(_myTokenAddress); // Use the deployed MyToken contract instance

        startTime = block.timestamp;
        endTime = _endTime;
        minIncrement = 5;
        maxBidder = _creator;
        cancelled = false;
        tokenId = _tokenId;
        tokenUri = _uri;
    }

    // Retorna una lista con las direcciones de los postores y sus respectivas pujas
    function allBids()
        external
        view
        returns (address[] memory, uint256[] memory)
    {
        address[] memory addrs = new address[](bids.length); // Vector de addrs de bids
        uint256[] memory bidPrice = new uint256[](bids.length); // Vector de precios de bids

        for (uint256 i = 0; i < bids.length; i++) {
            addrs[i] = bids[i].sender;
            bidPrice[i] = bids[i].bid;
        }

        return (addrs, bidPrice);
    }

    // Crea una nueva puja (usa los modificadores)
    function placeBid(uint256 bid, address bidder)
        external
        open
        validBid(bid, bidder)
        returns (bool)
    {
        if (bid >= directBuyPrice) {
            endTime = block.timestamp;
        }

        if (bidder == maxBidder) {
            bids[bids.length - 1].bid = bid;

            return true;
        }

        if (bid > maxBid) {
            maxBid = bid;
            maxBidder = bidder;
            bids.push(Bid(bidder, bid));
            return true;
        }
        return false;
    }

    //Tiempo Restante
    function timeRemaining() external view returns (uint256) {
        if (block.timestamp > endTime) {
            return 0;
        }
        return endTime - block.timestamp;
    }

    //Max Bidder
    function getMaxBidder() external view returns (address) {
        return maxBidder;
    }

    //Max Bid
    function getMaxBid() external view returns (uint256) {
        return maxBid;
    }

    //Max Bid
    function getUri() external view returns (string memory) {
        return tokenUri;
    }

    // El postor máximo obtiene el token
    function collect() external view ended notCancelled returns (CollectResult memory){

        CollectResult memory result;
        result.creator = creator;
        result.maxBidder = maxBidder;
        result.tokenId = tokenId;
        result.maxBid = maxBid;

        return result;
    }

    // Cancela la subasta
    function cancelAuction() external open onlyCreator returns (bool) {
        endTime = block.timestamp;
        maxBid = 0;
        maxBidder = address(0); // Set maxBidder to an invalid address (burn address)
        cancelled = true;

        return true;
    }
}
