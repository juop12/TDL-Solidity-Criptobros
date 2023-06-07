import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './HomePage.css'; // Import the CSS file for the homepage

function HomePage() {
  return (
    <div className="home-page home-page-bg">
      <div className="header"></div> {/* Add the header element */}
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
      <div className="footer">
        <div className="bubbles">
          {[...Array(128)].map((_, i) => (
            <div
              key={i}
              className="bubble"
              style={{
                '--size': `${2 + Math.random() * 4}rem`,
                '--distance': `${6 + Math.random() * 4}rem`,
                '--position': `${-5 + Math.random() * 110}%`,
                '--time': `${2 + Math.random() * 2}s`,
                '--delay': `-${1 * (2 + Math.random() * 2)}s`,
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
