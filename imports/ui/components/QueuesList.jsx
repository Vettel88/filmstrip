import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Queues } from '/imports/db/queues.js'

const QueuesListItem = ({key, item}) => <li>{item.name} ({item._id})</li>
const QueuesListList = ({loading, queues}) => 
    <ul>
        {loading ? "Loading.." : queues.map(queueItem =>
            <QueuesListItem key={queueItem._id} item={queueItem} />
        )}
    </ul>

export const QueuesListContainer = withTracker(({ id }) => {
    const queuesHandle = Meteor.subscribe('Queues')
    return {
        loading: !queuesHandle.ready(),
        queues: Queues.find().fetch()
    }

})(QueuesListList)
