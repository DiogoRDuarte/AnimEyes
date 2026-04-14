const oldoldpalette = [
  "#D19600", "#00ABCE", "#BBD100", "#B500A0", "#FF5263",
  "#FF9852", "#D1C200", "#B50043", "#D17D00", "#5AD500",
  "#B50600", "#D16200", "#72D7FF", "rgba(47, 0, 206, 1)", "#7FFF72",
  "#7894FF", "#00D52B", "#FFD46B", "#D1AD00",
  "#01001E", "#FF85A1", "#00CED1", "#9B59B6", "#E67E22",
  "#1ABC9C", "#E74C3C", "#3498DB", "#F39C12", "#8E44AD",
  "#2ECC71", "#C0392B", "#16A085", "#D35400", "#27AE60",
]

const oldpalette = [
  "#003d5c",
  "#31497e",
  "#674f95",
  "#a14e9a",
  "#d44c8d",
  "#f9596f",
  "#B50043",
  "#ff7a47",
  "#ffa600",
  "#FFD46B",
  "#b1aa00",
  "#65a31c",
  "#009446",
  "#008162",
  "#00ABCE",
  "#006b71",
  "#00546e",
  "#ffffff",
];

const palette = [
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
    genreColorMap[genre] = palette[nextIndex % palette.length]
    nextIndex++
  }
  return genreColorMap[genre]
}

export function buildGenreColorMap(genres) {
  genres.forEach((g) => getGenreColor(g))
}

export function getActiveGenreColors(genres) {
  return genres.map((g) => [g, getGenreColor(g)])
}
