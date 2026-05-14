const PALETTE = [
  "#005077ff",
  "#486bb8ff",
  "#8868c5ff",
  "#db6ad1ff",
  "#ff268fff",
  "#ff1333ff",
  "#79002cff",
  "#ff530fff",
  "#ffbb0eff",
  "#ff7700ff",
  "#e8e000ff",
  "#7fda18ff",
  "#00d262ff",
  "#00bf93ff",
  "#00d5ffff",
  "#0cb7c1ff",
  "#00546e",
  "#ffffff",
];

const genreColorMap = {}
let nextIndex = 0

export function getGenreColor(genre) {
  if (!genreColorMap[genre]) {
    genreColorMap[genre] = PALETTE[nextIndex % PALETTE.length]
    nextIndex++
  }
  return genreColorMap[genre]
}

export function buildGenreColorMap(genres) {
  genres.forEach((g) => getGenreColor(g))
}
