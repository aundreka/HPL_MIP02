import { useState, useEffect, useRef } from "react";
import "./endcard2_landscape.css";
import { useSound } from "../../hooks/useSound";
import clickSfx from "../../assets/sfx/click.wav";
import popSfx from "../../assets/sfx/pop.mp3";

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
const BOUNCE_OUT_DURATION = 420;

export default function Endcard2Landscape() {
  const [current, setCurrent] = useState(0);
  const [bouncing, setBouncing] = useState(false);
  const playClick = useSound(clickSfx, 0.45);
  const playPop = useSound(popSfx, 0.45);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setBouncing(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % IMAGES.length);
        setBouncing(false);
      }, BOUNCE_OUT_DURATION);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    playPop();
  }, [current, playPop]);

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
      <div className="right-panel">
        <img src={logo} alt="Flutterhabit" className="logo" />
        <img src={title} alt="The Glow-Getter Brunette" className="title-img" />
        <img
          src={cta}
          alt="Shop Now"
          className="cta-btn"
          onClick={() => {
            playClick();
            window.open("https://flutterhabit.com", "_blank");
          }}
        />
      </div>
    </div>
  );
}
