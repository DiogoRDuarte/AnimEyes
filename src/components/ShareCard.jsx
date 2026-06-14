import { useRef, useCallback, useImperativeHandle, forwardRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { domToPng } from 'modern-screenshot'
import Eye from './Eye'
import { getGenreColor } from '../data/genreColor'
import { arabicToKanji } from '../helpers'
import '../styles/ShareCard.css'

function textColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000' : '#fff'
}

// Cache for converted image data URLs
const imageDataUrlCache = new Map()

/**
 * Fetch an image as a data URL with CORS support.
 * Uses cache-busting to avoid the browser serving a cached non-CORS response
 * (AniList CDN uses Vary: origin, which can cause conflicts).
 */
async function fetchImageAsDataUrl(url) {
  if (imageDataUrlCache.has(url)) return imageDataUrlCache.get(url)

  // Add cache-buster to avoid Vary:origin conflicts with the non-CORS cached version
  const bustUrl = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now()
  try {
    const res = await fetch(bustUrl, { mode: 'cors' })
    if (res.ok) {
      const blob = await res.blob()
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(blob)
      })
      if (dataUrl) {
        imageDataUrlCache.set(url, dataUrl)
        return dataUrl
      }
    }
  } catch (err) {
    console.warn('[ShareCard] Failed to fetch image:', err)
  }
  return null
}

const ShareCard = forwardRef(function ShareCard({ anime, activeTag }, ref) {
  const nodeRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const generate = useCallback(async () => {
    const node = nodeRef.current
    if (!node) return

    // Pre-fetch the cover image as a data URL
    const bgData = await fetchImageAsDataUrl(anime.img_url)

    // Swap the bg element to use the data URL so modern-screenshot can embed it
    const bgEl = node.querySelector('.share-card__bg')
    const originalBg = bgEl?.style.backgroundImage
    if (bgEl && bgData) {
      bgEl.style.backgroundImage = `url("${bgData}")`
    }

    const width = node.offsetWidth || 400
    const height = node.offsetHeight || 600
    const scale = 2

    const dataUrl = await domToPng(node, { width, height, scale })

    // Restore original bg
    if (bgEl) {
      bgEl.style.backgroundImage = originalBg
    }

    setPreviewUrl(dataUrl)
    document.body.style.overflow = 'hidden'
  }, [anime.img_url])

  const close = useCallback(() => {
    setPreviewUrl(null)
    document.body.style.overflow = ''
  }, [])

  useImperativeHandle(ref, () => ({ generate }), [generate])

  const genres = anime.genre.split(', ')
  const rankContext = activeTag ? `in ${activeTag}` : 'of All Time'

  const generatedAlt = `Animeyes card for "${anime.title}", ranked #${anime.ranked} ${rankContext}. A pair of stylized anime eyes with ${genres.join(', ')}-colored irises reflecting its genres, a ${anime.episodes >= 100 ? 'large' : anime.episodes >= 50 ? 'medium' : 'small'} pupil representing ${anime.episodes} episodes, and ${anime.premiered.split(' ')[0].toLowerCase()}-shaped eye contours for the ${anime.premiered} premiere season. Score: ${anime.score}/10.`

  return (
    <>
      <div className="share-card" ref={nodeRef} aria-hidden="true">
        <div
          className="share-card__bg"
          style={{ backgroundImage: `url(${anime.img_url})` }}
        />
        <div className="share-card__overlay" />

        <div className="share-card__content">
          <div className="share-card__top">
            <h2 className="share-card__title">{anime.title}</h2>
            <span className="share-card__rank-label">
              #{anime.ranked} {rankContext}
            </span>
            <span className="share-card__kanji">
              {arabicToKanji(anime.ranked)}
            </span>
          </div>

          <div className="share-card__visual">
            <span className="share-card__kanji-bg">
              {arabicToKanji(anime.ranked)}
            </span>
            <div className="share-card__eyes">
              <div className="share-card__eye--left">
                <Eye anime={anime} side="left" />
              </div>
              <div className="share-card__eye--right">
                <Eye anime={anime} side="right" />
              </div>
            </div>
          </div>

          <div className="share-card__genres">
            {genres.map((genre) => {
              const color = getGenreColor(genre);
              return (
                <span
                  key={genre}
                  className="share-card__genre-tag"
                  style={{ background: color, color: textColor(color) }}
                >
                  {genre}
                </span>
              );
            })}
          </div>

          <dl className="share-card__stats">
            <div className="share-card__stat">
              <dt>Score</dt>
              <dd>{anime.score} / 10</dd>
            </div>
            <div className="share-card__stat">
              <dt>Popularity</dt>
              <dd>{anime.popularity}</dd>
            </div>
            <div className="share-card__stat">
              <dt>Episodes</dt>
              <dd>{anime.episodes}</dd>
            </div>
            <div className="share-card__stat">
              <dt>Premiered</dt>
              <dd>{anime.premiered}</dd>
            </div>
            <div className="share-card__stat">
              <dt>First Aired</dt>
              <dd>{anime.aired}</dd>
            </div>
            <div className="share-card__stat">
              <dt></dt>
              <dd>anilist.co/anime/{anime.uid}</dd>
            </div>
          </dl>

          <div className="share-card__footer">
            <span>✦ Animeyes ✦</span>
          </div>
        </div>
      </div>

      {previewUrl &&
        createPortal(
          <div
            className="share-preview"
            onClick={close}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
            }}
            role="dialog"
            aria-label={`Share image for ${anime.title}`}
            aria-modal="true"
            tabIndex={-1}
            ref={(node) => { node?.focus() }}
          >
            <div
              className="share-preview__content"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                className="share-preview__img"
                src={previewUrl}
                alt={generatedAlt}
              />
              <div className="share-preview__alt-panel">
                <h3 className="share-preview__alt-heading">Suggested alt text:</h3>
                <textarea
                  className="share-preview__alt-text"
                  readOnly
                  value={generatedAlt}
                  onClick={(e) => e.target.select()}
                  aria-label="Suggested alt text for the generated image"
                />
                <button
                  className="share-preview__copy-btn tag"
                  onClick={() => navigator.clipboard.writeText(generatedAlt)}
                  aria-label="Copy alt text to clipboard"
                >
                  Copy <i className="fa-regular fa-copy" aria-hidden="true"></i>
                </button>
                <button
                  className="share-preview__download-btn tag"
                  onClick={() => {
                    const a = document.createElement('a')
                    a.href = previewUrl
                    a.download = `${anime.title.replace(/[^a-z0-9]/gi, '_')}_animeyes.png`
                    a.click()
                  }}
                  aria-label="Download image"
                >
                  Download image <i className="fa-solid fa-download" aria-hidden="true"></i>
                </button>
              </div>
              <button
                className="share-preview__close"
                onClick={close}
                aria-label="Close preview"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
})

export default ShareCard
