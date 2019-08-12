import { Meteor } from 'meteor/meteor'
import '/imports/ui/UIState.js'
import './methods.js'

import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'

const insertFilmstrip = o => Filmstrips.insert(o)
const insertFrame = o => Frames.insert(o)

Meteor.startup(() => {
  // bootstrap
  // Filmstrips.remove({})
  // Frames.remove({})
  if (Filmstrips.find().count() === 0) {
    insertFilmstrip({
      _id: '1',
      name: 'Filmstrip 1',
      description: 'Description of Filmstrip 1',
    })
  }
  if (Frames.find().count() === 0) {
    insertFrame({ _id: '1', filmstripId: '1', no: 1, title: 'Frame 1', description: 'Description 1', link: 'https://filmstrip.com/1' })
    insertFrame({ _id: '2', filmstripId: '1', no: 2, title: 'Frame 2', description: 'Description 2', link: 'https://filmstrip.com/2' })
  }
  // console.log(JSON.stringify(Filmstrips.find().fetch(), null, 2))
  // console.log(JSON.stringify(Frames.find().fetch(), null, 2))
});

