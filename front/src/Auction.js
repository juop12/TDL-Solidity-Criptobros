import React, { useEffect, useState } from 'react';
import './Auction.css';
import axios from 'axios';

function Auction() {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const address = '0x123456789ABCDEF'; // Remplazar con address
        const network = 'matic'; // Mumbai
        const apiKey = 'YOUR_API_KEY'; // Reemplazar con API KEY

        const response = await axios.get(
          `https://api.opensea.io/api/v1/assets?owner=${address}&network=${network}`,
          {
            headers: {
              'X-API-KEY': apiKey,
            },
          }
        );

        setTokens(response.data.assets);
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };

    fetchTokens();
  }, []);

  return (
    <div className="auction-page">
      <h1>Tokens owned by the address:</h1>
      {tokens.length === 0 ? (
        <p>Loading tokens...</p>
      ) : (
        <ul>
          {tokens.map((token) => (
            <li key={token.token_id}>
              <p>Token ID: {token.token_id}</p>
              <p>Name: {token.name}</p>
              <p>Contract Address: {token.asset_contract.address}</p>
              <p>Token Type: {token.asset_contract.schema_name}</p>
              <img src={token.image_url} alt={token.name} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Auction;
