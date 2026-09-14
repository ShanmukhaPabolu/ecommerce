import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

export default function HeroCarousel({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Highlighted Offers"
    >
      <div
        className="hero-carousel-inner"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-carousel-slide ${slide.splitLayout ? "split-layout" : ""}`}
            aria-hidden={currentIndex !== index}
          >
            {slide.splitLayout ? (
              <div className="hero-split container">
                <div className="hero-split-text">
                  {slide.eyebrow && <span className="hero-carousel-eyebrow">{slide.eyebrow}</span>}
                  <h2 className="hero-carousel-title" style={{ color: 'var(--ink)' }}>{slide.headline}</h2>
                  {slide.subtext && <p className="hero-carousel-desc" style={{ color: 'var(--olive)' }}>{slide.subtext}</p>}
                  <div className="hero-ctas">
                    {slide.ctaText && slide.ctaLink && (
                      <Link to={slide.ctaLink} className="btn btn-primary hero-carousel-btn" tabIndex={currentIndex === index ? 0 : -1}>
                        {slide.ctaText}
                      </Link>
                    )}
                    {slide.ctaText2 && slide.ctaLink2 && (
                      <Link to={slide.ctaLink2} className="btn btn-outline" style={{ borderColor: 'var(--ink)' }} tabIndex={currentIndex === index ? 0 : -1}>
                        {slide.ctaText2}
                      </Link>
                    )}
                  </div>
                  {slide.trustLine && <div className="hero-trust-line"><span>★</span> {slide.trustLine}</div>}
                </div>
                <div className="hero-split-image">
                  <img src={slide.image} alt="" loading={index === 0 ? "eager" : "lazy"} />
                </div>
              </div>
            ) : (
              <>
                <img src={slide.image} alt="" className="hero-carousel-bg" loading={index === 0 ? "eager" : "lazy"} />
                <div className="hero-carousel-overlay">
                  <div className="hero-carousel-content container">
                    {slide.eyebrow && <span className="hero-carousel-eyebrow">{slide.eyebrow}</span>}
                    <h2 className="hero-carousel-title">{slide.headline}</h2>
                    {slide.subtext && <p className="hero-carousel-desc">{slide.subtext}</p>}
                    <div className="hero-ctas">
                      {slide.ctaText && slide.ctaLink && (
                        <Link to={slide.ctaLink} className="btn btn-primary hero-carousel-btn" tabIndex={currentIndex === index ? 0 : -1}>
                          {slide.ctaText}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <button
        className="hero-carousel-arrow hero-carousel-prev"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        className="hero-carousel-arrow hero-carousel-next"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="hero-carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`hero-carousel-dot ${currentIndex === index ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentIndex === index ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  );
}
