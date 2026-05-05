import { useState, useRef, useCallback, useEffect } from "react";
import "./DragStart.css";
import dragSfx from "../assets/sfx/drag.mp3";
import dropSfx from "../assets/sfx/drop.mp3";
import { useSound } from "../hooks/useSound";

const LASHES = [
  { id: "glow-getter",  label: "Glow-Getter",  sub: "Brunette",  curve: "M0,12 Q20,0 40,12 Q60,0 80,12" },
  { id: "natural",      label: "Natural",       sub: "Wispy",     curve: "M0,14 Q20,4 40,14 Q60,4 80,14" },
  { id: "bold",         label: "Bold",          sub: "Dramatic",  curve: "M0,10 Q20,0 40,8 Q60,0 80,10" },
  { id: "flutter",      label: "Flutter",       sub: "Feathered", curve: "M0,13 Q15,2 40,10 Q65,2 80,13" },
];

function LashIcon({ curve, active }) {
  return (
    <svg className={`dragStart__lashIcon${active ? " is-active" : ""}`} viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* lash band */}
      <path d={curve} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.9"/>
      {/* lash strands */}
      {[8, 18, 28, 40, 52, 62, 72].map((x, i) => {
        const baseY = curve ? 12 : 12;
        const len = [10, 13, 15, 16, 15, 13, 10][i];
        const lean = [-3, -2, -1, 0, 1, 2, 3][i];
        return (
          <line
            key={x}
            x1={x} y1={baseY}
            x2={x + lean} y2={baseY - len}
            stroke="currentColor"
            strokeWidth={i === 3 ? "2" : "1.4"}
            strokeLinecap="round"
            opacity={0.7 + i * 0.04}
          />
        );
      })}
    </svg>
  );
}

export default function DragStart({ onStart }) {
  const [dragging, setDragging] = useState(null);
  const [over, setOver]         = useState(false);
  const [dropped, setDropped]   = useState(null);   // lash id that was dropped
  const [pos, setPos]           = useState({ x: 0, y: 0 });
  const dropRef                 = useRef(null);
  const rafRef                  = useRef(null);
  const { play: playDragSound, audioElement: dragAudioElement } = useSound(dragSfx, 0.55);
  const { play: playDropSound, audioElement: dropAudioElement } = useSound(dropSfx, 0.65);

  const onPointerMove = useCallback((e) => {
    if (!dragging) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setPos({ x: e.clientX, y: e.clientY });
      const zone = dropRef.current;
      if (!zone) return;
      const r = zone.getBoundingClientRect();
      setOver(
        e.clientX >= r.left && e.clientX <= r.right &&
        e.clientY >= r.top  && e.clientY <= r.bottom
      );
    });
  }, [dragging]);

  const onPointerUp = useCallback((e) => {
    if (!dragging) return;
    const zone = dropRef.current;
    if (zone) {
      const r = zone.getBoundingClientRect();
      const hit =
        e.clientX >= r.left && e.clientX <= r.right &&
        e.clientY >= r.top  && e.clientY <= r.bottom;
      if (hit) {
        playDropSound();
        setDropped(dragging);
        setOver(false);
        setDragging(null);
        setTimeout(() => onStart?.(), 900);
        return;
      }
    }
    setDragging(null);
    setOver(false);
  }, [dragging, onStart, playDropSound]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup",   onPointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup",   onPointerUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dragging, onPointerMove, onPointerUp]);

  const startDrag = (e, lash) => {
    e.preventDefault();
    playDragSound();
    setDragging(lash.id);
    setPos({ x: e.clientX, y: e.clientY });
  };

  const activeLash = LASHES.find(l => l.id === dragging);
  const droppedLash = LASHES.find(l => l.id === dropped);

  return (
    <div className={`dragStart${dropped ? " dragStart--dropped" : ""}`}>
      {dragAudioElement}
      {dropAudioElement}
      <div className="dragStart__grain" aria-hidden="true" />

      {/* ── drop zone ── */}
      <div
        ref={dropRef}
        className={`dragStart__dropZone${over ? " is-over" : ""}${dropped ? " is-dropped" : ""}`}
        aria-label="Drop lash style here"
      >
        <div className="dragStart__eyeWrap" aria-hidden="true">
          {dropped && droppedLash ? (
            <div className="dragStart__eyeSuccess">
              <LashIcon curve={droppedLash.curve} active />
              <svg className="dragStart__eyeSvg" viewBox="0 0 100 38" fill="none">
                <ellipse cx="50" cy="22" rx="44" ry="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                <ellipse cx="50" cy="22" rx="14" ry="14" fill="rgba(30,20,15,0.7)"/>
                <ellipse cx="50" cy="22" rx="8" ry="8" fill="rgba(15,10,8,0.9)"/>
                <ellipse cx="46" cy="19" rx="2.5" ry="2.5" fill="rgba(255,255,255,0.55)"/>
              </svg>
            </div>
          ) : (
            <>
              {/* idle eye outline */}
              <div className="dragStart__handWrap">
                <svg className="dragStart__handSvg" viewBox="0 0 80 100" fill="none">
                  <path d="M20 55 C18 45 17 35 19 28 C21 21 28 20 32 25 L32 15 C32 11 35 8 38 8 C41 8 44 11 44 15 L44 22 C44 18 47 16 50 17 C53 18 55 21 55 25 L55 28 C55 24 58 22 61 23 C64 24 65 28 65 32 L65 50 C65 62 58 75 48 80 L38 82 C28 82 20 74 20 65 Z" fill="rgba(210,165,140,0.88)" stroke="rgba(180,130,100,0.4)" strokeWidth="0.8"/>
                  <path d="M32 25 L32 15" stroke="rgba(180,130,100,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M44 22 L44 15" stroke="rgba(180,130,100,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M55 28 L55 25" stroke="rgba(180,130,100,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </>
          )}
        </div>

        <p className="dragStart__dropLabel">
          {dropped
            ? `✦ ${droppedLash?.label} lashes applied`
            : over
              ? "release to apply"
              : "drag and drop\na lash style"}
        </p>
      </div>

      <div className="dragStart__divider" aria-hidden="true" />

      {/* ── lash chips ── */}
      <div className="dragStart__palette">
        {LASHES.map((lash) => (
          <button
            key={lash.id}
            className={`dragStart__chip${dragging === lash.id ? " is-dragging" : ""}${dropped === lash.id ? " is-dropped" : ""}`}
            onPointerDown={(e) => startDrag(e, lash)}
            aria-label={`Drag ${lash.label} ${lash.sub} lashes`}
            disabled={!!dropped}
          >
            <LashIcon curve={lash.curve} />
            <span className="dragStart__chipText">
              <span className="dragStart__chipLabel">{lash.label}</span>
              <span className="dragStart__chipSub">{lash.sub}</span>
            </span>
          </button>
        ))}
      </div>

      {/* ── shop now ── */}
      <div className="dragStart__shopWrap">
        <button
          type="button"
          className="dragStart__shopBtn"
          onClick={() => {
            playDragSound();
            onStart?.();
          }}
          aria-label="Shop Now"
        >
          Shop Now
        </button>
      </div>

      {/* ── drag ghost ── */}
      {dragging && activeLash && (
        <div
          className="dragStart__ghost"
          style={{ left: pos.x, top: pos.y }}
          aria-hidden="true"
        >
          <LashIcon curve={activeLash.curve} active />
          <span className="dragStart__ghostLabel">{activeLash.label}</span>
        </div>
      )}
    </div>
  );
}
