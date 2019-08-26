import { Meteor } from 'meteor/meteor'
import { Typography, Grid, GridCell } from 'rmwc'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import { withTranslation } from 'react-i18next'
import { withTracker } from 'meteor/react-meteor-data'
import React, { Component } from 'react'
import { IconCard, PaddedCard } from '/imports/ui/components/Cards.jsx'
import { SignupForm } from '/imports/ui/components/users/SignUp.jsx'
import { withRouter } from 'react-router-dom'

/**
 *
 * Response flow:
 * 1. Input e-mail (ResponseLanding)
 * 2. Do questionnaire (ResponseQuestionnaire)
 * 3. Verify e-mail (ResponseFinish)
 * 4. E-mail sent (ResponseConfirmationSent)
 * 5. Come back from link in e-mail (ResponseConfirm)
 *
 */

export const ResponseLayout = (props) =>
    <>{props.children}</>

/**
 * Filmstrip not found screen
 */
export const ResponseFilmstripNotFound = ({ t }) =>
  <>
    <IconCard
      image='/icons8-short_hair_girl_question_mark.svg'
      headline={t('Response.LandingNotFound')}
      caption={t('Response.LandingPleaseCheckLink')}
    />
    <PaddedCard>
      <SignupForm t={t} />
    </PaddedCard>
  </>

/**
 * Common wrapper for responding to a filmstrip
 */
const ResponseWrapper = ({
  Component,
  isLoading,
  filmstrip,
  ...rest
}) => {

  if (!isLoading && !filmstrip) return (
    <Grid>
      <GridCell span={12}>
        <ResponseFilmstripNotFound {...rest} />
      </GridCell>
    </Grid>
  )

  return (
    <div>
      {loadingWrapper(isLoading, () => (
        <Grid>
          <GridCell span={12}>
            <Component
              key={filmstrip._id}
              filmstrip={filmstrip}
              {...rest}
            />
          </GridCell>
        </Grid>
      ))}
    </div>
  )
}

/**
 * Common data fetch and loading state handling for responding to a filmstrip.
 * Reactive with withTracker and passes down translation as {t}.
 * @param {React.Component} Component Component to render after data has loaded
 */
export const prepareResponseView = Component => {
  return withRouter(withTranslation()(
    withTracker(({ match, history }) => {
      const id =
        match && match.params && match.params.id ? match.params.id : '-1'
      const createdFilmstripId =
        match && match.params && match.params.createdFilmstripId
          ? match.params.createdFilmstripId
          : null
      const handle = Meteor.subscribe('ResponseFilmstrip', id)

      const frames = Frames.find({
        filmstripId: id
      }).fetch()

      const filmstrip = Filmstrips.findOne({
        _id: id
      })

      if (filmstrip) filmstrip.frames = frames

      return {
        Component,
        filmstrip,
        isLoading: !handle.ready(),
        email: match.params.emailBase64 ? atob(match.params.emailBase64) : '',
        createdFilmstripId,
        history
      }
    })(ResponseWrapper)
  ))
}
