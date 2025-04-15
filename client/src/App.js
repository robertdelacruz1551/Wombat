import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./wombat/Login'))
const Register = React.lazy(() => import('./wombat/Register'))
const Page404 = React.lazy(() => import('./wombat/Page404'))
const Page500 = React.lazy(() => import('./wombat/Page500'))

// Mock authentication function
const isAuthenticated = () => {
  // Replace this with your actual authentication logic
  return !!localStorage.getItem('token')
}

// Protected route component
const RouteGuard = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="login" />
}

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route
            path="*"
            name="Home"
            element={
              <RouteGuard>
                <DefaultLayout />
              </RouteGuard>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
