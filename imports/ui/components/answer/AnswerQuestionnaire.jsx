import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Route, Link, Redirect } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { Queues } from '/imports/db/queues.js'
import { loadingWrapper, emailIsValid } from '/imports/ui/UIHelpers.js'
import { TextField, Button, Typography } from 'rmwc'
import { withTranslation } from 'react-i18next'

class AnswerQuestionnaireContainer extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: props.email ? props.email : ''
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
                <p>Questionnaire</p>
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
    const handle = Meteor.subscribe('Queue', id)
    return {
        isLoading: !handle.ready(),
        queueItem: Queues.findOne(),
        email: atob(match.params.emailBase64)
    }
})(AnswerWrapper))
