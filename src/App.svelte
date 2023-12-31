<script>
  // @ts-nocheck

  import Eye from "./components/Eye.svelte";
  import Table from "./components/Table.svelte";
  import data from "./data/top_anime";
  import * as d3 from "d3";

  import { fade } from "svelte/transition";

  const episodeNumbersArray = data.map((anime) => parseInt(anime.episodes));
  const [minValue, maxValue] = d3.extent(episodeNumbersArray);

  const isRotated = {};

  function mouseenter(animeID) {
    if (!isRotated[animeID]) {
      // Rotate the eyes on mouseover
      isRotated[animeID] = true;
      const eyesContainer = document.getElementsByClassName(animeID)[0];
      eyesContainer.style.transform = "rotateX(90deg)";
    }
  }

  function mouseleave(animeID) {
    if (isRotated[animeID]) {
      // Rotate the eyes back to the original position on mouseleave
      isRotated[animeID] = false;
      const eyesContainer = document.getElementsByClassName(animeID)[0];
      eyesContainer.style.transform = "rotateX(0deg)";
    }
  }

  function arabicToKanji(number) {
    const kanjiNumerals = [
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
    ];
    const tenKanji = "十";
    const hundredKanji = "百";
    const arabicDigits = number.toString().split("");

    if (arabicDigits.length === 1) {
      return kanjiNumerals[parseInt(arabicDigits[0]) - 1];
    } else if (arabicDigits.length === 2) {
      const firstDigit = parseInt(arabicDigits[0]);
      const secondDigit = parseInt(arabicDigits[1]);
      const kanjiRepresentation = [];

      if (firstDigit > 1) {
        kanjiRepresentation.push(kanjiNumerals[firstDigit - 1]);
      }

      kanjiRepresentation.push(tenKanji);

      if (secondDigit > 0) {
        kanjiRepresentation.push(kanjiNumerals[secondDigit - 1]);
      }

      return kanjiRepresentation.join("");
    } else if (arabicDigits.length === 3 && parseInt(number) === 100) {
      return hundredKanji;
    } else {
      return "Unsupported"; // Handle unsupported numbers
    }
  }
</script>

