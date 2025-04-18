/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from '@coreui/react'

const MyProfile = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const navigate = useNavigate()

  const load = async () => {
    try {
      const response = await fetch('http://localhost:4000/authenticated/profile', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          id: localStorage.getItem('user')
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setName(data.name)
        setEmail(data.email)
        setBio(data.bio)
      } else {
        localStorage.removeItem('token')
        navigate('../login')
      }
    } catch (error) {
      console.error('Error during login:' + error)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-6">
          <CCardHeader>
            <strong>User Profile</strong>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              Use this form to edit your personal information.
            </p>
            <CForm>
              <div className="mb-3">
                <CFormLabel htmlFor="fullname">Full name</CFormLabel>
                <CFormInput 
                  id="fullname" 
                  value={name}
                  onChange={setName}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="email">email</CFormLabel>
                <CFormInput 
                  type="email" 
                  id="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={setEmail}
                />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="bio">Bio</CFormLabel>
                <CFormTextarea 
                  id="bio" 
                  rows={3}
                  value={bio}
                  onChange={setBio}
                ></CFormTextarea>
              </div>
              <div className="col-auto">
                <CButton color="primary" type="submit" className="mb-3">
                  Save
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default MyProfile
