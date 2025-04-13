/* eslint-disable react/jsx-key */
import React from 'react'
import { CCol, CRow } from '@coreui/react'
import { Board } from 'src/components'

const MapDetails = () => {
  const data = {
    board: {
      layout: [
        ['hero-background', 'grass-path-background', 'grass-path-background'],
        ['grass-path-background', 'rock-wall-background', 'grass-path-background'],
        ['grass-path-background', 'grass-path-background', 'grass-path-background'],
      ],
    },
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <h1>{'Simple board game'}</h1>
          <br />
          <p>A small map designed to introduce the application to the player </p>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <Board layout={data.board.layout} />
        </CCol>
      </CRow>
    </>
  )
}

export default MapDetails
