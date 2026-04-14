import React, { useState, useCallback, useEffect } from 'react'
import Eye from './components/Eye'
import Table from './components/Table'
import { fetchTopAnime } from './data/fetchAnime'
import { YEAR_TAGS } from './constants'
import { arabicToKanji } from './helpers'
import './App.css'

function AnimeCard({ anime, index }) {
  const [isRotated, setIsRotated] = useState(false)

  const handleEnter = useCallback(() => setIsRotated(true), [])
  const handleLeave = useCallback(() => setIsRotated(false), [])

  return (
    <div
      className="animeContainer"
      tabIndex={0}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {isRotated && (
        <div>
          <Table anime={anime} />
        </div>
      )}
      <div
        className="eyesContainer"
        style={{
          transform: isRotated ? 'rotateX(90deg)' : 'rotateX(0deg) translateZ(0)',
        }}
      >
        <div className="leftEyeContainer">
          <Eye anime={anime} />
        </div>
        <div className="rightEyeContainer">
          <Eye anime={anime} />
        </div>
      </div>
      {!isRotated && (
        <p className="kanji">
          {arabicToKanji(index + 1)}
        </p>
      )}
      <div className="name-container">
        <a
          href={`https://anilist.co/anime/${anime.uid}`}
          target="_blank"
          rel="noreferrer"
          className="no-underline"
        >
          <h2 className="animeName">{anime.title}</h2>
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

  useEffect(() => {
    setLoading(true)
    fetchTopAnime(activeTag)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeTag])

  

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
            You can hover each pair of 👀 to learn more!
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
          <div className="visualizationContainer">
            {data.map((anime, index) => (
              <AnimeCard key={anime.uid} anime={anime} index={index} />
            ))}
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
