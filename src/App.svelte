<script>
  import Eye from "./components/Eye.svelte";
  import data from "./data/top_anime";
  import stretcher from "./data/stretcher";
  import * as d3 from "d3";

  const episodeNumbersArray = data.map((anime) => parseInt(anime.episodes));
  const [minValue, maxValue] = d3.extent(episodeNumbersArray);
</script>

<main>
  <div id="visualizationContainer">
    {#each data as anime}
      <div id="animeContainer">
        <div id="eyesContainer">
          <div id="leftEyeContainer">
            <Eye {anime} {minValue} {maxValue} />
          </div>
          <div id="rightEyeContainer">
            <Eye {anime} {minValue} {maxValue} />
          </div>
        </div>
        <h1 id="name">{anime.title_english}</h1>
      </div>
    {/each}
  </div>
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

  main {
    font-family: "Poppins", sans-serif;
    font-size: 6px;
    font-weight: 25;
    background-color: #031121;
    color: #d9d9d9;
  }

  :global(body) {
    /* this will apply to <body> */
    margin: 0;
    padding: 0;
  }

  #visualizationContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  #animeContainer {
    text-align: center;
  }

  #eyesContainer {
    display: flex;
    width: fit-content;
    block-size: fit-content;
    flex-direction: row;
    --custom-rotation: 0deg; /* Default value */
    transform: rotateX(
      var(--custom-rotation, 0deg)
    ); /* Use --custom-rotation, default 0deg */
    transform-origin: center bottom;
    transition: transform 0.5s ease; /* A smooth transition effect */
  }

  #eyesContainer:hover {
    --custom-rotation: 90deg; /* Value when hovering */
  }

  #leftEyeContainer,
  #rightEyeContainer {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #rightEyeContainer {
    transform: scaleX(-1);
  }
</style>
