import React from 'react'
import { getGenreColor } from '../data/genreColor'
import eyeContour from '../data/contours'
import kawaiiLinesSvg from '../assets/KawaiiLines.svg'
import starSvg from '../assets/star.svg'
import './Legend.css'

function textColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000' : '#fff'
}

const pupilSizes = [
  { label: "0 → 24", size: "tiny", min: 0 },
  { label: "25 → 49", size: "small", min: 25 },
  { label: "50 → 74", size: "medium", min: 50 },
  { label: "75 → 99", size: "medium-large", min: 75 },
  { label: "100+", size: "large", min: 100 },
];

const rRatingKeys = ['R - 17+ (violence & profanity)', 'R+ - Mild Nudity']

function getEpisodeBucket(episodes) {
  if (episodes >= 100) return '100+';
  if (episodes >= 75) return '75 → 99';
  if (episodes >= 50) return '50 → 74';
  if (episodes >= 25) return '25 → 49';
  return '0 → 24';
}

const contourSvgs = Object.entries(eyeContour[0])

function ContourThumb({ html, className = '' }) {
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = html
      const svg = ref.current.querySelector('svg')
      if (svg) {
        svg.setAttribute('width', '50')
        svg.setAttribute('height', '35')
      }
    }
  }, [html])
  return <span ref={ref} className={className} />
}

export default function Legend({ activeGenres, hoveredAnime }) {
  const genres = activeGenres.map((g) => [g, getGenreColor(g)])
  const hoveredSet = hoveredAnime ? new Set(hoveredAnime.genre.split(', ')) : null
  const hoveredEpBucket = hoveredAnime ? getEpisodeBucket(hoveredAnime.episodes) : null
  const hoveredIsR = hoveredAnime ? rRatingKeys.includes(hoveredAnime.rating) : false
  const hoveredIsOngoing = hoveredAnime ? hoveredAnime.status === 'RELEASING' : false
  const hoveredSeason = hoveredAnime ? hoveredAnime.premiered.split(' ')[0] : null

  const dimClass = (active) =>
    hoveredAnime ? (active ? 'is-highlighted' : 'is-dimmed') : ''

  return (
    <aside className="legendContainer" aria-label="Legend">
      {/* <h3 className="legendTitle">Legend</h3> */}
      <div className="legendBottomSection">
        <h4 className="legendSubtitle">Iris Color (Genre):</h4>
        <div className="genreGrid">
          {genres.map(([name, color]) => (
            <span
              key={name}
              className={`genreBadge ${dimClass(hoveredSet && hoveredSet.has(name))}`}
              style={{
                background: color,
                color: textColor(color),
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="legendBottomSection">
        <h4 className="legendSubtitle">Pupil Size (Episodes):</h4>
        <div className="pupilList">
          {pupilSizes.map((p) => (
            <div
              key={p.label}
              className={`pupilItem ${dimClass(hoveredEpBucket === p.label)}`}
            >
              <span className={`pupilDot ${p.size}`} />
              <span className="genreLabel">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="legendBottomSection">
        <h4 className="legendSubtitle">Details:</h4>
        <div className="pupilList">
          <div className={`pupilItem ${dimClass(hoveredIsR)}`}>
            <img
              className="legendIcon legendIcon--lg"
              src={kawaiiLinesSvg}
              alt=""
            />
            <span className="genreLabel">R / R+</span>
          </div>
          <div className={`pupilItem ${dimClass(hoveredIsOngoing)}`}>
            <img className="legendIcon legendIcon--sm" src={starSvg} alt="" />
            <span className="genreLabel">Releasing</span>
          </div>
        </div>
      </div>

      <div className="legendBottomSection">
        <h4 className="legendSubtitle">Eye Shape (Season):</h4>
        <div className="contourList">
          {contourSvgs.map(([season, svg]) => (
            <div
              key={season}
              className={`contourItem ${dimClass(hoveredSeason === season)}`}
            >
              <ContourThumb html={svg} />
              <span className="genreLabel">{season}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
