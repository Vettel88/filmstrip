import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Route, Link, Redirect } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import { loadingWrapper, emailIsValid } from '/imports/ui/UIHelpers.js'
import { TextField, Button, Typography } from 'rmwc'
import { withTranslation } from 'react-i18next'
import { AnswerFrame } from './AnswerFrame.jsx'

class AnswerQuestionnaireContainer extends React.Component {

    state = {
        email: this.props.email,
        currentFrameIndex: 0,
        answers: []
    }

    handleChange = (event) => {
        console.log(event)
    }

    handleSubmit = (event) => {
        event.preventDefault()
    }

    prevQuestion = (event) => {
        event.preventDefault()
        this.setState({
            currentFrameIndex: this.state.currentFrameIndex - 1
        })
    }

    nextQuestion = (event) => {
        this.setState({
            currentFrameIndex: this.state.currentFrameIndex + 1
        })
    }

    render() {
        const { t } = this.props
        const currentFrame = this.props.filmstrip.frames[this.state.currentFrameIndex];
        const prevQuestionClass = this.state.currentFrameIndex === 0 ? 'disabled' : '';

        return (
            <div className='centered AnswerQuestionnaireContainer'>
                <h5><Typography use='headline5'>{this.props.filmstrip.name}</Typography></h5>
                <AnswerFrame key={currentFrame._id} frame={currentFrame} t={t} filmstrip={this.props.filmstrip} currentFrameIndex={this.state.currentFrameIndex} />
                <div className='AnswerNavigationButtons'>
                    <a onClick={this.prevQuestion} className={prevQuestionClass}>
                        <Typography use='button'>
                            { t('AnswerPrevQuestion') }
                        </Typography>
                    </a>
                    <a onClick={this.nextQuestion}>
                        <Typography use='button'>
                            { this.state.currentFrameIndex + 1 === this.props.filmstrip.frames.length ? t('AnswerFinish') : t('AnswerNextQuestion') }
                        </Typography>
                    </a>
                </div>
            </div>
        )

    }

}

const AnswerWrapper = ({ isLoading, filmstrip, email, t }) =>
    <div>
        {loadingWrapper(isLoading, () =>
            <AnswerQuestionnaireContainer key={filmstrip._id} filmstrip={filmstrip} email={email} t={t} />
        )}
    </div>

export const AnswerQuestionnaire = withTranslation()(withTracker(({ match }) => {
    
    const id = match.params.id
    const handle = Meteor.subscribe('AnswerFilmstrip', id)
    
    const frames = Frames.find({
        filmstripId: id
    }).fetch()

    const filmstrip = Filmstrips.findOne({
        _id: id
    })

    if(filmstrip) filmstrip.frames = frames

    return {
        isLoading: !handle.ready(),
        filmstrip,
        email: atob(match.params.emailBase64)
    }
})(AnswerWrapper))
