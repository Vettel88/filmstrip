import {
    Button,
    Fab,
    Grid,
    GridCell,
    List,
    ListItem,
    ListItemMeta,
    Snackbar,
    SnackbarAction,
    Switch,
    TextField
} from 'rmwc'
import {
    addTranslations,
    loadingWrapper,
    t,
    withTranslation
} from '/imports/ui/UIHelpers.js'

import { PaddedCard as Card } from '/imports/ui/components/Cards.jsx'
import { FileList } from '/imports/ui/components/FileList.jsx'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Form } from '/imports/ui/components/Forms.jsx'
import { Frames } from '/imports/db/frames.js'
import { Meteor } from 'meteor/meteor'
import { observer } from 'mobx-react'
import React from 'react'
import ReactFilestack from 'filestack-react'
import { StaticFab } from '/imports/ui/components/Forms.jsx'
import { VideoPlayer } from '/imports/ui/components/VideoPlayer.jsx'
import stores from '/imports/store'
import { withTracker } from 'meteor/react-meteor-data'

const store = stores.filmstripStore

const FrameItem = observer(({ frameId }) => {
    const frame = store.getFrame(frameId) || {}

    return (
        <Form fullWidth>
            <Card>
                <TextField
                    label={t('FramestripsItem.Frame Title')}
                    name='title'
                    outlined
                    value={frame.title}
                    onChange={e =>
                        store.setFrameValue(
                            frame,
                            'title',
                            e.currentTarget.value
                        )
                    }
                    maxLength={50}
                    characterCount
                />
                <TextField
                    textarea
                    outlined
                    label={t('FramestripsItem.Frame Description')}
                    rows={3}
                    maxLength={120}
                    characterCount
                    value={frame.description}
                    onChange={e =>
                        store.setFrameValue(
                            frame,
                            'description',
                            e.currentTarget.value
                        )
                    }
                />
                <TextField
                    name='link'
                    outlined
                    label={t('FramestripsItem.Link')}
                    value={frame.link || ''}
                    onChange={e =>
                        store.setFrameValue(
                            frame,
                            'link',
                            e.currentTarget.value
                        )
                    }
                    maxLength={50}
                    characterCount
                />
                <FileList
                    files={frame.files}
                    onRemove={(e, file, index) => {
                        const newFiles = [].concat(frame.files || [])
                        if (index > -1) newFiles.splice(index, 1)
                        store.setFrameValue(frame, 'files', newFiles)
                    }}
                />
                <ReactFilestack
                    apikey={Meteor.settings.public.filestack.apikey}
                    onSuccess={({ filesUploaded }) => {
                        const newFiles = [].concat(frame.files || [])
                        filesUploaded.forEach(f => newFiles.push(f))
                        store.setFrameValue(frame, 'files', newFiles)
                    }}
                    componentDisplayMode={{
                        type: 'button',
                        customText: `+ Upload a file`,
                        customClass:
                            'mdc-button mdc-ripple-upgraded mdc-ripple-upgraded--background-focused'
                    }}
                    render={({ onPick }) => (
                        <Button label='' onClick={onPick} />
                    )}
                />
            </Card>
            <Card>
                <List>
                    <ListItem
                        onClick={e =>
                            store.setFrameValue(
                                frame,
                                'allowTextAnswer',
                                e.target.checked
                            )
                        }>
                        {t('FramestripsItem.allowTextAnswers')}
                        <ListItemMeta>
                            <Switch
                                checked={frame.allowTextAnswer || false}
                                readOnly
                            />
                        </ListItemMeta>
                    </ListItem>
                    <ListItem
                        onClick={e =>
                            store.setFrameValue(
                                frame,
                                'allowAddingLinks',
                                e.target.checked
                            )
                        }>
                        {t('FramestripsItem.allowAddingLinks')}
                        <ListItemMeta>
                            <Switch
                                checked={frame.allowAddingLinks || false}
                                readOnly
                            />
                        </ListItemMeta>
                    </ListItem>
                    <ListItem
                        onClick={e =>
                            store.setFrameValue(
                                frame,
                                'allowAddingFiles',
                                e.target.checked
                            )
                        }>
                        {t('FramestripsItem.allowAddingFiles')}
                        <ListItemMeta>
                            <Switch
                                checked={frame.allowAddingFiles || false}
                                readOnly
                            />
                        </ListItemMeta>
                    </ListItem>
                </List>
            </Card>
        </Form>
    )
})

