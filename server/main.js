import { Meteor } from 'meteor/meteor';
import '/imports/ui/UIState.js'
import './methods.js'

import { Filmstrips } from '/imports/db/filmstrips.js';

const insertFilmstrip = o => Filmstrips.insert(o);

Meteor.startup(() => {
  // bootstrap
  // Filmstrips.remove({})
  if (Filmstrips.find().count() === 0) {
    insertFilmstrip({
      _id: '1',
      name: 'Filmstrip 1',
      description: 'Description of Filmstrip 1',
      frames: [
        {no: 1, title: 'Frame1', description: 'Description 1', link: 'https://filmstrip.com' },
        {no: 2, title: 'Frame2', description: 'Description 2', link: 'https://filmstrip.com/2' },
      ],
    })
  }
});

