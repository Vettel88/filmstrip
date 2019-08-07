import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Queues } from '/imports/db/queues.js'

const QueuesListItem = ({item}) => 
    <li>{item.name} ({item._id})</li>
const QueuesListWrapper = ({loading, queues}) => 
    <ul>
        {loading ? "Loading.." : queues.map(queueItem =>
            <QueuesListItem key={queueItem._id} item={queueItem} />
        )}
    </ul>

export const QueuesList = withTracker(({ id }) => {
    const queuesHandle = Meteor.subscribe('Queues')
    return {
        loading: !queuesHandle.ready(),
        queues: Queues.find().fetch()
    }

})(QueuesListWrapper)
