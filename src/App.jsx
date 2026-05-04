import { useState, useEffect, useRef } from "react";
import "./App.css";
import logo from "./assets/images/portrait/logo.png";
import title from "./assets/images/portrait/title.png";
import cta from "./assets/images/portrait/cta.png";
import bg from "./assets/images/portrait/bg.png";

import image1 from "./assets/images/portrait/IMAGE_1.png";
import image2 from "./assets/images/portrait/IMAGE_2.png";
import image3 from "./assets/images/portrait/IMAGE_3.png";
import image4 from "./assets/images/portrait/IMAGE_4.png";
import image5 from "./assets/images/portrait/IMAGE_5.png";
import image6 from "./assets/images/portrait/IMAGE_6.png";

const IMAGES = [image1, image2, image3, image4, image5, image6];
const INTERVAL = 2000;

export default function App() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef(null);

  const goTo = (index) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  };

  useEffect(() => {
    timeoutRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length);
    }, INTERVAL);
    return () => clearInterval(timeoutRef.current);
  }, []);

  const next = (IMAGES.length + current + 1) % IMAGES.length;

  return (
    <div className="page" style={{ backgroundImage: `url(${bg})` }}>
      <div className="content">

        {/* Logo */}
        <img src={logo} alt="Flutterhabit" className="logo" />

        {/* Title */}
        <img src={title} alt="The Glow-Getter Brunette" className="title-img" />

        {/* Carousel */}
        <div className="carousel-viewport">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${current * 88}%)` }}
          >
            {IMAGES.map((img, i) => (
              <div
                key={i}
                className={`carousel-slide ${i === current ? "active" : ""}`}
                onClick={() => goTo(i)}
              >
                <img src={img} alt={`Product ${i + 1}`} className="slide-img" />
              </div>
            ))}
          </div>

          {/* Peek ghost of next card */}
          <div className="peek-shadow" />
        </div>

        {/* Dots */}
        <div className="dots">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === current ? "dot-active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        {/* CTA */}
        <img
          src={cta}
          alt="Shop Now"
          className="cta-btn"
          onClick={() => window.open("https://flutterhabit.com", "_blank")}
        />
      </div>
    </div>
  );
}
