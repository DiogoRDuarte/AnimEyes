import React from 'react'
import "../styles/Table.css";

export default function Table({ anime }) {
  return (
    <div className="informationTable">
      <table>
        <colgroup>
          <col />
          <col />
        </colgroup>
        <tbody>
          <tr className="row">
            <td className="left">First Aired</td>
            <td className="right">{anime.aired} &nbsp;</td>
          </tr>
          <tr className="row">
            <td className="left alternate">Episodes</td>
            <td className="right alternate">{anime.episodes} &nbsp;</td>
          </tr>
          <tr className="row">
            <td className="left">Popularity</td>
            <td className="right">{anime.popularity} &nbsp;</td>
          </tr>
          <tr className="row">
            <td className="left alternate">Ranked</td>
            <td className="right alternate">{anime.ranked} &nbsp;</td>
          </tr>
          <tr className="row">
            <td className="left">Score</td>
            <td className="right">{anime.score} &nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
