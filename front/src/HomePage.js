import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import the CSS file for the homepage

function HomePage() {
    return (
      <div className="home-page home-page-bg">
        <h1>Crypto Bros</h1>
        <Link to="/your-page-url">
            <button className="big-button">Create your NFT</button>
        </Link>
    </div>
  );
}

export default HomePage;
