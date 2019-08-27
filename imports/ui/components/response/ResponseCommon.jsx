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
  frame,
  layoutOptions,
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
          {!layoutOptions.isFullWidth && <GridCell desktop={3} tablet={1} phone={0} /> }
          <GridCell desktop={layoutOptions.isFullWidth ? 12 : 6} tablet={layoutOptions.isFullWidth ? 8 : 6} phone={4}>
            <Component
              key={frame ? frame._id : filmstrip._id}
              filmstrip={filmstrip}
              frame={frame}
              {...rest}
            />
          </GridCell>
          {!layoutOptions.isFullWidth && <GridCell desktop={3} tablet={1} phone={0} />}
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
export const prepareResponseView = (Component, layoutOptions) => {
  return withRouter(withTranslation()(
    withTracker(({ match, history }) => {
      const filmstripId =
        match && match.params && match.params.filmstripId ? match.params.filmstripId : '-1'
      const frameId =
        match && match.params && match.params.frameId ? match.params.frameId : '-1'
      const createdFilmstripId =
        match && match.params && match.params.createdFilmstripId
          ? match.params.createdFilmstripId
          : null
      const handle = Meteor.subscribe('ResponseFilmstrip', filmstripId)

      const frames = Frames.find({
        filmstripId
      }, {
        sort: {
          no: 1
        }
      }).fetch()

      const filmstrip = Filmstrips.findOne({
        _id: filmstripId
      })

      if (filmstrip) filmstrip.frames = frames

      const frame = frames.length ? frames.find(f => f._id === frameId) : null
      const currentFrameIndex = frames.length ? frames.map(f => f._id).indexOf(frameId) : 0

      console.log("frameId", filmstripId, frameId, frames, "frame", frame, "currentFrameIndex", currentFrameIndex)

      return {
        Component,
        filmstrip,
        frame,
        frameId,
        currentFrameIndex,
        isLoading: !handle.ready(),
        email: match.params.emailBase64 ? atob(match.params.emailBase64) : '',
        emailBase64: match.params.emailBase64 ? match.params.emailBase64 : '',
        createdFilmstripId,
        layoutOptions: layoutOptions || {},
        history
      }
    })(ResponseWrapper)
  ))
}
