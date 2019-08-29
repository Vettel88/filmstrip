import {
    Fab,
    Grid,
    GridCell,
    List,
    ListItem,
    ListItemMeta,
    ListItemPrimaryText,
    ListItemSecondaryText,
    ListItemText,
    Typography
} from 'rmwc'
import {
    addTranslations,
    loadingWrapper,
    t,
    withTranslation
} from '/imports/ui/UIHelpers.js'
import { PaddedCard as Card } from '/imports/ui/components/Cards.jsx'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import get from 'lodash/get'
import { Link } from 'react-router-dom'
import React from 'react'
import styled from 'styled-components'
import Video from '/imports/ui/components/VideoPlayer.js'
import { withTracker } from 'meteor/react-meteor-data'

const nl2br = string => string.replace(/\n/g, '<br/>')

const FileView = ({ file }) => <>{file.filename}</>

const LeftFab = styled(Fab)`
    position: absolute !important;
    top: 50%;
    left: 0;
    margin-top: -28px;
    margin-left: -18px;
`

const RightFab = styled(Fab)`
    position: absolute !important;
    top: 50%;
    right: 0;
    margin-top: -28px;
    margin-right: -18px;
`

const FrameView = ({
    currentFrame,
    currentFrameIndex,
    setCurrentFrameIndex,
    frames
}) => {
    const frameCount = frames.length
    return (
        <>
            {currentFrame.cloudinaryPublicId && (
                <div style={{ marginBottom: '24px', position: 'relative' }}>
                    <LeftFab
                        icon='arrow_back'
                        disabled={currentFrameIndex === 0}
                        onClick={changeFrame(
                            frameCount,
                            currentFrameIndex,
                            setCurrentFrameIndex,
                            -1
                        )}
                    />
                    <Video
                        publicId={currentFrame.cloudinaryPublicId}
                        width='100%'
                    />
                    {currentFrameIndex < frames.length && (
                        <RightFab
                            icon='arrow_forward'
                            onClick={changeFrame(
                                frameCount,
                                currentFrameIndex,
                                setCurrentFrameIndex
                            )}
                        />
                    )}
                </div>
            )}
            <Typography use='headline4' tag='h4'>
                {currentFrameIndex + 1}. {currentFrame.title}
            </Typography>
            {currentFrame.text && (
                <Card>
                    <Typography use='headline6' tag='h6'>
                        Text answer
                    </Typography>
                    <Typography
                        use='body2'
                        tag='p'
                        dangerouslySetInnerHTML={{
                            __html: nl2br(currentFrame.text)
                        }}
                    />
                </Card>
            )}
            {currentFrame.files && currentFrame.files.length && (
                <Card>
                    <Typography use='headline6' tag='h6'>
                        Uploaded files
                    </Typography>
                    <List twoLine>
                        {currentFrame.files.map(file => (
                            <ListItem
                                key={file.handle}
                                onClick={event => {
                                    event.preventDefault()
                                    window.open(file.url)
                                }}>
                                <ListItemText>
                                    <ListItemPrimaryText>
                                        {file.filename}
                                    </ListItemPrimaryText>
                                    <ListItemSecondaryText>
                                        {Math.round(file.size / 1024)}
                                        kB
                                    </ListItemSecondaryText>
                                </ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Card>
            )}
            {currentFrame.link && (
                <Card>
                    <Typography use='headline6' tag='h6'>
                        Links
                    </Typography>
                    <Typography use='body2' tag='p'>
                        <Link to={currentFrame.link} target='_blank'>
                            {currentFrame.link}
                        </Link>
                    </Typography>
                </Card>
            )}
        </>
    )
}

const changeFrame = (
    frameCount,
    currentFrame,
    setCurrentFrame,
    direction = 1
) => () => {
    if (direction === 1 && currentFrame < frameCount)
        return setCurrentFrame(currentFrame + direction)
    if (direction === -1 && currentFrame > 0)
        return setCurrentFrame(currentFrame + direction)
}

const FilmstripsResponseViewWrapper = ({ isLoading, filmstrip, frames }) => {
    const [currentFrameIndex, setCurrentFrameIndex] = React.useState(0)
    const currentFrame = frames[currentFrameIndex] || {}

    return (
        <>
            {loadingWrapper(isLoading, () => (
                <Grid>
                    <GridCell desktop={3} tablet={1} phone={0} />
                    <GridCell desktop={6} tablet={6} phone={4}>
                        <FrameView
                            currentFrame={currentFrame}
                            frames={frames}
                            currentFrameIndex={currentFrameIndex}
                            setCurrentFrameIndex={setCurrentFrameIndex}
                        />
                    </GridCell>
                    <GridCell desktop={3} tablet={1} phone={0} />
                </Grid>
            ))}
        </>
    )
}

export const FilmstripsResponseView = withTranslation()(
    withTracker(({ match }) => {
        const { filmstripId } = match.params
        const handle = Meteor.subscribe('SharedFilmstrip', filmstripId)
        return {
            isLoading: !handle.ready(),
            filmstrip: Filmstrips.findOne(filmstripId),
            frames: Frames.find({ filmstripId }).fetch()
        }
    })(FilmstripsResponseViewWrapper)
)
