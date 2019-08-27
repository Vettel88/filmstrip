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
export const ResponseQuestionnaire = prepareResponseView(({
  t,
  filmstrip,
  frame,
  email,
  emailBase64,
  currentFrameIndex,
  history
}) => {

  const [toFinish, goToFinish] = useState(false)
  const [toNextFrame, goToNextFrame] = useState(false)
  const [toPreviousFrame, goToPreviousFrame] = useState(false)
  const [createdFilmstripId, setCreatedFilmstripId] = useState(false)

  const nextQuestion = (event) => {

    event.preventDefault()

    if (currentFrameIndex === filmstrip.frames.length - 1) {

      const frames = filmstrip.frames.map(f => {

        return Object.assign({
          no: f.no,
          responseToFrameId: f._id,
          responseToFilmstripId: filmstrip._id
        }, JSON.parse(localStorage.getItem(f._id)))

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
          goToFinish(true)
        }
      })

    }
    else {
      goToNextFrame(true)
    }

  }

  const frames = filmstrip.frames

  if (toFinish === true) {
    const url = `/a/${filmstrip._id}/${emailBase64}/${createdFilmstripId}/finish`
    return <Redirect push to={url} />
  }

  if (toPreviousFrame === true) {
    const url = `/response/${filmstrip._id}/${frames[currentFrameIndex - 1]._id}/${emailBase64}`
    return <Redirect push to={url} />
  }

  if (toNextFrame === true) {
    const url = `/response/${filmstrip._id}/${frames[currentFrameIndex + 1]._id}/${emailBase64}`
    return <Redirect push to={url} />
  }

  return (
    <>
      <Grid style={{ paddingBottom: '72px' }}>
        <GridCell span={12}>
          <Typography use='headline4' tag='h4' style={{ textAlign: 'center' }}>
            {filmstrip.name || 'Untitled Filmstrip'}
          </Typography>
       </GridCell>
        <GridCell desktop={6} tablet={4} phone={4}>
          <ResponseQuestion currentFrame={frame} filmstrip={filmstrip} currentFrameIndex={currentFrameIndex} t={t} />
        </GridCell>
        <StyledGridCell desktop={6} tablet={4} phone={4}>
          <ResponseAnswer key={frame._id} currentFrame={frame} filmstrip={filmstrip} currentFrameIndex={currentFrameIndex} t={t} history={history} email={email} emailBase64={emailBase64} />
        </StyledGridCell>
      </Grid>
      <StickyNav
        index={currentFrameIndex}
        max={frames.length}
        prevTitle={t('Response.PrevQuestion')}
        nextTitle={t('Response.NextQuestion')}
        finishTitle={t('Response.Finish')}
        onPrevious={(event) => {
          event.preventDefault()
          goToPreviousFrame(true)
        }}
        onNext={nextQuestion}
      />
    </>
  )

}, {
  isFullWidth: true
})