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
    showAuction(false);
    setAddress(event.target.value);
    showTable(true);
  };

  return (
    <div className="auction-page">
      <div className="button-container">
        <button onClick={handleButtonClick} className="big-button">
          Auctions still opened
        </button>
        <div style={{ textAlign: "center" }}>
          <input
            value={address}
            onChange={handleAddressChange}
            className="address-field-faucet"
            placeholder="Wallet Address"
          />
        </div>
      </div>

      {auction && !table && (
        <div className="nft-table">
          <h1>Tokens owned by the address:</h1>
          {tokens.length === 0 ? (
            <p>No tokens found for the given address.</p>
          ) : (
            <div className="token-grid">
              {tokens.map((token) => (
                <div key={`${token.token_id}-${token.contract_address}`} className="card">
                  {token.metadata && token.metadata.image ? (
                    <>
                      <img src={"https://ipfs.io/ipfs/" + token.metadata.image.slice(7)} alt={token.name} />
                      <p className="amount">Amount: {token.amount}</p>
                    </>
                  ) : (
                    <p>No image available</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {table && !auction && (
        <div className="nft-table">
          <h1>Tokens owned by the address:</h1>
          {tokens.length === 0 ? (
            <p>No tokens found for the given address.</p>
          ) : (
            <div className="token-grid">
              {tokens.map((token) => (
                <div key={`${token.token_id}-${token.contract_address}`} className="card">
                  {token.metadata && token.metadata.image ? (
                    <div>
                      <img
                        src={"https://ipfs.io/ipfs/" + token.metadata.image.slice(7)}
                        alt={token.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'images/no-image-available.jpg'; // Replace with the path to your "no image available" placeholder image
                        }}
                      />
                        <p className="amount">Amount: {token.amount}</p>
                      {/* <p className="image-url">{token.metadata.image}</p> */}
                    </div>
                  ) : (
                    <div>
                      <p>No image available</p>
                      <p className="image-url">{token.metadata ? token.metadata.image : 'Image URL not found'}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* <div className="response-container">
        <h2>Response:</h2>
        <pre>{responseString}</pre>
      </div> */}
      <div className="button-container">
        <Link to="..">
          <button className="custom-button">Back</button>
        </Link>
      </div>
    </div>
  );
}
const startMoralis = async () => {
  await Moralis.start({
    apiKey: "uwKAFyNPx5zT7CQHZ9J28sfP3k2dpl25CJNEBwaU4gv7LKCNI3d3Pb9LPDdmWr5t" // Replace with your Moralis API Key
  });
}

startMoralis()
export default Auction;
