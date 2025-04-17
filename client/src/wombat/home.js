/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsB,
  CButton,
} from '@coreui/react'

const Dashboard = () => {
  const [data, setData] = useState({
    stats: {
      simulations: {value: '0', progress: 12},
      successful: {value: '0', progress: 12},
      times: {value: '0', progress: 12},
    },
    routines: [],
    maps: []
  })
  
  const load = async () => {
    // event.preventDefault()
    try {
      const response = await fetch('http://localhost:4000/authenticated/home', {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setData(data)
      } else {
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Error during login:' + error)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <CRow>
        <CCol xs={6}>
          <CWidgetStatsB
            className="mb-3"
            color="success"
            inverse
            progress={{ value: data.stats.simulations.progress }}
            text="Progress"
            title="Simulations"
            value={data.stats.simulations.value}
          />
        </CCol>
        <CCol xs={3}>
          <CWidgetStatsB
            className="mb-3"
            color="primary"
            inverse
            progress={{ value: data.stats.successful.progress }}
            text="Progress"
            title="Successful simulations"
            value={data.stats.successful.value}
          />
        </CCol>
        <CCol xs={3}>
          <CWidgetStatsB
            className="mb-3"
            color="primary"
            inverse
            progress={{ value: data.stats.times.progress }}
            text="Progress"
            title="Best time"
            value={data.stats.times.value}
          />
        </CCol>
      </CRow>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <h4 id="traffic" className="card-title mb-0">
                Maps
              </h4>
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol sm={12} className="d-none d-md-block">
              <CTable align="moddle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary"></CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Name</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Description</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Obstacles</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Size</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.maps.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-left">
                        <Link to={`map/${item.id}`}>
                          <CButton color="primary" size="sm">
                            Play
                          </CButton>
                        </Link>
                      </CTableDataCell>
                      <CTableDataCell className="text-left">{item.name}</CTableDataCell>
                      <CTableDataCell className="text-left">{item.description}</CTableDataCell>
                      <CTableDataCell className="text-left">{item.obstacles}</CTableDataCell>
                      <CTableDataCell className="text-left">{item.size}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={12}>
              <h4 id="traffic" className="card-title mb-0">
                Routines
              </h4>
            </CCol>
          </CRow>
          <br />
          <CRow>
            <CCol sm={12} className="d-none d-md-block">
              <CTable align="moddle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">Name</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Time</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Obstacle</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Steps</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">
                      Latest Simulation
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.routines.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-left">{item.name}</CTableDataCell>
                      <CTableDataCell className="text-left">{item.time}</CTableDataCell>
                      <CTableDataCell className="text-left">{item.obstacle}</CTableDataCell>
                      <CTableDataCell className="text-left">{item.steps}</CTableDataCell>
                      <CTableDataCell className="text-left">{item.latestRun}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
