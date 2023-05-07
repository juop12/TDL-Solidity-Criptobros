import React, { useState } from 'react';
import backgroundImage from './images/bathroom brothers.jpeg';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [bars, setBars] = useState(['']);

  const handleSelectFile = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleBarChange = (index, value) => {
    const newBars = [...bars];
    newBars[index] = value;
    setBars(newBars);
    if (index === newBars.length - 1 && value.length > 0 && newBars.length < 6) {
      setBars([...newBars, '']);
    }
  };

  return (
    <div
      className="App"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '20px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div style={{ marginRight: '20px' }}>
        <div
          style={{
            width: '300px',
            height: '200px',
            border: '1px solid #ccc',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          ) : (
            <p>Select an image</p>
          )}
        </div>
        <input type="file" onChange={handleSelectFile} style={{ marginBottom: '10px' }} />
      </div>
      <div>
        {bars.map((bar, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <label>{`Property ${index + 1}:`}</label>
            <input
              value={bar}
              onChange={(event) => handleBarChange(index, event.target.value)}
              maxLength={index === bars.length - 1 ? 10 : undefined} // Set the maximum length to 10 for the last input field
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
