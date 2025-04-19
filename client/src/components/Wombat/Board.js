/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

const Board = ({ layout }) => {
  //  /** walkable-space, obstacle-space, start-space, end-space */
  const creatBackground = (cell) => {
    let klass = 'grass-path-background'
    let c = cell.at(-1)
    switch (c) {
      case -2:
        klass = 'traveled-background'
        break;
      case -1:
        klass = 'rock-wall-background'
        break;
      case  1:
        klass = 'hero-background'
        break;
      case  2:
        klass = 'start-background'
        break;
      case  3:
        klass = 'end-background'
        break;
      default:
        break;
    }
    return klass
  }

  const Row = ({ row, _ }) => {
    return (
      <tr>
        {row.map((cell, cellIndex) => (
          <td 
            key={cellIndex} 
            className={creatBackground(cell)}
          ></td>
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
