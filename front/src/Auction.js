import React, { useEffect, useState } from 'react';
import './Auction.css';
import axios from 'axios';
import console from './lib/console-browserify';
import { Link } from 'react-router-dom';
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";



function Auction() {
  const [imageURL, setImageURL] = useState('');
  const [maxBid, setMaxBid] = useState('');
  const [balance, setBalance] = useState('');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [walletAddressInput, setWalletAddressInput] = useState('');
  const [bidAmountInput, setBidAmountInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);


  useEffect(() => {
    const fetchImage = async () => {
      try {
        const responseImage = await axios.post('https://api.defender.openzeppelin.com/autotasks/d1c6bf30-0112-43a9-9352-bc978df633ab/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/LT7R5XRK72KshopDm25Cos');
        const resultImage = JSON.parse(responseImage.data.result);
        const url = JSON.parse(resultImage.body.message);
        const responseIpfs = await axios.get(url);
        const image_url = responseIpfs.data.image;
        const trimmedString = image_url.split('://')[1];
        const concatenatedUrl = "https://ipfs.io/ipfs/" + trimmedString;
        setImageURL(concatenatedUrl);
      } catch (error) {
        console.error('Error getting image:', error);
      }
    };

    const fetchBalance = async () => {
      try {
        const responseBalance = await axios.post('https://api.defender.openzeppelin.com/autotasks/413508e9-ac94-4fd1-ab16-01ce2c0d5cc5/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/a4kfQerDazMhW6BQTEg95', {
          accountAddress: "0xd592673053a14308C376D0125133A6770c52e6e5",
        });
        let balance = JSON.parse(responseBalance.data.result).hex;
        setBalance(parseInt(balance));
      } catch (error) {
        console.error('Error getting image:', error);
      }
    };

    const fetchMaxBid = async () => {
      try {
        const responseMaxBid = await axios.post('https://api.defender.openzeppelin.com/autotasks/53727e70-9b63-4c3f-b08f-df347928bea7/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/MC9XoNL6zhuqeW5fTKFR4p');
        console.log(responseMaxBid);
        const resultMaxBid = JSON.parse(responseMaxBid.data.result);
        const MaxbidObject = JSON.parse(resultMaxBid.body.message);
        console.log(MaxbidObject);
        setMaxBid(parseInt(MaxbidObject.hex));
      } catch (error) {
        console.error('Error getting bid:', error);
      }
    };


    const fetchTimeRemaining = async () => {
      try {
        const responseTimeRemaining = await axios.post('https://api.defender.openzeppelin.com/autotasks/905d76ac-2654-4644-a4d2-c2161c874d90/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/N2nLiRDP9eBmzzi3C5TvEc');
        console.log(responseTimeRemaining);
        const resultTimeRemainig = JSON.parse(responseTimeRemaining.data.result);
        const timeRemainingObject = JSON.parse(resultTimeRemainig.body.message);
        console.log(timeRemainingObject);
        setTimeRemaining(parseInt(timeRemainingObject.hex));
        console.log("TIEMPO", timeRemaining);
        const date = new Date(timeRemaining * 1000);
        console.log(date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Los meses en JavaScript son base 0, por lo que sumamos 1.
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        console.log(`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`);
      } catch (error) {
        console.error('Error getting bid:', error);
      }
    };


    fetchBalance();
    fetchTimeRemaining();
    fetchImage();
    fetchMaxBid();
  }, [bidAmountInput]);

  const handleAddressChange = (event) => {
    setWalletAddressInput(event.target.value);
  };

  const handleBidChange = (event) => {
    setBidAmountInput(event.target.value);
  };


  const handleBid = async () => {

    setLoading(true);
    setResponse(false);
    // Crear un proveedor que se conecta a MetaMask
    const provider = new Web3Provider(window.ethereum);

    // Pedir permiso a MetaMask para acceder a tus cuentas
    await provider.send("eth_requestAccounts", []);

    // Obtener el contrato nft1155 con la dirección y el abi
    const nft1155Address = "0x451a3507d323cc99cab301736b5c3bb5f9bb2119";
    const nft1155Abi = [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "approved",
            "type": "bool"
          }
        ],
        "name": "ApprovalForAll",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "Paused",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256[]",
            "name": "ids",
            "type": "uint256[]"
          },
          {
            "indexed": false,
            "internalType": "uint256[]",
            "name": "values",
            "type": "uint256[]"
          }
        ],
        "name": "TransferBatch",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "TransferSingle",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "string",
            "name": "value",
            "type": "string"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "URI",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "Unpaused",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address[]",
            "name": "accounts",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "ids",
            "type": "uint256[]"
          }
        ],
        "name": "balanceOfBatch",
        "outputs": [
          {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "burn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint256[]",
            "name": "ids",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "values",
            "type": "uint256[]"
          }
        ],
        "name": "burnBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "exists",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          }
        ],
        "name": "isApprovedForAll",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256[]",
            "name": "ids",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "mintBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "paused",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256[]",
            "name": "ids",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "amounts",
            "type": "uint256[]"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "safeBatchTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "approved",
            "type": "bool"
          }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "newuri",
            "type": "string"
          }
        ],
        "name": "setURI",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes4",
            "name": "interfaceId",
            "type": "bytes4"
          }
        ],
        "name": "supportsInterface",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          }
        ],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "uri",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]; // El abi del contrato nft1155
    const nft1155 = new Contract(nft1155Address, nft1155Abi, provider);

    // Obtener el contrato de subasta con la dirección y el abi
    const auctionAddress = "0x5BF81CEaFA8453fc4f7F4E30883B45410fE1b578";
    const auctionAbi = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_creator",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_startPrice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_directBuyPrice",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_endTime",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_myTokenAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_tokenId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_uri",
            "type": "string"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "_winner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "AuctionEnded",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "cancelAuction",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "collect",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "_creator",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "FundsCollected",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "_winner",
            "type": "address"
          }
        ],
        "name": "NFTCollected",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "_from",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "_bid",
            "type": "uint256"
          }
        ],
        "name": "NewBid",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
          },
          {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
          },
          {
            "internalType": "bytes",
            "name": "",
            "type": "bytes"
          }
        ],
        "name": "onERC1155BatchReceived",
        "outputs": [
          {
            "internalType": "bytes4",
            "name": "",
            "type": "bytes4"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "",
            "type": "bytes"
          }
        ],
        "name": "onERC1155Received",
        "outputs": [
          {
            "internalType": "bytes4",
            "name": "",
            "type": "bytes4"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "bid",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "bidder",
            "type": "address"
          }
        ],
        "name": "placeBid",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "allBids",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          },
          {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "bids",
        "outputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "bid",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "cancelled",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "creator",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "directBuyPrice",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "endTime",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getMaxBid",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getMaxBidder",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getUri",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "maxBid",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "maxBidder",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "minIncrement",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "startPrice",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "startTime",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes4",
            "name": "interfaceId",
            "type": "bytes4"
          }
        ],
        "name": "supportsInterface",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "timeRemaining",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "tokenId",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]; // El abi del contrato de subasta
    const auction = new Contract(auctionAddress, auctionAbi, provider);

    // Obtener la cuenta que está conectada a MetaMask
    const account = await provider.getSigner();

    // Aprobar al contrato de subasta para que pueda transferir tus tokens NFT
    await nft1155.connect(account).setApprovalForAll(auction.address, true);


    const walletAddress = walletAddressInput;
    const bidAmount = bidAmountInput;

    const responseBid = await axios.post('https://api.defender.openzeppelin.com/autotasks/c85bb66a-915e-4fce-bdcd-239e2b8351a7/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/HmyYgJZZ9NtBJ83Kn4rnQy', {
      walletAddressInput: walletAddressInput,
      bidAmountInput: bidAmountInput,
    });

    console.log(responseBid);
    console.log("I BID");
    console.log(walletAddress);
    console.log(bidAmount);
    setLoading(false);
    setResponse(true);
    
  };



  return (
    <div className="auction-page">
      <div className="titleAuction">
        <span className="title-textAuction">Auction</span>
      </div>

      <div className="image-container-auction">
        {imageURL && <img src={imageURL} alt="Imagen" />}
      </div>

      <div className="max-bidder-display">
        MAX BID:
        {maxBid && <span className="max-bidder">{maxBid}</span>}
      </div>

      <div className="time-remaining-display">
        TIME REMAINING:
        {timeRemaining && <span className="max-bidder">{timeRemaining}</span>}
      </div>

      <div className="balance-display">
        BALANCE:
        {balance && <span className="max-bidder">{balance}</span>}
      </div>

      <div className="input-container">
        <input
          value={walletAddressInput}
          onChange={handleAddressChange}
          className="input-field"
          placeholder="Wallet Address"
        />
      </div>
      <div className="input-container">
        <input
          value={bidAmountInput}
          onChange={handleBidChange}
          className="input-field"
          placeholder="Bid Amount"
        />
      </div>

      <div className="button-container">
        <button className="big-button" onClick={handleBid}>
          Bid
        </button>
      </div>

      <div className="button-container">
        <Link to="..">
          <button className="custom-button">Back</button>
        </Link>
      </div>
      {loading && (
        <div className="loading-box-auction">
          <span>Loading...</span>
        </div>
      )}
      {response && <p className="bid-placed-comment">BIDDED</p>}
    </div>
  );
}

export default Auction;
