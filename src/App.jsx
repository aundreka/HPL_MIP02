import { useEffect, useRef, useState, useCallback } from "react";
import "./App.css";
import clickSfx from "./assets/sfx/click.wav";
import popSfx from "./assets/sfx/pop.mp3";
import { isAudioUnlocked, markAudioUnlocked } from "./lib/audioState";
import logoImg from "./assets/MIP/LOGO.png";
import titleImg from "./assets/MIP/title.png";
import subtitleImg from "./assets/MIP/subtitle.png";
import productImg from "./assets/MIP/PRODUCT.png";
import productSubtitleImg from "./assets/MIP/product_subtitle.PNG";
import applicationTitleImg from "./assets/MIP/application_title.png";
import shopNowImg from "./assets/MIP/shop-now.png";
import step1LabelImg from "./assets/MIP/STEP 1/STEP 1.png";
import step1TitleImg from "./assets/MIP/STEP 1/APPLY ADHESIVE.png";
import step1BodyImg from "./assets/MIP/STEP 1/Apply a small, rounded bead of adhesive to the top side of the lash cluster's bottom edge. Wait 20-30 seconds until tacky..png";
import step1SceneImg from "./assets/MIP/STEP 1/STEP 1_IMAGE.png";
import step2LabelImg from "./assets/MIP/STEP 2/STEP 2.png";
import step2TitleImg from "./assets/MIP/STEP 2/APPLY TO LASH LINE.png";
import step2BodyImg from "./assets/MIP/STEP 2/Using your applicator, apply your segments to the underside of your natural lashes, avoiding your waterline. Repeat for remaining segments..png";
import step2SceneImg from "./assets/MIP/STEP 2/STEP 2_IMAGE.png";
import step3LabelImg from "./assets/MIP/STEP 3/PRO TIP.png";
import step3TitleImg from "./assets/MIP/STEP 3/CLAMP TO SECURE.png";
import step3BodyImg from "./assets/MIP/STEP 3/Once all segments are applied, gently clamp your natural lashes and segments together using your applicator to fully secure your set and achieve a seamless blend..png";
import step3SceneImg from "./assets/MIP/STEP 3/STEP 3_IMAGE.png";
import MIP_Endscene from "./components/index.js";

const steps = [
  {
    id: "01",
    labelImage: step1LabelImg,
    titleImage: step1TitleImg,
    bodyImage: step1BodyImg,
    sceneImage: step1SceneImg,
    labelWidth: "108px",
    titleWidth: "280px",
    alt: "Step 1 apply adhesive",
  },
  {
    id: "02",
    labelImage: step2LabelImg,
    titleImage: step2TitleImg,
    bodyImage: step2BodyImg,
    sceneImage: step2SceneImg,
    labelWidth: "108px",
    titleWidth: "350px",
    alt: "Step 2 apply to lash line",
  },
  {
    id: "03",
    labelImage: step3LabelImg,
    titleImage: step3TitleImg,
    bodyImage: step3BodyImg,
    sceneImage: step3SceneImg,
    labelWidth: "120px",
    titleWidth: "320px",
    alt: "Pro tip clamp to secure",
  },
];

