import { Snackbar, SnackbarAction, TextField, Grid, GridCell } from 'rmwc'
import {
    addTranslations,
    loadingWrapper,
    t,
    withTranslation
} from '/imports/ui/UIHelpers.js'

import { Filmstrips } from '/imports/db/filmstrips.js'
import { Form } from '/imports/ui/components/Forms.jsx'
import { Frames } from '/imports/db/frames.js'
import { Meteor } from 'meteor/meteor'
import { observer } from 'mobx-react'
import React from 'react'
import stores from '/imports/store'
import { withTracker } from 'meteor/react-meteor-data'

const store = stores.filmstripStore

const FilmstripSettingsForm = observer(_props => {
    const filmstrip = store.filmstrip || {}
    return (
        <Form fullWidth>
            <TextField
                label={'Name'}
                name='filmstripName'
                value={filmstrip.name}
                outlined
                onChange={e => {
                    store.setFilmstripValue('name', e.currentTarget.value)
                }}
                maxLength={50}
                characterCount
            />
            <TextField
                textarea
                outlined
                label={'Description'} // TODO i18n
                rows={3}
                maxLength={120}
                characterCount
                value={filmstrip.description}
                onChange={e => {
                    store.setFilmstripValue(
                        'description',
                        e.currentTarget.value
                    )
                }}
            />
        </Form>
    )
})

const saveFilmstrip = event => {
    event.preventDefault()
    store.persist()
}

const FilmstripSettingsContent = observer(({ filmstripId }) => {
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
                        <FilmstripSettingsForm filmstripId={filmstripId} />
                    </>
                ))}
            </GridCell>
        </Grid>
    )
})

export const FilmstripsSettings = withTranslation()(
    withTracker(({ match }) => {
        const { filmstripId, frameId } = match.params
        Meteor.subscribe('Filmstrip', filmstripId, () => {
            store.filmstrip = Filmstrips.findOne(filmstripId)
        })
        Meteor.subscribe('Frames', { filmstripId: filmstripId }, () => {
            store.frames = Frames.find({ filmstripId }).fetch()
        })
        return { filmstripId, frameId }
    })(FilmstripSettingsContent)
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
