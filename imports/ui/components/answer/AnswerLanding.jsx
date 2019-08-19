import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Redirect } from 'react-router-dom'
import { emailIsValid, regexPattern } from '/imports/ui/UIHelpers.js'
import { TextField, Button, Typography } from 'rmwc'
import { prepareAnswerView } from './AnswerCommon.jsx'

class AnswerLandingContainer extends React.Component {

    state = {
        email: this.props.email ? this.props.email : '',
        toQuestionnaire: false
    }

    handleChange = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleSubmit = (event) => {
        this.setState({
            toQuestionnaire: true
        })
        event.preventDefault()
    }

    render() {
        
        const { t } = this.props

        if (this.state.toQuestionnaire === true) {
            const url = `/a/${this.props.filmstrip._id}/${btoa(this.state.email)}/q`;
            return <Redirect to={url} />
        }

        return (
            <div className='centered AnswerQuestionnaireContainer'>
                <img src='/icons8-short_hair_girl_question_mark.svg' className='topIcon centered' />
                <h4><Typography use='headline4'>{this.props.filmstrip.name}</Typography></h4>
                <p><Typography use='body1'>{this.props.filmstrip.description}</Typography></p>
                <h6><Typography use='body2'>{t('AnswerEmailConfirmation')}</Typography></h6>
                <form onSubmit={this.handleSubmit}>
                    <TextField label={t('AnswerLandingTypeEmail')} value={this.state.email} onChange={this.handleChange} className='solitary' outlined pattern={regexPattern} />
                    <p className='smallHelp'><Typography use='caption'>{t('AnswerLandingContact')}</Typography></p>
                    <Button label={t('AnswerStart')} raised className='big' disabled={this.state.email && emailIsValid(this.state.email) ? false : true} />
                </form>
            </div>
        )
    }

}

export const AnswerLanding = prepareAnswerView(AnswerLandingContainer)
