import { Meteor } from 'meteor/meteor'
import React from 'react'
import { TextField, Button, Typography } from 'rmwc'
import { prepareAnswerView } from './AnswerCommon.jsx'

class AnswerSentContainer extends React.Component {

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

export const AnswerSent = prepareAnswerView(AnswerSentContainer)