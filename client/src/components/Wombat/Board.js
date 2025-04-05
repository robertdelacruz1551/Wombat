/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

const Board = ({ layout }) => {
  const Row = ({ row, rowIndex }) => {
    return (
      <tr>
        {row.map((cell, cellIndex) => (
          <td key={cellIndex} className={cell}></td>
        ))}
      </tr>
    )
  }

  return (
    <table className="gameboard">
      <tbody>
        {layout.map((row, rowIndex) => (
          <Row key={rowIndex} row={row} rowIndex={rowIndex} />
        ))}
      </tbody>
    </table>
  )
}

Board.propTypes = {
  layout: PropTypes.array,
}

export default React.memo(Board)
