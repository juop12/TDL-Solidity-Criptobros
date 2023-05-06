// SPDX-License-Identifier: MIT
// Especifica la licencia bajo la cual se distribuye el código fuente. En este caso, la licencia MIT.
pragma solidity ^0.8.9;
// Indica la versión del compilador de Solidity que se utilizará.

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "./erc1155.sol";

contract Auction is ERC1155Holder {
    address public creator;         // La dirección del creador de la subasta
    uint256 public directBuyPrice;  // El precio de compra directa
    uint256 public startPrice;      // Precio inicial de la subasta

    IERC1155 nft1155;               // El token NFT
    uint256 public tokenId;         // El id del token
    uint256 public nftAmount;       // La cantidad de tokens

    uint256 public startTime;       // El timestamp del bloque que marca el inicio de la subasta
    uint256 public endTime;         // Tiempo de finalización de la subasta (en segundos)

    Bid[] public bids;              // La lista de pujas realizadas por los postores
    uint256 public maxBid;          // La puja máxima
    address public maxBidder;       // La dirección del postor máximo

    MyToken smartContract;          // El contrato inteligente de MyToken


    enum AuctionState {
        OPEN,
        CANCELLED,
        ENDED,
        DIRECT_BUY,
        ENDED_BY_CREATOR
    }

    struct Bid {
        address sender;
        uint256 bid;
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

    // Crea una nueva puja
    function placeBid(address bidder, uint256 bidAmmount) external payable returns (bool) {
        
        require(getAuctionState() == AuctionState.OPEN, "The auction is not open");
        require(block.timestamp < endTime, "The auction has already ended");
        require(bidAmmount > startPrice, "The bid is lower than the start price");
        require(bidAmmount > maxBid, "There already is a higher bid");

        maxBid = bidAmmount;
        maxBidder = bidder;

        bids.push(Bid(bidder, bidAmmount));

        return true;
    }

    // El postor máximo obtiene el token
    function collectNFT() external returns (bool) {

        require(getAuctionState() == AuctionState.ENDED || getAuctionState() == AuctionState.DIRECT_BUY || getAuctionState() == AuctionState.ENDED_BY_CREATOR, "The auction has not ended yet");
        
        require(msg.sender == maxBidder, "Only the highest bidder can only collect the token");
        
        nft1155.safeTransferFrom(address(this), maxBidder, tokenId, nftAmount, "");
        return true;
    }

    // El creador obtiene el dinero
    function collectFunds() external returns (bool) {

        require(getAuctionState() == AuctionState.ENDED || getAuctionState() == AuctionState.DIRECT_BUY || getAuctionState() == AuctionState.ENDED_BY_CREATOR, "The auction has not ended yet");
        
        require(msg.sender == creator, "Only the creator can collect the funds");


        //  averiguar: como transfiero plata usando nuestro contrato!
        smartContract.transfer(creator, maxBid);

        return true;
    }

    // El creador termina la subasta
    function creatorEndAution() external returns (bool) {

        require(msg.sender == creator, "Only the creator can end the auction");
        require(getAuctionState() == AuctionState.OPEN, "The auction is not open");

        endTime = block.timestamp;
        return true;
    }

    // Cancela la subasta
    function cancelAuction() external returns (bool) {
            
        require(msg.sender == creator, "Only the creator can cancel the auction");
        require(getAuctionState() == AuctionState.OPEN, "The auction is not open");

        endTime = block.timestamp;

        nft1155.safeTransferFrom(address(this), maxBidder, tokenId, nftAmount, ""); // Transfer the token to the highest bidder
        smartContract.transfer(maxBidder, maxBid);
        return true;
    }

    // Obtiene el estado de la subasta
    function getAuctionState() public view returns (AuctionState) {
        if (block.timestamp >= endTime) return AuctionState.ENDED;
        if (block.timestamp >= startTime) return AuctionState.OPEN;
    }
}