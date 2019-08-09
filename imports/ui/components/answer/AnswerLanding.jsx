import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Route, Link } from "react-router-dom"
import { withTracker } from 'meteor/react-meteor-data'
import { Queues } from '/imports/db/queues.js'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'
import { TextField, Button, Typography } from 'rmwc'
import { withTranslation } from 'react-i18next';

const AnswerHome = ({ item, email, t }) =>
    <div className="centered AnswerLanding">
        <img src="/icons8-short_hair_girl_question_mark.svg" className="topIcon centered" />
        <h4><Typography use="headline4">{item.title}</Typography></h4>
        <p><Typography use="body1">{item.description}</Typography></p>
        <h6><Typography use="body2">{t('AnswerLandingHelp')}</Typography></h6>
        <form>
            {/* TODO: data-length provokes ReferenceError: M is not defined */}
            {/* <TextInput label="Title" value={item.value} data-length={50}/> */}
            {/* <Textarea label="Description" data-length={120}/> */}
            <TextField label={t('AnswerLandingTypeEmail')} value={email} onChange={(v) => console.log(v)} className="solitary" outlined pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" />
            <p className="smallHelp"><Typography use="caption">{t('AnswerLandingContact')}</Typography></p>
            <Button label="Start" raised className="big" disabled={email ? false : true} />
        </form>
    </div>

const AnswerWrapper = ({ isLoading, queueItem, email, t }) =>
    <div>
        {loadingWrapper(isLoading, () =>
            <AnswerHome key={queueItem._id} item={queueItem} email={email} t={t} />
        )}
    </div>

export const AnswerLanding = withTranslation()(withTracker(({ match }) => {
    const id = match.params.id
    const handle = Meteor.subscribe('Queue', id)
    return {
        isLoading: !handle.ready(),
        queueItem: Queues.findOne(),
        email: match.params.email ? atob(match.params.email) : ""
    }
})(AnswerWrapper));
