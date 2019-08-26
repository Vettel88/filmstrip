import { Meteor } from 'meteor/meteor'
import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { TextField, Button, Typography, Grid, GridCell } from 'rmwc'
import { prepareResponseView } from './ResponseCommon.jsx'
import { ResponseSave } from '/imports/methods/Response.js'
import { ResponseQuestion } from './ResponseQuestion.jsx'
import { ResponseAnswer } from './ResponseAnswer.jsx'
import { StickyNav } from '../Forms.jsx'
import styled from 'styled-components'

const StyledGridCell = styled(GridCell)`
  background: white;
`
export const ResponseQuestionnaire = prepareResponseView(({ filmstrip, t, email, history }) => {

  useEffect(() => {
    document.body.classList.add('fullWidth')
    return function cleanup() {
      document.body.classList.remove('fullWidth')
    }
  })

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [toFinish, setToFinish] = useState(false)
  const [createdFilmstripId, setCreatedFilmstripId] = useState(false)

  const prevQuestion = (event) => {
    event.preventDefault()
    setCurrentFrameIndex(currentFrameIndex - 1)
  }

  const nextQuestion = (event) => {

    event.preventDefault()

    if (currentFrameIndex === filmstrip.frames.length - 1) {

      const frames = filmstrip.frames.map(frame => {

        return Object.assign({
          no: frame.no,
          responseToFrameId: frame._id,
          responseToFilmstripId: filmstrip._id
        }, JSON.parse(localStorage.getItem(frame._id)))

      })

      ResponseSave.call({
        filmstrip: {
          responseToFilmstripId: filmstrip._id,
          name: filmstrip.name,
          email
        },
        frames
      }, (err, res) => {
        if (err) console.error(err)
        else {
          setCreatedFilmstripId(res)
          setToFinish(true)
        }
      })

    }
    else {
      setCurrentFrameIndex(currentFrameIndex + 1)
    }

  }

  const frames = filmstrip.frames
  const currentFrame = frames[currentFrameIndex]

  if (toFinish === true) {
    const url = `/a/${filmstrip._id}/${btoa(email)}/${createdFilmstripId}/finish`
    return <Redirect push to={url} />
  }

  return (
    <>
      <Grid style={{ paddingBottom: '72px' }}>
        <GridCell span={12}>
          <Typography use='headline5' tag='h5'>
            {filmstrip.name || 'Untitled Filmstrip'}
          </Typography>
       </GridCell>
        <GridCell desktop={6} tablet={4} phone={4}>
          <ResponseQuestion currentFrame={currentFrame} filmstrip={filmstrip} currentFrameIndex={currentFrameIndex} t={t} />
        </GridCell>
        <StyledGridCell desktop={6} tablet={4} phone={4}>
          <ResponseAnswer key={currentFrame._id} currentFrame={currentFrame} filmstrip={filmstrip} currentFrameIndex={currentFrameIndex} t={t} history={history} email={email} />
        </StyledGridCell>
      </Grid>
      <StickyNav
        index={currentFrameIndex}
        max={frames.length}
        prevTitle={t('Response.PrevQuestion')}
        nextTitle={t('Response.NextQuestion')}
        finishTitle={t('Response.Finish')}
        onPrevious={prevQuestion}
        onNext={nextQuestion}
      />
    </>
  )

}

)