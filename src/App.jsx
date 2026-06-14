import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import Eye from './components/Eye'
import Table from './components/Table'
import ShareCard from './components/ShareCard'
import { fetchTopAnime } from './data/fetchAnime'
import { buildGenreColorMap } from './data/genreColor'
import { YEAR_TAGS } from './constants'
import { arabicToKanji } from './helpers'
import { useImageLoaded } from './hooks/useImageLoaded'
import Legend from './components/Legend'
import './styles/app.css'

const AnimeCard = React.memo(function AnimeCard({ anime, index, activeTag, onHover }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [generating, setGenerating] = useState(false)
  const timerRef = useRef(null)
  const shareCardRef = useRef(null)
  const imageLoaded = useImageLoaded(anime.img_url)

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

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      // Open AniList page on Enter for keyboard users
      window.open(`https://anilist.co/anime/${anime.uid}`, '_blank')
    }
  }, [anime.uid])

  const setDetailRef = useCallback((node) => {
    if (node) {
      node.setAttribute('inert', '')
    }
    detailRef.current = node
  }, [])

  const detailRef = useRef(null)
  useEffect(() => {
    const node = detailRef.current
    if (!node) return
    if (showTable) {
      node.removeAttribute('inert')
    } else {
      node.setAttribute('inert', '')
    }
  }, [showTable])

  const handleDownload = useCallback(async () => {
    setGenerating(true)
    await shareCardRef.current?.generate()
    setGenerating(false)
  }, [])

  return (
    <>
      <article
        className={`card${isHovered ? ' is-hovered' : ''}${imageLoaded ? ' card--ready' : ' card--loading-media'}${generating ? ' card--generating' : ''}`}
        tabIndex={0}
        aria-label={`${anime.title}, rank ${index + 1}. Score ${anime.score} out of 10, ${anime.episodes} episodes, premiered ${anime.premiered}. Press Enter to open on AniList.`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onKeyDown={handleKeyDown}
      >
        <div className="card__header">
          <h2 className="card__title">{anime.title}</h2>
        </div>
        <p className="card__rank-bg" aria-hidden="true">{arabicToKanji(index + 1)}</p>
        <p className="card__rank" aria-hidden="true">{arabicToKanji(index + 1)}</p>
        <div className="card__eyes" aria-hidden="true">
          <div className="card__eye--left">
            <Eye anime={anime} side={'left'} />
          </div>
          <div className="card__eye--right">
            <Eye anime={anime} side={'right'} />
          </div>
        </div>
        <div
          ref={setDetailRef}
          className={`card__detail${showTable ? ' is-visible' : ''}`}
          aria-hidden="true"
        >
          <div className="card__detail-body">
            <Table anime={anime} />
            <div className="card__detail-actions">
              <button
                className="tag"
                onClick={handleDownload}
                disabled={generating}
                aria-label={`Generate share image for ${anime.title}`}
              >
                Image <i className="fa-regular fa-image" aria-hidden="true"></i>
              </button>
              <a
                className={`tag card__detail-link${generating ? ' tag--disabled' : ''}`}
                href={`https://anilist.co/anime/${anime.uid}`}
                target="_blank"
                rel="noreferrer"
                aria-disabled={generating}
                tabIndex={generating ? -1 : undefined}
                onClick={generating ? (e) => e.preventDefault() : undefined}
                onKeyDown={generating ? (e) => { if (e.key === 'Enter' || e.key === ' ') e.preventDefault() } : undefined}
                aria-label='View on AniList'
              >
                <span>AniList</span>{' '}
                <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
              </a>
            </div>
          </div>
          <img
            className={`card__detail-img${imageLoaded ? ' card__detail-img--loaded' : ''}`}
            src={anime.img_url}
            alt=""
          />
        </div>
        <div
          className={`card__bg${imageLoaded ? ' card__bg--loaded' : ''}`}
          style={{ backgroundImage: `url(${anime.img_url})` }}
          aria-hidden="true"
        />
      </article>
      <ShareCard ref={shareCardRef} anime={anime} activeTag={activeTag} />
    </>
  )
})

