import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCalculator, cilCursor, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Wombat',
  },
  {
    component: CNavItem,
    name: 'Home',
    to: '/home',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'My Profile',
    to: '/profile',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Administrator',
    to: '/administrator',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Users',
        to: '/administrator/users',
      },
      {
        component: CNavItem,
        name: 'Maps',
        to: '/administrator/maps',
      },
    ],
  },
]

export default _nav
