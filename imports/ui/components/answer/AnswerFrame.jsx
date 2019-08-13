import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Route, Link, Redirect } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { loadingWrapper, emailIsValid } from '/imports/ui/UIHelpers.js'
import { List, ListItem, ListItemText, ListItemPrimaryText, ListItemSecondaryText, ListItemMeta, Card, TextField, Button, Typography } from 'rmwc'
import { withTranslation } from 'react-i18next'
import ReactFilestack from 'filestack-react'

export class AnswerFrame extends React.Component {

    constructor(props) {

        super(props)

        const serializedCachedState = localStorage.getItem(this.props.frame._id)
        const cachedState = serializedCachedState ? JSON.parse(serializedCachedState) : null;

        if(cachedState) this.state = cachedState
        else {
            this.state = {
                text: null,
                link: "",
                files: []
            }
        }

    }

    handleLinkAnswer = (event) => {
        this.setState({
            link: event.target.value
        })
        this.updateLocalStorageState();
    }

    handleTextAnswer = (event) => {
        this.setState({
            text: event.target.value
        })
        this.updateLocalStorageState();
    }

    answerUploadSave = (res) => {
        const files = this.state.files.concat(res.filesUploaded)
        console.log(res, files)
        this.setState({
            files
        })
        this.updateLocalStorageState();
    }

    updateLocalStorageState = () => {
        console.log(this.state);
        localStorage.setItem(this.props.frame._id, JSON.stringify(this.state));
    }

    render() {
        
        const t = this.props.t
        const frame = this.props.frame
        let files, link, textAnswer, linkAnswer, fileAnswer;

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
            textAnswer = <>
                <h6><Typography use='subtitle2'>{t('AnswerText')}</Typography></h6>
                <TextField
                    label={t('AnswerText')}
                    className='AnswerField'
                    fullwidth
                    onChange={this.handleTextAnswer}
                    defaultValue={this.state.text}
                    outlined
                    rows={4}
                    textarea />
            </>
        }

        if (frame.allowLinks) {
            linkAnswer = <>
                    <h6><Typography use='subtitle2'>{t('AnswerAddLink')}</Typography></h6>
                    <TextField
                    label={t('URL')}
                    className='AnswerField'
                    onChange={this.handleLinkAnswer}
                    defaultValue={this.state.link}
                    fullwidth
                    outlined />
                </>
        }

        if (frame.allowFiles) {
            fileAnswer = <div className='FileUploadContainer'>
                    <h6><Typography use='subtitle2'>{t('AnswerUploadFiles')}</Typography></h6>
                    <List>
                        {
                            this.state.files.map(file => {
                                return (
                                    <ListItem key={file.handle}>
                                        <ListItemText>
                                            <ListItemPrimaryText>{file.filename}</ListItemPrimaryText>
                                            <ListItemSecondaryText>{Math.round(file.size/1024)}kB</ListItemSecondaryText>
                                        </ListItemText>
                                        <ListItemMeta icon="delete" />
                                    </ListItem>
                                )
                            })
                        }
                    </List>
                    <ReactFilestack
                        apikey={Meteor.settings.public.filestack.apikey}
                        onSuccess={(res) => this.answerUploadSave(res, files)}
                        render={({ onPick }) => (
                            <Button label={t('PickFile')} raised onClick={onPick} />
                        )}
                    />
                </div>
        }

        return (
            <>
                <Card className='AnswerCardDetails'>
                    <h5><Typography use='headline5'>{this.props.currentFrameIndex + 1}/{this.props.filmstrip.frames.length}: {frame.title}</Typography></h5>
                    <p><Typography use='body1'>{frame.description}</Typography></p>
                    {files}
                    {link}
                </Card>
                <Card className='AnswerCard' outlined>
                    <h6 className='noMarginTop'><Typography use='subtitle2'>{t('AnswerVideo')}</Typography></h6>
                    <Button label={t('AnswerRecordButton')} raised className='big' />
                    {textAnswer}
                    {linkAnswer}
                    {fileAnswer}
                </Card>
            </>
        )
    }

}
