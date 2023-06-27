import React, { useEffect, useState } from 'react';
import './Auction.css';
import Moralis from 'moralis';
import console from './lib/console-browserify';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Auction() {
  const [address, setAddress] = useState('');
  const [table, showTable] = useState(false);
  const [auction, showAuction] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [responseString, setResponseString] = useState('');

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
          chain: "0x13881", // Mumbai Testnet
          format: "decimal",
          mediaItems: true,
          address: address
        });

        setTokens(response.result);
        setResponseString(JSON.stringify(response, null, 2));
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setTokens([]);
        setResponseString(`Error fetching tokens: ${error.message}`);
      }
    };

    if (address) {
      fetchTokens();
    }
  }, [address]);

  const getUri = async () => {
    try {
      const response = await axios.post('https://api.defender.openzeppelin.com/autotasks/d1c6bf30-0112-43a9-9352-bc978df633ab/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/LT7R5XRK72KshopDm25Cos');
      console.log('GetUri successfully:', response.data.result);
      let result = JSON.parse(response.data.result);
      console.log('Get image:', result.body.message);
      let url = result.body.message;
      const responseIpfs = await fetch(url);
      const data = await responseIpfs.text();
      console.log(data);
      /*
      const trimmedString = responseIpfs.url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('%'));
      console.log('Get TRIM:', trimmedString);
      //const trimmedWithoutQuotes = trimmed.replace(/"$/, '');
      const concatenatedUrl = "https://ipfs.io/ipfs/" + trimmedString;
      console.log('Get image:', concatenatedUrl);
      */
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  const handleButtonClick = () => {
    showTable(false);
    showAuction(true);
  };

  const handleAddressChange = (event) => {

  };

  return (
    <div className="auction-page">

      <div className="titleAuction">
        <span className="title-textAuction">Auction</span>
      </div>

      <div className="image-container">
          
      </div>

      <div className="center-image">
        {/* Agrega aquí el código para mostrar la imagen en el centro de la página */}
      </div>

      <div className="max-bidder-display">
        MAX BIDDER:
        {/* Agrega aquí el código para mostrar el máximo postor */}
      </div>

      <div className="input-container"> {/* Add a container for the address input field */}
        <input
          value={address}
          onChange={handleAddressChange}
          className="input-field"
          placeholder="Wallet Address"
        />
      </div>
      <div className="input-container"> {/* Add a container for the address input field */}
        <input
          value={address}
          onChange={handleAddressChange}
          className="input-field"
          placeholder="Bid Amount"
        />
      </div>

      <div className="button-container">
        <button onClick={getUri} className="big-button">
          Bid
        </button>
      </div>
    </div>
  );
}

export default Auction;
