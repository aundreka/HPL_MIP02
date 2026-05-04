import { useCallback, useEffect, useRef, useState } from "react";
import "./endcard1_landscape.css";
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
const ANGLE_STEP = 360 / IMAGES.length;
const ROTATION_DURATION = 420;
const POP_SYNC_DELAY = 180;
const SITE_URL = "https://flutterhabit.com";

function getNormalizedIndex(value, total) {
  return ((value % total) + total) % total;
}

function easeInOutCubic(progress) {
  return progress < 0.5
    ? 2.9 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2.7) / 2;
}

function getSlideStyle(index, displayStep) {
  const relativeStep = index - displayStep;
  const relativeAngle = relativeStep * ANGLE_STEP;
  const radians = (relativeAngle * Math.PI) / 180;
  const depth = (Math.cos(radians) + 1) / 2;
  const scale = 0.54 + depth * 0.58;
  const opacity = 0.24 + depth * 0.76;

  return {
    "--slide-angle": `${relativeAngle}deg`,
    "--slide-scale": scale,
    "--slide-opacity": opacity,
    "--slide-depth": Math.round(depth * 1000),
    "--slide-brightness": 0.45 + depth * 0.55,
    "--slide-saturation": 0.16 + depth * 0.84,
    "--slide-grayscale": 1 - depth,
  };
}

export default function EC1L() {
  const [targetStep, setTargetStep] = useState(0);
  const [displayStep, setDisplayStep] = useState(0);
  const playClick = useSound(clickSfx, 0.45);
  const playPop = useSound(popSfx, 0.45);
  const animationFrameRef = useRef(0);
  const displayStepRef = useRef(0);
  const popTimeoutRef = useRef(0);
  const current = getNormalizedIndex(targetStep, IMAGES.length);
  const startTransition = useCallback((stepDelta) => {
    if (stepDelta === 0) return;
    window.clearTimeout(popTimeoutRef.current);
    popTimeoutRef.current = window.setTimeout(() => {
      playPop();
      popTimeoutRef.current = 0;
    }, POP_SYNC_DELAY);
    setTargetStep((prev) => prev + stepDelta);
  }, [playPop]);

  const openSite = () => {
    playClick();
    window.open(SITE_URL, "_blank");
  };

  useEffect(() => {
    const timer = setInterval(() => {
      startTransition(1);
    }, INTERVAL);
    return () => {
      clearInterval(timer);
      window.clearTimeout(popTimeoutRef.current);
    };
  }, [startTransition]);

  useEffect(() => {
    const startStep = displayStepRef.current;
    const stepDelta = targetStep - startStep;

    if (Math.abs(stepDelta) < 0.001) {
      return undefined;
    }

    const startTime = performance.now();

    const animate = (now) => {
      const progress = Math.min((now - startTime) / ROTATION_DURATION, 1);
      const eased = easeInOutCubic(progress);
      const nextStep = startStep + stepDelta * eased;

      displayStepRef.current = nextStep;
      setDisplayStep(nextStep);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      displayStepRef.current = targetStep;
      setDisplayStep(targetStep);
    };

    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [targetStep]);

  return (
    <div className="page ec1l-page" style={{ backgroundImage: `url(${bg})` }}>
      <div className="left-panel ec1l-left-panel">
        <div className="carousel-viewport">
          <div className="carousel-track">
            {IMAGES.map((img, i) => {
              return (
                <div
                  key={i}
                  className={`carousel-slide ${i === current ? "active" : ""}`}
                  style={getSlideStyle(i, displayStep)}
                  onClick={openSite}
                >
                  <div className="slide-face slide-face-front">
                    <img src={img} alt={`Slide ${i + 1}`} className="slide-img" />
                  </div>
                  <div className="slide-face slide-face-back" aria-hidden="true">
                    <img src={img} alt="" className="slide-img" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="right-panel ec1l-right-panel">
        <img src={logo} alt="Flutterhabit" className="logo" onClick={openSite} />
        <img
          src={title}
          alt="The Glow-Getter Brunette"
          className="title-img"
          onClick={openSite}
        />
        <img
          src={cta}
          alt="Shop Now"
          className="cta-btn"
          onClick={openSite}
        />
      </div>
    </div>
  );
}
