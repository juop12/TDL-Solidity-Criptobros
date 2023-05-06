import React, { useState } from 'react';

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
  };

  const handleBarBlur = (index) => {
    const lastBarIndex = bars.length - 1;
    if (index === lastBarIndex && bars[lastBarIndex].length > 0 && lastBarIndex < 5) {
      setBars([...bars, '']);
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
              onBlur={() => handleBarBlur(index)}
              disabled={index === 5 && bars[5].length > 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
