import { Meteor } from 'meteor/meteor'
import React from 'react'
import ReactFilestack from 'filestack-react'
import { TextField, Button, Icon, List, ListItem, Card } from 'rmwc'
import { withTracker } from 'meteor/react-meteor-data'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'
import { Filmstrips } from '/imports/db/filmstrips.js'

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

const FrameItem = ({frame, no}) => {
    // const currentFrame = item.frames.find(i => i.no === no)
    // console.log('currentFrame', currentFrame)
    // const [lastNo, setLastNo] = React.useState(no)
    // const [frame, setFrame] = React.useState(frame)
    const [title, setTitle] = React.useState(frame.title)

    const getStyle = no => ({ display: no === 1 ? 'inline' : 'none' })
    
    return (<>
        <form className="formFrame" id={no} style={getStyle(no)}>
            <TextField label="Frame Title" name="title" value={title} onChange={setter(setTitle)} maxLength={50} characterCount/>
            <TextField
                textarea
                outlined
                fullwidth
                label="Frame Description"
                rows={3}
                maxLength={120}
                characterCount
                value={frame.description}
                onChange={noop}
            />
            <TextField textarea label="Link" defaultValue={frame.link}/>
            <h3>Files</h3>

            // TODO move apikey to setttings file
            <ReactFilestack
                apikey={'Aqp34KkGdTvCthMIbNKTYz'}
                // onSuccess={(result) => console.log(result)}
                onSuccess={(result) => Meteor.call('filmstrip.addFileLink', {filmstripId: item._id, frameNo: no, filesUploaded: result.filesUploaded})}
                render={({ onPick }) => (
                    <Button label='+ Upload File' onClick={onPick} />
                )}
            />

            <List>
                <ListItem>Ho</ListItem>
                {frame.files && frame.files.map((file, i) => <FileItem key={i} file={file} />)}
            </List>

            {/* <h2>{frame.files.length}</h2> */}
            {/* <Card>
                {frame.files.length ?
                    <List>
                        <h2></h2>
                        {frame.files.map((file, i) => {
                            return (
                                <ListItem key={i}>{file.filename}</ListItem>
                            )
                        })}
                    </List>
                    : null}
            </Card> */}
        </form>
    </>)
}

const FileItem = ({file}) => {
    console.log(file)
    console.log(file.filename)
    return (
        <ListItem key={file.filename}>{file.filename}</ListItem>
    )
}

const FilmstripContent = ({item}) => {
    const [no, setNo] = React.useState(item.frames[0].no)
    // const frame = item.frames.find(i => i.no === no)
    // const findFrame = (no) => {
    //     console.log('findFrame', no, typeof no)
    //     const i = item.frames.find(i => i.no === no)
    //     console.log(i)
    //     return i
    // }
    // const [frame, setFrame] = React.useState(findFrame(+no))
    // setFrame(item.frames[no])
    // setTitle(currentFrame.title)
    // console.log('title', title)


    return (<>
        <h1>Frames</h1>
        <FrameSelector frames={item.frames} setNo={setNo}/>
        {/* <FrameItem item={item} no={+no}/> */}
        {item.frames && item.frames.map((frame, i) => <FrameItem key={i} frame={frame} no={frame.no}/>)}
    </>)
}

const FilmstripWrapper = ({isLoading, item}) => 
    <ul>
        {loadingWrapper(isLoading, () => 
            <FilmstripContent key={item._id} item={item} />)
        }
    </ul>

export const FilmstripsItem = withTracker(({ match }) => {
    const handle = Meteor.subscribe('Filmstrip', match.params.filmstripId)
    console.log(match.params)
    console.log(Filmstrips.findOne())
    return {
        isLoading: !handle.ready(),
        item: Filmstrips.findOne()
    }
})(FilmstripWrapper)
