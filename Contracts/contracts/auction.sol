// SPDX-License-Identifier: MIT
// Especifica la licencia bajo la cual se distribuye el código fuente. En este caso, la licencia MIT.
pragma solidity ^0.8.9;
// Indica la versión del compilador de Solidity que se utilizará.

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "./erc1155.sol";

contract Auction is ERC1155Holder {
    using SafeMath for uint256;
    address public creator;         // La dirección del creador de la subasta
    uint256 public startPrice;      // Precio inicial de la subasta
    uint256 public minIncrement;    // Incremento mínimo de la puja
    uint256 public directBuyPrice;  // El precio de compra directa

    IERC1155 nft1155;               // El token NFT
    uint256 public tokenId;         // El id del token
    uint256 public nftAmount;       // La cantidad de tokens

    uint256 public startTime;       // El timestamp del bloque que marca el inicio de la subasta
    uint256 public endTime;         // Tiempo de finalización de la subasta (en segundos)

    Bid[] public bids;              // La lista de pujas realizadas por los postores
    uint256 public maxBid;          // La puja máxima
    address public maxBidder;       // La dirección del postor máximo

    MyToken smartContract;          // El contrato inteligente de MyToken

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
        require(msg.sender == creator, "Only the creator can collect the funds");
        _;
    }

    modifier notCreator() {
        require(msg.sender != creator, "The creator cannot bid");
        _;
    }

    modifier maxBidder() {
        require(msg.sender == maxBidder, "Only the highest bidder can only collect the token");
        _;
    }

    modifier validBid() {
        require(msg.value > startPrice, "The bid is lower than the start price");
        require(msg.value > maxBid, "There already is a higher bid");
        require(msg.value >= maxBid + minIncrement, "The bid has to set a significant increase");
        _;
    }

    constructor(
        address _creator,
        uint256 _startPrice,
        uint256 _directBuyPrice,
        uint256 _endTime,
        address _nftAddress,
        MyToken _smartContract
    ) {
        creator = _creator;
        directBuyPrice = _directBuyPrice;
        startPrice = _startPrice;

        nft1155 = ERC1155(_nftAddress);

        startTime = block.timestamp;
        endTime = _endTime;

        maxBidders = _creator;

        smartContract = _smartContract;
    }

    // Retorna una lista con las direcciones de los postores y sus respectivas pujas
    function allBids() external view returns (address[] memory, uint256[] memory) {
        
        address[] memory addrs = new address[](bids.length); // Vector de addrs de bids
        uint256[] memory bidPrice = new uint256[](bids.length); // Vector de precios de bids

        for (uint256 i = 0; i < bids.length; i++) {
            addrs[i] = bids[i].sender;
            bidPrice[i] = bids[i].bid;
        }
        
        return (addrs, bidPrice);
    }

    // // Crea una nueva puja
    // function placeBid(address bidder, uint256 bidAmmount) external payable returns (bool) {
        
    //     require(bidder != creator, "The creator cannot bid");
    //     require(block.timestamp < endTime, "The auction has already ended");
    //     require(bidAmmount > startPrice, "The bid is lower than the start price");
    //     require(bidAmmount > maxBid, "There already is a higher bid");
    //     require(bidAmmount >= maxBid + minIncrement, "The bid is lower than the minimum increment");

    //     if (bidder == maxBidder) {

    //         bids[bids.length - 1].bid = maxBid;

    //     } else {
    //         bids.push(Bid(bidder, bidAmmount));
            
    //         if (maxBidder != address(0)) {
    //             smartContract.transfer(maxBidder, maxBid);
    //         }

    //         maxBid = bidAmmount;
    //         maxBidder = bidder;
    //     }

    //     if (bidAmmount >= directBuyPrice) {
    //         endTime = block.timestamp;
    //     }
    //     return true;
    // }

    // Crea una nueva puja (usa los modificadores)
    function placeBid() external payable open notCreator validBid returns (bool) {

        if (msg.value >= directBuyPrice) {
            endTime = block.timestamp;
        }

        if (msg.sender == maxBidder) {
            bids[bids.length - 1].bid = msg.value;

            return true;
        }

        if (maxBidder != address(0)) {
            smartContract.transfer(maxBidder, maxBid);
        }

        maxBid = msg.value;
        maxBidder = msg.sender;
        bids.push(Bid(msg.sender, msg.value));

        return true;
    }

    // El postor máximo obtiene el token
    function collectNFT() external ended maxBidder returns (bool) {

        nft1155.safeTransferFrom(address(this), maxBidder, tokenId, nftAmount, "");
        return true;
    }

    // El creador obtiene el dinero
    function collectFunds() external ended onlyCreator returns (bool) {
        
        //  averiguar: como transfiero plata usando nuestro contrato! (ver tema de pagar gas y todo eso)
        smartContract.transfer(creator, maxBid);
        return true;
    }

    // Cancela la subasta
    function cancelAuction() external open onlyCreator returns (bool) {

        endTime = block.timestamp;

        nft1155.safeTransferFrom(address(this), creator, tokenId, nftAmount, ""); // Transfer the token to the highest bidder
        smartContract.transfer(creator, maxBid);

        return true;
    }
}