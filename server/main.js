import { Meteor } from 'meteor/meteor'
import '/imports/ui/UIState.js'
import './methods.js'

import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'

const insertFilmstrip = o => Filmstrips.insert(o)
const insertFrame = o => Frames.insert(o)

Meteor.startup(() => {
  // bootstrap
  Filmstrips.remove({})
  Frames.remove({})

  if (Filmstrips.find().count() === 0) {
    insertFilmstrip({
      _id: '1',
      name: 'Filmstrip 1',
      description: 'Description of Filmstrip 1',
      live: true
    })
  }

  if (Frames.find().count() === 0) {

    insertFrame({
      no: 1,
      title: 'Frame1',
      filmstripId: '1',
      description: 'Description 1',
      link: 'https://filmstrip.com',
      allowText: true,
      allowLinks: true,
      allowFiles: true,
      files: [
        {
          "filename": "a1498d35-5092-4c85-9895-a52aab24eddc.jpeg",
          "handle": "SU8Lk6RlQXqa7zya6NN6",
          "mimetype": "image/jpeg",
          "originalPath": "a1498d35-5092-4c85-9895-a52aab24eddc.jpeg",
          "size": 276444,
          "source": "local_file_system",
          "url": "https://cdn.filestackcontent.com/SU8Lk6RlQXqa7zya6NN6",
          "uploadId": "rbjaTqbGFRh7UpEY",
          "originalFile": {
            "name": "a1498d35-5092-4c85-9895-a52aab24eddc.jpeg",
            "type": "image/jpeg",
            "size": 276444
          },
          "status": "Stored"
        }
      ]
    })

    insertFrame({
      no: 2,
      title: 'Frame2',
      filmstripId: '1',
      description: 'Description 2',
      link: 'https://filmstrip.com/2',
      allowText: true,
      allowLinks: false,
      allowFiles: false
    })

  }

  console.log(JSON.stringify(Filmstrips.find().fetch(), null, 2))
  console.log(JSON.stringify(Frames.find().fetch(), null, 2))

});