export default function App() {
  const [data, setData] = useState([])
  const [activeTag, setActiveTag] = useState(null)
  const [hoveredAnime, setHoveredAnime] = useState(null)
  const [status, setStatus] = useState('loading')
  const [isRefetching, setIsRefetching] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const hasLoadedRef = useRef(false)

  const handleCardHover = useCallback((anime) => {
    setHoveredAnime(anime)
  }, [])

  useEffect(() => {
    let cancelled = false
    const isRefetch = hasLoadedRef.current

    if (isRefetch) {
      setIsRefetching(true)
    } else {
      setStatus('loading')
    }
    fetchTopAnime(activeTag)
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setStatus('success')
          hasLoadedRef.current = true
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsRefetching(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [activeTag, retryCount])

  const handleRetry = useCallback(() => {
    setRetryCount((c) => c + 1)
  }, [])

  const activeGenres = useMemo(() => {
    const set = new Set()
    data.forEach((a) => a.genre.split(', ').forEach((g) => set.add(g)))
    return [...set].toSorted()
  }, [data])

  useEffect(() => {
    if (activeGenres.length) {
      buildGenreColorMap(activeGenres)
    }
  }, [activeGenres])

  const showInitialLoading = status === 'loading' && data.length === 0
  const showError = status === 'error' && data.length === 0
  const filtersBusy = status === 'loading' && data.length === 0

  return (
    <main>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="bg-fixed" aria-hidden="true" />
      <div className="layout">
        <Legend activeGenres={activeGenres} hoveredAnime={hoveredAnime} />
        <div className="viz" id="main-content">
          <div className="viz__sticky-bg" aria-hidden="true"></div>
          <h1 className="header-heading">
            <span className="visually-hidden">Animeyes</span>
            <svg
              className="header"
              aria-hidden="true"
              viewBox="0 0 700 80"
              overflow="visible"
            >
              <text
                x="350"
                y="40"
                dominantBaseline="middle"
                textAnchor="middle"
                stroke="var(--color-bg)"
                strokeWidth="20"
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="var(--color-fg)"
                paintOrder="stroke fill"
              >
                ✦ Animeyes ✦
              </text>
            </svg>
          </h1>
          <div className="intro">
            <p className="intro__header">
              What do the eyes from your favorite anime look like?
            </p>
            <p className="intro__body">
              Each pair of eyes below represents one of the top 100 highest-rated
              anime by community score on{' '}
              <a href="https://anilist.co/" target="_blank" rel="noreferrer">
                AniList
              </a>
              .
            </p>
            <ul className="intro__legend">
              <li><span className="intro__accent">Iris colors</span> reflect genres</li>
              <li><span className="intro__accent">Pupil size</span> shows episode count</li>
              <li><span className="intro__accent">Eye shape</span> changes with the season it aired</li>
            </ul>
          </div>
          <div className="filters" role="region" aria-label="Year filter">
            <div className="filters__list" role="group" aria-label="Filter by year">
              {YEAR_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  className={`tag ${activeTag === tag.value ? 'tag--active' : ''}`}
                  onClick={() => setActiveTag(tag.value)}
                  disabled={filtersBusy || isRefetching}
                  aria-pressed={activeTag === tag.value}
                >
                  {tag.label}
                </button>
              ))}
            </div>
            <select
              className="filters__select"
              value={activeTag ?? ''}
              onChange={(e) => setActiveTag(e.target.value === '' ? null : Number(e.target.value))}
              disabled={filtersBusy || isRefetching}
              aria-label="Filter by year"
            >
              {YEAR_TAGS.map((tag) => (
                <option key={tag.label} value={tag.value ?? ''}>
                  {tag.label}
                </option>
              ))}
            </select>
          </div>
          {showInitialLoading && (
            <div className="viz__status viz__status--loading" role="status" aria-live="polite">
              <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
              <span>Loading anime...</span>
            </div>
          )}
          {showError && (
            <div className="viz__status viz__status--error" role="alert">
              <p>Could not load anime data. Please try again.</p>
              <button type="button" className="tag" onClick={handleRetry}>
                Retry
              </button>
            </div>
          )}
          <div
            className={`card-grid${isRefetching ? ' card-grid--refetching' : ''}`}
            aria-busy={status === 'loading' || isRefetching}
          >
            {isRefetching && data.length > 0 && (
              <div className="card-grid__overlay" aria-hidden="true">
                <i className="fa-solid fa-spinner fa-spin card-grid__spinner" aria-hidden="true" />
              </div>
            )}
            {!showError &&
              data.map((anime, index) => (
                <AnimeCard
                  key={anime.uid}
                  anime={anime}
                  index={index}
                  activeTag={activeTag}
                  onHover={handleCardHover}
                />
              ))}
          </div>
          <nav className="nav-btns" aria-label="Page navigation">
            <div className="nav-btns__buttons">
              <button
                className="nav-btn nav-btn--up"
                aria-label="Scroll to top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <i className="fa-solid fa-arrow-up" aria-hidden="true"></i>
              </button>
              <button
                className="nav-btn nav-btn--down"
                aria-label="Scroll to bottom"
                onClick={() =>
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth',
                  })
                }
              >
                <i className="fa-solid fa-arrow-down" aria-hidden="true"></i>
              </button>
            </div>
            <span className="nav-btns__credit">
              Created by{' '}
              <a
                href="https://www.linkedin.com/in/diogorduarte/"
                target="_blank"
                rel="noreferrer"
              >
                D.R.D
              </a>
              .
            </span>
          </nav>
        </div>
      </div>
      <footer>
        <div className="footer">
          <p>the end?</p>
        </div>
      </footer>
    </main>
  )
}
