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
        <h1>{anime.title_english}</h1>
      </div>
    {/each}
  </div>
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

  main {
    font-family: "Poppins", sans-serif;
    font-size: xx-small;
    font-weight: 50;
    background-color: #031121;
    color: #d9d9d9;
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
