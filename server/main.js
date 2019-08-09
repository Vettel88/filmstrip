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
    insertQueue({_id: 'LffAHLNevvBoM2KrZ', title: 'Queue1', description: 'Description 1' });
    insertQueue({_id: 'owF5a7SmZBp9PmaDH', title: 'Queue2', description: 'Description 2' });
    insertQueue({_id: 'MAdMtP2gaJ4cpcaXe', title: 'Queue3', description: 'Description 3' });
  }
  console.log(Queues.find().fetch())
});

