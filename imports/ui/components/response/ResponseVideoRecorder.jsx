import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withRouter } from 'react-router-dom'
import VideoRecorder from '/imports/ui/components/VideoRecorder/index.jsx'

const saveVideo = (filmstripId, frameId, emailBase64, history) => ({ public_id: cloudinaryPublicId }) => {
  const serializedCachedState = localStorage.getItem(frameId)
  const cachedState = serializedCachedState ? JSON.parse(serializedCachedState) : {}
  cachedState.cloudinaryPublicId = cloudinaryPublicId
  localStorage.setItem(frameId, JSON.stringify(cachedState))
  history.replace(`/a/${filmstripId}/${emailBase64}/q`)
}

export const ResponseVideoRecorder = withRouter(({ history, match }) => {
  const { filmstripId, frameId, emailBase64 } = match.params
  return (
    <VideoRecorder onSuccess={saveVideo(filmstripId, frameId, emailBase64, history)} />
  )
})
