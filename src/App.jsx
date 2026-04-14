import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import Eye from './components/Eye'
import Table from './components/Table'
import { fetchTopAnime } from './data/fetchAnime'
import { buildGenreColorMap } from './data/genreColor'
import { YEAR_TAGS } from './constants'
import { arabicToKanji } from './helpers'
import Legend from './components/Legend'
import './styles/App.css'

function AnimeCard({ anime, index, onHover }) {
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
      className="animeContainer"
      tabIndex={0}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      <div className="tableWrapper" style={{ opacity: showTable ? 1 : 0 }}>
        <Table anime={anime} />
        <img className="tableImage" src={anime.img_url} alt={anime.title} />
      </div>
      <div
        className="eyesContainer"
        style={{
          transform: isHovered ? 'rotateX(90deg)' : 'rotateX(0deg) translateZ(0)',
        }}
      >
        <div className="leftEyeContainer">
          <Eye anime={anime} />
        </div>
        <div className="rightEyeContainer">
          <Eye anime={anime} />
        </div>
      </div>
      <p className="kanji" style={{ opacity: isHovered ? 0 : 1 }}>
        {arabicToKanji(index + 1)}
      </p>
      <div className="name-container" style={{ opacity: isHovered ? 0 : 1 }}>
        <a
          href={`https://anilist.co/anime/${anime.uid}`}
          target="_blank"
          rel="noreferrer"
          className="no-underline"
        >
          <p className="animeName">{anime.title}</p>
        </a>
      </div>
      <div
        className="background"
        style={{ backgroundImage: `url(${anime.img_url})` }}
      />
    </div>
  )
}

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
      <div id="projectContainer">
        <h1 id="appTitle">✦ Animeyes ✦</h1>
        <div className="introductionContainer">
          <p className="introduction">
            <b>What do the eyes from your favorite anime look like?</b>
            <br />
            These are the current top 100 anime, fetched live from{' '}
            <a href="https://anilist.co/" target="_blank" rel="noreferrer">
              AniList
            </a>
            , represented as colorful eyes (✦ ‿ ✦)
            <br />
            You can hover each pair to learn more!
          </p>
        </div>
        <div className="tagsContainer">
          {YEAR_TAGS.map((tag) => (
            <button
              key={tag.label}
              className={`tag ${activeTag === tag.value ? 'tagActive' : ''}`}
              onClick={() => setActiveTag(tag.value)}
            >
              {tag.label}
            </button>
          ))}
        </div>
        {loading ? (
          <p className="introduction">Loading...</p>
        ) : (
          <div className="mainLayout">
            <div className="visualizationContainer">
              {data.map((anime, index) => (
                <AnimeCard key={anime.uid} anime={anime} index={index} onHover={handleCardHover} />
              ))}
            </div>
            <Legend activeGenres={activeGenres} hoveredAnime={hoveredAnime} />
          </div>
        )}
        <footer>
          <div className="footerDiv">
            <p>
              Data fetched live from the{' '}
              <a
                href="https://anilist.co/"
                target="_blank"
                rel="noreferrer"
              >
                AniList
              </a>{' '}
              API.
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
