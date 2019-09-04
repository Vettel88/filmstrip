import { Meteor } from 'meteor/meteor'
import React from 'react';
import { TextField, Card, Snackbar, SnackbarAction } from "rmwc";

import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { observer } from 'mobx-react'
import { loadingWrapper, addTranslations, t, withTranslation } from '/imports/ui/UIHelpers.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'

import './FilmstripsSettings.less'

import stores from '/imports/store'
const store = stores.filmstripStore

const FormField = styled.div`
    padding: 1rem;
`

const FilmstripSettingsForm = observer((_props) => {
    const filmstrip = store.filmstrip || {}
    return (
        <Card>
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
        </Card>
    );
})

const saveFilmstrip = event => {
    event.preventDefault()
    store.persist()
}

const FilmstripSettingsContent = observer(({filmstripId}) => {
    return (
        <div className="filmstripsSettings">
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
                    <FilmstripSettingsForm filmstripId={filmstripId} />
                </>
            )}
        </div>
    )
})

export const FilmstripsSettings = withTranslation()(
    withTracker(({match}) => {
        const { filmstripId, frameId } = match.params
        Meteor.subscribe('Filmstrip', filmstripId, () => {
            store.filmstrip = Filmstrips.findOne(filmstripId)
        })
        Meteor.subscribe('Frames', { filter: { filmstripId } }, () => {
            store.frames = Frames.find({ filmstripId }).fetch()
        })
        return ({ filmstripId, frameId })
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
