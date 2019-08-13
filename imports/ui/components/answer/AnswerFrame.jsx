import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Route, Link, Redirect } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { loadingWrapper, emailIsValid } from '/imports/ui/UIHelpers.js'
import { Card, TextField, Button, Typography } from 'rmwc'
import { withTranslation } from 'react-i18next'
import ReactFilestack from 'filestack-react'

export class AnswerFrame extends React.Component {

    state = {
        text: null,
        links: [],
        files: []
    }

    handleTextAnswer = (event) => {
        event.preventDefault()
    }

    addLink = (event) => {
        event.preventDefault()
    }

    handleLinkAnswer = (event) => {
        event.preventDefault()
    }

    handleTextAnswer = (event) => {
        event.preventDefault()
        this.setState({
            text: event.target.value
        })
    }

    answerUploadSave = (res, files, event) => {
        this.setState({
            files: this.state.files.concat(res.filesUploaded)
        })
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
                    outlined
                    rows={4}
                    textarea />
            </>
        }

        if (frame.allowLinks) {
            linkAnswer = <>
                    <h6><Typography use='subtitle2'>{t('AnswerAddLinks')}</Typography></h6>
                    <TextField
                    label={t('URL')}
                    className='AnswerField'
                    fullwidth
                    outlined />
                </>
        }

        if (frame.allowFiles) {
            fileAnswer = <div className='FileUploadContainer'>
                    <h6><Typography use='subtitle2'>{t('AnswerUploadFiles')}</Typography></h6>
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
