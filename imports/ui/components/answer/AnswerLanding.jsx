import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Route, Link } from "react-router-dom"
import { withTracker } from 'meteor/react-meteor-data'
import { Queues } from '/imports/db/queues.js'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'

const AnswerHome = ({ item }) =>
    <div>
        <p>{item._id}</p>
    </div>

const AnswerWrapper = ({ isLoading, queueItem }) =>
    <div>
        {loadingWrapper(isLoading, () =>
            <AnswerHome key={queueItem._id} item={queueItem} />
        )}
    </div>

export const AnswerLanding = withTracker(({ match }) => {
    const id = match.params.id
    const handle = Meteor.subscribe('Queue', id)
    console.log(Queues.findOne());
    return {
        isLoading: !handle.ready(),
        queueItem: Queues.findOne()
    }
})(AnswerWrapper);
