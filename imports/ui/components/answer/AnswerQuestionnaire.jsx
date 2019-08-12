import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Route, Link, Redirect } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { loadingWrapper, emailIsValid } from '/imports/ui/UIHelpers.js'
import { TextField, Button, Typography } from 'rmwc'
import { withTranslation } from 'react-i18next'
import { AnswerQuestion } from './AnswerQuestion.jsx'

class AnswerQuestionnaireContainer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: props.email,
            currentFrameNumber: 0
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
    }

    handleSubmit(event) {
        event.preventDefault()
    }

    render() {
        
        const t = this.props.t

        return (
            <div className='centered AnswerLanding'>
                <h5><Typography use='headline5'>{this.props.item.name}</Typography></h5>
                <AnswerQuestion item={this.props.item} frame={this.state.currentFrameNumber} />
            </div>
        )
    }

}

const AnswerWrapper = ({ isLoading, queueItem, email, t }) =>
    <div>
        {loadingWrapper(isLoading, () =>
            <AnswerQuestionnaireContainer key={queueItem._id} item={queueItem} email={email} t={t} />
        )}
    </div>

export const AnswerQuestionnaire = withTranslation()(withTracker(({ match }) => {
    const id = match.params.id
    const handle = Meteor.subscribe('Filmstrip', id)
    return {
        isLoading: !handle.ready(),
        queueItem: Filmstrips.findOne(),
        email: atob(match.params.emailBase64),
        frames: [
            {
                "_id": "1",
                "name": "Filmstrip 1",
                "description": "Description of Filmstrip 1",
                "frames": [
                    {
                        "no": 1,
                        "title": "Frame1",
                        "description": "Description 1",
                        "link": "https://filmstrip.com",
                        "files": [
                            {
                                "filename": "a1498d35-5092-4c85-9895-a52aab24eddc.jpeg",
                                "handle": "SU8Lk6RlQXqa7zya6NN6",
                                "mimetype": "image/jpeg",
                                "originalPath": "a1498d35-5092-4c85-9895-a52aab24eddc.jpeg",
                                "size": 276444,
                                "source": "local_file_system",
                                "url": "https://cdn.filestackcontent.com/SU8Lk6RlQXqa7zya6NN6",
                                "uploadId": "rbjaTqbGFRh7UpEY",
                                "originalFile": {
                                "name": "a1498d35-5092-4c85-9895-a52aab24eddc.jpeg",
                                "type": "image/jpeg",
                                "size": 276444
                                },
                                "status": "Stored"
                            }
                        ]
                    },
                    {
                        "no": 2,
                        "title": "Frame2",
                        "description": "Description 2",
                        "link": "https://filmstrip.com/2"
                    }
                ],
                "createdAt": "2019-08-10T01:03:47.073Z",
                "createdBy": "system",
                "modifiedAt": "2019-08-10T01:04:51.582Z",
                "modifiedBy": "system"
            }
        ]
    }
})(AnswerWrapper))
