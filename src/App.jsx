import { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/images/landscape/logo.png";
import title from "./assets/images/landscape/title.png";
import cta from "./assets/images/landscape/cta.png";
import bg from "./assets/images/landscape/bg.png";

import image1 from "./assets/images/landscape/IMAGE_1.png";
import image2 from "./assets/images/landscape/IMAGE_2.png";
import image3 from "./assets/images/landscape/IMAGE_3.png";
import image4 from "./assets/images/landscape/IMAGE_4.png";
import image5 from "./assets/images/landscape/IMAGE_5.png";
import image6 from "./assets/images/landscape/IMAGE_6.png";

const IMAGES = [image1, image2, image3, image4, image5, image6];
const INTERVAL = 2000;

export default function App() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page" style={{ backgroundImage: `url(${bg})` }}>
      {/* LEFT — carousel */}
      <div className="left-panel">
        <div className="carousel-viewport">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${current * 90}%)` }}
          >
            {IMAGES.map((img, i) => (
              <div
                key={i}
                className={`carousel-slide ${i === current ? "active" : ""}`}
                onClick={() => setCurrent(i)}
              >
                <img src={img} alt={`Slide ${i + 1}`} className="slide-img" />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="dots">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === current ? "dot-active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT — branding + cta */}
      <div className="right-panel">
        <img src={logo} alt="Flutterhabit" className="logo" />
        <img src={title} alt="The Glow-Getter Brunette" className="title-img" />
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
