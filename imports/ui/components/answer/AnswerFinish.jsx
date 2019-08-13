import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Redirect } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { loadingWrapper, emailIsValid } from '/imports/ui/UIHelpers.js'
import { TextField, Button, Typography } from 'rmwc'
import { withTranslation } from 'react-i18next'

class AnswerEnd extends React.Component {

    state = {
        email: this.props.email ? this.props.email : ''
    }

    render() {
        
        const t = this.props.t

        if (this.state.toQuestionnaire === true) {
            const url = `/a/${this.props.item._id}/${btoa(this.state.email)}/q`;
            return <Redirect to={url} />
        }

        return (
            <div className='centered AnswerQuestionnaireContainer'>
                <img src='/icons8-checked.svg' className='topIcon centered' />
                <h4><Typography use='headline4'>{this.props.item.name}</Typography></h4>
                <p><Typography use='body1'>{t('AnswerLandingFinished')}</Typography></p>
            </div>
        )
    }

}

const AnswerWrapper = ({ isLoading, queueItem, email, t }) => {

    if(!isLoading && !queueItem) {

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
              <AnswerEnd key={queueItem._id} item={queueItem} email={email} t={t} />
            )}
        </div>
    )

}

export const AnswerFinish = withTranslation()(withTracker(({ match }) => {
    const id = match.params.id
    const handle = Meteor.subscribe('AnswerFilmstrip', id)
    return {
        queueItem: Filmstrips.findOne(),
        email: match.params.emailBase64 ? atob(match.params.emailBase64) : ''
    }
})(AnswerWrapper))
