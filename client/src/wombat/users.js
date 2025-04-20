/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'

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

const Users = () => {
  const [users, setUsers] = useState([])

  const load = async () => {
    try {
      const response = await fetch('http://localhost:4000/authenticated/administrator/users', {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error users page load:' + error)
    }
  }

  const updateUserStatus = (id) => {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1) {
      let user = users[index]
      user.status = user.status === 'Active'? 'Deactivated': 'Active'
      users[index] = user
      setUsers([...users])
    }
  }

  const handleStatusChange = async (event) => {
    try {
     const response = await fetch('http://localhost:4000/authenticated/administrator/user-status-change', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          id: event.target.dataset.user,
          status: event.target.dataset.status,
        })
      })
      if (response.ok) {
        updateUserStatus(event.target.dataset.user)
      }
    } catch (error) {
      console.error('Error updating user status:' + error)
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
                Users
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
                  <CTableHeaderCell className="bg-body-tertiary">Email</CTableHeaderCell>
                  <CTableHeaderCell className="bg-body-tertiary">Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {users.map((user, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-left">
                        <CButton color="primary" size="sm" data-user={user.id} data-status={user.status} onClick={handleStatusChange}>
                          Update status
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell className="text-left">{user.name}</CTableDataCell>
                      <CTableDataCell className="text-left">{user.email}</CTableDataCell>
                      <CTableDataCell className="text-left">{user.status}</CTableDataCell>
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

export default Users