<main>
  <div id="projectContainer">
    <h1 id="appTitle">AnimEyes</h1>
    <div id="introductionContainer">
      <p id="introduction">
        <b>What do the eyes from your favorite anime look like?</b>
        <br />
        These are the top 100 anime from <b>2019</b>, taken from
        <a href="https://myanimelist.net/" target="_blank">MyAnimeList</a>,
        represented as colorful eyes (✦ ‿ ✦)
        <br />
        You can hover (or keyboard focus) each one to learn more!
      </p>
    </div>
    <div id="visualizationContainer">
      {#each data as anime, index}
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          id="animeContainer"
          tabindex="0"
          on:mouseenter={() => mouseenter(anime.animeID)}
          on:mouseleave={() => mouseleave(anime.animeID)}
          on:focus={() => mouseenter(anime.animeID)}
          on:focusout={() => mouseleave(anime.animeID)}
        >
          {#if isRotated[anime.animeID]}
            <div transition:fade>
              <Table {anime} />
            </div>
          {/if}
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <div id="eyesContainer" class={anime.animeID}>
            <div id="leftEyeContainer">
              <Eye {anime} />
            </div>
            <div id="rightEyeContainer">
              <Eye {anime} />
            </div>
          </div>
          {#if !isRotated[anime.animeID]}
            <p id={"kanji"} class={"kanji" + anime.animeID} transition:fade>
              {arabicToKanji(index + 1)}
            </p>
          {/if}
          <div class="name-container">
            <a
              href={"https://myanimelist.net/anime/" + anime.animeID}
              target="_blank"
              class="no-underline"
            >
              <h2 id="name">🔗{anime.title_english}</h2>
            </a>
          </div>
        </div>
      {/each}
    </div>
    <footer>
      <div id="footerDiv">
        <p>
          The data used in this project comes directly from dataset provided in
          a <a
            href="https://github.com/rfordatascience/tidytuesday/tree/master/data/2019/2019-04-23"
            target="_blank">tidytuesday</a
          > back in April of 2019. The 👀 are ordered based on their "rank", which
          is calculated through a weight formula from MyAnimeList.
        </p>
      </div>
    </footer>
  </div>
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

  /* 
    font-size: rem
    width: % in combination with a max-width, ch
    height: question urself "do i rly need to set height" if yes -> use a min-height
    padding/margin: rem or em, kevin often uses em for padding of buttons
    media queries: em 
  */

  main {
    font-family: "Poppins", sans-serif;
    font-size: large;
    background-color: #020b14;
    color: #d9d9d9;
  }

  /* Default link color */
  a:link {
    color: #d9d9d9; /* Change the color for unvisited links */
  }

  /* Visited link color */
  a:visited {
    color: #7c7c8a; /* Change the color for visited links */
  }

  a.no-underline {
    text-decoration: none;
  }

  :global(body) {
    /* this will apply to <body> */
    margin: 0;
    padding: 0;
  }

  #appTitle {
    margin: 0;
    padding-top: 1.5rem;
    text-align: center;
    font-family: "Yamagachi2050Italic";
    font-size: xxx-large;
    color: #c5d1eb;
  }

  #visualizationContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  #animeContainer {
    margin: 1rem;
    text-align: center;
    background: #031121; /* Adjust the opacity as needed */
    backdrop-filter: blur(10px);
    border-radius: 15px;
    box-shadow: 0px 0px 20px #031121;
  }

  #introductionContainer {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
  }

  #introduction {
    line-height: 1.5; /* Adjust the value as needed */
    color: #c5d1eb;
    text-align: center;
    font-family: "DMSans";
    font-size: 1rem;
  }

  #eyesContainer {
    margin-top: 1rem;
    display: flex;
    width: fit-content;
    flex-direction: row;
    --custom-rotation: 0deg; /* Default value */
    transform: rotateX(
      var(--custom-rotation, 0deg)
    ); /* Use --custom-rotation, default 0deg */
    transform-origin: center bottom;
    transition: transform 0.5s ease; /* A smooth transition effect */
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

  #kanji {
    position: absolute;
    text-align: center; /* Center-align text within the paragraph */
    margin-top: -3rem; /* Horizontal centering using margin */
    margin-left: auto;
    margin-right: auto;
    font-size: 1rem;
    width: 100%; /* Set a fixed width for the element */
    font-weight: bolder;
    color: #c5d1eb;
    /* pupupu free */
    /* mini-wakuwaku-maru */
    /* MadonoFont */
  }

  #name {
    white-space: nowrap; /* Prevent text from wrapping to the next line */
    overflow: hidden; /* Hide any overflowing content */
    text-overflow: ellipsis; /* Display ellipses for overflow text */
    max-width: 35ch; /* Adjust the maximum width as needed */
    margin-left: auto;
    margin-right: auto;
    margin-top: 7%;
    font-size: medium;
    color: #c5d1eb;
  }

  #footerDiv {
    padding-top: 2rem;
    margin-left: 20%;
    margin-right: 20%;
    padding-bottom: 2rem;
    font-family: "DMSans";
    font-size: 1rem;
    line-height: 1.5; /* Adjust the value as needed */
    color: #c5d1eb;
    text-align: center;
  }

  @font-face {
    font-family: "DMSans";
    src: url("../fonts/DMSans.ttf") format("truetype");
    /* Add other font properties, such as font-weight and font-style if needed */
  }

  @font-face {
    font-family: "Yamagachi2050Italic";
    src: url("../fonts/Yamagachi2050Italic.ttf") format("truetype");
    /* Add other font properties, such as font-weight and font-style if needed */
  }
</style>
