/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

const Board = ({ layout }) => {
  //  /** walkable-space, obstacle-space, start-space, end-space */
  // const layout_ = [
  //   [
  //     {
  //       type: 'walkable-space',
  //     }
  //   ]
  // ]

  const Row = ({ row, _ }) => {
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
  // editing: PropTypes.bool,
}

export default React.memo(Board)
