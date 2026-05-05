import { useCallback, useEffect, useRef, useState } from "react";
import "./endscene1.css";
import clickSfx from "../assets/sfx/click.wav";
import popSfx from "../assets/sfx/pop.mp3";
import { isAudioUnlocked, markAudioUnlocked } from "../lib/audioState";

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
const POP_VOLUME = 0.75;

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
  const clickAudioRef = useRef(null);
  const popAudioRef = useRef(null);
  const timeoutRef = useRef(null);
  const popCountRef = useRef(0);
  const preloadedImagesRef = useRef([]);

  const playClick = useCallback((markUnlockedOnSuccess = false) => {
    const audioElement = clickAudioRef.current;
    if (!audioElement) {
      return;
    }

    audioElement.muted = false;
    audioElement.defaultMuted = false;
    audioElement.playsInline = true;
    audioElement.volume = 0.45;
    audioElement.currentTime = 0;

    const playAttempt = audioElement.play();
    if (markUnlockedOnSuccess) {
      playAttempt
        ?.then(() => {
          markAudioUnlocked();
        })
        .catch(() => {});
    }
  }, []);

  const playPop = useCallback(() => {
    if (!isAudioUnlocked()) {
      return;
    }

    const audioElement = popAudioRef.current;
    if (!audioElement) {
      return;
    }

    audioElement.muted = false;
    audioElement.defaultMuted = false;
    audioElement.playsInline = true;
    audioElement.volume = POP_VOLUME;
    audioElement.currentTime = 0;
    audioElement.play().catch(() => {});
  }, []);

  const handleClickAction = useCallback(() => {
    playClick(true);

    const mraid = window.mraid || {};
    if (mraid.open && typeof mraid.open === "function") {
      if (clickUrl) mraid.open(clickUrl);
      else mraid.open();
      return;
    }

    if (clickUrl) window.open(clickUrl, "_blank", "noopener,noreferrer");
    else window.open();
  }, [clickUrl, playClick]);

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
      if (popCountRef.current === 1) {
        playPop();
        popCountRef.current = 2;
      }

      setBouncing(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      timeoutRef.current = setTimeout(() => {
        setCurrent((prevCurrent) => {
          return (prevCurrent + 1) % PORTRAIT_IMAGES.length;
        });
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
    const imageSources = [
      portraitBg,
      portraitLogo,
      portraitTitle,
      portraitCta,
      landscapeBg,
      landscapeLogo,
      landscapeTitle,
      landscapeCta,
      ...PORTRAIT_IMAGES,
      ...LANDSCAPE_IMAGES,
    ];

    preloadedImagesRef.current = imageSources.map((src) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
      image.decode?.().catch(() => {});
      return image;
    });
  }, [playPop]);

  useEffect(() => {
    if (popCountRef.current > 0) {
      return;
    }

    playPop();
    popCountRef.current = 1;
  }, [playPop]);

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


  return (
    <div
      className={`mip-endscene mip-endscene--${isLandscape ? "landscape" : "portrait"}`}
      style={{ backgroundImage: `url(${assets.bg})` }}
      onClick={handleClickAction}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClickAction();
        }
      }}
    >
      <audio
        ref={clickAudioRef}
        src={clickSfx}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{ display: "none" }}
      />
      <audio
        ref={popAudioRef}
        src={popSfx}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{ display: "none" }}
      />
      {isLandscape ? (
        <>
          <div className="mip-endscene__media-panel">
            <div className={imageWrapClassName}>
              <img
                src={assets.images[current]}
                alt={`Slide ${current + 1}`}
                className="mip-endscene__slide-image"
                decoding="async"
                fetchPriority="high"
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
                  decoding="async"
                  fetchPriority="high"
                />
            </div>
          </div>

          <img
            src={assets.cta}
            alt="Shop Now"
            className="mip-endscene__cta"
          />
        </div>
      )}
    </div>
  );
}
