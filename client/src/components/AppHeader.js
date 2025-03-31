import React, { useEffect, useRef } from 'react'
import { CContainer, CHeader } from '@coreui/react'

const AppHeader = () => {
  const headerRef = useRef()

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid></CContainer>
    </CHeader>
  )
}

export default AppHeader
