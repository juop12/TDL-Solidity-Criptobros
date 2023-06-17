import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import './Faucet.css'; // Import the CSS file


function Faucet() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);


  const dispenseCurrency = async (address) => {
    try {
      const response = await axios.post('https://api.defender.openzeppelin.com/autotasks/d6221de7-554b-4ecf-9943-e35947cf14f3/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/VTGzQtQXkHU6paxsiv91xw', {
        addressTo: address,
      })

      console.log('Currency dispensed successfully:', response.data);
    } catch (error) {
      console.error('Error dispensing currency:', error);
    }
  };

  const handleFaucet = async (address) => {
    // Access the form data and execute your code here
    console.log('Address:', address);
    setLoading(true);
    setResponse(false);

    try { 

			// Await operation.
			await dispenseCurrency(address);

			// Reset form fields and clear selected image and properties
			setLoading(false);
      setResponse(true);
      setAddress('');

		} catch (error) {
      console.error('Error dispensing currency:', error);
    }
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  return (
    <div
			className="faucet"
			style={{
				background:
					'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 400\'%3E%3Cdefs%3E%3Cpattern id=\'bg_pattern\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3E%3Crect x=\'0\' y=\'0\' width=\'50\' height=\'25\' fill=\'%2315161A\'/%3E%3Crect x=\'0\' y=\'25\' width=\'25\' height=\'75\' fill=\'%2315161A\'/%3E%3Crect x=\'50\' y=\'75\' width=\'50\' height=\'25\' fill=\'%2315161A\'/%3E%3Crect x=\'50\' y=\'0\' width=\'25\' height=\'75\' fill=\'%2315161A\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect x=\'0\' y=\'0\' width=\'100%25\' height=\'100%25\' fill=\'%23112455\'/%3E%3Crect x=\'0\' y=\'0\' width=\'100%25\' height=\'100%25\' fill=\'url(%23bg_pattern)\'/%3E%3C/svg%3E") center/cover',
				}}
    >

			<div className="title">
				<span className="title-text">Faucet</span>
			</div>

			<div styles="text-align:center">
				<input
					value={address}
					onChange={handleAddressChange}
					className="address-field"
					placeholder="Wallet Address"
				/>
			</div>
				
			<div className="button-container">
				<button
				onClick={() => handleFaucet(address)}
				className="faucet-btn"
				type="button"
				>
					<strong>ASK FOR CURRENCY</strong>
				</button>
			</div>

			{loading && (
				<div className="loading-box">
				<span>Loading...</span>
				</div>
			)}

			{response && <p className="faucet-comment">DONE</p>}
      
    </div>
  );
}

export default Faucet;
