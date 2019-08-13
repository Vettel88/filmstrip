import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { VideoRecorder } from '/imports/ui/components/VideoRecorder'

const saveVideo = (filmstripId, frameId, history) => (video) => {
    // TODO the method relies on an existing frame, but a new one maybe is not persisted at all - find a way to promote the video pack to the filmstrip editor without saving here
    // I guess it is time for some real state management
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
