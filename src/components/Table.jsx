import React from 'react'
import "../styles/Table.css";

export default function Table({ anime }) {
  return (
    <div className="info-table">
      <table>
        <colgroup>
          <col />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <td className="info-table__cell--left">Ranked:</td>
            <td className="info-table__cell--right">#{anime.ranked} &nbsp;</td>
          </tr>
          <tr>
            <td className="info-table__cell--left">Score:</td>
            <td className="info-table__cell--right">{anime.score} / 10 &nbsp;</td>
          </tr>
          <tr>
            <td className="info-table__cell--left">Popularity:</td>
            <td className="info-table__cell--right">{anime.popularity} &nbsp;</td>
          </tr>
          <tr>
            <td className="info-table__cell--left">Episodes:</td>
            <td className="info-table__cell--right">{anime.episodes} &nbsp;</td>
          </tr>
          <tr>
            <td className="info-table__cell--left">First Aired:</td>
            <td className="info-table__cell--right">{anime.aired} &nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
