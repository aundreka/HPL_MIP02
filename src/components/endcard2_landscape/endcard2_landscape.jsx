import { useState, useEffect } from "react";
import "./endcard2_landscape.css";

import logo from "../../assets/images/landscape/logo.png";
import title from "../../assets/images/landscape/title.png";
import cta from "../../assets/images/landscape/cta.png";
import bg from "../../assets/images/landscape/bg.png";

import image1 from "../../assets/images/landscape/IMAGE_1.png";
import image2 from "../../assets/images/landscape/IMAGE_2.png";
import image3 from "../../assets/images/landscape/IMAGE_3.png";
import image4 from "../../assets/images/landscape/IMAGE_4.png";
import image5 from "../../assets/images/landscape/IMAGE_5.png";
import image6 from "../../assets/images/landscape/IMAGE_6.png";

const IMAGES = [image1, image2, image3, image4, image5, image6];
const INTERVAL = 2000;

export default function Endcard2Landscape() {
  const [current, setCurrent] = useState(0);
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setBouncing(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % IMAGES.length);
        setBouncing(false);
      }, 350);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ec2l-page" style={{ backgroundImage: `url(${bg})` }}>
      {/* LEFT — bouncing image */}
      <div className="ec2l-left">
        <div className={`ec2l-image-wrap ${bouncing ? "bounce-out" : "bounce-in"}`}>
          <img
            src={IMAGES[current]}
            alt={`Slide ${current + 1}`}
            className="ec2l-image"
          />
        </div>

        <div className="ec2l-dots">
          {IMAGES.map((_, i) => (
            <button
              key={i}
              className={`ec2l-dot ${i === current ? "ec2l-dot-active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>

      {/* RIGHT — branding */}
      <div className="ec2l-right">
        <img src={logo} alt="Flutterhabit" className="ec2l-logo" />
        <img src={title} alt="The Glow-Getter Brunette" className="ec2l-title" />
        <img
          src={cta}
          alt="Shop Now"
          className="ec2l-cta"
          onClick={() => window.open("https://flutterhabit.com", "_blank")}
        />
      </div>
    </div>
  );
}
