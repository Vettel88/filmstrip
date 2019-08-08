import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Route, Link } from "react-router-dom"
import { withTracker } from 'meteor/react-meteor-data'
import { Queues } from '/imports/db/queues.js'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'

const QueuesListItem = ({item}) =>     
    <li>
        <Link to={`/queueitem/${item._id}`}>{item.name} ({item._id})</Link>
    </li>

const QueuesListWrapper = ({isLoading, queues}) => 
    <div>
        <ul>
            {loadingWrapper(isLoading, () => 
                queues.map(queueItem => <QueuesListItem key={queueItem._id} item={queueItem} />))
            }
        </ul>
    </div>

export const QueuesList = withTracker(({ id }) => {
    const queuesHandle = Meteor.subscribe("Queues");
    return {
        isLoading: !queuesHandle.ready(),
        queues: Queues.find().fetch()
    };
})(QueuesListWrapper);
