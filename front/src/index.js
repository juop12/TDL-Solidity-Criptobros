import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CreateNFT from './CreateNFT'; // Update the import statement

ReactDOM.render(
  <React.StrictMode>
    <CreateNFT /> {/* Update the component name */}
  </React.StrictMode>,
  document.getElementById('root')
);
