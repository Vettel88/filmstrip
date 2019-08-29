import './FilmstripsResponseView.less'
import React from 'react'
import { Fab, Typography, Card } from "rmwc";
import { withTracker } from 'meteor/react-meteor-data'
import get from 'lodash/get'
import { loadingWrapper, addTranslations, t, withTranslation } from '/imports/ui/UIHelpers.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import Video from '/imports/ui/components/VideoPlayer.js'

const nl2br = string => string.replace(/\n/g, '<br/>')

const FileView = ({ file }) => <>{file.filename}</>

const FrameView = ({ frame = {}, currentFrame }) => {
    console.log(frame)
    return <div className="rows">
         <Typography use="headline6" className="title">{currentFrame + 1}. {frame.title}</Typography>
        <div className="row"><label>Description:</label> <span>{frame.description}</span></div>
        {frame.files && frame.files.map(file => <FileView key={file.handle} file={file}/>)}
    </div>
}

const changeFrame = (frameCount, currentFrame, setCurrentFrame, direction = 1) => () => {
    if (direction === 1 && currentFrame < frameCount) return setCurrentFrame(currentFrame + direction)
    if (direction === -1 && currentFrame > 0) return setCurrentFrame(currentFrame + direction)
}

const FilmstripsResponseViewWrapper = ({ isLoading, filmstrip, frames }) => {
    const [currentFrame, setCurrentFrame] = React.useState(0)
    const frameCount = frames.length
    const publicId = get(frames[currentFrame], 'video.public_id')

    return <div className="FilmstripsResponseView">
        
        {loadingWrapper(isLoading, () => <Card className="rows">
            <div className="row"><label>Email:</label> <span>{filmstrip.email}</span></div>
            <div className="row"><label>Name:</label> <span>{filmstrip.name}</span></div>
            <div className="row"><label>Description:</label> <span dangerouslySetInnerHTML={{__html: nl2br(filmstrip.description)}}/></div>
        </Card>)}
        <Card>
            <div className="videoArea">
                {currentFrame > 0 ? <Fab icon="arrow_back" onClick={changeFrame(frameCount, currentFrame, setCurrentFrame, -1)}/> : <></>}
                <div className="video">{publicId ? <Video publicId={publicId} width="300"/> : <>No video</>}</div>
                {currentFrame < frames.length ? <Fab icon="arrow_forward" onClick={changeFrame(frameCount, currentFrame, setCurrentFrame)}/> : <></>}
            </div>
            <div>
                <FrameView frame={frames[currentFrame]} currentFrame={currentFrame} />
            </div>
        </Card>
    </div>
}

export const FilmstripsResponseView = withTranslation()(withTracker(({ match }) => {
    const { filmstripId } = match.params
    const handle = Meteor.subscribe('ResponseFilmstrip', filmstripId)
    return {
        isLoading: !handle.ready(),
        filmstrip: Filmstrips.findOne(filmstripId),
        frames: Frames.find({ filmstripId }).fetch()
    }
})(FilmstripsResponseViewWrapper))
