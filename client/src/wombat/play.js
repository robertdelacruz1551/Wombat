/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { CCol, CRow, CButton } from '@coreui/react'
import { Board } from 'src/components'
import { useNavigate, useParams } from 'react-router-dom'
import { CListGroup, CListGroupItem } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'
import { CBadge } from '@coreui/react'

import {
  cilArrowCircleBottom,
  cilArrowCircleLeft,
  cilArrowCircleRight,
  cilArrowCircleTop,
  cilXCircle,
  cilBoltCircle,
} from '@coreui/icons'

const MapPlay = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [instructions, setInstructions] = useState([])
  const [data, setData] = useState({
    title: undefined,
    description: undefined,
    board: {
      layout: []
    },
  })

  const handleMoveClick = (ikon, coordinates) => {
    const move = {icon: ikon, coordinates: coordinates}
    setInstructions([...instructions, move])
  }

  const handleUpClick = () => {
    handleMoveClick(cilArrowCircleTop, [1,  0])
  }
  const handleLeftClick = () => {
    handleMoveClick(cilArrowCircleLeft, [0, -1])
  }
  const handleRightClick = () => {
    handleMoveClick(cilArrowCircleRight, [0, 1])
  }
  const handleDownClick = () => {
    handleMoveClick(cilArrowCircleBottom, [-1, 0])
  }
  const handleRemoveClick = () => {
    if (instructions.length > 0) {
      instructions.pop()
      setInstructions([...instructions])
    }
  }

  const handlePlay = () => {

  }

  const load = async () => {
    const response = await fetch(`http://localhost:4000/authenticated/play/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      setData(data)
    } else {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <h2>{data.title}</h2>
              <p>{data.description}</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <br></br>
      <CRow>
        <CCol xs={3}>
          <CCard>
            <CCardHeader>
              <CButton color="primary" className="rounded-pill" onClick={handleUpClick}>
                <CIcon icon={cilArrowCircleTop} size="md" />
              </CButton>
              <CButton color="primary" className="rounded-pill" onClick={handleLeftClick}>
                <CIcon icon={cilArrowCircleLeft} size="md" />
              </CButton>
              <CButton color="primary" className="rounded-pill" onClick={handleRightClick}>
                <CIcon icon={cilArrowCircleRight} size="md" />
              </CButton>
              <CButton color="primary" className="rounded-pill" onClick={handleDownClick}>
                <CIcon icon={cilArrowCircleBottom} size="md" />
              </CButton>
              <CButton color="danger" className="rounded-pill" onClick={handleRemoveClick}>
                <CIcon icon={cilXCircle} size="md" />
              </CButton>
              <CButton color="success" className="rounded-pill">
                <CIcon icon={cilBoltCircle} size="md" />
              </CButton>
            </CCardHeader>
            <CCardBody>
              {instructions.map((move, i) => (
                <CIcon
                  icon={move.icon}
                  size="xl"
                />
              ))}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={9}>
          <CCard>
            <CCardBody>
              <Board layout={data.board.layout} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default MapPlay
