// SPDX-License-Identifier: MIT
// Especifica la licencia bajo la cual se distribuye el código fuente. En este caso, la licencia MIT.
pragma solidity ^0.8.9;
// Indica la versión del compilador de Solidity que se utilizará.

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./MyToken.sol";


contract Auction is ERC1155Holder {
    using SafeMath for uint256;
    address public creator; // La dirección del creador de la subasta
    uint256 public startPrice; // Precio inicial de la subasta
    uint256 public minIncrement; // Incremento mínimo de la puja
    uint256 public directBuyPrice; // El precio de compra directa

    IERC1155 nft1155; // El token NFT
    uint256 public tokenId; // El id del token

    uint256 public startTime; // El timestamp del bloque que marca el inicio de la subasta
    uint256 public endTime; // Tiempo de finalización de la subasta (en segundos)

    Bid[] public bids; // La lista de pujas realizadas por los postores
    uint256 public maxBid; // La puja máxima
    address public maxBidder; // La dirección del postor máximo
    bool public cancelled;

    MyToken smartContract; // El contrato inteligente de MyToken

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

    modifier collector() {
        require(
            msg.sender == maxBidder || msg.sender == creator,
            "Only the highest bidder can only collect the token"
        );
        _;
    }

    modifier validBid() {
        require(
            msg.value > startPrice,
            "The bid is lower than the start price"
        );
        require(msg.value > maxBid, "There already is a higher bid");
        require(
            msg.value >= maxBid + minIncrement,
            "The bid has to set a significant increase"
        );
        _;
    }

    modifier notCancelled() {
        require(cancelled != false);
        _;
    }

    constructor(
        address _creator,
        uint256 _startPrice,
        uint256 _directBuyPrice,
        uint256 _endTime,
        address _myTokenAddress
    ) {
        creator = _creator;
        directBuyPrice = _directBuyPrice;
        startPrice = _startPrice;

        nft1155 = MyToken(_myTokenAddress); // Use the deployed MyToken contract instance

        startTime = block.timestamp;
        endTime = _endTime;

        maxBidder = _creator;
        cancelled = false;
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
    function placeBid()
        external
        payable
        open
        notCreator
        validBid
        returns (bool)
    {
        if (msg.value >= directBuyPrice) {
            endTime = block.timestamp;
        }

        if (msg.sender == maxBidder) {
            bids[bids.length - 1].bid = msg.value;

            return true;
        }

        maxBid = msg.value;
        maxBidder = msg.sender;
        bids.push(Bid(msg.sender, msg.value));

        return true;
    }

    // El postor máximo obtiene el token
    function collect() external ended collector notCancelled returns (bool) {
        nft1155.safeTransferFrom(
            creator,
            maxBidder,
            tokenId,
            1,
            ""
        );
        smartContract.safeTransferFrom(maxBidder, creator,0,maxBid,"");
        return true;
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
