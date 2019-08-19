import { Meteor } from 'meteor/meteor'
import { Typography } from 'rmwc'
import React from 'react'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import { withTranslation } from 'react-i18next'
import { withTracker } from 'meteor/react-meteor-data'

/**
 * Filmstrip not found screen
 */
const AnswerFilmstripNotFound = ({ t }) => <>
        <div className='centered AnswerLanding'>
            <img src='/icons8-short_hair_girl_question_mark.svg' className='topIcon centered' />
            <h5><Typography use='headline5'>{t('AnswerLandingNotFound')}</Typography></h5>
            <p><Typography use='body1'>{t('AnswerLandingPleaseCheckLink')}</Typography></p>
        </div>
    </>

/**
 * Common wrapper for answering a filmstrip
 */
const AnswerWrapper = ({ Component, isLoading, filmstrip, email, t }) => {

    if (!isLoading && !filmstrip) {
        return <AnswerFilmstripNotFound t={t} />
    }

    return (
        <div>
            {loadingWrapper(isLoading, () =>
                <Component key={filmstrip._id} filmstrip={filmstrip} email={email} t={t} />
            )}
        </div>
    )

}

/**
 * Common data fetch and loading state handling for answering a filmstrip.
 * Reactive with withTracker and passes down translation as {t}.
 * @param {React.Component} Component Component to render after data has loaded
 */
export const prepareAnswerView = (Component) => {
    return withTranslation()(withTracker(({ match }) => {

        const id = match && match.params && match.params.id ? match.params.id : '-1'
        const handle = Meteor.subscribe('AnswerFilmstrip', id)

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
            email: match.params.emailBase64 ? atob(match.params.emailBase64) : ''
        }

    })(AnswerWrapper))
}