import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Redirect } from 'react-router-dom'
import { emailIsValid, regexPattern } from '/imports/ui/UIHelpers.js'
import { TextField, Button, Typography } from 'rmwc'
import { prepareResponseView } from './ResponseCommon.jsx'
import { ResponseSendConfirmation, ResponseVerifyConfirmation } from '/imports/methods/Response.js'
import { withTranslation } from 'react-i18next'
import { withTracker } from 'meteor/react-meteor-data'
import { ResponseFilmstripNotFound } from './ResponseCommon.jsx'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'
import { SignupForm } from '/imports/ui/components/signup/SignupForm.jsx'

class ResponseFinishContainer extends React.Component {

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

        ResponseSendConfirmation.call({
            filmstripId: this.props.createdFilmstripId,
            email: this.state.email
        }, (err, res) => {
            if (err) console.error(err)
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
        const responseUrl = `/a/${this.props.filmstrip._id}/${btoa(this.props.email)}/q`

        if (this.state.toSent === true) {
            const url = `/a/${this.props.filmstrip._id}/${btoa(this.state.email)}/sent`;
            return <Redirect to={url} />
        }

        return (
            <div className='centered ResponseQuestionnaireContainer'>
                <img src='/icons8-checked.svg' className='topIcon centered' />
                <h4><Typography use='headline4'>{t('Response.Finished')}</Typography></h4>
                <p><Typography use='body1'>{t('Response.EmailConfirmation')}</Typography></p>
                <form onSubmit={this.handleSubmit}>
                    <TextField label={t('Response.LandingTypeEmail')} value={this.state.email} onChange={this.handleChange} className='solitary' outlined pattern={regexPattern} />
                    <p className='smallHelp'><Typography use='caption'>{t('Response.FinishedCopy')}</Typography></p>
                    <Button label={t('Response.FinishedConfirmButton')} raised className='big' disabled={this.state.email && emailIsValid(this.state.email) ? false : true} />
                </form>
                <p>
                    <Typography use='body1'>
                        <a href={responseUrl}>{t('Response.FinishedChangeResponses')}</a>
                    </Typography>
                </p>
            </div>
        )
    }

}

export const ResponseFinish = prepareResponseView(ResponseFinishContainer)

export const ResponseConfirmationSent = prepareResponseView(({ email, t }) => {
    return (
        <div className='centered ResponseQuestionnaireContainer'>
            <img src='/icons8-checked.svg' className='topIcon centered' />
            <h4><Typography use='headline4'>{t('Response.Finished')}</Typography></h4>
            <p><Typography use='body1'>{t('Response.EmailSent', { email })}</Typography></p>
        </div>
    )
})

const ResponseConfirmWrapper = ({ confirmationKey, email, t, createdFilmstripId }) => {

    const [ loading, setLoading ] = React.useState(true)
    const [ isConfirmed, setConfirmed] = React.useState(false)

    ResponseVerifyConfirmation.call({
        filmstripId: createdFilmstripId,
        email,
        confirmationKey
    }, (err, res) => {
        if (err) {
            console.error(err)
            setLoading(false)
        }
        else {
            setLoading(false)
            setConfirmed(res)
        }
    })

    return (
        <div>
            {loadingWrapper(loading, () =>
                isConfirmed ? (
                    <div className='centered ResponseQuestionnaireContainer'>
                        <img src='/icons8-checked.svg' className='topIcon centered' />
                        <h4><Typography use='headline4'>{t('Response.Confirmed')}</Typography></h4>
                        <SignupForm email={email} t={t} />
                    </div>
                ) : <ResponseFilmstripNotFound t={t} />
            )}
        </div>
    )

}

export const ResponseConfirm = withTranslation()(withTracker(({ match }) => {

    const confirmationKey = match && match.params && match.params.confirmationKey ? match.params.confirmationKey : null
    const createdFilmstripId = match && match.params && match.params.createdFilmstripId ? match.params.createdFilmstripId : null

    return {
        email: match.params.emailBase64 ? atob(match.params.emailBase64) : '',
        createdFilmstripId,
        confirmationKey
    }

})(ResponseConfirmWrapper))

