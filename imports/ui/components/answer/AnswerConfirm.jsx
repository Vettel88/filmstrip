import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Typography } from 'rmwc'
import { withTranslation } from 'react-i18next'
import { SignupForm } from '../signup/SignupForm.jsx'

class AnswerConfirmed extends React.Component {

  render() {

    const t = this.props.t
    const email = this.props.email

    return (
      <div className='centered AnswerQuestionnaireContainer'>
        <img src='/icons8-checked.svg' className='topIcon centered' />
        <h4><Typography use='headline4'>{t('AnswerConfirmed')}</Typography></h4>
        <SignupForm email={email} t={t} />
      </div>
    )
  }

}

const AnswerWrapper = ({ email, t }) => {

  return (
      <AnswerConfirmed email={email} t={t} />
  )

}

export const AnswerConfirm = withTranslation()(withTracker(({ match }) => {
  const id = match.params.id
  return {
    filmstrip: Filmstrips.findOne(),
    email: match.params.emailBase64 ? atob(match.params.emailBase64) : ''
  }
})(AnswerWrapper))
