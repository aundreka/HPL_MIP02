import { useCallback, useEffect, useRef } from "react";

export const useSound = (src, volume = 0.7) => {
  const templateRef = useRef(null);
  const activePlayersRef = useRef(new Set());

  useEffect(() => {
    const audio = new Audio(src);
    const activePlayers = activePlayersRef.current;
    audio.preload = "auto";
    audio.volume = volume;
    templateRef.current = audio;

    return () => {
      activePlayers.forEach((player) => {
        player.pause();
        player.src = "";
      });
      activePlayers.clear();
      audio.pause();
      audio.src = "";
      templateRef.current = null;
    };
  }, [src, volume]);

  const play = useCallback(() => {
    const template = templateRef.current;
    if (!template) return;

    const player = template.cloneNode();
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
  }, [volume]);

  return play;
};
