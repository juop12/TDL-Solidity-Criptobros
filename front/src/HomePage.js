import React, { useState } from 'react';
import { Link, useNavigate   } from 'react-router-dom';

import './HomePage.css';

function HomePage() {

  const navigate = useNavigate();
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
        <Link to="https://eli-tocs.notion.site/eli-tocs/Criptobros-ae4670bdd81a4d5091a8b735110d222f" target='_blank'>
          <button className="big-button">Information</button>
        </Link>
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
