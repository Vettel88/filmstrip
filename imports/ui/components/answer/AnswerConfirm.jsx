import React from 'react'
import { Typography } from 'rmwc'
import { SignupForm } from '../signup/SignupForm.jsx'
import { prepareAnswerView } from './AnswerCommon.jsx'

class AnswerConfirmContainer extends React.Component {

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

export const AnswerConfirm = prepareAnswerView(AnswerConfirmContainer)
