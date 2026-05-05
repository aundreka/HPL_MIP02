const SILENT_WAV_DATA_URI =
  "data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAAAAAAAAAA";

let isAudioUnlocked = false;
let unlockInFlight = null;

async function unlockAudioPlayback() {
  if (isAudioUnlocked) {
    return true;
  }

  if (unlockInFlight) {
    return unlockInFlight;
  }

  const audio = new Audio(SILENT_WAV_DATA_URI);
  audio.preload = "auto";
  audio.muted = true;
  audio.playsInline = true;

  unlockInFlight = audio
    .play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      isAudioUnlocked = true;
      unlockInFlight = null;
      return true;
    })
    .catch(() => {
      unlockInFlight = null;
      return false;
    });

  return unlockInFlight;
}

export function primeAudioPlayback() {
  if (typeof window === "undefined" || isAudioUnlocked) {
    return () => {};
  }

  const handleUnlock = () => {
    void unlockAudioPlayback().then((didUnlock) => {
      if (didUnlock) {
        removeListeners();
      }
    });
  };

  const removeListeners = () => {
    window.removeEventListener("pointerdown", handleUnlock, true);
    window.removeEventListener("touchstart", handleUnlock, true);
    window.removeEventListener("keydown", handleUnlock, true);
  };

  window.addEventListener("pointerdown", handleUnlock, true);
  window.addEventListener("touchstart", handleUnlock, true);
  window.addEventListener("keydown", handleUnlock, true);

  return removeListeners;
}

export async function ensureAudioUnlocked() {
  if (typeof window === "undefined") {
    return false;
  }

  return unlockAudioPlayback();
}
