import { Meteor } from 'meteor/meteor'
import { Typography } from 'rmwc'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import { withTranslation } from 'react-i18next'
import { withTracker } from 'meteor/react-meteor-data'
import React, { Component } from 'react'

export class ResponseLayout extends Component {
    render() {
        return (
            <>
                {this.props.children}
            </>
        )
    }
}

/**
 * Filmstrip not found screen
 */
export const ResponseFilmstripNotFound = ({ t }) => <>
        <div className='centered ResponseLanding'>
            <img src='/icons8-short_hair_girl_question_mark.svg' className='topIcon centered' />
            <h5><Typography use='headline5'>{t('Response.LandingNotFound')}</Typography></h5>
            <p><Typography use='body1'>{t('Response.LandingPleaseCheckLink')}</Typography></p>
        </div>
    </>

/**
 * Common wrapper for responding to a filmstrip
 */
const ResponseWrapper = ({ Component, isLoading, filmstrip, email, t, createdFilmstripId }) => {

    if (!isLoading && !filmstrip) {
        return <ResponseFilmstripNotFound t={t} />
    }

    return (
        <div>
            {loadingWrapper(isLoading, () =>
                <Component key={filmstrip._id} filmstrip={filmstrip} email={email} t={t} createdFilmstripId={createdFilmstripId} />
            )}
        </div>
    )

}

/**
 * Common data fetch and loading state handling for responding to a filmstrip.
 * Reactive with withTracker and passes down translation as {t}.
 * @param {React.Component} Component Component to render after data has loaded
 */
export const prepareResponseView = (Component) => {
    return withTranslation()(withTracker(({ match }) => {

        const id = match && match.params && match.params.id ? match.params.id : '-1'
        const createdFilmstripId = match && match.params && match.params.createdFilmstripId ? match.params.createdFilmstripId : null
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
            createdFilmstripId
        }

    })(ResponseWrapper))
}