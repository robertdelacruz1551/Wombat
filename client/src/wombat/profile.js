import React from 'react'
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
                <CFormInput id="fullname" />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="email">email</CFormLabel>
                <CFormInput type="email" id="email" placeholder="name@example.com" />
              </div>
              <div className="mb-3">
                <CFormLabel htmlFor="bio">Bio</CFormLabel>
                <CFormTextarea id="bio" rows={3}></CFormTextarea>
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
