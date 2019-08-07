import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Queues } from '/imports/db/queues.js'

const QueueItemContent = ({queue}) =>
    <div>
        Name: {queue.name}<br/>
        ID: {queue && queue._id}
    </div>

const QueuesItemWrapper = ({loading, queue}) => 
    <ul>
        {loading 
            ? "Loading.." 
            : <QueueItemContent key={queue._id} queue={queue} />}
    </ul>

export const QueueItem = withTracker(({ match }) => {
    const handle = Meteor.subscribe('Queue', match.params.id)
    return {
        loading: !handle.ready(),
        queue: Queues.findOne()
    }
})(QueuesItemWrapper)
