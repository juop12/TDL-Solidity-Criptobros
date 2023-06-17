import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useRef } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import './CreateNFT.css'; // Import the CSS file


function CreateNFT() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [properties, setProperties] = useState([]);
  const [propertyName, setPropertyName] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const fileInputRef = useRef(null);


  const handleSelectFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleAddProperty = () => {
    if (propertyName && propertyValue) {
      const newProperty = { name: propertyName, value: propertyValue };
      setProperties([...properties, newProperty]);
      setPropertyName('');
      setPropertyValue('');
    }
  };

  const handleDeleteProperty = () => {
    setProperties([]);
  }

  const handleButtonClick = () => {
    handleSelectFile();
  };

  const mintNFT = async (address, pinataHash) => {
    try {
      const response = await axios.post('https://api.defender.openzeppelin.com/autotasks/9464a6c0-a076-4cb7-be81-6698c16db878/runs/webhook/16764d23-28d5-46ba-a418-c064f2089339/HUo8kVHcTGfK8qwijGqkkW', {
        addressTo: address,
        uri: pinataHash,
      });

      console.log('NFT Minted successfully:', response.data);
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  const handleCreateNFT = async (selectedImage, properties, address) => {
    // Access the form data and execute your code here
    console.log('Selected Image:', selectedImage);
    console.log('Properties:', properties);
    console.log('Address:', address);
    setLoading(true);
    setResponse(false);

    // Upload image to IPFS
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const ipfsResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: '40c94835d8413087e499',
          pinata_secret_api_key: 'a529f470ddeb55ae816c13433cc1de6a88bf09acba77ce59153114131e50a064',
        },
      });

      const ipfsHash = ipfsResponse.data.IpfsHash;
      console.log('IPFS Hash:', ipfsHash);

      // Create NFT on Pinata
      const nftData = {
        image: `ipfs://${ipfsHash}`,
        name: 'CryptoBros',
        description: 'CryptoBros',
        attributes: properties.reduce((acc, property) => {
          acc[property.name] = property.value;
          return acc;
        }, {}),
      };
      
      const pinataResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', nftData, {
        headers: {
          pinata_api_key: '40c94835d8413087e499',
          pinata_secret_api_key: 'a529f470ddeb55ae816c13433cc1de6a88bf09acba77ce59153114131e50a064',
        },
      });

      const pinataHash = pinataResponse.data.IpfsHash;
      console.log('Pinata Hash:', `ipfs://${pinataHash}`);

      await mintNFT(address, `ipfs://${pinataHash}`);

      // Reset form fields and clear selected image and properties
      setLoading(false);
      setResponse(true);
      setSelectedImage(null);
      setProperties([]);
      setPropertyName('');
      setPropertyValue('');
      setAddress('');

    } catch (error) {
      console.error('Error creating NFT:', error);
    }
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  return (
    <div
      className="create-nft"
      style={{
        background:
          'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 400\'%3E%3Cdefs%3E%3Cpattern id=\'bg_pattern\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3E%3Crect x=\'0\' y=\'0\' width=\'50\' height=\'25\' fill=\'%2315161A\'/%3E%3Crect x=\'0\' y=\'25\' width=\'25\' height=\'75\' fill=\'%2315161A\'/%3E%3Crect x=\'50\' y=\'75\' width=\'50\' height=\'25\' fill=\'%2315161A\'/%3E%3Crect x=\'50\' y=\'0\' width=\'25\' height=\'75\' fill=\'%2315161A\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect x=\'0\' y=\'0\' width=\'100%25\' height=\'100%25\' fill=\'%23112455\'/%3E%3Crect x=\'0\' y=\'0\' width=\'100%25\' height=\'100%25\' fill=\'url(%23bg_pattern)\'/%3E%3C/svg%3E") center/cover',
        }}
    >
      <div className="title">
        <span className="title-text">Create Your NFT</span>
      </div>
      <div className="content">
        <div className="image-container">
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="selected-image"
            />
          )}
        </div>
        <button onClick={handleButtonClick} className="custom-button">
          Choose File
        </button>
        <div>
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      <div className="input-container">
        <div className="input-row">
          <input
            value={propertyName}
            onChange={(event) => setPropertyName(event.target.value)}
            className="input-field"
            placeholder="Property Name"
          />
          <input
            value={propertyValue}
            onChange={(event) => setPropertyValue(event.target.value)}
            className="input-field"
            placeholder="Property"
          />
          <button onClick={handleAddProperty} className="add-button">
            Add Property
          </button>
          <button onClick={handleDeleteProperty} className="delete-button">
            Delete All Properties
          </button>
        </div>
        <div className="property-box-container">
          <div className="property-table">
            <div className="property-row property-header">
              <div className="property-name">Property Name</div>
              <div className="property-value">Property</div>
            </div>
            <div className="property-rows">
              {properties.map((property, index) => (
                <div key={index} className="property-row">
                  <div className="property-name">{property.name}</div>
                  <div className="property-value">{property.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="address-container"> {/* Add a container for the address input field */}
        <input
          value={address}
          onChange={handleAddressChange}
          className="address-field"
          placeholder="Wallet Address"
        />
      </div>
      <div className="button-container">
        <button
          onClick={() => handleCreateNFT(selectedImage, properties, address)}
          className="btn"
          type="button"
        >
          <strong>CREATE YOUR NFT</strong>
          <div id="container-stars">
            <div id="stars"></div>
          </div>
          <div id="glow">
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </button>
      </div>
      {loading && (
        <div className="loading-box">
          <span>Loading...</span>
        </div>
      )}
      {loading && (
        <div className="loading-box">
          <span>Loading...</span>
        </div>
      )}
      {response && <p className="minted-comment">MINTED</p>}
    </div>
  );
}

export default CreateNFT;
