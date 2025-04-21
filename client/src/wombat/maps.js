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
  CButton,
} from '@coreui/react'

const Maps = () => {
  const [maps, setMaps] = useState([])

  const load = async () => {
    try {
      const response = await fetch('http://localhost:4000/authenticated/administrator/maps', {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMaps(data)
      }
    } catch (error) {
      console.error('Error maps page load:' + error)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
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
                    <CTableHeaderCell className="bg-body-tertiary">
                      <Link to={`/map/0/editor`}>
                        <CButton color="primary" size="sm">
                          New
                        </CButton>
                      </Link>
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Title</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Description</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {maps.map((mapp, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-left">
                        <Link to={`/map/${mapp.id}/editor`}>
                          <CButton color="primary" size="sm">
                            Update
                          </CButton>
                        </Link>
                      </CTableDataCell>
                      <CTableDataCell className="text-left">{mapp.title}</CTableDataCell>
                      <CTableDataCell className="text-left">{mapp.description}</CTableDataCell>
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

export default Maps
