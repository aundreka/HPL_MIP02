import {
  hasAudioPlaybackUnlocked,
  setAudioPlaybackUnlocked,
} from "./audioUnlock";

export function isAudioUnlocked() {
  return hasAudioPlaybackUnlocked();
}

export function markAudioUnlocked() {
  setAudioPlaybackUnlocked(true);
}
