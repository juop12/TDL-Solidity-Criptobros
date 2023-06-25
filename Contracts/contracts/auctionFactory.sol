// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Auction.sol";

contract AuctionFactory {
    address[] public auctions;

    event AuctionCreated(address indexed auction, address indexed creator);

    function createAuction(
        uint256 _startPrice,
        uint256 _directBuyPrice,
        uint256 _endTime,
        address _myTokenAddress
    ) external returns (address) {
        Auction newAuction = new Auction(
            msg.sender,
            _startPrice,
            _directBuyPrice,
            _endTime,
            _myTokenAddress
        );

        auctions.push(address(newAuction));
        emit AuctionCreated(address(newAuction), msg.sender);

        return address(newAuction);
    }

    function getAuctionCount() external view returns (uint256) {
        return auctions.length;
    }

    function getAuctionAtIndex(uint256 index) external view returns (address) {
        require(index < auctions.length, "Invalid index");
        return auctions[index];
    }

    function placeBid(address auctionAddress) external payable {
        Auction auction = Auction(auctionAddress);
        auction.placeBid{value: msg.value}();
    }

    function collect(address auctionAddress) external {
        Auction auction = Auction(auctionAddress);
        auction.collect();
    }

    function cancelAuction(address auctionAddress) external {
        Auction auction = Auction(auctionAddress);
        auction.cancelAuction();
    }

    function getAllBids(address auctionAddress) external view returns (address[] memory, uint256[] memory) {
        Auction auction = Auction(auctionAddress);
        return auction.allBids();
    }
}
