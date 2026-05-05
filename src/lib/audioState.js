let hasUnlockedAudio = false;

export function isAudioUnlocked() {
  return hasUnlockedAudio;
}

export function markAudioUnlocked() {
  hasUnlockedAudio = true;
}
