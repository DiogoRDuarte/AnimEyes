import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import Eye from './components/Eye'
import Table from './components/Table'
import { fetchTopAnime } from './data/fetchAnime'
import { buildGenreColorMap } from './data/genreColor'
import { YEAR_TAGS } from './constants'
import { arabicToKanji } from './helpers'
import Legend from './components/Legend'
import './styles/App.css'

const AnimeCard = React.memo(function AnimeCard({ anime, index, onHover }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  const handleEnter = useCallback(() => {
    setIsHovered(true)
    onHover(anime)
    timerRef.current = setTimeout(() => setShowTable(true), 300)
  }, [anime, onHover])

  const handleLeave = useCallback(() => {
    clearTimeout(timerRef.current)
    setIsHovered(false)
    setShowTable(false)
    onHover(null)
  }, [onHover])

  return (
    <div
      className={`card${isHovered ? ' is-hovered' : ''}`}
      tabIndex={0}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      <div className="card__header">
        <p className="card__title">{anime.title}</p>
      </div>
      <p className="card__rank-bg">{arabicToKanji(index + 1)}</p>
      <p className="card__rank">{arabicToKanji(index + 1)}</p>
      <div className="card__eyes">
        <div className="card__eye--left">
          <Eye anime={anime} side={"left"} />
        </div>
        <div className="card__eye--right">
          <Eye anime={anime} side={"right"} />
        </div>
      </div>
      <div className={`card__detail${showTable ? ' is-visible' : ''}`}>
        <div className="card__detail-body">
          <Table anime={anime} />
          <div className="card__detail-actions">
            <button className="tag">TODO</button>
            <a
              className="tag card__detail-link"
              href={`https://anilist.co/anime/${anime.uid}`}
              target="_blank"
              rel="noreferrer"
            >
              AniList <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </div>
        <img className="card__detail-img" src={anime.img_url} alt={anime.title} />
      </div>
      <div
        className="card__bg"
        style={{ backgroundImage: `url(${anime.img_url})` }}
      />
    </div>
  );
})

export default function App() {
  const [data, setData] = useState([])
  const [activeTag, setActiveTag] = useState(null)
  const [hoveredAnime, setHoveredAnime] = useState(null)

  const handleCardHover = useCallback((anime) => {
    setHoveredAnime(anime)
  }, [])

  useEffect(() => {
    fetchTopAnime(activeTag)
      .then(setData)
      .catch(console.error)
  }, [activeTag])

  const activeGenres = useMemo(() => {
    const set = new Set()
    data.forEach((a) => a.genre.split(', ').forEach((g) => set.add(g)))
    return [...set].toSorted()
  }, [data])

  useEffect(() => {
    buildGenreColorMap(activeGenres)
  }, [activeGenres])

  return (
    <main>
      <div className="bg-fixed" />
      <div className="layout">
        <Legend activeGenres={activeGenres} hoveredAnime={hoveredAnime} />
        <div className="viz">
          <div className="viz__sticky-bg"></div>
          <svg
            className="header"
            role="heading"
            aria-level="1"
            aria-label="Animeyes"
            viewBox="0 0 700 80"
            overflow="visible"
          >
            <text
              x="350"
              y="40"
              dominantBaseline="middle"
              textAnchor="middle"
              stroke="#031121"
              strokeWidth="20"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="#c5d1eb"
              paintOrder="stroke fill"
            >
              ✦ Animeyes ✦
            </text>
          </svg>
          <p className="intro">
            <span className="intro__header">
              What do the eyes from your favorite anime look like?
            </span>
            <br />
            Each pair of eyes below represents one of the top 100 highest-rated anime by
            community score on{" "}
            <a href="https://anilist.co/" target="_blank" rel="noreferrer">
              AniList
            </a>
            . <br></br>The iris colors reflect genres, the pupil size shows
            episode count, and the eye shape changes with the season it aired.
          </p>
          <div className="filters">
            <div className="filters__list">
              {YEAR_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  className={`tag ${activeTag === tag.value ? "tag--active" : ""}`}
                  onClick={() => setActiveTag(tag.value)}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
          <div className="card-grid">
            {data.map((anime, index) => (
              <AnimeCard
                key={anime.uid}
                anime={anime}
                index={index}
                onHover={handleCardHover}
              />
            ))}
          </div>
          <button
            className="nav-btn nav-btn--up"
            aria-label="Scroll to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
          <button
            className="nav-btn nav-btn--down"
            aria-label="Scroll to bottom"
            onClick={() =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
          >
            <i className="fa-solid fa-arrow-down"></i>
          </button>
        </div>
      </div>
      <footer>
        <div className="footer">
          <p>the end?</p>
        </div>
      </footer>
    </main>
  );
}
