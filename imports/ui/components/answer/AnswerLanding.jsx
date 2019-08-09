import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Route, Link } from "react-router-dom"
import { withTracker } from 'meteor/react-meteor-data'
import { Queues } from '/imports/db/queues.js'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'
import { TextField, Button, Typography } from 'rmwc'
import { withTranslation } from 'react-i18next';

const AnswerHome = ({ item, email, t }) =>
    <div>
        <img src="/icons8-short_hair_girl_question_mark.svg" />
        <h1><Typography use="headline1">{item.title}</Typography></h1>
        <h5><Typography use="headline5">{item.description}</Typography></h5>
        <p><Typography use="body1">{t('AnswerLandingHelp')}</Typography></p>
        <form>
            {/* TODO: data-length provokes ReferenceError: M is not defined */}
            {/* <TextInput label="Title" value={item.value} data-length={50}/> */}
            {/* <Textarea label="Description" data-length={120}/> */}
            <TextField label="Type in your e-mail address to start." value={email} onChange={(v) => console.log(v)}/>
            <Button label="Start" raised />
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
