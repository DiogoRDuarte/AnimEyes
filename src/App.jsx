import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import Eye from './components/Eye'
import Table from './components/Table'
import { fetchTopAnime } from './data/fetchAnime'
import { buildGenreColorMap } from './data/genreColor'
import { YEAR_TAGS } from './constants'
import { arabicToKanji } from './helpers'
import Legend from './components/Legend'
import { PulsingBorder } from '@paper-design/shaders-react'
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
      <div className="name-container" style={{ opacity: isHovered ? 0 : 1 }}>
        <p className="animeName">{anime.title}</p>
      </div>
      <div
        className="eyesContainer"
        style={{
          opacity: isHovered ? 0 : 1,
          transform: isHovered
            ? "rotateX(90deg)"
            : "rotateX(0deg) translateZ(0)",
        }}
      >
        <div className="leftEyeContainer">
          <Eye anime={anime} side={"left"} />
        </div>
        <p className="kanji" style={{ opacity: isHovered ? 0 : 1 }}>
          {arabicToKanji(index + 1)}
        </p>
        <div className="rightEyeContainer">
          <Eye anime={anime} side={"right"} />
        </div>
      </div>
      <div className="tableWrapper" style={{ opacity: showTable ? 1 : 0 }}>
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
      <PulsingBorder
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
        }}
        colors={["#4c4794", "#774a7d"]}
        colorBack="#0c182c"
        roundness={0}
        thickness={1}
        softness={1}
        aspectRatio="auto"
        intensity={0.1}
        bloom={0.2}
        spots={4}
        spotSize={0.25}
        pulse={0}
        smoke={0.32}
        smokeSize={0.5}
        speed={0.35}
        scale={1.1}
        marginLeft={0}
        marginRight={0}
        marginTop={0}
        marginBottom={0}
      />
      <div id="projectContainer">
        {/* {loading ? (
          <p className="introduction">Loading...</p>
        ) : ( */}
        <div className="mainLayout">
          <div className="visualizationContainer">
            <h1 id="appTitle">✦ Animeyes ✦</h1>
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
            <div className='animeContainerGrid'>
              {data.map((anime, index) => (
                <AnimeCard
                  key={anime.uid}
                  anime={anime}
                  index={index}
                  onHover={handleCardHover}
                />
              ))}
            </div>
          </div>
          <Legend activeGenres={activeGenres} hoveredAnime={hoveredAnime} />
        </div>
        {/* )} */}
        <footer>
          <div className="footerDiv">
            <p>
              Data fetched live from the{" "}
              <a href="https://anilist.co/" target="_blank" rel="noreferrer">
                AniList
              </a>{" "}
              API.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
