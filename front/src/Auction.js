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
  const [collected, setCollected] = useState(false);
  const [auctionOpen, setAuctionOpen] = useState(false);



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
      if(walletAddressInput.length > 41) {
        try {
          const responseBalance = await axios.post('https://api.defender.openzeppelin.com/autotasks/413508e9-ac94-4fd1-ab16-01ce2c0d5cc5/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/a4kfQerDazMhW6BQTEg95', {
            accountAddress: "0xd592673053a14308C376D0125133A6770c52e6e5",
          });
          let balance = JSON.parse(responseBalance.data.result).hex;
          setBalance(parseInt(balance));
        } catch (error) {
          console.error('Error getting image:', error);
        }
      }else{
        console.log("No hay address");
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
        let timeRemaining = parseInt(timeRemainingObject.hex);
        setTimeRemaining(` ${ timeRemaining / 60 } minutos`);

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
    const nft1155Address = "0xcf40426b134BE1c8A3B5Cc99a7816B4A035949C5";
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
        "name": "safeTransfer",
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

    // Obtener la cuenta que está conectada a MetaMask
    const account = await provider.getSigner();

    // Aprobar al contrato de subasta para que pueda transferir tus tokens NFT
    await nft1155.connect(account).setApprovalForAll("0x1300f9edb982256265ba5c8f6c35609596676d9b", true);

    const responseBid = await axios.post('https://api.defender.openzeppelin.com/autotasks/c85bb66a-915e-4fce-bdcd-239e2b8351a7/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/HmyYgJZZ9NtBJ83Kn4rnQy', {
      walletAddressInput: walletAddressInput,
      bidAmountInput: bidAmountInput,
    });

    console.log(responseBid);

    setLoading(false);
    setResponse(true);

  };


  const handleCollect = async () => {

    setLoading(true);
    setResponse(false);
    
    const responseCollect = await axios.post('https://api.defender.openzeppelin.com/autotasks/47caec5e-2afd-474b-b79e-9a2c2b633215/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/UMSsqy1fT5H33HCDf3qe4X');

    console.log(responseCollect);
    console.log("RESPONSE COLLECT",responseCollect.data)
    console.log("RESPONSE COLLECT STATUS",responseCollect.data.status);
    setLoading(false);

    if(responseCollect.data.status === 'success') {
      setCollected(true);
    } else {
      setAuctionOpen(true);
    }


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

      <div className="button-container-collect">
        <button className="big-button-collect" onClick={handleCollect}>
          Collect
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
      {auctionOpen && (
        <div className="loading-box-auction">
          <span>The auction Is still OPENED</span>
        </div>
      )}
      {collected && <p className="bid-placed-comment">COLLECTED</p>}
    </div>
  );
}

export default Auction;
