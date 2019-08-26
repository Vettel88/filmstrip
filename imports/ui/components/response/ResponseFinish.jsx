import { Meteor } from 'meteor/meteor'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { emailIsValid, regexPattern } from '/imports/ui/UIHelpers.js'
import { CircularProgress, TextField, Typography, Grid, GridCell } from 'rmwc'
import { prepareResponseView } from './ResponseCommon.jsx'
import { ResponseSendConfirmation, ResponseVerifyConfirmation } from '/imports/methods/Response.js'
import { withTranslation } from 'react-i18next'
import { withTracker } from 'meteor/react-meteor-data'
import { ResponseFilmstripNotFound } from './ResponseCommon.jsx'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'
import { SignupForm } from '/imports/ui/components/users/SignUp.jsx'
import { IconCard, PaddedCard } from '/imports/ui/components/Cards.jsx'
import { Form, BigButton as Button } from '/imports/ui/components/Forms.jsx'

/**
 * Fragment used after confirmation e-mail is sent
 */
export const ResponseConfirmationSent = ({ email, t }) => {
  return (
    <IconCard
      image='/icons8-checked.svg'
      headline={t('Response.CheckYourInbox')}
      caption={t('Response.EmailSent', { email })}
    />
  )
}

/**
 * Response finished, verify e-mail address and send verification e-mail
 */
const ResponseFinishContainer = ({ email, t, filmstrip, createdFilmstripId }) => {

  const [userEmail, setUserEmail] = useState(email)
  const [isSent, setIsSent] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = (event) => {

    event.preventDefault()
    setIsSending(true)

    ResponseSendConfirmation.call(
      {
        filmstripId: createdFilmstripId,
        email: userEmail.toLowerCase().trim()
      },
      (err, res) => {

        setIsSending(false)

        if (err) console.error(err)
        else {
          localStorage.clear()
          setIsSent(true)
        }
      }
    )
  } 

  const responseUrl = `/a/${filmstrip._id}/${btoa(userEmail)}/q`

  if (isSent) return <ResponseConfirmationSent email={userEmail} t={t} />

  return (
    <IconCard
      image='/icons8-checked.svg'
      headline={t('Response.Finished')}
      caption={t('Response.EmailConfirmation')}
    >
      <Form fullWidth onSubmit={handleSubmit}>
        <TextField
          label={t('Response.LandingTypeEmail')}
          value={userEmail}
          onChange={(event) => setUserEmail(event.target.value.trim().toLowerCase())}
          outlined />
        <Typography use='caption' tag='p'>{t('Response.FinishedCopy')}</Typography>
        <Button
          label={isSending ? '' : t('Response.FinishedConfirmButton')}
          raised
          icon={isSending ? <CircularProgress /> : ''}
          disabled={!isSending && userEmail && emailIsValid(userEmail) ? false : true} />
        {
          !isSending ? <>
            <Typography use='body1' tag='p'>
              <Link to={responseUrl}>
                {t('Response.FinishedChangeResponses')}
              </Link>
            </Typography>
          </> : ''
        }
      </Form>
    </IconCard>
  )

}

export const ResponseFinish = prepareResponseView(ResponseFinishContainer)

/**
 * Coming back from e-mail link, confirm response to filmstrip
 */
const ResponseConfirmWrapper = ({ confirmationKey, email, t, createdFilmstripId }) => {

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Response only changes
  const [loading, setLoading] = React.useState(true)
  const [isConfirmed, setConfirmed] = React.useState(false)

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

  if (!loading && !isConfirmed) return <ResponseFilmstripNotFound t={t} />

  return (
      <>
        {loadingWrapper(loading, () =>
          <Grid>
            <GridCell span={12}>
              <IconCard image='/icons8-checked.svg' headline={t('Response.Confirmed')} caption={t('Response.ConfirmedCopy', { email })} />
              <PaddedCard>
                <SignupForm email={email} t={t} />
              </PaddedCard>
            </GridCell>
          </Grid>
        )}
      </>
<<<<<<< HEAD
=======
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
                        <Card>
                            <SignupForm email={email} t={t} />
                        </Card>
                    </div>
                ) : <ResponseFilmstripNotFound t={t} />
            )}
        </div>
>>>>>>> Signup form with firstname, lastname and email. Split login form into route and form itself. Added general styled form components and a styled card component to handle these forms.
=======
>>>>>>> Response only changes
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

