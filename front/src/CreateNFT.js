import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './CreateNFT.css'; // Import the CSS file
import backgroundImage from './images/bathroom brothers.jpeg';
import titleImage from './images/create your nft.png';
import HomePage from './HomePage';

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

  return (
    <Router>
      <div className="create-nft" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/your-page-url" element={
            <div>
              <div className="title">
                <img src={titleImage} alt="Title" className="title-image" />
              </div>
              <div className="content">
                <div className="image-container" onClick={handleSelectFile}>
                  {selectedImage && (
                    <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="selected-image" />
                  )}
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="file-input"
                />
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
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default CreateNFT;