function Reveal({
  as: Tag = "section",
  className = "",
  delay = 0,
  onReveal,
  children,
  style,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onReveal?.();
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8%" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onReveal]);

  return (
    <Tag
      ref={nodeRef}
      className={`reveal ${isVisible ? "is-visible" : ""} ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ─── Scroll Hand Guide ───────────────────────────────────────────── */
function ScrollGuide() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) setHidden(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`scrollGuide${hidden ? " is-hidden" : ""}`} aria-hidden="true">
      <div className="scrollGuide__arrow" />
    </div>
  );
}

/* ─── App ─────────────────────────────────────────────────────────── */
function App() {
  const [showEndscene, setShowEndscene] = useState(false);
  const clickAudioRef = useRef(null);
  const popAudioRef = useRef(null);
  const endsceneTimeoutRef = useRef(null);

  const playMountedAudio = useCallback((audioElement, volume, markUnlockedOnSuccess = false) => {
    if (!audioElement) {
      return;
    }

    audioElement.muted = false;
    audioElement.defaultMuted = false;
    audioElement.playsInline = true;
    audioElement.volume = volume;
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

  const primeMountedAudio = useCallback((audioElement) => {
    if (!audioElement || isAudioUnlocked()) {
      return;
    }

    audioElement.muted = false;
    audioElement.defaultMuted = false;
    audioElement.playsInline = true;
    audioElement.volume = 0;
    audioElement.currentTime = 0;

    const playAttempt = audioElement.play();
    playAttempt
      ?.then(() => {
        markAudioUnlocked();
        window.setTimeout(() => {
          audioElement.pause();
          audioElement.currentTime = 0;
        }, 0);
      })
      .catch(() => {
        audioElement.muted = true;
        audioElement.defaultMuted = true;
      });
  }, []);

  useEffect(() => {
    const handleEarlyUnlock = () => {
      if (isAudioUnlocked()) {
        removeListeners();
        return;
      }

      primeMountedAudio(clickAudioRef.current);
    };

    const removeListeners = () => {
      window.removeEventListener("pointerdown", handleEarlyUnlock, true);
      window.removeEventListener("touchstart", handleEarlyUnlock, true);
      window.removeEventListener("keydown", handleEarlyUnlock, true);
    };

    window.addEventListener("pointerdown", handleEarlyUnlock, true);
    window.addEventListener("touchstart", handleEarlyUnlock, true);
    window.addEventListener("keydown", handleEarlyUnlock, true);

    return removeListeners;
  }, [primeMountedAudio]);

  const handleStepReveal = useCallback(() => {
    if (!isAudioUnlocked()) {
      return;
    }

    playMountedAudio(popAudioRef.current, 0.75);
  }, [playMountedAudio]);

  const handleShopNowClick = useCallback(() => {
    playMountedAudio(clickAudioRef.current, 0.45, true);
    window.scrollTo({ top: 0, behavior: "auto" });
    setShowEndscene(true);
  }, [playMountedAudio]);

  useEffect(() => {
    if (showEndscene) {
      return undefined;
    }

    const clearEndsceneTimeout = () => {
      if (endsceneTimeoutRef.current) {
        clearTimeout(endsceneTimeoutRef.current);
        endsceneTimeoutRef.current = null;
      }
    };

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageBottom = document.documentElement.scrollHeight;
      const isAtBottom = scrollPosition >= pageBottom - 4;

      if (isAtBottom) {
        if (!endsceneTimeoutRef.current) {
          endsceneTimeoutRef.current = window.setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "auto" });
            setShowEndscene(true);
            endsceneTimeoutRef.current = null;
          }, 2000);
        }
        return;
      }

      clearEndsceneTimeout();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearEndsceneTimeout();
    };
  }, [showEndscene]);

  if (showEndscene) {
    return <MIP_Endscene />;
  }

  return (
    <main className="pageShell">
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

      {/* ── Scroll hand guide (QA #7) ── */}
      <ScrollGuide />

      {/* ── Hero ── */}
      <header className="heroPanel">
        <Reveal as="div" className="heroLogoReveal" delay={0}>
          <img className="brandLogo" src={logoImg} alt="link" />
        </Reveal>
        <div className="heroHeadingGroup">
          <Reveal as="div" className="heroTitleReveal" delay={140}>
            <img className="heroTitleImage" src={titleImg} alt="The Glow-Getter Brunette" />
          </Reveal>
          <Reveal as="div" className="heroSubtitleReveal" delay={260}>
            <img className="heroSubtitleImage" src={subtitleImg} alt="Our Bold, Textured Lash" />
          </Reveal>
        </div>
      </header>

      {/* ── Product column ── */}
      <Reveal className="heroStory" delay={380}>
        <div className="productColumn">
          <div className="productShineFrame">
            <img
              className="productHeroImage"
              src={productImg}
              alt="The Glow-Getter Brunette lash packaging"
            />
          </div>
          <img
            className="productSubtitleImage"
            src={productSubtitleImg}
            alt="Product description"
          />
        </div>
      </Reveal>

      {/* ── Steps header ── */}
      <Reveal className="stepsHeader" delay={220}>
        <img
          className="applicationTitleImage"
          src={applicationTitleImg}
          alt="Application in 2 Easy Steps"
        />
      </Reveal>

      {/* ── Steps grid ── */}
      <div className="stepsGrid">
        {steps.map((step, index) => (
          <Reveal
            key={step.id}
            className="stepCard"
            delay={120 + index * 120}
            onReveal={handleStepReveal}   /* QA #9 – sound on each step reveal */
            style={{
              "--step-label-width": step.labelWidth,
              "--step-title-width": step.titleWidth,
              "--shimmer-delay": `${0.4 + index * 0.1}s`,
            }}
          >
            <div className="stepCopyImages">
              <img
                className="stepLabelImage"
                src={step.labelImage}
                alt=""
                aria-hidden="true"
              />
              <img
                className="stepTitleImage"
                src={step.titleImage}
                alt={step.alt}
              />
              <img
                className="stepBodyImage"
                src={step.bodyImage}
                alt=""
                aria-hidden="true"
              />
            </div>
            <div className="stepImageFrame">
              <img src={step.sceneImage} alt="" aria-hidden="true" />
            </div>
          </Reveal>
        ))}
      </div>

      <div className="shopNowWrap">
        <button
          type="button"
          className="shopNowImageButton"
          onClick={handleShopNowClick}
          aria-label="Shop Now"
        >
          <img src={shopNowImg} alt="" aria-hidden="true" />
        </button>
      </div>
    </main>
  );
}

export default App;
