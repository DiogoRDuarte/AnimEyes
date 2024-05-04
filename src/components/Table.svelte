<script>
  export let anime;

  import { fade } from "svelte/transition";
</script>

<div id="informationTable" class={"table" + anime.uid} in:fade>
<!-- Left Table -->
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

<!-- Right Table -->
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
    width: 50%;
    font-weight: bold;
    font-size: 0.55rem;
    border-collapse: separate; 
    border-spacing: 0 5px;
    font-family: "DMSans";
  }

  td {
  height: 1.75rem;
  max-width: 40px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #d9d9d9;
    border: none;
    font-size: 0.75rem;
    background-color: #020b14;
    color: #c5d1eb;
}


  .left {
    text-align: left;
    border-radius: 10px 0 0 10px;
    font-weight: bolder;
  }
  .right {
    text-align: right;
    border-radius: 0 10px 10px 0;
    padding-right: 2px;
  }
  .header {
    color: #031121;
  }
</style>
