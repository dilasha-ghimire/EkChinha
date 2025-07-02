import React, { useState, useEffect } from "react";
import "./WhyChooseUs.css";

const WhyChooseUs = () => {
  const [activeSlide, setActiveSlide] = useState(0); // center index
  const whyImages = [1, 2, 3, 4, 5].map((i) => `/why-${i}.png`);
  const totalSlides = whyImages.length;

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleDotClick = (index) => {
    setActiveSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // 5-second auto-rotation

    return () => clearInterval(interval);
  }, [totalSlides]);

  const getClassName = (index) => {
    const distance = (index - activeSlide + totalSlides) % totalSlides;

    if (index === activeSlide) return "slide center";
    if (distance === 1) return "slide side-right";
    if (distance === totalSlides - 1) return "slide side-left";
    if (distance === 2) return "slide far-right";
    if (distance === totalSlides - 2) return "slide far-left";
    return "slide hidden";
  };

  return (
    <section className="section">
      <div className="section-content">
        <h2>Why Choose Us?</h2>
        <div className="carousel-container-centered">
          <div className="slides-wrapper">
            {whyImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Why ${i + 1}`}
                className={getClassName(i)}
              />
            ))}
          </div>

          <div className="dots-and-arrows">
            <button className="nav-arrow left" onClick={prevSlide}>
              <img src="/left-arrow.png" alt="Left" />
            </button>

            <div className="why-dots">
              {whyImages.map((_, i) => (
                <span
                  key={i}
                  className={`dot ${i === activeSlide ? "active" : ""}`}
                  onClick={() => handleDotClick(i)}
                ></span>
              ))}
            </div>

            <button className="nav-arrow right" onClick={nextSlide}>
              <img src="/right-arrow.png" alt="Right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
