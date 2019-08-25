import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withRouter } from 'react-router-dom'
import VideoRecorder from '/imports/ui/components/VideoRecorder/index.jsx'

const saveVideo = (filmstripId, frameId, history) => ({public_id: cloudinaryPublicId}) => {
    Meteor.call('filmstrip.frame.saveVideo', {filmstripId, frameId, cloudinaryPublicId})
    history.replace(`/filmstrip/${filmstripId}/${frameId}`)
}

export const FrameVideoRecorder = withRouter(( {history, match} ) => {
    const { filmstripId, frameId } = match.params
    return (
        <VideoRecorder onSuccess={saveVideo(filmstripId, frameId, history)}/>
    )
})
