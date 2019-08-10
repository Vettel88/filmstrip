import { Meteor } from 'meteor/meteor'
import React from 'react'
// import { Route, Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { Button } from '@rmwc/button'
import { Card } from '@rmwc/card'
import { FormField } from '@rmwc/formfield'
import { Grid, GridCell, GridInner } from '@rmwc/grid'
import { List, ListItem } from '@rmwc/list'
import { TextField } from '@rmwc/textfield'
import ReactFilestack from 'filestack-react'
// import { Queues } from '/imports/db/queues.js'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'

const frames = [
    {
        id: 1,
        name: 'The first frame',
        description: 'Duis occaecat eiusmod dolor anim irure occaecat sint cillum laboris minim.',
        link: '',
        files: []
    },
    {
        id: 2,
        name: 'The second frame',
        description: 'Qui eiusmod pariatur adipisicing cillum consectetur enim ullamco.',
        link: '',
        files: []
    }
]
const frameUploadSave = (res, files) => {
    files.push(res.filesUploaded[0])
    console.log(res, files);
}

const Frame = props => {
    const { files, frame } = props
    return (
        <>
            <Card>
                <TextField
                    label="Name"
                    fullwidth
                    defaultValue={frame.name}
                />
                <TextField
                    label="Description"
                    fullwidth
                    defaultValue={frame.description}
                    maxLength={120}
                    outlined
                    rows={4}
                    textarea />
                <TextField
                    label="Link"
                    fullwidth
                    defaultValue={frame.link}
                />
            </Card>
            <Card>
                {files.length ?
                    <List>
                        {files.map(file => {
                            return (
                                <ListItem>{file.filename}</ListItem>
                            )
                        })}
                    </List>
                    : null}
                <ReactFilestack
                    apikey={'Aqp34KkGdTvCthMIbNKTYz'}
                    onSuccess={(res) => frameUploadSave(res, files)}
                    render={({ onPick }) => (
                        <Button label='Upload' onClick={onPick} />
                    )}
                />
            </Card>
        </>
    )
        
}

export const Filmstrip = ({ match }) =>    
    <>
        <Grid>
            <GridCell>
                <TextField
                    label="Name" 
                    fullwidth 
                />

                <TextField
                    label="Description"
                    fullwidth
                    maxLength={120}
                    outlined
                    rows={4}
                    textarea />

                <ReactFilestack
                    apikey={'Aqp34KkGdTvCthMIbNKTYz'}
                    onSuccess={(res) => console.log(match)}
                    render={({ onPick }) => (
                        <Button label='Upload' onClick={onPick} />
                    )}
                />

            </GridCell>

            <GridCell>
                <h2>Frames</h2>
                <ul>
                    {frames.map(frame => {
                        return (
                            <li key={frame.id}>
                                <Frame
                                    files={frame.files} 
                                    frame={frame} 
                                />
                            </li>
                        )
                    })}
                </ul>
            </GridCell>
        </Grid>
    </>