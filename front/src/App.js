import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import CreateNFT from './CreateNFT';
import Faucet from './Faucet'; // Import the Faucet component
import Auction from './Auction'; // Import the Auction component
import Information from './Information'; // Import the Information component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-nft" element={<CreateNFT />} />
        <Route path="/faucet" element={<Faucet />} /> 
        <Route path="/auction" element={<Auction />} /> 
        <Route path="/information" element={<Information />} /> 
      </Routes>
    </Router>
  );
}

export default App;
