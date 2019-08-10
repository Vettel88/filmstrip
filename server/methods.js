import { check } from 'meteor/check'
import { Filmstrips } from '/imports/db/filmstrips.js'

Meteor.methods({
    'filmstrip.addFileLink'({filmstripId, frameNo, filesUploaded}) {
        check(filmstripId, String)
        check(frameNo, Number)
        check(filesUploaded, [Object])
        console.log(filmstripId, frameNo, filesUploaded)
        Filmstrips.update({_id: filmstripId, 'frames.no': frameNo}, {$addToSet: {'frames.$.files': filesUploaded}})
    }
});
  