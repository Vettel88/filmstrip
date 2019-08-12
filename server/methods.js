import { check } from 'meteor/check'
import { Filmstrips } from '/imports/db/filmstrips.js'

Meteor.methods({
    'filmstrip.frame.addFile'({filmstripId, frameNo, filesUploaded}) {
        check(filmstripId, String)
        check(frameNo, Number)
        check(filesUploaded, [Object])
        console.log(filmstripId, frameNo, filesUploaded)
        filesUploaded.forEach(file =>
            Filmstrips.update({_id: filmstripId, 'frames.no': frameNo}, {$addToSet: {'frames.$.files': file}})
        )
    },
    'filmstrip.frame.removeFile'({filmstripId, frameNo, handle}) {
        check(filmstripId, String)
        check(frameNo, Number)
        check(handle, String)
        // TODO remove, but before move frame to its own collection, unfortunately
        console.log(filmstripId, frameNo, handle)
    },
});
  