import React, { useState, useRef } from 'react';
import './App.css'; // Import the CSS file
import backgroundImage from './images/bathroom brothers.jpeg';
import titleImage from './images/create your nft.png'; // Replace 'title_image.jpg' with your actual title image file

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [properties, setProperties] = useState([]); // Array to store the properties
  const [propertyName, setPropertyName] = useState(''); // State for the Property Name input
  const [propertyValue, setPropertyValue] = useState(''); // State for the Property Value input
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleSelectFile = () => {
    fileInputRef.current.click(); // Programmatically trigger the click event of the file input
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  // Event handler for adding a property
  const handleAddProperty = () => {
    if (propertyName && propertyValue) {
      setProperties([...properties, { name: propertyName, value: propertyValue }]);
      setPropertyName(''); // Reset the Property Name input
      setPropertyValue(''); // Reset the Property Value input
    }
  };

  return (
    <div className="App">
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
  );
}

export default App;
