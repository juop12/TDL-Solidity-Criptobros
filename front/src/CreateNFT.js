import React, { useState, useRef } from 'react';
import './CreateNFT.css'; // Import the CSS file


function CreateNFT() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [properties, setProperties] = useState([]);
  const [propertyName, setPropertyName] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
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
      setProperties([...properties, { name: propertyName, value: propertyValue }]);
      setPropertyName('');
      setPropertyValue('');
    }
  };

  const handleButtonClick = () => {
    handleSelectFile();
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
      <div className="button-container">
        <button class="btn" type="button">
          <strong>CREATE YOUR NFT</strong>
          <div id="container-stars">
            <div id="stars"></div>
          </div>

          <div id="glow">
            <div class="circle"></div>
            <div class="circle"></div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default CreateNFT;
