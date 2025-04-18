/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { CCol, CRow, CButton } from '@coreui/react'
import { Board } from 'src/components'
import { Link, useNavigate, useParams } from 'react-router-dom'

const MapDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState({
    title: undefined,
    description: undefined,
    board: { layout: [] },
  })

  const load = async () => {
    const response = await fetch(`http://localhost:4000/authenticated/map/${id}`, {
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
        <CCol xs={12}>
          <h1>{data.title}</h1>
          <br />
          <p>{data.description}</p>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <Link to={`/map/${id}/play`}>
            <CButton color="primary" size="sm">
              Play
            </CButton>
          </Link>
        </CCol>
      </CRow>
      <br></br>
      <CRow>
        <CCol xs={12}>
          <Board layout={data.board.layout} />
        </CCol>
      </CRow>
    </>
  )
}

export default MapDetails
