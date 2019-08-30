import { Meteor } from 'meteor/meteor'
import React from 'react';
import ReactFilestack from 'filestack-react'
import { TextField, Button, Icon, List, ListItem, Card, GridCell, Grid, Fab, MenuSurface, MenuSurfaceAnchor, Snackbar, SnackbarAction, Switch} from "rmwc";

import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { observer } from 'mobx-react'
import { loadingWrapper, addTranslations, t, withTranslation, changeLanguage } from '/imports/ui/UIHelpers.js'
import Video from '/imports/ui/components/VideoPlayer.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'

import stores from '/imports/store'
const store = stores.filmstripStore

import './FilmstripsItem.less'

const FormField = styled.div`
    padding: 1rem;
`

const FrameEditorItem = withRouter(observer(({history, frameId}) => {
    const [playing, setPlaying] = React.useState(false)
    const frame = store.getFrame(frameId)
    const addVideo = () => history.push(`/filmstrip/${frame.filmstripId}/${frame._id}/frames/recordVideo/`)
    return (
        <div className="videoContainer">
            {frame.cloudinaryPublicId ? (
                <Video
                    publicId={frame.cloudinaryPublicId}
                    onPlaying={() => setPlaying(true)}
                    onStopped={() => setPlaying(false)}
                />
            ) : (
                <div className="noRecording"></div>
            )}
            {!playing ? (
                <div className="recordButtonContainer">
                    <Fab
                        icon="fiber_manual_record"
                        onClick={addVideo}
                        style={{ backgroundColor: 'var(--mdc-theme-error)' }}
                        theme={['onError']}
                    />
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}))

const StyledReactFilestack = styled(ReactFilestack)`
    text-align: right;
    float: right;
    text-decoration: underline;
    color: blue;
`

const FrameItem = observer(({frameId}) => {
    const frame = store.getFrame(frameId) || {}

    return (
        <>
            <Card>
                <GridCell span={12}>
                    <FormField>
                        <TextField
                            label={t('FramestripsItem.Frame Title')}
                            name="title"
                            fullwidth
                            value={frame.title}
                            onChange={(e) => store.setFrameValue(frame, 'title', e.currentTarget.value)}
                            maxLength={50}
                            characterCount
                        />
                    </FormField>
                </GridCell>
                <GridCell span={12}>
                    <FormField>
                        <TextField
                            textarea
                            outlined
                            fullwidth
                            label={t('FramestripsItem.Frame Description')}
                            rows={3}
                            maxLength={120}
                            characterCount
                            value={frame.description}
                            onChange={(e) => store.setFrameValue(frame, 'description', e.currentTarget.value)}
                        />
                    </FormField>
                </GridCell>
                <GridCell span={12}>
                    <FormField>
                        <TextField
                            fullwidth
                            label={t('FramestripsItem.Link')}
                            defaultValue={frame.link}
                            onChange={(e) => store.setFrameValue(frame, 'link', e.currentTarget.value)}
                        />
                    </FormField>
                </GridCell>
                <GridCell span={12}>
                    <FormField>
                        <h3>{t('FramestripsItem.Files')}</h3>
                        <StyledReactFilestack
                            apikey={Meteor.settings.public.filestack.apikey}
                            onSuccess={({filesUploaded}) => {
                                const newFiles = [].concat(frame.files)
                                filesUploaded.forEach(f => newFiles.push(f))
                                store.setFrameValue(frame, 'files', newFiles)
                            }}
                            componentDisplayMode={{
                                type: 'link',
                                customText: t('FramestripsItem.Upload'),
                            }}
                            render={({ onPick }) => (
                                <Button label='' onClick={onPick} />
                            )}
                        />
                    </FormField>
                </GridCell>
                <GridCell span={12}>
                    <FormField>
                        <List>
                            {frame.files && frame.files.map((file, i) => 
                                <FileItem
                                    key={i}
                                    file={file}
                                    filmstrip={store.filmstrip}
                                    frame={frame}
                                    no={frame.no}
                                    files={frame.files}
                                    setFiles={console.log}
                                />)
                            }
                        </List>
                    </FormField>
                </GridCell>
            </Card>
            <Card>
                <GridCell span={12}>
                    <FormField>
                        <Switch
                            checked={frame.allowTextAnswer || false}
                            onClick={(e) => store.setFrameValue(frame, 'allowTextAnswer', e.currentTarget.checked)}
                            label={t('FramestripsItem.allowTextAnswers')}
                        />
                    </FormField>
                </GridCell>
                <GridCell span={12}>
                    <FormField>
                        <Switch
                            checked={frame.allowAddingLinks || false}
                            onClick={(e) => store.setFrameValue(frame, 'allowAddingLinks', e.currentTarget.checked)}
                            label={t('FramestripsItem.allowAddingLinks')}
                        />
                    </FormField>
                </GridCell>
                <GridCell span={12}>
                    <FormField>
                        <Switch
                            checked={frame.allowAddingFiles || false}
                            onClick={(e) => store.setFrameValue(frame, 'allowAddingFiles', e.currentTarget.checked)}
                            label={t('FramestripsItem.allowAddingFiles')}
                        />
                    </FormField>
                </GridCell>
            </Card>
        </>
    )
})

const saveFilmstrip = event => {
    event.preventDefault()
    store.persist()
}

const removeFile = ({filmstrip, no, frame, file, files}) => event => {
    event.preventDefault()
    const newFiles = files.filter(f => f.handle !== file.handle)
    store.setFrameValue(frame, 'files', newFiles)
}

const FileItem = ({filmstrip, frame, no, file, files}) => <Grid>
        <GridCell span={2}>
            <img src={file.url} alt={file.filename} width="48" height="48"></img>
        </GridCell>
        <GridCell span={8}>
            <ListItem key={file.filename}>{file.filename}</ListItem>
        </GridCell>
        <GridCell span={2}>
            <button className="removeFile" onClick={removeFile({filmstrip, frame, no, file, files})}>{t('FramestripsItem.Remove')}</button>
        </GridCell>
    </Grid>

const FilmstripItem = observer((props) => {
    const { frameId, filmstripId, history } = props
    return (
        <div className="filmstripsItem">
            {loadingWrapper(store.isLoading, () =>
                <>
                    <Snackbar
                        open={store.isDirty}
                        onClose={e => store.isDirty = false}
                        message={t('FramestripsItem.messageUnsavedChanges')}
                        timeout={100000000000000000000} // ms => 3.17 x 10^9 years
                        action={
                            <SnackbarAction
                                label={t('FramestripsItem.Save')}
                                onClick={saveFilmstrip}
                            />
                        }
                    />
                    <FilmstripFrameSlides
                        frameId={frameId}
                        filmstripId={filmstripId}
                        history={history}
                    />
                    <FrameItem frameId={frameId} />
                    <Fab
                        className="footerAction"
                        icon="add"
                        onClick={async () => {
                            const newFrame = await store.createFrame(filmstripId)
                            history.replace(`/filmstrip/${filmstripId}/${newFrame._id}/frames`)
                        }}
                    />
                </>
            )}
        </div>
    )
})

const getFramesForNavigation = (currentFrameId) => {
    if (store.frames.length <= 1) {
        return { previousFrame: null, nextFrame: null }
    }
    const indexOfCurrentFrame = store.frames.findIndex(frame => frame._id === currentFrameId)
    const currentFrame = store.frames[indexOfCurrentFrame]
    const nextFrameIndex = indexOfCurrentFrame + 1
    const nextFrame = nextFrameIndex < store.frames.length ? store.frames[nextFrameIndex] : null
    const previousFrameIndex = indexOfCurrentFrame - 1
    const previousFrame = previousFrameIndex >= 0 ? store.frames[previousFrameIndex] : null
    return {
        previousFrame,
        currentFrame,
        nextFrame,
    }
}

const BackButton = (props) => (
    <div className="buttonPanel back">
        {props.disabled ? <></> : <Fab icon="arrow_left" mini onClick={props.onClick} />}
    </div>
)
const NextButton = (props) => (
    <div className="buttonPanel next">
        {props.disabled ? <></> : <Fab icon="arrow_right" mini onClick={props.onClick}/>}
    </div>
)

const SelectedIcon = styled(Icon)`
    color: #888;
`
const UnselectedIcon = styled(Icon)`
    color: #CCC;
`

const FilmstripFrameSlides = ({frameId, filmstripId, history}) => {
    const { previousFrame, nextFrame, currentFrame } = getFramesForNavigation(frameId)
    const indexOfCurrentFrame = store.frames.findIndex(frame => frame._id === frameId)
    return (
        <div className="frameSlides">
            <BackButton
                disabled={!previousFrame}
                onClick={(e) => {
                    e.preventDefault()
                    history.replace(`/filmstrip/${filmstripId}/${previousFrame._id}/frames`)
                }}
            />
            <FrameEditorItem frameId={frameId} />
            <NextButton
                disabled={!nextFrame}
                onClick={(e) => {
                    e.preventDefault()
                    history.replace(`/filmstrip/${filmstripId}/${nextFrame._id}/frames`)
                }}
            />
            <div>
                {store.frames.map((_,i)=> (
                    indexOfCurrentFrame === i ?
                        <SelectedIcon icon="fiber_manual_record" /> :
                        <UnselectedIcon icon="fiber_manual_record" />
                ))}
            </div>
        </div>
    )
}

export const FilmstripsItem = withTranslation()(
    withTracker(({match}) => {
        const { filmstripId, frameId } = match.params
        Meteor.subscribe('Filmstrip', filmstripId, () => {
            store.filmstrip = Filmstrips.findOne(filmstripId)
        })
        Meteor.subscribe('Frames', { filter: { filmstripId } }, () => {
            store.frames = Frames.find({ filmstripId }).fetch()
        })
        return ({ filmstripId, frameId })
    })(FilmstripItem)
)

Meteor.startup(() => {
    addTranslations('en', {    
        FramestripsItem: {
            Frames: 'Frames',
            'Frame Title': 'Frame Title',
            'Frame Description': 'Frame Description',
            Upload: 'Upload',
            Link: 'Link',
            Files: 'Files',
            Save: 'Save',
            Remove: 'Remove',
            'Do you want to delete the frame?': 'Do you want to delete the frame?',
            messageUnsavedChanges: 'You have unsaved changes',
            allowTextAnswers: 'Allow text answers',
            allowAddingLinks: 'Allow adding links',
            allowAddingFiles: 'Allow adding files',
        }
    })
    addTranslations('es', {
        FramestripsItem: {
            Frames: 'Marcos',
            'Frame Title': 'Titulo',
            'Frame Description': 'Descripción',
            Upload: 'Subir',
            Link: 'Enlace',
            Files: 'Subir archivos',
            Save: 'Guardar',
            Remove: 'Remover',
            'Do you want to delete the frame?': 'Quieres borrarlo?',
            messageUnsavedChanges: 'Tienes cambios no guardados',
            allowTextAnswers: 'Allow text answers',
            allowAddingLinks: 'Allow adding links',
            allowAddingFiles: 'Allow adding files',
        }
    })
})
