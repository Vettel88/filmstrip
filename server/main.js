import { Meteor } from 'meteor/meteor'
import '/imports/ui/UIState.js'
import './methods.js'
import '/imports/methods/Response.js'

import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import { Invites } from '/imports/db/invites.js'

const insertFilmstrip = o => Filmstrips.insert(o)
const insertFrame = o => Frames.insert(o)
const insertInvite = o => Invites.insert(o)

Meteor.startup(() => {
  // bootstrap
  //Filmstrips.remove({})
  //Frames.remove({})

  if (Filmstrips.find().count() === 0) {
    insertFilmstrip({
      _id: '1',
      name: 'Filmstrip 1',
      description: 'Description of Filmstrip 1',
      live: true,
    })
  }

  if (Frames.find().count() === 0) {
    insertFrame({
      _id: "abc1",
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
      ],
      "video": { "public_id": "filmstrip_1/blob_x9ftyt", "version": 1565720793, "signature": "090f7f0a0cbcba56c1735ff8afa76bb9dc18d421", "width": 640, "height": 480, "format": "webm", "resource_type": "video", "created_at": "2019-08-13T18:26:33Z", "tags": [], "pages": 0, "bytes": 621600, "type": "upload", "etag": "ef89370f9fa5b4dd89cb18df22ae22d8", "placeholder": false, "url": "http://res.cloudinary.com/incnition/video/upload/v1565720793/filmstrip_1/blob_x9ftyt.webm", "secure_url": "https://res.cloudinary.com/incnition/video/upload/v1565720793/filmstrip_1/blob_x9ftyt.webm", "access_mode": "public", "existing": false, "audio": { "codec": "opus", "frequency": 48000, "channels": 1, "channel_layout": "mono" }, "video": { "pix_format": "yuv420p", "codec": "vp8", "level": -99, "profile": "0", "dar": "4:3" }, "is_audio": false, "frame_rate": 1000, "duration": 4.56, "rotation": 0, "original_filename": "blob" },
    })
    insertFrame({
      _id: "def2",
      no: 2,
      title: 'Frame2',
      filmstripId: '1',
      description: 'Description 2',
      link: 'https://filmstrip.com/2',
      allowText: true,
      allowLinks: false,
      allowFiles: false,
    })
  }

  // Invites.remove({})
  if (Invites.find().count() === 0) {
    insertInvite({ name: 'Steve Skrysak', email: 'steve@kaizenrecruit.com' })
    insertInvite({ name: 'David Young', email: 'david@kaizenrecruit.com', invitedAt: new Date() })
    insertInvite({ name: 'Chuck Carpenter', email: 'chuck@kaizenrecruit.com', invitedAt: new Date(), completedAt: new Date() })
  }



  // console.log(JSON.stringify(Filmstrips.find().fetch(), null, 2))
  // console.log(JSON.stringify(Frames.find().fetch(), null, 2))

});