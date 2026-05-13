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
      className={`animeContainer${isHovered ? ' is-hovered' : ''}`}
      tabIndex={0}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      <div className="name-container">
        <p className="animeName">{anime.title}</p>
      </div>
      <p className="kanjiBackground">{arabicToKanji(index + 1)}</p>
      <p className="kanji">
        {arabicToKanji(index + 1)}
      </p>
      <div className="eyesContainer">
        <div className="leftEyeContainer">
          <Eye anime={anime} side={"left"} />
        </div>
        <div className="rightEyeContainer">
          <Eye anime={anime} side={"right"} />
        </div>
      </div>
      <div className={`tableWrapper${showTable ? ' is-visible' : ''}`}>
        <div className="tableWrapperLeftSide">
          <Table anime={anime} />
          <div className="tableActions">
            <button className="tag">TODO</button>
            <a
              className="tag tableAnilistLink"
              href={`https://anilist.co/anime/${anime.uid}`}
              target="_blank"
              rel="noreferrer"
            >
              AniList <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </div>
        <img className="tableImage" src={anime.img_url} alt={anime.title} />
      </div>
      <div
        className="background"
        style={{ backgroundImage: `url(${anime.img_url})` }}
      />
    </div>
  );
})

export default function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTag, setActiveTag] = useState(null)
  const [hoveredAnime, setHoveredAnime] = useState(null)

  const handleCardHover = useCallback((anime) => {
    setHoveredAnime(anime)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchTopAnime(activeTag)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeTag])

  const activeGenres = useMemo(() => {
    const set = new Set()
    data.forEach((a) => a.genre.split(', ').forEach((g) => set.add(g)))
    const sorted = [...set].sort()
    buildGenreColorMap(sorted)
    return sorted
  }, [data])

  return (
    <main>
      <div className="animatedBackground" />
      <div id="projectContainer">
        <div className="mainLayout">
          <Legend activeGenres={activeGenres} hoveredAnime={hoveredAnime} />
          <div className="visualizationContainer">
            <div className="stickyBackground"></div>
            <svg
              id="appTitle"
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
            <p className="introduction">
              <b>What do the eyes from your favorite anime look like?</b>
              <br />
              These are the current top 100 anime, fetched live from{" "}
              <a href="https://anilist.co/" target="_blank" rel="noreferrer">
                AniList
              </a>
              , represented as colorful eyes (✦ ‿ ✦)
            </p>
            <div className="filtersContainer">
              <div className="tagsContainer">
                {YEAR_TAGS.map((tag) => (
                  <button
                    key={tag.label}
                    className={`tag ${activeTag === tag.value ? "tagActive" : ""}`}
                    onClick={() => setActiveTag(tag.value)}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="animeContainerGrid">
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
              className="rightFixedButton rightFixedButtonUp"
              aria-label="Scroll to top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
            <button
              className="rightFixedButton rightFixedButtonDown"
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
        {/* )} */}
        <footer>
          <div className="footerDiv">
            <p>the end?</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
