import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Redirect } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { loadingWrapper, emailIsValid } from '/imports/ui/UIHelpers.js'
import { TextField, Button, Typography } from 'rmwc'
import { withTranslation } from 'react-i18next'
import { regexEmail } from '../../UIHelpers'

class AnswerEnd extends React.Component {

    state = {
        email: this.props.email ? this.props.email : ''
    }

    handleChange = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()

        Meteor.call('answer.sendConfirmation', {
            filmstripId: this.props.filmstrip._id,
            email: this.state.email
        }, (err, res) => {
            if(err) console.log(err)
            else {
                this.setState({
                    toSent: true
                })
                console.log(res);
            }
        })
    }

    render() {
        
        const t = this.props.t
        const answerUrl = `/a/${this.props.filmstrip._id}/${btoa(this.props.email)}/q`

        if (this.state.toSent === true) {
            const url = `/a/${this.props.filmstrip._id}/${btoa(this.state.email)}/sent`;
            return <Redirect to={url} />
        }

        return (
            <div className='centered AnswerQuestionnaireContainer'>
                <img src='/icons8-checked.svg' className='topIcon centered' />
                <h4><Typography use='headline4'>{t('AnswerFinished')}</Typography></h4>
                <p><Typography use='body1'>{t('AnswerEmailConfirmation')}</Typography></p>
                <form onSubmit={this.handleSubmit}>
                    <TextField label={t('AnswerLandingTypeEmail')} value={this.state.email} onChange={this.handleChange} className='solitary' outlined pattern={regexEmail} />
                    <p className='smallHelp'><Typography use='caption'>{t('AnswerFinishedCopy')}</Typography></p>
                    <Button label={t('AnswerFinishedConfirmButton')} raised className='big' disabled={this.state.email && emailIsValid(this.state.email) ? false : true} />
                </form>
                <p>
                    <Typography use='body1'>
                        <a href={answerUrl}>{t('AnswerFinishedChangeAnswers')}</a>
                    </Typography>
                </p>
            </div>
        )
    }

}

const AnswerWrapper = ({ isLoading, filmstrip, email, t }) => {

    if (!isLoading && !filmstrip) {

        return (
            <div className='centered AnswerLanding'>
                <img src='/icons8-short_hair_girl_question_mark.svg' className='topIcon centered' />
                <h5><Typography use='headline5'>{t('AnswerLandingNotFound')}</Typography></h5>
                <p><Typography use='body1'>{t('AnswerLandingPleaseCheckLink')}</Typography></p>
            </div>
        )

    }

    return (
        <div>
            {loadingWrapper(isLoading, () =>
                <AnswerEnd key={filmstrip._id} filmstrip={filmstrip} email={email} t={t} />
            )}
        </div>
    )

}

export const AnswerFinish = withTranslation()(withTracker(({ match }) => {
    const id = match.params.id
    const handle = Meteor.subscribe('AnswerFilmstrip', id)
    return {
        isLoading: !handle.ready(),
        filmstrip: Filmstrips.findOne(),
        email: match.params.emailBase64 ? atob(match.params.emailBase64) : ''
    }
})(AnswerWrapper))
