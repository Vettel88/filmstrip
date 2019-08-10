import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Route, Link } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { List, ListItem } from '@rmwc/list'
import { Queues } from '/imports/db/queues.js'
import { loadingWrapper } from '/imports/ui/UIHelpers.js'

const QueuesListWrapper = ({isLoading, queues}) => 
    <List>
        {loadingWrapper(isLoading, () =>
            queues.map(queueItem => <ListItem key={queueItem.id}><Link to={`/queueitem/${queueItem._id}`}>{queueItem.name} ({queueItem._id})</Link></ListItem>))
        }
    </List>

export const QueuesList = withTracker(({ id }) => {
    const queuesHandle = Meteor.subscribe("Queues");
    return {
        isLoading: !queuesHandle.ready(),
        queues: Queues.find().fetch()
    };
})(QueuesListWrapper);
