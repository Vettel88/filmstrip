import { Meteor } from 'meteor/meteor'
import React from 'react'
import ReactFilestack from 'filestack-react'
import { TextField, Button, Icon, List, ListItem, Card, GridCell, GridInner } from 'rmwc'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import './FilmstripsItem.less'

const FrameSelectorItem = ({item, setNo}) => {
    const clickHandler = (event) => {
        document.querySelectorAll('form.formFrame').forEach(form => form.style.display = 'none')
        document.querySelector(`#${CSS.escape(event.currentTarget.dataset.no)}`).style.display = 'block'
        setNo(event.currentTarget.dataset.no)
    }
    return (<Button raised data-no={item.no} onClick={clickHandler}>
        <Icon icon="camera" /> {item.no}
    </Button>)
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
                onSuccess={(result) => Meteor.call('filmstrip.frame.addFile', {filmstripId: filmstrip._id, frameNo: no, filesUploaded: result.filesUploaded})}
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
                {frame.files && frame.files.map((file, i) => 
                    <FileItem key={i} file={file} filmstrip={filmstrip} frame={frame} no={no}/>)}
            </List>
            </GridCell>
        </form>
    </>)
}

const removeFileHandler = (filmstrip, frame, no, file) => event => {
    event.preventDefault()
    console.log(filmstrip, frame, no, file)    
    Meteor.call('filmstrip.frame.removeFile', {filmstripId: filmstrip._id, frameNo: no, handle: file.handle})
}

const FileItem = ({filmstrip, frame, no, file}) => {
    console.log('file', file)
    console.log(file.filename)
    return (<GridInner>
        <GridCell span={9}>
            <ListItem key={file.filename}>{file.filename}</ListItem>
        </GridCell>
        <GridCell span={3} className="right">
            <button className="removeFile" onClick={removeFileHandler(filmstrip, frame, no, file)}>Remove</button>
        </GridCell>
    </GridInner>)
}

const FilmstripContent = ({filmstrip}) => {
    const [no, setNo] = React.useState(filmstrip.frames[0].no)
    return (<>
        <h1>Frames</h1>
        <FrameSelector frames={filmstrip.frames} setNo={setNo}/>
        {filmstrip.frames && filmstrip.frames.map((frame, i) => <FrameItem key={i} filmstrip={filmstrip} frame={frame} no={frame.no}/>)}
    </>)
}

const FilmstripWrapper = ({isLoading, filmstrip}) => 
    <div className="filmstripsItem">
        {loadingWrapper(isLoading, () => 
            <FilmstripContent key={filmstrip._id} filmstrip={filmstrip} />)
        }
    </div>

export const FilmstripsItem = withTracker(({ match }) => {
    const handle = Meteor.subscribe('Filmstrip', match.params.filmstripId)
    return {
        isLoading: !handle.ready(),
        filmstrip: Filmstrips.findOne()
    }
})(FilmstripWrapper)
