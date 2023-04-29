import React from 'react';
import './App.css';
import Carousel from './Carousel';

function App() {
  return (
    <div className="app-wrapper">
      <div className="title-wrapper">
        <h1>Selecciona tu meme</h1>
        <div className="property-wrapper">
          <p className="property">Property 1</p>
          <p className="property">Property 2</p>
          <p className="property">Property 3</p>
        </div>
      </div>
      <div className="carousel-wrapper">
        <Carousel />
      </div>
    </div>
  );
}

export default App;
