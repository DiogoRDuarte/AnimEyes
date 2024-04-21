<script>
  import * as d3 from "d3";

  export let color;
  export let text;
</script>

<div id="contourContainer">
  <svg width="200" height="100">
    <g>
      <circle cx="50" cy="50" r="40" fill="blue" />
      <!-- Create a paragraph (text) -->
      <text x="100" y="50" font-size="14" fill="black">
        <tspan x="100" dy="1.2em">Your paragraph text here</tspan>
      </text>
    </g>
  </svg>
</div>
