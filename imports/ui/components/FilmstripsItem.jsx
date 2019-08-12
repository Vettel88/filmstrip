import { Meteor } from 'meteor/meteor'
import React from 'react'
import ReactFilestack from 'filestack-react'
import { VideoRecorder } from '/imports/ui/components/VideoRecorder.jsx'
import { Image, CloudinaryContext, Transformation } from 'cloudinary-react'
import { TextField, Button, Icon, List, ListItem, Card, GridCell, GridInner } from 'rmwc'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import get from 'lodash/get'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import './FilmstripsItem.less'

const FrameSelectorItem = ({item, setNo}) => {
    const clickHandler = (event) => {
        document.querySelectorAll('form.formFrame').forEach(form => form.style.display = 'none')
        document.querySelector(`#${CSS.escape(event.currentTarget.dataset.no)}`).style.display = 'block'
        setNo(event.currentTarget.dataset.no)
    }
    return (<>
        {/* <Image cloudName="demo" publicId="sample" width="300" crop="scale"/> */}
        {/* <CloudinaryContext cloudName="demo">
            <Image publicId="sample">
                <Transformation width="200" crop="scale" angle="10"/>
            </Image>
        </CloudinaryContext> */}
        {/* <VideoRecorder/> */}
        <Button raised data-no={item.no} onClick={clickHandler}>
            <Icon icon="camera" /> {item.no}
        </Button>
    </>)
}

const FrameSelector = ({frames, setNo}) => <>
    {frames.map(frame => <FrameSelectorItem key={frame.no} item={frame} setNo={setNo}/>)}
</>

// The dummyHandler is necessary, otherwise we get this warning:
// Warning: Failed prop type: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
const noop = (event) => {
    console.log(event.target.name, event.target.value)
}

const setter = (set) => (event) => set(event.target.value)

const StyledReactFilestack = styled(ReactFilestack)`
    text-align: right;
    float: right;
    text-decoration: underline;
    color: blue;
`

const FrameItem = ({filmstrip, frame, no}) => {
    const [title, setTitle] = React.useState(frame.title)
    const [description, setDescription] = React.useState(frame.description)
    const [link, setLink] = React.useState(frame.link)
    const [files, setFiles] = React.useState(frame.files || [])

    // All frames will be rendered but only the currently selected will be visible
    const getStyle = no => ({ display: no === 1 ? 'inline' : 'none' })
    
    return (<>
        <form className="formFrame" id={no} style={getStyle(no)}>
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
}

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
        <GridCell span={9}>
            <ListItem key={file.filename}>{file.filename}</ListItem>
        </GridCell>
        <GridCell span={3} className="right">
            <button className="removeFile" onClick={removeFile({filmstrip, frame, no, file, files, setFiles})}>Remove</button>
        </GridCell>
    </GridInner>)
}

const FilmstripContent = ({filmstrip, frames}) => {
    console.log(frames)
    const [no, setNo] = React.useState(get(frames[0], 'no'))
    return (<>
        <h1>Frames</h1>
        <FrameSelector frames={frames} setNo={setNo}/>
        {frames && frames.map((frame, i) => <FrameItem key={i} filmstrip={filmstrip} frame={frame} no={frame.no}/>)}
    </>)
}

const FilmstripWrapper = ({isLoading, filmstrip, frames}) => 
    <div className="filmstripsItem">
        {loadingWrapper(isLoading, () => 
            <FilmstripContent key={filmstrip._id} filmstrip={filmstrip} frames={frames} />)
        }
    </div>

export const FilmstripsItem = withTracker(({ match }) => {
    const handle = Meteor.subscribe('Filmstrip', match.params.filmstripId)
    return {
        isLoading: !handle.ready(),
        filmstrip: Filmstrips.findOne(match.params.filmstripId),
        frames: Frames.find({ filmstripId: match.params.filmstripId }).fetch(),
    }
})(FilmstripWrapper)
