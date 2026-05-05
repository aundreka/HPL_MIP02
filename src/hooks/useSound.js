import { createElement, useCallback, useEffect, useMemo, useRef } from "react";
import { ensureAudioUnlocked } from "../lib/audioUnlock";

export const useSound = (src, volume = 0.7) => {
  const templateRef = useRef(null);
  const activePlayersRef = useRef(new Set());

  useEffect(() => {
    const activePlayers = activePlayersRef.current;

    return () => {
      activePlayers.forEach((player) => {
        player.pause();
        player.src = "";
      });
      activePlayers.clear();
      templateRef.current = null;
    };
  }, []);

  const play = useCallback(() => {
    const template = templateRef.current;
    if (!template) return;

    void ensureAudioUnlocked()
      .then((isUnlocked) => {
        if (!isUnlocked) {
          return;
        }

        const player = template.cloneNode();
        player.muted = false;
        player.defaultMuted = false;
        player.playsInline = true;
        player.preload = "auto";
        player.volume = volume;
        player.currentTime = 0;
        activePlayersRef.current.add(player);

        const cleanup = () => {
          player.pause();
          player.src = "";
          activePlayersRef.current.delete(player);
        };

        player.addEventListener("ended", cleanup, { once: true });
        player.play().catch(cleanup);
      })
      .catch(() => {});
  }, [volume]);

  const audioElement = useMemo(
    () =>
      createElement("audio", {
        ref: templateRef,
        src,
        autoPlay: true,
        muted: true,
        playsInline: true,
        preload: "auto",
        "aria-hidden": "true",
        style: { display: "none" },
      }),
    [src]
  );

  return { play, audioElement };
};
