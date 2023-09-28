<script>
  export let anime;

  import { fade } from "svelte/transition";
</script>

<div id="informationTable" class={"table" + anime.animeID} in:fade>
  <table>
    <colgroup>
      <col />
      <col />
    </colgroup>
    <thead>
      <tr class="row">
        <th class="left header">&nbsp Category</th>
        <th class="right header">Value</th>
      </tr>
    </thead>
    <tbody>
      <tr class="row">
        <td class="left alternate">&nbsp Type</td>
        <td class="right alternate">{anime.type} &nbsp </td>
      </tr>
      <tr class="row">
        <td class="left">&nbsp Source</td>
        <td class="right">{anime.source} &nbsp</td>
      </tr>
      <tr class="row">
        <td class="left alternate">&nbsp Genre</td>
        <td class="right alternate">{anime.genre} &nbsp </td>
      </tr>
      <tr class="row">
        <td class="left">&nbsp Episodes</td>
        <td class="right">{anime.episodes} &nbsp </td>
      </tr>
      <tr class="row">
        <td class="left alternate">&nbsp Duration</td>
        <td class="right alternate">{anime.duration} &nbsp </td>
      </tr>
      <tr class="row">
        <td class="left">&nbsp Rating</td>
        <td class="right">{anime.rating} &nbsp </td>
      </tr>
      <tr class="row">
        <td class="left alternate">&nbsp Scored by</td>
        <td class="right alternate">{anime.scored_by} people &nbsp </td>
      </tr>
      <tr class="row">
        <td class="left">&nbsp Premiered</td>
        <td class="right">{anime.premiered} &nbsp</td>
      </tr>
    </tbody>
  </table>
</div>

<style>
  #informationTable {
    position: absolute;
    width: 95%;
    padding-left: 2.5%;
    padding-right: 2.5%;
  }

  table {
    width: 100%; /* Set the table's width to 100% */
    font-family: "DM Sans";
    font-weight: bold;
    font-size: 9px;
    border-collapse: collapse;
  }
  .left {
    text-align: left; /* Left-align the text in the left column */
    border-radius: 10px 0 0 10px;
  }
  .right {
    text-align: right; /* Right-align the text in the right column */
    border-radius: 0 10px 10px 0;
  }
  .header {
    color: #031121;
  }
  td {
    color: #d9d9d9; /* Change the text color for non-header cells to red */
    border: none; /* Remove cell borders */
    padding: 2px 0;
  }
  .alternate {
    background-color: #061e3a;
  }
</style>
