import React, { useEffect, useState } from 'react';
import './Auction.css';
import Moralis from 'moralis';
import console from './lib/console-browserify';
import { Link } from 'react-router-dom';

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

  const handleButtonClick = () => {
    showTable(false);
    showAuction(true);
  };

  const handleAddressChange = (event) => {

  };

  return (
    <div className="auction-page">

      <div className="center-image">
        {/* Agrega aquí el código para mostrar la imagen en el centro de la página */}
      </div>

      <div className="max-bidder-display">
        MAX BIDDER:
        {/* Agrega aquí el código para mostrar el máximo postor */}
      </div>

      <div className="address-container"> {/* Add a container for the address input field */}
        <input
          value={address}
          onChange={handleAddressChange}
          className="address-field"
          placeholder="Wallet Address"
        />
      </div>
      <div className="address-container"> {/* Add a container for the address input field */}
        <input
          value={address}
          onChange={handleAddressChange}
          className="address-field"
          placeholder="Bid Amount"
        />
      </div>

      <div className="button-container">
        <button onClick={handleButtonClick} className="big-button">
          Bid
        </button>
      </div>
    </div>
  );
}

export default Auction;