const saveFilmstrip = event => {
    event.preventDefault()
    store.persist()
}

const FilmstripItem = observer(({ frameId, filmstripId, history }) => {
    const currentFrameIndex = store.frames.findIndex(
        frame => frame._id === frameId
    )
    const currentFrame = store.frames[currentFrameIndex]

    const previousFrame =
        currentFrameIndex < store.frames.length
            ? store.frames[currentFrameIndex - 1]
            : null

    const nextFrame =
        currentFrameIndex < store.frames.length - 1
            ? store.frames[currentFrameIndex + 1]
            : null

    return (
        <Grid>
            <GridCell span={12}>
                {loadingWrapper(store.isLoading, () => (
                    <>
                        <Snackbar
                            open={store.isDirty}
                            onClose={e => (store.isDirty = false)}
                            message={t('FramestripsItem.messageUnsavedChanges')}
                            timeout={100000000000000000000} // ms => 3.17 x 10^9 years
                            action={
                                <SnackbarAction
                                    label={t('FramestripsItem.Save')}
                                    onClick={saveFilmstrip}
                                />
                            }
                        />
                        <VideoPlayer
                            currentFrame={currentFrame}
                            currentFrameIndex={currentFrameIndex}
                            numberOfFrames={store.frames.length}
                            onRecord={e => {
                                e.preventDefault()
                                history.push(
                                    `/filmstrip/${filmstripId}/${frameId}/frames/recordVideo/`
                                )
                            }}
                            onClickPrevious={e => {
                                e.preventDefault()
                                history.replace(
                                    `/filmstrip/${filmstripId}/${previousFrame._id}/frames`
                                )
                            }}
                            onClickNext={e => {
                                e.preventDefault()
                                history.replace(
                                    `/filmstrip/${filmstripId}/${nextFrame._id}/frames`
                                )
                            }}
                        />
                        <FrameItem frameId={frameId} />
                        <StaticFab
                            icon='add'
                            label='Add frame'
                            onClick={async () => {
                                const newFrame = await store.createFrame(
                                    filmstripId
                                )
                                history.replace(
                                    `/filmstrip/${filmstripId}/${newFrame._id}/frames`
                                )
                            }}
                        />
                    </>
                ))}
            </GridCell>
        </Grid>
    )
})

export const FilmstripsItem = withTranslation()(
    withTracker(({ match }) => {
        const { filmstripId, frameId } = match.params
        Meteor.subscribe('Filmstrip', filmstripId, () => {
            store.filmstrip = Filmstrips.findOne(filmstripId)
        })
        Meteor.subscribe('Frames', { filter: { filmstripId } }, () => {
            store.frames = Frames.find({ filmstripId }).fetch()
        })
        return { filmstripId, frameId }
    })(FilmstripItem)
)

Meteor.startup(() => {
    addTranslations('en', {
        FramestripsItem: {
            Frames: 'Frames',
            'Frame Title': 'Frame Title',
            'Frame Description': 'Frame Description',
            Upload: '+ Upload a file',
            Link: 'Link',
            Files: 'Files',
            Save: 'Save',
            Remove: 'Remove',
            'Do you want to delete the frame?':
                'Do you want to delete the frame?',
            messageUnsavedChanges: 'You have unsaved changes',
            allowTextAnswers: 'Allow text answers',
            allowAddingLinks: 'Allow adding links',
            allowAddingFiles: 'Allow adding files'
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
            allowAddingFiles: 'Allow adding files'
        }
    })
})
