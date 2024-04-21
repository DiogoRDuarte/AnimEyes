<script>
  export let anime;

  import { fade } from "svelte/transition";
</script>

<div id="informationTable" class={"table" + anime.uid} in:fade>
<!-- Table for Members -->
<table>
  <colgroup>
    <col />
    <col />
  </colgroup>
  <thead>
    <tr class="row">
      <th class="left header">&nbsp;</th>
      <th class="right header">&nbsp;</th>
    </tr>
  </thead>
  <tbody>
    <tr class="row">
      <td class="left alternate">&nbsp;Genre</td>
      <td class="right alternate">{anime.genre} &nbsp;</td>
    </tr>
    <tr class="row">
      <td class="left">&nbsp;Aired</td>
      <td class="right">{anime.aired} &nbsp;</td>
    </tr>
    <tr class="row">
      <td class="left alternate">&nbsp;Episodes</td>
      <td class="right alternate">{anime.episodes} &nbsp;</td>
    </tr>
    <tr class="row">
      <td class="left">&nbsp;Members</td>
      <td class="right">{anime.members} people &nbsp;</td>
    </tr>
  </tbody>
</table>

<!-- Table for Popularity -->
<table>
  <colgroup>
    <col />
    <col />
  </colgroup>
  <thead>
    <tr class="row">
      <th class="left header">&nbsp;</th>
      <th class="right header">&nbsp;</th>
    </tr>
  </thead>
  <tbody>
    <tr class="row">
      <td class="left">&nbsp;Popularity</td>
      <td class="right">{anime.popularity} &nbsp;</td>
    </tr>
    <tr class="row">
      <td class="left alternate">&nbsp;Ranked</td>
      <td class="right alternate">{anime.ranked} &nbsp;</td>
    </tr>
    <tr class="row">
      <td class="left">&nbsp;Score</td>
      <td class="right">{anime.score} &nbsp;</td>
    </tr>
    <tr class="row">
      <td class="left alternate">&nbsp;Season</td>
      <td class="right alternate">{anime.premiered} &nbsp;</td>
    </tr>
  </tbody>
</table>

</div>

<style>
  #informationTable {
    display: flex;
    flex-direction: row;
    gap: 10px;
    position: absolute;
    width: 95%;
    padding-left: 2.5%;
    padding-right: 2.5%;
  }

  table {
    width: 50%; /* Set the table's width to 100% */
    font-family: "DM Sans";
    font-weight: bold;
    font-size: 0.55rem;
    border-collapse: collapse;
  }

  td {
  height: 3em; /* Adjust this value as needed */
  max-width: 40px; /* Adjust this value as needed */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; /* Add this line */
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
    padding: 0.15rem 0;
  }
  .alternate {
    background-color: #061e3a;
  }
</style>
