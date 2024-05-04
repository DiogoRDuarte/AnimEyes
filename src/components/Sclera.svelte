<script>
  import eyeSclera from "../data/sclera";
  import * as d3 from "d3";

  export let premiered;

  let season = premiered.split(" ")[0];

  const seasonsArray = Object.keys(eyeSclera[0]);
  const pathsArray = Object.values(eyeSclera[0]);

  var correspondingPath = d3
    .scaleOrdinal()
    .domain(seasonsArray)
    .range(pathsArray);

  $: svgContent = correspondingPath(season);
</script>

{@html svgContent}
