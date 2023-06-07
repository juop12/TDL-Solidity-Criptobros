import React, { useEffect } from 'react';
import './Auction.css';

function Auction() {
  useEffect(() => {
    document.body.classList.add('auction-page');
    return () => {
      document.body.classList.remove('auction-page');
    };
  }, []);

  return (
    <div>
      {/* Add your content and functionality specific to the Auction page */}
      <h2>Auction Page</h2>
      <p>Welcome to the auction page!</p>
    </div>
  );
}

export default Auction;
