<script>
  // @ts-nocheck

  import { scaleLinear } from "d3-scale";
  import { scaleOrdinal } from "d3-scale";
  import genreColor from "../data/genreColor";
  import stretcher from "../data/stretcher";
  import * as d3 from "d3";

  import Contour from "./Contour.svelte";
  import Sclera from "./Sclera.svelte";

  export let anime;

  let animeGenres = anime.genre.split(", ");

  const genresArray = Object.keys(genreColor[0]);
  const colorsArray = Object.values(genreColor[0]);

  const ratingArray = Object.keys(stretcher[0]);
  const stretchesArray = Object.values(stretcher[0]);

  var correspondingColor = d3
    .scaleOrdinal()
    .domain(genresArray)
    .range(colorsArray);

  var correspondingStretch = d3
    .scaleOrdinal()
    .domain(ratingArray)
    .range(stretchesArray);

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

  function getPupilSize(number) {
    if (number >= 100) {
      return 1;
    } else if (number >= 75) {
      return 0.8;
    } else if (number >= 50) {
      return 0.6;
    } else if (number >= 25) {
      return 0.4;
    } else if (number >= 0) {
      return 0.2;
    } else {
      return 0;
    }
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

<svg class="svg-container svg-container-{anime.premiered.split(" ")[0]}">
  <defs>
    <filter id="blurIris">
      <feGaussianBlur stdDeviation="3" in="SourceGraphic" result="BLUR" />
    </filter>
    <filter id="blurPupil">
      <feGaussianBlur stdDeviation="0.7" in="SourceGraphic" result="BLUR" />
    </filter>
  </defs>

  <g class={anime.premiered.split(" ")[0]}>
    <Sclera premiered={anime.premiered} />
  </g>

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
      rx={correspondingStretch(anime.rating) *
        20 *
        getPupilSize(anime.episodes)}
      ry={20 * getPupilSize(anime.episodes)}
      fill-opacity="1"
      filter="url(#blurPupil)"
    />
  </g>

  <g>
    <Contour premiered={anime.premiered} />
  </g>
</svg>

<style>
  .svg-container {
    position: relative;
    width: 12rem;
    height: 6.5rem;
    transform: translate(15px, 15px);
  }

  .svg-container-Autumn {
    transform: translate(35px, 10px);
  }

  .svg-container-Spring {
    transform: translate(20px, 15px);
  }

  .sclera {
    width: 1rem;
  }

  .Winter {
    transform: translate(1.3rem, 0.6rem);
  }

  .Spring {
    transform: translate(0.9rem, 0.6rem);
  }

  .Autumn {
    transform: translate(0.6rem, 0.5rem);
  }

  .Summer {
    transform: translate(0.6rem, 0.6rem);
  }
</style>
