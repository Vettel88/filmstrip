import { Meteor } from 'meteor/meteor'
import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { emailIsValid, regexPattern } from '/imports/ui/UIHelpers.js'
import { Grid, GridCell, GridInner, TextField, Typography } from 'rmwc'
import { prepareResponseView } from './ResponseCommon.jsx'
import { Form, BigButton as Button } from '/imports/ui/components/Forms.jsx'
import { IconCard } from '/imports/ui/components/Cards.jsx'

export const ResponseLanding = prepareResponseView(({ filmstrip, email, t }) => {

  const [userEmail, setUserEmail] = useState(email)
  const [toQuestionnaire, setToQuestionnaire] = useState(false)

  if (toQuestionnaire === true) {
    const url = `/response/${filmstrip._id}/${filmstrip.frames[0]._id}/${btoa(userEmail)}`
    return <Redirect to={url} />
  }

  return (
    <IconCard
      image='/icons8-short_hair_girl_question_mark.svg'
      headline={filmstrip.name || 'Unnamed Filmstrip'}
      caption={filmstrip.description}
      copy={t('Response.LandingHelp')}
    >
      <Form fullWidth onSubmit={() => setToQuestionnaire(true)}>
        <TextField label={t('Response.LandingTypeEmail')} value={userEmail} onChange={(event) => setUserEmail(event.target.value.trim().toLowerCase())} outlined pattern={regexPattern} />
        <Typography use='caption' tag='p'>{t('Response.LandingContact')}</Typography>
        <Button label={t('Response.Start')} raised disabled={userEmail && emailIsValid(userEmail) ? false : true} />
      </Form>
    </IconCard>
  )

})
