import React, { useEffect } from 'react';
import './Auction.css';

function Auction() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://plug-platform.devrev.ai/static/plug.js';
    script.type = 'text/javascript';

    script.onload = () => {
      window.plugSDK.init({
        app_id: 'don:core:dvrv-us-1:devo/KqvH5iWQ:plug_setting/1',
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.classList.remove('auction-page');
    };
  }, []);

  useEffect(() => {
    document.body.classList.add('auction-page');

    return () => {
      document.body.classList.remove('auction-page');
    };
  }, []);

  return (
    <div>
      
      <h2>Auction Page</h2>
      <p>Welcome to the auction page!</p>

      
      <div id="plug-widget"></div>
    </div>
  );
}

export default Auction;
