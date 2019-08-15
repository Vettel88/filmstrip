import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withRouter } from 'react-router-dom'
import VideoRecorder from '/imports/ui/components/VideoRecorder/index.jsx'

const saveVideo = (filmstripId, frameId, history) => ({public_id: cloudinaryPublicId}) => {
    // TODO the method relies on an existing frame, but a new one maybe is not persisted at all - find a way to promote the video pack to the filmstrip editor without saving here
    // I guess it is time for some real state management
    Meteor.call('filmstrip.frame.saveVideo', {filmstripId, frameId, cloudinaryPublicId})
    // TODO navigate to frame in FilmstripsItem
    history.replace(`/filmstrip/${filmstripId}/${frameId}`)
}

export const FrameVideoRecorder = withRouter(( {history, match} ) => {
    const { filmstripId, frameId } = match.params
    console.log('FrameVideoRecorder', filmstripId, frameId)
    return (
        <VideoRecorder onSuccess={saveVideo(filmstripId, frameId, history)}/>
    )
})
