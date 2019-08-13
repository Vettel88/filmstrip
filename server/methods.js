import { check } from 'meteor/check'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'

Meteor.methods({
    'filmstrip.frame.save'({filmstripId, no, frame}) {
        check(filmstripId, String)
        check(frame, Object)
        check(no, Number)
        Frames.upsert({filmstripId, no}, {$set: {...frame}})
    },
    'filmstrip.frame.saveVideo'({filmstripId, frameId, video}) {
        check(filmstripId, String)
        check(frameId, String)
        check(video, Object)
        Frames.upsert(frameId, {$set: {video}})
    },
});
  