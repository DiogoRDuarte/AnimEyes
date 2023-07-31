<!-- 
Iris color = genre
Pupila stretch = rating
Tamanho pupila = episodes
eyelaches or not = movie or tv 
shape of eyes = one of 4 seasons
-->

<script>
  // @ts-nocheck

  import { scaleLinear } from "d3-scale";
  import { scaleOrdinal } from "d3-scale";
  import genreColor from "../data/genreColor";
  import * as d3 from "d3";

  import Contour from "./Contour.svelte";
  import Sclera from "./Sclera.svelte";

  export let anime;
  export let minValue;
  export let maxValue;

  let animeGenres = anime.genre.split(", ");
  console.log(animeGenres);

  const xScale = scaleLinear().domain([minValue, maxValue]).range([0, 25]);

  const genresArray = Object.keys(genreColor[0]);
  const colorsArray = Object.values(genreColor[0]);

  var correspondingColor = d3
    .scaleOrdinal()
    .domain(genresArray)
    .range(colorsArray);

  function split360Parts(n) {
    if (n <= 0 || typeof n !== "number") {
      throw new Error(
        "Invalid input. The input must be a positive number greater than 0."
      );
    }

    const step = 360 / n;
    const result = [];

    for (let i = 1; i <= n; i++) {
      result.push(i * step);
    }

    return result;
  }

  function correspondingRotation(animeGenres, genre) {
    const uniqueGenres = [...new Set(animeGenres)];
    const slices = split360Parts(uniqueGenres.length);
    const genreIndex = uniqueGenres.indexOf(genre);
    const rotationIndex = animeGenres.indexOf(genre);

    return (
      slices[genreIndex] +
      (rotationIndex - genreIndex) * (360 / animeGenres.length)
    );
  }
</script>

<svg class="svg-container" transform="translate(20, 5)">
  <defs>
    <filter id="blurIris">
      <feGaussianBlur stdDeviation="2" in="SourceGraphic" result="BLUR" />
    </filter>
    <filter id="blurPupil">
      <feGaussianBlur stdDeviation="1" in="SourceGraphic" result="BLUR" />
    </filter>
  </defs>
  <!-- <path
      d="M50.0334 71.1475C8.43338 58.3475 -0.633285 31.8141 0.0333819 20.1475C55.6334 -29.0525 106.867 23.3141 125.533 55.6475C93.9333 81.2475 62.0334 76.6475 50.0334 71.1475Z"
      fill="white"
    /> -->
  <Sclera premiered={anime.premiered} />

  <g class="irisANDpupil" transform="translate(-10, -2)">
    <circle class="iris" cx="100px" cy="50px" r="32px" />

    <!-- Move the irisColor circles group to the bottom -->
    {#each animeGenres as genre}
      <g
        transform={`rotate(${correspondingRotation(
          animeGenres,
          genre
        )}, 100, 50)`}
      >
        <circle
          class="irisColor"
          cx="100px"
          cy="40px"
          r="15"
          fill={correspondingColor(genre)}
          fill-opacity="0.7"
          filter="url(#blurIris)"
        />
      </g>
    {/each}

    <ellipse
      class="pupil"
      cx="100px"
      cy="50px"
      rx={xScale(anime.episodes)}
      ry={xScale(anime.episodes)}
      fill-opacity="0.9"
      filter="url(#blurPupil)"
    />
  </g>

  <g
    class="contour"
    width="149"
    height="69"
    viewBox="0 0 149 69"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    transform="translate(5, 0)"
  >
    <Contour premiered={anime.premiered} />
  </g>
</svg>

<style>
  .svg-container {
    position: relative;
    width: 200px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .irisANDpupil {
    height: 100px;
    width: 200px;
  }

  .sclera {
    position: absolute;
    top: 40px;
    right: 41px;
    height: 100px;
    width: 200px;
    z-index: -1;
  }

  .contour {
    position: absolute;
    height: 150px;
    width: 200px;
  }

  .iris {
    fill: black;
  }

  .irisColor {
  }
</style>
