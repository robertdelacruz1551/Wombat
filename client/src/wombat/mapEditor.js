/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import {
  CCol,
  CRow,
  CButton,
  CFormLabel,
  CFormTextarea,
  CFormInput,
  // CInputGroup,
  CButtonGroup,
  CInputGroupText,
} from '@coreui/react'
import { Board } from 'src/components'
import {
  // Link,
  // useNavigate,
  useParams
} from 'react-router-dom'

const MapEditor = () => {
  const { id } = useParams()
  const [rows, setRows] = useState(1)
  const [cols, setCols] = useState(1)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [layout, setLayout] = useState([])
  // const [start, setStart] = useState([0, 0])
  // const [end, setEnd] = useState([0, 0])
  // const [obstacles, setObstacles] = useState(0)

  const load = async () => {
    const url = `http://localhost:4000/authenticated/administrator/maps/editor/${id}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      setTitle(data.title)
      setDescription(data.description)
      setLayout(data.board.layout)
      // setStart(data.board.start)
      // setEnd(data.board.end)
      // setObstacles(data.board.obstacles)
      setRows(data.board.layout.length)
      setCols(data.board.layout[0].length)
    }
  }

  const findNumberOfObstacles = () => {
    let obs = 0
    for (let r = 0; r < layout.length; r++) {
      for (let c = 0; c < layout[r].length; c++) {
        if (layout[r][c].at(-1) === -1) {
          obs++
        }
      }
    } 
    return obs
  }

  const findPosition = (type) => {
    for (let r = 0; r < layout.length; r++) {
      for (let c = 0; c < layout[r].length; c++) {
        if (layout[r][c].at(-1) === type) {
          return [r, c]
        }
      }
    } 
    return [0, 0]
  }

  const save = async () => {
    const url = `http://localhost:4000/authenticated/administrator/maps/editor/${id}`
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        id: id,
        title: title,
        description: description,
        board: {
          layout: [...layout],
          start: findPosition(2),
          end: findPosition(3),
          current: findPosition(2),
          obstacles: findNumberOfObstacles()
        }
      })
    })
  }

  const handleTitleChange = (event) => {
    const newTitle = event.target.value 
    setTitle(newTitle)
  }

  const handleDescriptionChange = (event) => {
    const newDescription = event.target.value
    setDescription(newDescription)
  }

  const handleUpdateLayout = (R, C) => {
    const newLayout = []
    for (let r = 0; r < R; r++) {
      newLayout.push([])
      for (let c = 0; c < C; c++) {
        try {
          newLayout[r].push([...layout[r][c]])
        } catch (error) {
          newLayout[r].push([0])
        }
      }
    }
    setLayout(newLayout)
  }

  const incCols = () => {
    const num = cols + 1
    if (num <= 10) {
      setCols(num)
      handleUpdateLayout(rows, num)
    }
  }

  const decCols = () => {
    const num = cols - 1
    if (num > 0) {
      setCols(num)
      handleUpdateLayout(rows, num)
    }
  }

  const incRows = () => {
    const num = rows + 1
    if (num <= 10) {
      setRows(num)
      handleUpdateLayout(num, cols)
    }
  }

  const decRows = () => {
    const num = rows - 1
    if (num > 0) {
      setRows(num)
      handleUpdateLayout(num, cols)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <CRow>
        <CCol xs={3}>
          <CCol className="mb-3">
            <CFormLabel htmlFor="title">Title</CFormLabel>
            <CFormInput
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
            />
          </CCol>
          <CCol className="mb-3">
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormTextarea
              id="description"
              rows={3}
              value={description}
              onChange={handleDescriptionChange}
            ></CFormTextarea>
          </CCol>
          <CCol>
            <CButtonGroup horizontal role="group" aria-label="Rows">
              <CInputGroupText as="label" htmlFor="rows">
                Rows
              </CInputGroupText>
              <CButton color="primary" onClick={decRows}>-</CButton>
              <CButton color="primary" onClick={incRows}>+</CButton>
              <CInputGroupText as="label" htmlFor="rows">{rows}</CInputGroupText>
            </CButtonGroup>
            <br></br>
            <br></br>
            <CButtonGroup horizontal role="group" aria-label="Columns">
              <CInputGroupText as="label" htmlFor="cols">
                Cols
              </CInputGroupText>
              <CButton color="primary" onClick={decCols}>-</CButton>
              <CButton color="primary" onClick={incCols}>+</CButton>
              <CInputGroupText as="label" htmlFor="cols">{cols}</CInputGroupText>
            </CButtonGroup>
            
          </CCol>
          <br></br>
          <CCol>
            <CButton color="primary" type="submit" className="mb-3" onClick={save}>Save</CButton>
          </CCol>
        </CCol>

        <CCol xs={9}>
          <br></br>
          <Board editing={true} layout={layout} onLayoutUpdate={(newLayout) => { setLayout(newLayout) }}/>
        </CCol>
      </CRow>
    </>
  )
}

export default MapEditor
