import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import QueuesList from './QueuesList';
import { Queues } from '/imports/db/queues.js'

const QueuesListContainer = withTracker(({ id }) => {

  const queuesHandle = Meteor.subscribe('Queues')

  return {
    // currentUser: Meteor.user(),
    loading: !queuesHandle.ready(),
    queues: Queues.find().fetch()
  };

})(QueuesList);

export default QueuesListContainer;