import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import the CSS file for the homepage

function HomePage() {
  return (
    <div className="home-page home-page-bg">
      <div className="header"></div> {/* Add the header element */}
      <h1 className="animated-header">
        <p>
          <span>Crypto Bros</span>
        </p>
      </h1>
      <div className="button-container">
        <Link to="/your-page-url" className="transition-element" transition-style="in:circle:hesitate">
          <button className="big-button">Create your NFT</button>
        </Link>
        <button className="big-button">Faucet</button>
        <button className="big-button">Auction</button>
        <button className="big-button">Information</button>
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
              <b>Integrantes del grupo:</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
