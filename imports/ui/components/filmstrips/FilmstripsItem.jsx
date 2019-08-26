import { Meteor } from 'meteor/meteor'
import React from 'react';
import ReactFilestack from 'filestack-react'
import { TextField, Button, Icon, List, ListItem, Card as MUICard, GridCell, Grid, Fab, CardPrimaryAction, Snackbar, SnackbarAction, Switch} from "rmwc";
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import get from 'lodash/get'
import { observer } from 'mobx-react'
import { loadingWrapper, addTranslations, t, withTranslation, changeLanguage } from '/imports/ui/UIHelpers.js'
import Video from '/imports/ui/components/VideoPlayer.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import stores from '/imports/store'
const store = stores.filmstripStore

const FormField = styled.div`
    padding: 1rem;
`

/* Styled Components */
const Card = styled(MUICard)`
    padding: 1rem;
    margin-bottom: 1rem;
`

/* Filmstrip Settings Section */
const FilmstripSettings = observer((props) => {
    const filmstrip = store.filmstrip || {}
    return (
        <>
            <FormField>
                <TextField
                    label={"Name"}
                    name="filmstripName"
                    value={filmstrip.name}
                    fullwidth
                    onChange={e => {
                        store.setFilmstripValue(
                            "name",
                            e.currentTarget.value
                        );
                    }}
                    maxLength={50}
                    characterCount
                />
            </FormField>
            <FormField>
                <TextField
                    textarea
                    outlined
                    fullwidth
                    label={"Description"} // TODO i18n
                    rows={3}
                    maxLength={120}
                    characterCount
                    value={filmstrip.description}
                    onChange={e => {
                        store.setFilmstripValue(
                            "description",
                            e.currentTarget.value
                        );
                    }}
                />
            </FormField>
        </>
    );
})

const FrameEditorItem = withRouter((props) => {
    const { history, match, frame } = props
    const removeFrame = (event) => {
        if(confirm(t('FramestripsItem.Do you want to delete the frame?'))) {
            store.removeFrame(frame)
        }
    }
    const addVideo = () => history.push(`/filmstrip/${frame.filmstripId}/${frame._id}/recordVideo/`)
    const createFrame = () => store.createFrame(frame.filmstripId)
    const publicId = get(frame, 'cloudinaryPublicId')
    const imageOrVideo = publicId
        ? <Video publicId={publicId} width="300"/>
        : <img src="https://via.placeholder.com/300x200" onClick={addVideo}/>

    // All frames will be rendered but only the currently selected will be visible
    const { frameId } = match.params
    const getStyle = id => {
        return ({ display: id === frameId ? 'block' : 'none' })
    }

    return (<div className="videoEditor" style={getStyle(frame._id)}>
        {imageOrVideo}
        <div className="actions">
            <Fab icon="clear" data-no={frame.no} onClick={removeFrame} style={{ backgroundColor: 'var(--mdc-theme-error)' }} theme={['onError']}  mini={true}/>
            <Fab icon="add" data-no={frame.no} onClick={createFrame} mini={true}/>
        </div>
    </div>)
})

const FrameSelectorItem = withRouter(({history, match, frame}) => {
    const { filmstripId, frameId } = match.params
    const changeFrame = event =>
        history.push(`/filmstrip/${filmstripId}/${event.currentTarget.dataset.id}`)    
    const getColor = () => frame._id === frameId ? 'black' : 'grey'
    
    return (<>
        <Icon data-id={frame._id} onClick={changeFrame}
            icon={
                <div
                    style={{
                        background: getColor(),
                        width: '12px',
                        height: '12px',
                        borderRadius: '50px',
                        marginLeft: '3px',
                    }}
                />
            }
        />
    </>)
})

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
            <CardPrimaryAction>
                <GridCell span={12}>
                    <TextField
                        label={t('FramestripsItem.Frame Title')}
                        name="title"
                        value={frame.title}
                        onChange={(e) => store.setFrameValue(frame, 'title', e.currentTarget.value)}
                        maxLength={50}
                        characterCount
                    />
                </GridCell>
                <GridCell span={12}>
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
                </GridCell>
                <GridCell span={12}>
                    <TextField
                        textarea
                        label={t('FramestripsItem.Link')}
                        defaultValue={frame.link}
                        onChange={(e) => store.setFrameValue(frame, 'link', e.currentTarget.value)}
                    />
                </GridCell>
                <GridCell span={12}>
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
                </GridCell>
                <GridCell span={12}>
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
                </GridCell>
            </CardPrimaryAction>
            <Card>
                <CardPrimaryAction>
                    <FormField>
                        <Switch
                            checked={frame.allowTextAnswer || false}
                            onClick={(e) => store.setFrameValue(frame, 'allowTextAnswer', e.currentTarget.checked)}
                            label={t('FramestripsItem.allowTextAnswers')}
                        />
                    </FormField>
                    <FormField>
                        <Switch
                            checked={frame.allowAddingLinks || false}
                            onClick={(e) => store.setFrameValue(frame, 'allowAddingLinks', e.currentTarget.checked)}
                            label={t('FramestripsItem.allowAddingLinks')}
                        />
                    </FormField>
                    <FormField>
                        <Switch
                            checked={frame.allowAddingFiles || false}
                            onClick={(e) => store.setFrameValue(frame, 'allowAddingFiles', e.currentTarget.checked)}
                            label={t('FramestripsItem.allowAddingFiles')}
                        />
                    </FormField>
                </CardPrimaryAction>
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
    const { frameId, filmstripId } = props
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
                    <Card>
                        <CardPrimaryAction>
                            <FilmstripSettings filmstripId={filmstripId} />
                        </CardPrimaryAction>
                    </Card>
                    <Card>
                        <h1>{t("FramestripsItem.Frames")}</h1>
                        <div style={{ textAlign: "center" }}>
                            {store.frames.map(frame => <FrameEditorItem key={frame.no} frame={frame} />)}
                            {store.frames.map(frame => <FrameSelectorItem key={frame.no} frame={frame} />)}
                        </div>
                        <FrameItem frameId={frameId} />
                    </Card>
                </>
            )}
        </div>
    )
})

export const FilmstripsItem = withTranslation()(
    withTracker(({match}) => {
        const { filmstripId, frameId } = match.params
        Meteor.subscribe('Filmstrip', filmstripId, () => {
            store.filmstrip = Filmstrips.findOne(filmstripId)
        })
        Meteor.subscribe('Frames', { filmstripId: filmstripId }, () => {
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
