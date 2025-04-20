/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilOptions } from '@coreui/icons'

const Board = ({ layout, editing, onLayoutUpdate }) => {
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

  const updateCellType = (event) => {
    const r = event.target.dataset.row
    const c = event.target.dataset.col
    const type = Number(event.target.dataset.type)
    let newLayout = [...layout.map(row => [...row])]
    if (type === 2 || type === 3) {
      for (let a = 0; a < newLayout.length; a++) {
        for (let b = 0; b < newLayout[a].length; b++) {
          if (newLayout[a][b].at(-1) === type) {
            for (let z = newLayout[a][b].length - 1; z > 0 ; z--) {
              newLayout[a][b].pop()
            }
          }
        }
      }
    }
    newLayout[r][c].push(type)
    onLayoutUpdate(newLayout)
  }

  const Cell = ({ r, c, cell }) => {
    const klass = creatBackground(cell)
    return <td key={c} data-row={r} data-col={c} className={klass}></td>
  } 

  const CellEditing = ({ r, c, cell }) => {
    const klass = creatBackground(cell)
    return (
      <td key={c} data-row={r} data-col={c} className={klass}>
        <CDropdown>
          <CDropdownToggle color="transparent" caret={false} className="p-0">
            <CIcon icon={cilOptions} className="text-white" />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem data-row={r} data-col={c} data-type={ 2} onClick={updateCellType}>Is Start</CDropdownItem>
            <CDropdownItem data-row={r} data-col={c} data-type={ 0} onClick={updateCellType}>Grass</CDropdownItem>
            <CDropdownItem data-row={r} data-col={c} data-type={-1} onClick={updateCellType}>Obstacle</CDropdownItem>
            <CDropdownItem data-row={r} data-col={c} data-type={ 3} onClick={updateCellType}>Is End</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </td>
    )
  }

  const Row = ({ row, r }) => {
    return (
      <tr>
        {row.map((cell, c) => (
          editing? <CellEditing key={c} r={r} c={c} cell={cell} /> : <Cell key={c} r={r} c={c} cell={cell} />
        ))}
      </tr>
    )
  }

  return (
    <table className="gameboard">
      <tbody>
        {layout.map((row, r) => (
          <Row key={r} row={row} r={r} />
        ))}
      </tbody>
    </table>
  )
}

Board.propTypes = {
  layout: PropTypes.array,
  editing: PropTypes.bool = false,
  onLayoutUpdate: PropTypes.func,
}

export default React.memo(Board)
