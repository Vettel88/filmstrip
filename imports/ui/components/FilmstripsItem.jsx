import { Meteor } from 'meteor/meteor'
import React from 'react'
import ReactFilestack from 'filestack-react'
import { Image } from 'cloudinary-react'
import { TextField, Button, Icon, List, ListItem, Card, GridCell, GridInner, Avatar } from 'rmwc'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { withRouter } from 'react-router-dom'
import get from 'lodash/get'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import Video from '/imports/ui/components/VideoPlayer.js';
import './FilmstripsItem.less'

const FrameEditorItem = withRouter(({history, match, frame}) => {
    const removeFrame = (event) => {
        if(confirm('Do you want to delete the frame?')) {
            alert('Wait for the future to come!')
        }
    }
    const addVideo = (event) =>
        history.push(`/videoRecorder/${frame.filmstripId}/${frame._id}`)
    
    const publicId = get(frame, 'video.public_id')
    const cloudName = publicId && Meteor.settings.public.cloudinary.cloudName
    const imageOrVideo = publicId
        // ? <Video cloudName={cloudName} publicId={publicId} width="300" crop="scale"/>
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
            <Button raised data-no={frame.no} onClick={removeFrame}>
                <Icon icon={{ icon: 'clear', size: 'xsmall' }} />
            </Button>
            <Button raised data-no={frame.no} onClick={addVideo}>
                <Icon icon="add" />
            </Button>
        </div>
    </div>)
})

const FrameSelectorItem = withRouter(({history, match, frame}) => {
    const changeFrame = (event) => {
        const { filmstripId } = match.params
        history.push(`/filmstrip/${filmstripId}/${event.currentTarget.dataset.id}`)
    }
    
    return (<>
        <Button raised data-id={frame._id} onClick={changeFrame}>
            {frame.no}
        </Button>
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
                <TextField label="Frame Title" name="title" value={title} onChange={setter(setTitle)} maxLength={50} characterCount/>
            </GridCell>
            <GridCell span={12}>
                <TextField
                    textarea
                    outlined
                    fullwidth
                    label="Frame Description"
                    rows={3}
                    maxLength={120}
                    characterCount
                    value={description}
                    onChange={setter(setDescription)}
                />
            </GridCell>
            <GridCell span={12}>
                <TextField textarea label="Link" defaultValue={link} onChange={setter(setLink)}/>
            </GridCell>
            <GridCell span={12}>
                <h3>Files</h3>
                <StyledReactFilestack
                    apikey={Meteor.settings.public.filestack.apikey}
                    onSuccess={({filesUploaded}) => {
                        const newFiles = [].concat(files)
                        filesUploaded.forEach(f => newFiles.push(f))
                        setFiles(newFiles)
                    }}
                    componentDisplayMode={{
                        type: 'link',
                        customText: 'Upload',
                    }}
                    render={({ onPick }) => (
                        <Button label='+ Upload File' onClick={onPick} />
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
                <button className="saveFrame" onClick={saveFrame({filmstrip, no, title, description, link, files})}>Save</button>
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

const FileItem = ({filmstrip, frame, no, file, files, setFiles}) => {
    return (<GridInner>
        <GridCell span={2}>
            <img src={file.url} alt={file.filename} width="48" height="48"></img>
        </GridCell>
        <GridCell span={8}>
            <ListItem key={file.filename}>{file.filename}</ListItem>
        </GridCell>
        <GridCell span={2}>
            <button className="removeFile" onClick={removeFile({filmstrip, frame, no, file, files, setFiles})}>Remove</button>
        </GridCell>
    </GridInner>)
}

const FilmstripContent = ({match, filmstrip, frames, filmstripId, frameId}) => {
    const frame = frames.find(f => f._id === frameId)
    return (<>
        <h1>Frames</h1>
        <div style={{textAlign: 'center'}}>
            <FrameEditor frames={frames} />
            <FrameSelector frames={frames} />
        </div>
        {frames && frames.map((frame, i) => <FrameItem key={i} filmstrip={filmstrip} frame={frame} no={frame.no}/>)}
    </>)
}

const FilmstripWrapper = ({isLoading, filmstrip, frames, filmstripId, frameId}) => 
    <div className="filmstripsItem">
        {loadingWrapper(isLoading, () => 
            <FilmstripContent key={filmstrip._id} filmstrip={filmstrip} frames={frames} filmstripId={filmstripId} frameId={frameId}/>)
        }
    </div>

export const FilmstripsItem = withTracker(({ match }) => {
    const handle = Meteor.subscribe('Filmstrip', match.params.filmstripId)
    const { filmstripId, frameId } = match.params
    return {
        isLoading: !handle.ready(),
        filmstrip: Filmstrips.findOne(match.params.filmstripId),
        frames: Frames.find({ filmstripId: match.params.filmstripId }).fetch(),
        filmstripId,
        frameId,
    }
})(FilmstripWrapper)
