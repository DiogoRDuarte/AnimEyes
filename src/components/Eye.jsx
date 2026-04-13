import React, { useId } from 'react'
import * as d3 from 'd3'
import genreColor from '../data/genreColor'
import stretcher from '../data/stretcher'
import eyeContour from '../data/contours'
import eyeSclera from '../data/sclera'
import './Eye.css'

const genresArray = Object.keys(genreColor[0])
const colorsArray = Object.values(genreColor[0])
const ratingArray = Object.keys(stretcher[0])
const stretchesArray = Object.values(stretcher[0])

const correspondingColor = d3.scaleOrdinal().domain(genresArray).range(colorsArray)
const correspondingStretch = d3.scaleOrdinal().domain(ratingArray).range(stretchesArray)

const contourSeasonsArray = Object.keys(eyeContour[0])
const contourPathsArray = Object.values(eyeContour[0])
const correspondingContour = d3.scaleOrdinal().domain(contourSeasonsArray).range(contourPathsArray)

const scleraSeasonsArray = Object.keys(eyeSclera[0])
const scleraPathsArray = Object.values(eyeSclera[0])
const correspondingSclera = d3.scaleOrdinal().domain(scleraSeasonsArray).range(scleraPathsArray)

function split360Parts(n) {
  const step = 360 / n
  const result = []
  for (let i = 1; i <= n; i++) result.push(i * step)
  return result
}

function getPupilSize(number) {
  if (number >= 100) return 1
  if (number >= 75) return 0.8
  if (number >= 50) return 0.6
  if (number >= 25) return 0.4
  if (number >= 0) return 0.2
  return 0
}

function correspondingRotation(animeGenres, genre) {
  const uniqueGenres = [...new Set(animeGenres)]
  const slices = split360Parts(uniqueGenres.length)
  const genreIndex = uniqueGenres.indexOf(genre)
  const rotationIndex = animeGenres.indexOf(genre)
  return slices[genreIndex] + (rotationIndex - genreIndex) * (360 / animeGenres.length)
}

function InnerHTML({ html, className }) {
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (ref.current) ref.current.innerHTML = html
  }, [html])
  return <g ref={ref} className={className} />
}

export default function Eye({ anime }) {
  const animeGenres = anime.genre.split(', ')
  const season = anime.premiered.split(' ')[0]
  const id = useId()
  const blurIrisId = `blurIris-${id}`
  const blurPupilId = `blurPupil-${id}`

  return (
    <svg className={`svg-container svg-container-${season}`}>
      <defs>
        <filter id={blurIrisId}>
          <feGaussianBlur stdDeviation="3" in="SourceGraphic" result="BLUR" />
        </filter>
        <filter id={blurPupilId}>
          <feGaussianBlur stdDeviation="0.7" in="SourceGraphic" result="BLUR" />
        </filter>
      </defs>
      <InnerHTML html={correspondingSclera(season)} className={season} />
      <g className="irisANDpupil" transform="translate(-10, -2)">
        <circle className="iris" cx="100" cy="50" r="32" />
        {animeGenres.map((genre, i) => (
          <g key={i} transform={`rotate(${correspondingRotation(animeGenres, genre)}, 100, 50)`}>
            <circle
              className="irisColor"
              cx="100"
              cy="40"
              r="15"
              fill={correspondingColor(genre)}
              fillOpacity="0.7"
              filter={`url(#${blurIrisId})`}
            />
          </g>
        ))}
        <ellipse
          className="pupil"
          cx="100"
          cy="50"
          rx={correspondingStretch(anime.rating) * 20 * getPupilSize(anime.episodes)}
          ry={20 * getPupilSize(anime.episodes)}
          fillOpacity="1"
          filter={`url(#${blurPupilId})`}
        />
      </g>
      <InnerHTML html={correspondingContour(season)} />
    </svg>
  )
}
