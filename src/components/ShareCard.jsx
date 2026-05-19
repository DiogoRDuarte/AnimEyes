import React, { useRef, useCallback, useImperativeHandle, forwardRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { toPng } from 'html-to-image'
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

const ShareCard = forwardRef(function ShareCard({ anime, activeTag }, ref) {
  const nodeRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [coverDataUrl, setCoverDataUrl] = useState(null)

  // Convert cover image to data URL via canvas to bypass CORS in html-to-image
  React.useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (cancelled) return
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      setCoverDataUrl(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => {
      // If CORS fails, fall back to no background
      if (!cancelled) setCoverDataUrl(null)
    }
    img.src = anime.img_url
    return () => { cancelled = true }
  }, [anime.img_url])

  const generate = useCallback(async () => {
    const node = nodeRef.current
    if (!node) return

    // Wait for cover image data URL if it hasn't resolved yet
    if (!coverDataUrl && anime.img_url) {
      await new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          setCoverDataUrl(canvas.toDataURL('image/jpeg', 0.85))
          resolve()
        }
        img.onerror = resolve
        img.src = anime.img_url
      })
      // Give React a tick to re-render with the new coverDataUrl
      await new Promise((r) => setTimeout(r, 50))
    }

    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      style: {
        opacity: '1',
      },
    })

    setPreviewUrl(dataUrl)
  }, [coverDataUrl, anime.img_url])

  const close = useCallback(() => {
    setPreviewUrl(null)
  }, [])

  useImperativeHandle(ref, () => ({ generate }), [generate])

  const genres = anime.genre.split(', ')
  const rankContext = activeTag ? `in ${activeTag}` : 'of All Time'

  return (
    <>
      <div className="share-card" ref={nodeRef} aria-hidden="true">
        <div
          className="share-card__bg"
          style={
            coverDataUrl
              ? { backgroundImage: `url(${coverDataUrl})` }
              : undefined
          }
        />
        <div className="share-card__overlay" />

        <div className="share-card__content">
          <div className="share-card__top">
            <h2 className="share-card__title">{anime.title}</h2>
            <span className="share-card__rank-label">
              #{anime.ranked} {rankContext}
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
              <span className="share-card__kanji">
                {arabicToKanji(anime.ranked)}
              </span>
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
              <dt>anilist.co/anime/{anime.uid}</dt>
              <dd></dd>
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
          >
            <div
              className="share-preview__content"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                className="share-preview__img"
                src={previewUrl}
                alt={`Share card for ${anime.title}`}
              />
              <p className="share-preview__hint">
                Right-click or long-press to save
              </p>
              <button
                className="share-preview__close"
                onClick={close}
                aria-label="Close preview"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
})

export default ShareCard
