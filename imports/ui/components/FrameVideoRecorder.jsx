import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { VideoRecorder } from '/imports/ui/components/VideoRecorder.jsx'

const saveVideo = (filmstripId, frameId, history) => (video) => {
    Meteor.call('filmstrip.frame.saveVideo', {filmstripId, frameId, video})
    // TODO navigate to frame in FilmstripsItem
    history.push(`/filmstrip/${filmstripId}/${frameId}`)
}

export const FrameVideoRecorder = withRouter(( {history, match} ) => {
    const { filmstripId, frameId } = match.params
    return (
        <VideoRecorder onSuccess={saveVideo(filmstripId, frameId, history)}/>
    )
})
