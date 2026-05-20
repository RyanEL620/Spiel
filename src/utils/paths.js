// Central utility for all file path formatting
// Change naming conventions here and it updates everywhere

export function toAudioPath(label) {
  return `words/${label.toLowerCase().replace(/\s+/g, '_')}.mp3`
}

export function toImagePath(label) {
  return `images/${label.toLowerCase().replace(/\s+/g, '_')}.png`
}