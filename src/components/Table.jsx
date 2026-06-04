import React from 'react'
import "../styles/Table.css";

export default function Table({ anime }) {
  return (
    <div className="info-table">
      <table>
        <caption className="visually-hidden">Stats for {anime.title}</caption>
        <colgroup>
          <col />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row" className="info-table__cell--left">Ranked:</th>
            <td className="info-table__cell--right">#{anime.ranked} &nbsp;</td>
          </tr>
          <tr>
            <th scope="row" className="info-table__cell--left">Score:</th>
            <td className="info-table__cell--right">{anime.score} / 10 &nbsp;</td>
          </tr>
          <tr>
            <th scope="row" className="info-table__cell--left">Popularity:</th>
            <td className="info-table__cell--right">{anime.popularity} &nbsp;</td>
          </tr>
          <tr>
            <th scope="row" className="info-table__cell--left">Episodes:</th>
            <td className="info-table__cell--right">{anime.episodes} &nbsp;</td>
          </tr>
          <tr>
            <th scope="row" className="info-table__cell--left">First Aired:</th>
            <td className="info-table__cell--right">{anime.aired} &nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
