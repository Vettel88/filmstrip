import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { loadingWrapper, emailIsValid } from '/imports/ui/UIHelpers.js'
import { TextField, Button, Typography } from 'rmwc'
import { withTranslation } from 'react-i18next'

class AnswerConfirmationSent extends React.Component {

  render() {

    const t = this.props.t
    const email = this.props.email

    return (
      <div className='centered AnswerQuestionnaireContainer'>
        <img src='/icons8-checked.svg' className='topIcon centered' />
        <h4><Typography use='headline4'>{t('AnswerFinished')}</Typography></h4>
        <p><Typography use='body1'>{t('AnswerEmailSent', { email })}</Typography></p>
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
        <AnswerConfirmationSent key={filmstrip._id} filmstrip={filmstrip} email={email} t={t} />
      )}
    </div>
  )

}

export const AnswerSent = withTranslation()(withTracker(({ match }) => {
  const id = match.params.id
  const handle = Meteor.subscribe('AnswerFilmstrip', id)
  return {
    filmstrip: Filmstrips.findOne(),
    email: match.params.emailBase64 ? atob(match.params.emailBase64) : ''
  }
})(AnswerWrapper))
