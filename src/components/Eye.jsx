import React, { useId } from 'react'
import * as d3 from 'd3'
import { getGenreColor } from '../data/genreColor'
import eyeContour from '../data/contours'
import eyeSclera from '../data/sclera'
import "../styles/Eye.css";
import starSvg from '../assets/star.svg';
import kawaiiLinesFall from '../assets/KawaiiLines-Fall.svg';
import kawaiiLinesSpring from '../assets/KawaiiLines-Spring.svg';
import kawaiiLinesSummer from '../assets/KawaiiLines-Summer.svg';
import kawaiiLinesWinter from '../assets/KawaiiLines-Winter.svg';

const kawaiiLinesBySeason = {
  Fall: kawaiiLinesFall,
  Spring: kawaiiLinesSpring,
  Summer: kawaiiLinesSummer,
  Winter: kawaiiLinesWinter,
};

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
  const clipIrisId = `clipIris-${id}`

  const isOngoing = anime.status === 'RELEASING'
  const isRRated = anime.rating === 'R - 17+ (violence & profanity)' || anime.rating === 'R+ - Mild Nudity'

  return (
    <div className="eyeWrapper">
      <svg className={`svg-container svg-container-${season}`}>
        <defs>
          <filter id={blurIrisId}>
            <feGaussianBlur stdDeviation="3" in="SourceGraphic" result="BLUR" />
          </filter>
          <filter id={blurPupilId}>
            <feGaussianBlur stdDeviation="0.7" in="SourceGraphic" />
          </filter>
          <clipPath id={clipIrisId}>
            <circle cx="100" cy="50" r="20" />
          </clipPath>
        </defs>
        <InnerHTML html={correspondingSclera(season)} className={season} />
        <g className="irisANDpupil" transform="translate(-10, -2)">
          <circle className="iris" cx="100" cy="50" r="32" />
          <g clipPath={`url(#${clipIrisId})`}>
            {animeGenres.map((genre, i) => (
              <g key={i} transform={`rotate(${correspondingRotation(animeGenres, genre)}, 100, 50)`}>
                <circle
                  className="irisColor"
                  cx="100"
                  cy="40"
                  r="15"
                  fill={getGenreColor(genre)}
                  fillOpacity="0.7"
                  filter={`url(#${blurIrisId})`}
                />
              </g>
            ))}
          </g>
          <ellipse
            className="pupil"
            cx="100"
            cy="50"
            rx={15 * getPupilSize(anime.episodes)}
            ry={15 * getPupilSize(anime.episodes)}
            fillOpacity="1"
            filter={`url(#${blurPupilId})`}
          />
        </g>
        <InnerHTML html={correspondingContour(season)} />
      </svg>
      {isOngoing && (
        <img className={`finishedSparkle finishedSparkle-${season}`} src={starSvg} alt="Ongoing" />
      )}
      {isRRated && (
        <img className={`kawaiiLines kawaiiLines-${season}`} src={kawaiiLinesBySeason[season]} alt="" />
      )}
    </div>
  )
}
