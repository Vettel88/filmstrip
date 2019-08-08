import { Meteor } from 'meteor/meteor';
// import Links from '/imports/api/links';
import '/imports/ui/UIState.js'

import { Queues } from '/imports/db/queues.js';
import { Frames } from '/imports/db/frames.js';
import { Invitees } from '/imports/db/invitees.js';

const insertQueue = o => Queues.insert(o);

Meteor.startup(() => {
  // bootstrap
  Queues.remove({})
  console.log(Queues.find().count())
  if (Queues.find().count() === 0) {
    insertQueue({title: 'Queue1', description: 'Description 1' });
    insertQueue({title: 'Queue2', description: 'Description 2' });
    insertQueue({title: 'Queue3', description: 'Description 3' });
  }
  console.log(Queues.find().fetch())
});

