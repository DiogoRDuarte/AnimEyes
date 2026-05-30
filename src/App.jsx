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
import './styles/App.css'

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

  const handleDownload = useCallback(async () => {
    setGenerating(true)
    await shareCardRef.current?.generate()
    setGenerating(false)
  }, [])

  return (
    <>
      <div
        className={`card${isHovered ? ' is-hovered' : ''}${imageLoaded ? ' card--ready' : ' card--loading-media'}${generating ? ' card--generating' : ''}`}
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
            <Eye anime={anime} side={'left'} />
          </div>
          <div className="card__eye--right">
            <Eye anime={anime} side={'right'} />
          </div>
        </div>
        <div className={`card__detail${showTable ? ' is-visible' : ''}`}>
          <div className="card__detail-body">
            <Table anime={anime} />
            <div className="card__detail-actions">
              <button className="tag" onClick={handleDownload} disabled={generating}>
                Image <i className="fa-regular fa-image"></i>
              </button>
              <a
                className={`tag card__detail-link${generating ? ' tag--disabled' : ''}`}
                href={`https://anilist.co/anime/${anime.uid}`}
                target="_blank"
                rel="noreferrer"
                aria-disabled={generating}
                onClick={generating ? (e) => e.preventDefault() : undefined}
              >
                AniList{' '}
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>
          <img
            className={`card__detail-img${imageLoaded ? ' card__detail-img--loaded' : ''}`}
            src={anime.img_url}
            alt={anime.title}
          />
        </div>
        <div
          className={`card__bg${imageLoaded ? ' card__bg--loaded' : ''}`}
          style={{ backgroundImage: `url(${anime.img_url})` }}
        />
      </div>
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
          <p className="intro">
            <span className="intro__header">
              What do the eyes from your favorite anime look like?
            </span>
            <br />
            Each pair of eyes below represents one of the top 100 highest-rated
            anime by community score on{' '}
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
                  className={`tag ${activeTag === tag.value ? 'tag--active' : ''}`}
                  onClick={() => setActiveTag(tag.value)}
                  disabled={filtersBusy || isRefetching}
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
            aria-live="polite"
          >
            {isRefetching && data.length > 0 && (
              <div className="card-grid__overlay" aria-hidden="true">
                <i className="fa-solid fa-spinner fa-spin card-grid__spinner" />
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
          <div className="nav-btns">
            <div className="nav-btns__buttons">
              <button
                className="nav-btn nav-btn--up"
                aria-label="Scroll to top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <i className="fa-solid fa-arrow-up"></i>
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
                <i className="fa-solid fa-arrow-down"></i>
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
          </div>
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
