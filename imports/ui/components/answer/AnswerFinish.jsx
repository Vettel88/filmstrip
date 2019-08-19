import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Redirect } from 'react-router-dom'
import { emailIsValid, regexPattern } from '/imports/ui/UIHelpers.js'
import { TextField, Button, Typography } from 'rmwc'
import { prepareAnswerView } from './AnswerCommon.jsx'

class AnswerFinishContainer extends React.Component {

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
                    <TextField label={t('AnswerLandingTypeEmail')} value={this.state.email} onChange={this.handleChange} className='solitary' outlined pattern={regexPattern} />
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

export const AnswerFinish = prepareAnswerView(AnswerFinishContainer)
