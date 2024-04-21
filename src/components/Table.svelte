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
  <tbody>
    <tr class="row">
      <td class="left alternate">&nbsp;&nbsp;Genre</td>
      <td class="right alternate">{anime.genre} &nbsp;</td>
    </tr>
    <tr class="row">
      <td class="left">&nbsp;&nbsp;Aired</td>
      <td class="right">{anime.aired} &nbsp;</td>
    </tr>
    <tr class="row">
      <td class="left alternate">&nbsp;&nbsp;Episodes</td>
      <td class="right alternate">{anime.episodes} &nbsp;</td>
    </tr>
    <tr class="row">
      <td class="left">&nbsp;&nbsp;Members</td>
      <td class="right">{anime.members} &nbsp;</td>
    </tr>
  </tbody>
</table>

<!-- Table for Popularity -->
<table>
  <colgroup>
    <col />
    <col />
  </colgroup>
  <tbody>
    <tr class="row">
      <td class="left">&nbsp;&nbsp;Popularity</td>
      <td class="right">{anime.popularity} &nbsp;</td>
    </tr>
    <tr class="row">
      <td class="left alternate">&nbsp;&nbsp;Ranked</td>
      <td class="right alternate">{anime.ranked} &nbsp;</td>
    </tr>
    <tr class="row">
      <td class="left">&nbsp;&nbsp;Score</td>
      <td class="right">{anime.score} &nbsp;</td>
    </tr>
    <tr class="row">
      <td class="left alternate">&nbsp;&nbsp;Season</td>
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
      border-collapse: separate; 
  border-spacing: 0 5px;
  }

  td {
  height: 1.75rem; /* Adjust this value as needed */
  max-width: 40px; /* Adjust this value as needed */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; /* Add this line */
  color: #d9d9d9; /* Change the text color for non-header cells to red */
    border: none; /* Remove cell borders */
    /* padding: 0.15rem 0; */
    font-size: 0.75rem;
    background-color: #020b14;
    color: #c5d1eb;
}


  .left {
    text-align: left; /* Left-align the text in the left column */
    border-radius: 10px 0 0 10px;
    font-weight: bolder;
  }
  .right {
    text-align: right; /* Right-align the text in the right column */
    border-radius: 0 10px 10px 0;
    padding-right: 2px;
  }
  .header {
    color: #031121;
  }

  /* .alternate {
    background-color: #020b14;
  } */
</style>
