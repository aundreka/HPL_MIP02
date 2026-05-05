import { useCallback, useEffect, useRef, useState } from "react";
import "./endscene1.css";
import { useSound } from "../hooks/useSound";
import clickSfx from "../assets/sfx/click.wav";
import popSfx from "../assets/sfx/pop.mp3";

import portraitLogo from "../assets/images/portrait/logo.png";
import portraitTitle from "../assets/images/portrait/title.png";
import portraitCta from "../assets/images/portrait/cta.png";
import portraitBg from "../assets/images/portrait/bg.png";
import portraitImage1 from "../assets/images/portrait/IMAGE_1.png";
import portraitImage2 from "../assets/images/portrait/IMAGE_2.png";
import portraitImage3 from "../assets/images/portrait/IMAGE_3.png";
import portraitImage4 from "../assets/images/portrait/IMAGE_4.png";
import portraitImage5 from "../assets/images/portrait/IMAGE_5.png";
import portraitImage6 from "../assets/images/portrait/IMAGE_6.png";

import landscapeLogo from "../assets/images/landscape/logo.png";
import landscapeTitle from "../assets/images/landscape/title.png";
import landscapeCta from "../assets/images/landscape/cta.png";
import landscapeBg from "../assets/images/landscape/bg.png";
import landscapeImage1 from "../assets/images/landscape/IMAGE_1.png";
import landscapeImage2 from "../assets/images/landscape/IMAGE_2.png";
import landscapeImage3 from "../assets/images/landscape/IMAGE_3.png";
import landscapeImage4 from "../assets/images/landscape/IMAGE_4.png";
import landscapeImage5 from "../assets/images/landscape/IMAGE_5.png";
import landscapeImage6 from "../assets/images/landscape/IMAGE_6.png";

const PORTRAIT_IMAGES = [
  portraitImage1,
  portraitImage2,
  portraitImage3,
  portraitImage4,
  portraitImage5,
  portraitImage6,
];

const LANDSCAPE_IMAGES = [
  landscapeImage1,
  landscapeImage2,
  landscapeImage3,
  landscapeImage4,
  landscapeImage5,
  landscapeImage6,
];

const INTERVAL = 2000;
const BOUNCE_OUT_DURATION = 420;
const BLANK_PAGE_URL = "about:blank";
const LANDSCAPE_BREAKPOINT = 768;

function getIsLandscapeLayout() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth >= LANDSCAPE_BREAKPOINT;
}

export default function Endscene1({ clickUrl = BLANK_PAGE_URL }) {
  const [current, setCurrent] = useState(0);
  const [bouncing, setBouncing] = useState(false);
  const [isLandscape, setIsLandscape] = useState(getIsLandscapeLayout);
  const playClick = useSound(clickSfx, 0.45);
  const playPop = useSound(popSfx, 0.45);
  const hasMountedRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(getIsLandscapeLayout());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setBouncing(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % PORTRAIT_IMAGES.length);
        setBouncing(false);
        timeoutRef.current = null;
      }, BOUNCE_OUT_DURATION);
    }, INTERVAL);

    return () => {
      clearInterval(timer);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    playPop();
  }, [current, playPop]);

  const assets = isLandscape
    ? {
        bg: landscapeBg,
        logo: landscapeLogo,
        title: landscapeTitle,
        cta: landscapeCta,
        images: LANDSCAPE_IMAGES,
      }
    : {
        bg: portraitBg,
        logo: portraitLogo,
        title: portraitTitle,
        cta: portraitCta,
        images: PORTRAIT_IMAGES,
      };

  const imageWrapClassName = [
    "mip-endscene__image-wrap",
    bouncing ? "bounce-out" : "bounce-in",
  ].join(" ");

  const handleOpenShop = useCallback(() => {
    playClick();

    const mraid = window.mraid || {};
    if (mraid.open && typeof mraid.open === "function") {
      mraid.open(clickUrl || BLANK_PAGE_URL);
      return;
    }

    window.open(clickUrl || BLANK_PAGE_URL, "_blank", "noopener,noreferrer");
  }, [clickUrl, playClick]);

  return (
    <div
      className={`mip-endscene mip-endscene--${isLandscape ? "landscape" : "portrait"}`}
      style={{ backgroundImage: `url(${assets.bg})` }}
    >
      {isLandscape ? (
        <>
          <div className="mip-endscene__media-panel">
            <div className={imageWrapClassName}>
              <img
                src={assets.images[current]}
                alt={`Slide ${current + 1}`}
                className="mip-endscene__slide-image"
              />
            </div>

           
          </div>

          <div className="mip-endscene__content-panel mip-endscene__content-panel--landscape">
            <img src={assets.logo} alt="Flutterhabit" className="mip-endscene__logo" />
            <img
              src={assets.title}
              alt="The Glow-Getter Brunette"
              className="mip-endscene__title"
            />
            <img
              src={assets.cta}
              alt="Shop Now"
              className="mip-endscene__cta"
              onClick={handleOpenShop}
            />
          </div>
        </>
      ) : (
        <div className="mip-endscene__content-panel mip-endscene__content-panel--portrait">
          <img src={assets.logo} alt="Flutterhabit" className="mip-endscene__logo" />
          <img
            src={assets.title}
            alt="The Glow-Getter Brunette"
            className="mip-endscene__title"
          />

          <div className="mip-endscene__stage">
            <div className={imageWrapClassName}>
              <img
                src={assets.images[current]}
                alt={`Product ${current + 1}`}
                className="mip-endscene__slide-image"
              />
            </div>
          </div>

          <img
            src={assets.cta}
            alt="Shop Now"
            className="mip-endscene__cta"
            onClick={handleOpenShop}
          />
        </div>
      )}
    </div>
  );
}
