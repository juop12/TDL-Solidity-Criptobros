import React, { useState, useRef } from 'react';
import './App.css'; // Import the CSS file
import backgroundImage from './images/bathroom brothers.jpeg';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [bars, setBars] = useState(['']);
  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleSelectFile = () => {
    fileInputRef.current.click(); // Programmatically trigger the click event of the file input
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

  // Event handler for changing the input values
  const handleBarChange = (index, value) => {
    const newBars = [...bars];
    newBars[index] = value;
    setBars(newBars);
    // Add a new input field if the current one is the last and not empty
    if (index === newBars.length - 1 && value.length > 0 && newBars.length < 6) {
      setBars([...newBars, '']);
    }
  };

return (
    <div className="App">
      <h1 className="title">Create your NFT</h1>
      <div className="content">
        <div className="image-container" onClick={handleSelectFile}>
          {selectedImage && (
            <img src={selectedImage} alt="Selected" className="selected-image" />
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
        {bars.map((bar, index) => (
          <div key={index} className="input-row">
            <label className="input-label">{`Property ${index + 1}:`}</label> {/* Label for the input field */}
            <input
              value={bar}
              onChange={(event) => handleBarChange(index, event.target.value)}
              maxLength={index === bars.length - 1 ? 10 : undefined} // Set the maximum length to 10 for the last input field
              className="input-field"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
