import { Meteor } from 'meteor/meteor'
import React, { useState, useEffect } from 'react';
import ReactFilestack from 'filestack-react'
import { Image } from 'cloudinary-react'
import { TextField, Button, Icon, List, ListItem, Card, GridCell, GridInner, Fab } from 'rmwc'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { withRouter } from 'react-router-dom'
import get from 'lodash/get'
import { loadingWrapper, addTranslations, t, withTranslation, changeLanguage } from '/imports/ui/UIHelpers.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import Video from '/imports/ui/components/VideoPlayer.js';

const FrameEditorItem = withRouter(({history, match, frame}) => {
    const removeFrame = (event) => {
        changeLanguage('es')
        if(confirm(t('FramestripsItem.Do you want to delete the frame?'))) {
            alert(t('FramestripsItem.Wait for the future to come!'))
        }
    }
    const addVideo = (event) => {
        console.log('addVideo', history, `/filmstrip/${frame.filmstripId}/${frame._id}/recordVideo`)
        return history.push(`/filmstrip/${frame.filmstripId}/${frame._id}/recordVideo/`)
    }

    const publicId = get(frame, 'cloudinaryPublicId')
    const imageOrVideo = publicId
        ? <Video publicId={publicId} width="300"/>
        : <Image cloudName="demo" publicId="sample" width="300" crop="scale"/>

    // All frames will be rendered but only the currently selected will be visible
    const { frameId } = match.params
    const getStyle = id => {
        return ({ display: id === frameId ? 'block' : 'none' })
    }

    return (<div className="videoEditor" style={getStyle(frame._id)}>
        {imageOrVideo}
        <div className="actions">
            <Fab icon="clear" data-no={frame.no} onClick={removeFrame} style={{ backgroundColor: 'var(--mdc-theme-error)' }} theme={['onError']}  mini={true}/>
            <Fab icon="add" data-no={frame.no} onClick={addVideo} mini={true}/>
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

const FrameEditor = ({frames}) => <div>
    {frames.map(frame => <FrameEditorItem key={frame.no} frame={frame} />)}
</div>

const FrameSelector = ({frames}) => <div>
    {frames.map(frame => <FrameSelectorItem key={frame.no} frame={frame} />)}
</div>

const setter = (set) => (event) => set(event.target.value)

const StyledReactFilestack = styled(ReactFilestack)`
    text-align: right;
    float: right;
    text-decoration: underline;
    color: blue;
`

const FrameItem = withRouter(({match, filmstrip, frame, no}) => {
    const [title, setTitle] = React.useState(frame.title)
    const [description, setDescription] = React.useState(frame.description)
    const [link, setLink] = React.useState(frame.link)
    const [files, setFiles] = React.useState(frame.files || [])

    // All frames will be rendered but only the currently selected will be visible
    const { frameId } = match.params
    const getStyle = () => ({ display: frame._id === frameId ? 'inline' : 'none' })
    
    return (<>
        <form className="formFrame" id={no} style={getStyle()}>
            <GridCell span={12}>
                <TextField label={t('FramestripsItem.Frame Title')} name="title" value={title} onChange={setter(setTitle)} maxLength={50} characterCount/>
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
                    value={description}
                    onChange={setter(setDescription)}
                />
            </GridCell>
            <GridCell span={12}>
                <TextField textarea label={t('FramestripsItem.Link')} defaultValue={link} onChange={setter(setLink)}/>
            </GridCell>
            <GridCell span={12}>
                <h3>{t('FramestripsItem.Files')}</h3>
                <StyledReactFilestack
                    apikey={Meteor.settings.public.filestack.apikey}
                    onSuccess={({filesUploaded}) => {
                        const newFiles = [].concat(files)
                        filesUploaded.forEach(f => newFiles.push(f))
                        setFiles(newFiles)
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
                    {files && files.map((file, i) => 
                        <FileItem key={i} file={file} filmstrip={filmstrip} frame={frame} no={no} files={files} setFiles={setFiles}/>)}
                </List>
            </GridCell>
            <GridCell span={12}>
                <button className="saveFrame" onClick={saveFrame({filmstrip, no, title, description, link, files})}>{t('FramestripsItem.Save')}</button>
            </GridCell>
        </form>
    </>)
})

const saveFrame = ({filmstrip, no, title, description, link, files}) => event => {
    event.preventDefault()
    const frame = {title, description, link, files}
    Meteor.call('filmstrip.frame.save', {filmstripId: filmstrip._id, no, frame})
}

const removeFile = ({filmstrip, no, frame, file, files, setFiles}) => event => {
    event.preventDefault()
    const newFiles = files.filter(f => f.handle !== file.handle)
    setFiles(newFiles)
}

const FileItem = ({filmstrip, frame, no, file, files, setFiles}) => <GridInner>
        <GridCell span={2}>
            <img src={file.url} alt={file.filename} width="48" height="48"></img>
        </GridCell>
        <GridCell span={8}>
            <ListItem key={file.filename}>{file.filename}</ListItem>
        </GridCell>
        <GridCell span={2}>
            <button className="removeFile" onClick={removeFile({filmstrip, frame, no, file, files, setFiles})}>{t('FramestripsItem.Remove')}</button>
        </GridCell>
    </GridInner>

const FilmstripContent = ({match, filmstrip, frames, filmstripId, frameId}) => <>
    <h1>{t("FramestripsItem.Frames")}</h1>
    <div style={{ textAlign: "center" }}>
        <FrameEditor frames={frames} />
        <FrameSelector frames={frames} />
    </div>
    {frames && frames.map((frame, i) => (
        <FrameItem
            key={i}
            filmstrip={filmstrip}
            frame={frame}
            no={frame.no}
        />
    ))}
</>
    
const FilmstripWrapper = ({isLoading, filmstrip, frames, filmstripId, frameId}) => 
    <div className="filmstripsItem">
        {loadingWrapper(isLoading, () => 
            <FilmstripContent key={filmstrip._id} filmstrip={filmstrip} frames={frames} filmstripId={filmstripId} frameId={frameId}/>)
        }
    </div>

export const FilmstripsItem = withTranslation()(withTracker(({ match }) => {
    console.log(match)
    const handle = Meteor.subscribe('Filmstrip', match.params.filmstripId)
    const { filmstripId, frameId } = match.params

    return {
        isLoading: !handle.ready(),
        filmstrip: Filmstrips.findOne(match.params.filmstripId),
        frames: Frames.find({ filmstripId: match.params.filmstripId }).fetch(),
        filmstripId,
        frameId,
    }
})(FilmstripWrapper))

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
            'Wait for the future to come!': 'Wait for the future to come!',
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
            'Wait for the future to come!': 'Espera hasta que el futuro vendra!',
        }
    })
})
