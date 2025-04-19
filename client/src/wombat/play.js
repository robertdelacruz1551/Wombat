/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react'
import { CCol, CRow, CButton } from '@coreui/react'
import { Board } from 'src/components'
import { useNavigate, useParams } from 'react-router-dom'
import { CIcon } from '@coreui/icons-react'
import { CCard, CCardHeader, CCardBody } from '@coreui/react'

import {
  cilArrowCircleBottom,
  cilArrowCircleLeft,
  cilArrowCircleRight,
  cilArrowCircleTop,
  cilXCircle,
  cilBoltCircle,
  cilLoopCircular,
} from '@coreui/icons'

const MapPlay = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [instructions, setInstructions] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [readyToRun, setReadyToRun] = useState(true)
  const [success, setSuccess] = useState(false)
  const [board, setBoard] = useState({
    layout: [],
    start: [0,0],
    end: [0,0],
    current: [0,0],
    obstacles: 6,
  })
  let timespent = 0

  const handleMoveClick = (ikon, coordinates) => {
    const move = {icon: ikon, coordinates: coordinates}
    setInstructions([...instructions, move])
  }

  const handleUpClick = () => {
    handleMoveClick(cilArrowCircleTop, [-1,  0])
  }
  
  const handleLeftClick = () => {
    handleMoveClick(cilArrowCircleLeft, [0, -1])
  }
  
  const handleRightClick = () => {
    handleMoveClick(cilArrowCircleRight, [0, 1])
  }
  
  const handleDownClick = () => {
    handleMoveClick(cilArrowCircleBottom, [1, 0])
  }
  
  const handleRemoveClick = () => {
    if (instructions.length > 0) {
      instructions.pop()
      setInstructions([...instructions])
    }
  }
  
  const handleRefresh = () => {
    for (let r = 0; r < board.layout.length; r++) {
      for (let c = 0; c < board.layout[r].length; c++) {
        let cell = board.layout[r][c].at(-1)
        if (cell === -2 || cell === 1) { // walked path
          board.layout[r][c].pop()
          if (r === board.start[0] && c === board.start[1]) {
            board.layout[r][c].push(1)
          }
        }
      }
    }
    board.current = [...board.current]
    setBoard({
      ...board,
      layout: [...board.layout.map(row => [...row])],
      current: [...board.start],
    })
    setInstructions([])
    setReadyToRun(true)
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handlePlay = async () => {
    setReadyToRun(false)
    const startTime = Date.now()
    for (let i = 0; i < instructions.length; i++) {
      try {
        const step = instructions[i].coordinates
        const curr = board.current
        const move = [curr[0] + step[0], curr[1] + step[1]]
        if (move[0] >= 0 && move[1] >= 0 && move[0] < board.layout.length && move[1] < board.layout[0].length) { // check for move within the board)
          if (board.layout[move[0]][move[1]].at(-1) !== -1) { // not an obstacle
            board.layout[curr[0]][curr[1]].pop()
            board.layout[curr[0]][curr[1]].push(-2)
            board.layout[move[0]][move[1]].push( 1)
            board.current = move
            if (i === instructions.length - 1) { // check if winner
              setSuccess((board.end[0] === move[0] && board.end[1] === move[1]))
              timespent = (Date.now() - startTime) / 1000
              save()
            }
            setBoard({
              ...board,
              layout: [...board.layout.map(row => [...row])],
              current: [...move],
            })
            await sleep(1042)
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  const load = async () => {
    const response = await fetch(`http://localhost:4000/authenticated/play/${id}`, {
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
      setBoard(data.board)
    } else {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }

  const save = async () => {
    await fetch('http://localhost:4000/authenticated/simulation-save', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        user: Number(localStorage.getItem('user')),
        map: title,
        time: `${timespent} seconds`,
        obstacles: board.obstacles,
        steps: instructions.length,
        success: success,
      }),
    })
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CCol xs={6}>
                <h2>{title}</h2>
                <p>{description}</p>
              </CCol>
              <CCol sx={6}>
                <h3>{success? "Success" : ""}</h3>
              </CCol>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <br></br>
      <CRow>
        <CCol xs={4}>
          <CCard>
            <CCardHeader>
              <CButton color="primary" className="rounded-pill" onClick={handleLeftClick} disabled = {!readyToRun}>
                <CIcon icon={cilArrowCircleLeft} size="md" />
              </CButton>
              <CButton color="primary" className="rounded-pill" onClick={handleUpClick} disabled = {!readyToRun}>
                <CIcon icon={cilArrowCircleTop} size="md" />
              </CButton>
              <CButton color="primary" className="rounded-pill" onClick={handleDownClick} disabled = {!readyToRun}>
                <CIcon icon={cilArrowCircleBottom} size="md" />
              </CButton>
              <CButton color="primary" className="rounded-pill" onClick={handleRightClick} disabled = {!readyToRun}>
                <CIcon icon={cilArrowCircleRight} size="md" />
              </CButton>
              <CButton color="danger" className="rounded-pill" onClick={handleRemoveClick} disabled = {!readyToRun}>
                <CIcon icon={cilXCircle} size="md" />
              </CButton>
              <CButton color="success" className="rounded-pill" onClick={handlePlay} disabled = {!readyToRun}>
                <CIcon icon={cilBoltCircle} size="md" />
              </CButton>
              <CButton color="info" className="rounded-pill" onClick={handleRefresh} disabled = {readyToRun}>
                <CIcon icon={cilLoopCircular} size="md" />
              </CButton>
            </CCardHeader>
            <CCardBody>
              {instructions.map((move, i) => (
                <CIcon
                  icon={move.icon}
                  size="xl"
                />
              ))}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={8}>
          <CCard>
            <CCardBody>
              <Board layout={board.layout} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default MapPlay
