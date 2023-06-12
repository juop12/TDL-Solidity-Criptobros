import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './HomePage.css';

function HomePage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [bubbles, setBubbles] = useState(() =>
    [...Array(128)].map((_, i) => ({
      id: `${i}-${Math.random()}`,
      size: 2 + Math.random() * 4,
      distance: 6 + Math.random() * 4,
      position: -5 + Math.random() * 110,
      time: 2 + Math.random() * 2,
      delay: -1 * (2 + Math.random() * 2),
    }))
  );

  const handleChooseWallet = () => {
    // Handle choose wallet logic here
  };

  const handleInputChange = (event) => {
    setWalletAddress(event.target.value);
  };

  return (
    <div className="home-page home-page-bg">
      <div className="header"></div>
      <h1 className="animated-header">
        <p>
          <span>Solidity</span>
        </p>
      </h1>
      <div className="button-container">
        <Link to="/create-nft">
          <button className="big-button">Create your NFT</button>
        </Link>
        <Link to="/faucet">
          <button className="big-button">Faucet</button>
        </Link>
        <Link to="/auction">
          <button className="big-button">Auction</button>
        </Link>
        <Link to="/information">
          <button className="big-button">Information</button>
        </Link>
      </div>
      <div className="input-container">
        <div className="input-row">
          <input
            value={walletAddress}
            onChange={handleInputChange}
            className="input-field"
            placeholder="Wallet Address"
          />
          <button onClick={handleChooseWallet} className="choose-button">
            Choose Wallet
          </button>
        </div>
      </div>
      <div className="footer">
        <div className="bubbles">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="bubble"
              style={{
                '--size': `${bubble.size}rem`,
                '--distance': `${bubble.distance}rem`,
                '--position': `${bubble.position}%`,
                '--time': `${bubble.time}s`,
                '--delay': `${bubble.delay}s`,
              }}
            ></div>
          ))}
        </div>
        <div className="content">
          <div>
            <div>
              <b>Integrantes del grupo: Lucas Demarchi, Eliana Harriet, Marcos Bat Mentzel, Julian Stiefkens</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
