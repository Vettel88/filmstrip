import { Meteor } from 'meteor/meteor';
// import Links from '/imports/api/links';

import { Queues } from '/imports/db/queues.js';
import { Frames } from '/imports/db/frames.js';
import { Invitees } from '/imports/db/invitees.js';

const insertQueue = (name) => Queues.insert({ name });

Meteor.startup(() => {
  // bootstrap
  if (Queues.find().count() === 0) {
    insertQueue('Queue1');
    insertQueue('Queue2');
    insertQueue('Queue3');
  }
});

