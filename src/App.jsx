import React, { useState, useCallback } from 'react'
import Eye from './components/Eye'
import Table from './components/Table'
import data from './data/top_anime'
import './App.css'

function arabicToKanji(number) {
  const kanjiNumerals = ["一","二","三","四","五","六","七","八","九"]
  const tenKanji = "十"
  const hundredKanji = "百"
  const arabicDigits = number.toString().split("")

  if (arabicDigits.length === 1) {
    return kanjiNumerals[parseInt(arabicDigits[0]) - 1]
  } else if (arabicDigits.length === 2) {
    const firstDigit = parseInt(arabicDigits[0])
    const secondDigit = parseInt(arabicDigits[1])
    const kanjiRepresentation = []
    if (firstDigit > 1) kanjiRepresentation.push(kanjiNumerals[firstDigit - 1])
    kanjiRepresentation.push(tenKanji)
    if (secondDigit > 0) kanjiRepresentation.push(kanjiNumerals[secondDigit - 1])
    return kanjiRepresentation.join("")
  } else if (arabicDigits.length === 3 && parseInt(number) === 100) {
    return hundredKanji
  }
  return "Unsupported"
}

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
          href={`https://myanimelist.net/anime/${anime.uid}`}
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
  return (
    <main>
      <div id="projectContainer">
        <h1 id="appTitle">✦ AniMeYeS ✦</h1>
        <div className="introductionContainer">
          <p className="introduction">
            <b>What do the eyes from your favorite anime look like?</b>
            <br />
            These are the ranked top 100 anime from <b>2023</b>, taken from{' '}
            <a href="https://myanimelist.net/" target="_blank" rel="noreferrer">
              MyAnimeList
            </a>
            , represented as colorful eyes (✦ ‿ ✦)
            <br />
            You can hover (or keyboard focus) each one to learn more!
          </p>
        </div>
        <div className="visualizationContainer">
          {data.map((anime, index) => (
            <AnimeCard key={anime.uid} anime={anime} index={index} />
          ))}
        </div>
        <footer>
          <div className="footerDiv">
            <p>
              The dataset used in this project was taken from{' '}
              <a
                href="https://www.kaggle.com/datasets/arnavvvvv/anime-dataset"
                target="_blank"
                rel="noreferrer"
              >
                kaggle
              </a>{' '}
              at the beginning of 2024. The 👀 are ordered based on their
              "rank", which is calculated through a weight formula from
              MyAnimeList.
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}
