import React from 'react'
import "../styles/Table.css";

export default function Table({ anime }) {
  return (
    <div className="informationTable">
      <table>
        <colgroup><col /><col /></colgroup>
        <tbody>
          <tr className="row">
            <td className="left alternate">&nbsp;&nbsp;Genre</td>
            <td className="right alternate">{anime.genre} &nbsp;</td>
          </tr>
          <tr className="row">
            <td className="left">&nbsp;&nbsp;Aired</td>
            <td className="right">{anime.aired} &nbsp;</td>
          </tr>
          <tr className="row">
            <td className="left alternate">&nbsp;&nbsp;Episodes</td>
            <td className="right alternate">{anime.episodes} &nbsp;</td>
          </tr>
          <tr className="row">
            <td className="left">&nbsp;&nbsp;Members</td>
            <td className="right">{anime.members} &nbsp;</td>
          </tr>
        </tbody>
      </table>
      <table>
        <colgroup><col /><col /></colgroup>
        <tbody>
          <tr className="row">
            <td className="left">&nbsp;&nbsp;Popularity</td>
            <td className="right">{anime.popularity} &nbsp;</td>
          </tr>
          <tr className="row">
            <td className="left alternate">&nbsp;&nbsp;Ranked</td>
            <td className="right alternate">{anime.ranked} &nbsp;</td>
          </tr>
          <tr className="row">
            <td className="left">&nbsp;&nbsp;Score</td>
            <td className="right">{anime.score} &nbsp;</td>
          </tr>
          <tr className="row">
            <td className="left alternate">&nbsp;&nbsp;Season</td>
            <td className="right alternate">{anime.premiered} &nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
