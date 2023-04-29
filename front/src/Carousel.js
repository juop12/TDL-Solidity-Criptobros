import React, { useState, useRef } from 'react';
import './Carousel.css';

const images = [
  `${process.env.PUBLIC_URL}/images/howl bois.jpg`,
  `${process.env.PUBLIC_URL}/images/good boi.jpg`,
  `${process.env.PUBLIC_URL}/images/image tdl.jpg`,
];

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const ref = useRef(null);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartX(event.pageX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    event.preventDefault();
    const x = event.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 3; // Adjust the scroll speed
    ref.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (event) => {
    setIsDragging(true);
    setStartX(event.touches[0].clientX - ref.current.offsetLeft);
    setScrollLeft(ref.current.scrollLeft);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (event) => {
    if (!isDragging) return;
    const x = event.touches[0].clientX - ref.current.offsetLeft;
    const walk = (x - startX) * 3; // Adjust the scroll speed
    ref.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = () => {
    const slideWidth = ref.current.clientWidth;
    const newSlideIndex = Math.floor((ref.current.scrollLeft + slideWidth / 2) / slideWidth);
    setCurrentSlide(newSlideIndex);
  };

  return (
    <div className="carousel" ref={ref} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove} onScroll={handleScroll}>
      {images.map((imageUrl, index) => (
        <div key={index} className={`carousel-slide${index === currentSlide ? ' active' : ''}`}>
          <div className="carousel-img-container">
            <img className="carousel-img" src={imageUrl} alt={`Slide ${index + 1}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Carousel;
