import { useEffect, useRef, useState } from "react";
import "./endcard2_portrait.css";
import { useSound } from "../../hooks/useSound";
import clickSfx from "../../assets/sfx/click.wav";
import popSfx from "../../assets/sfx/pop.mp3";
import logo from "../../assets/images/portrait/logo.png";
import title from "../../assets/images/portrait/title.png";
import cta from "../../assets/images/portrait/cta.png";
import bg from "../../assets/images/portrait/bg.png";

import image1 from "../../assets/images/portrait/IMAGE_1.png";
import image2 from "../../assets/images/portrait/IMAGE_2.png";
import image3 from "../../assets/images/portrait/IMAGE_3.png";
import image4 from "../../assets/images/portrait/IMAGE_4.png";
import image5 from "../../assets/images/portrait/IMAGE_5.png";
import image6 from "../../assets/images/portrait/IMAGE_6.png";

const IMAGES = [image1, image2, image3, image4, image5, image6];
const INTERVAL = 2000;
const BOUNCE_OUT_DURATION = 420;

export default function Endcard2Portrait() {
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
    <div className="page" style={{ backgroundImage: `url(${bg})` }}>
      <div className="content">

        {/* Logo */}
        <img src={logo} alt="Flutterhabit" className="logo" />

        {/* Title */}
        <img src={title} alt="The Glow-Getter Brunette" className="title-img" />

        {/* Bouncing image */}
        <div className="bounce-stage">
          <div className={`image-wrap ${bouncing ? "bounce-out" : "bounce-in"}`}>
            <img src={IMAGES[current]} alt={`Product ${current + 1}`} className="slide-img" />
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

        {/* CTA */}
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
