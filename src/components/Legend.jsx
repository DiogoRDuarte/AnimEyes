import React, { useMemo, useState } from 'react'
import { getGenreColor } from '../data/genreColor'
import eyeContour from '../data/contours'
import eyeSclera from '../data/sclera'
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
  { label: "0 → 24", size: "xs", min: 0 },
  { label: "25 → 49", size: "sm", min: 25 },
  { label: "50 → 74", size: "md", min: 50 },
  { label: "75 → 99", size: "md-lg", min: 75 },
  { label: "100+", size: "lg", min: 100 },
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
const scleraBySeason = eyeSclera[0]

function ContourThumb({ season, className = '' }) {
  const scleraRef = React.useRef(null)
  const contourRef = React.useRef(null)

  React.useEffect(() => {
    if (scleraRef.current) {
      scleraRef.current.innerHTML = scleraBySeason[season] || ''
      const svg = scleraRef.current.querySelector('svg')
      if (svg) {
        svg.setAttribute('width', '50')
        svg.setAttribute('height', '35')
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
      }
    }
    if (contourRef.current) {
      contourRef.current.innerHTML = eyeContour[0][season] || ''
      const svg = contourRef.current.querySelector('svg')
      if (svg) {
        svg.setAttribute('width', '50')
        svg.setAttribute('height', '35')
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
      }
    }
  }, [season])

  return (
    <span className={`legend-thumb ${className}`}>
      <span ref={scleraRef} className={`legend-thumb__sclera legend-thumb__sclera--${season.toLowerCase()}`} />
      <span ref={contourRef} className="legend-thumb__contour" />
    </span>
  )
}

export default function Legend({ activeGenres, hoveredAnime }) {
  const [collapsed, setCollapsed] = useState(false)

  const genres = useMemo(
    () => activeGenres.map((g) => [g, getGenreColor(g)]),
    [activeGenres]
  )

  const hoveredGenre = hoveredAnime ? hoveredAnime.genre : null
  const hoveredSet = useMemo(
    () => (hoveredGenre ? new Set(hoveredGenre.split(', ')) : null),
    [hoveredGenre]
  )

  const hoveredEpBucket = hoveredAnime ? getEpisodeBucket(hoveredAnime.episodes) : null
  const hoveredIsR = hoveredAnime ? rRatingKeys.includes(hoveredAnime.rating) : false
  const hoveredIsOngoing = hoveredAnime ? hoveredAnime.status === 'RELEASING' : false
  const hoveredSeason = hoveredAnime ? hoveredAnime.premiered.split(' ')[0] : null

  const dimClass = (active) =>
    hoveredAnime ? (active ? 'is-highlighted' : 'is-dimmed') : ''

  return (
    <aside className={`legend${collapsed ? ' legend--collapsed' : ''}`} aria-label="Legend">
      <button
        type="button"
        className="legend__toggle"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        aria-controls="legend-content"
        aria-label={collapsed ? 'Expand legend' : 'Collapse legend'}
      >
        <i className={`fa-solid ${collapsed ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden="true" />
      </button>
      <div className="legend__content" id="legend-content">
        <div className="legend__section">
        <h4 className="legend__subtitle">Iris Color (Genre):</h4>
        <div className="legend__genre-grid">
          {genres.map(([name, color]) => (
            <span
              key={name}
              className={`legend__badge ${dimClass(hoveredSet && hoveredSet.has(name))}`}
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

      <div className="legend__section">
        <h4 className="legend__subtitle">Pupil Size (Episodes):</h4>
        <div className="legend__list">
          {pupilSizes.map((p) => (
            <div
              key={p.label}
              className={`legend__item ${dimClass(hoveredEpBucket === p.label)}`}
            >
              <span className={`legend__dot legend__dot--${p.size}`} />
              <span className="legend__label">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="legend__section">
        <h4 className="legend__subtitle">Details:</h4>
        <div className="legend__list">
          <div className={`legend__item ${dimClass(hoveredIsR)}`}>
            <img
              className="legend__icon legend__icon--lg"
              src={kawaiiLinesSvg}
              alt=""
            />
            <span className="legend__label">R / R+</span>
          </div>
          <div className={`legend__item ${dimClass(hoveredIsOngoing)}`}>
            <img className="legend__icon legend__icon--sm" src={starSvg} alt="" />
            <span className="legend__label">Releasing</span>
          </div>
        </div>
      </div>

      <div className="legend__section">
        <h4 className="legend__subtitle">Eye Shape (Season):</h4>
        <div className="legend__contour-list">
          {contourSvgs.map(([season]) => (
            <div
              key={season}
              className={`legend__contour-item ${dimClass(hoveredSeason === season)}`}
            >
              <ContourThumb season={season} />
              <span className="legend__label">{season}</span>
            </div>
          ))}
        </div>
      </div>
      </div>
    </aside>
  );
}
