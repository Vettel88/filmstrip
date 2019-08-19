import { Meteor } from 'meteor/meteor'
import React from 'react'
import { List, ListItem, ListItemText, ListItemPrimaryText, ListItemSecondaryText, ListItemMeta, Card, TextField, Button, Typography } from 'rmwc'
import VideoRecorder from '../VideoRecorder'
import ReactFilestack from 'filestack-react'

export class ResponseFrame extends React.Component {

    constructor(props) {

        super(props)

        const serializedCachedState = localStorage.getItem(this.props.frame._id)
        const cachedState = serializedCachedState ? JSON.parse(serializedCachedState) : null

        if(cachedState) this.state = cachedState
        else {
            this.state = {
                showVideoRecorder: false,
                text: null,
                link: '',
                files: []
            }
        }

    }

    handleLinkResponse = (event) => {
        this.updateLocalStorageState({
            link: event.target.value
        })
    }

    handleTextResponse = (event) => {
        this.updateLocalStorageState({
            text: event.target.value
        })
    }

    responseUploadSave = (res) => {
        const stateFiles = this.state.files ? this.state.files : []
        const files = stateFiles.concat(res.filesUploaded)
        //console.log(res, files)
        this.updateLocalStorageState({
            files
        })
    }

    updateLocalStorageState = (state) => {
        this.setState(state)
        localStorage.setItem(this.props.frame._id, JSON.stringify(this.state))
    }

    render() {
        const { t } = this.props
        const frame = this.props.frame
        let files, link, textResponse, linkResponse, fileResponse

        if (frame.files && frame.files.length) {
            files = <>
                <h6><Typography use='subtitle2'>{t('Files')}</Typography></h6>
                    <ul>
                        {
                            frame.files.map(file => <li key={file.handle}><a href={file.url} target='_blank'>{file.filename}</a></li>)
                        }
                    </ul>
                </>
        }

        if (frame.link) {
            link = <>
                <h6><Typography use='subtitle2'>{t('Link')}</Typography></h6>
                <a href={frame.link} target='_blank'>{frame.link}</a>
            </>
        }

        if(frame.allowText) {
            textResponse = <>
                <h6><Typography use='subtitle2'>{t('Response.Text')}</Typography></h6>
                <TextField
                    label={t('Response.Text')}
                    className='ResponseField'
                    fullwidth
                    onChange={this.handleTextResponse}
                    defaultValue={this.state.text}
                    outlined
                    rows={4}
                    textarea />
            </>
        }

        if (frame.allowLinks) {
            linkResponse = <>
                    <h6><Typography use='subtitle2'>{t('Response.AddLink')}</Typography></h6>
                    <TextField
                    label={t('URL')}
                    className='ResponseField'
                    onChange={this.handleLinkResponse}
                    defaultValue={this.state.link}
                    fullwidth
                    outlined />
                </>
        }

        if (frame.allowFiles) {
            fileResponse = <div className='FileUploadContainer'>
                    <h6><Typography use='subtitle2'>{t('Response.UploadFiles')}</Typography></h6>
                    <List>
                        {
                            this.state.files ? this.state.files.map(file => {
                                return (
                                    <ListItem key={file.handle}>
                                        <ListItemText>
                                            <ListItemPrimaryText>{file.filename}</ListItemPrimaryText>
                                            <ListItemSecondaryText>{Math.round(file.size/1024)}kB</ListItemSecondaryText>
                                        </ListItemText>
                                        <ListItemMeta icon='delete' />
                                    </ListItem>
                                )
                            }) : ''
                        }
                    </List>
                    <ReactFilestack
                        apikey={Meteor.settings.public.filestack.apikey}
                        onSuccess={(res) => this.responseUploadSave(res, files)}
                        render={({ onPick }) => (
                            <Button label={t('PickFile')} raised onClick={onPick} />
                        )}
                    />
                </div>
        }

        return (
            <>
                <Card className='ResponseCardDetails'>
                    <h5>
                        <Typography use='headline5'>
                            {this.props.currentFrameIndex + 1}/
                            {this.props.filmstrip.frames.length}:{' '}
                            {frame.title}
                        </Typography>
                    </h5>
                    <p>
                        <Typography use='body1'>
                            {frame.description}
                        </Typography>
                    </p>
                    {files}
                    {link}
                </Card>
                <Card className='ResponseCard' outlined>
                    <h6 className='noMarginTop'>
                        <Typography use='subtitle2'>
                            {t('Response.Video')}
                        </Typography>
                    </h6>
                    {this.state.cloudinaryPublicId &&
                        !this.state.showVideoRecorder && (
                            <VideoPlayer
                                publicId={this.state.cloudinaryPublicId}
                            />
                        )}
                    {this.state.showVideoRecorder && (
                        <VideoRecorder
                            onSuccess={({
                                public_id: cloudinaryPublicId
                            }) =>
                                this.updateLocalStorageState({
                                    showVideoRecorder: false,
                                    cloudinaryPublicId
                                })
                            }
                            onError={console.error}
                        />
                    )}
                    {!this.state.showVideoRecorder && (
                        <Button
                            label={t('Response.RecordButton')}
                            raised
                            onClick={() =>
                                this.setState({
                                    showVideoRecorder: true
                                })
                            }
                            className='big'
                        />
                    )}
                    {textResponse}
                    {linkResponse}
                    {fileResponse}
                </Card>
            </>
        );
    }
}
