import { check } from 'meteor/check'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'

Meteor.methods({
    'filmstrip.create'() {
        console.log('filmstrip.create')
        const filmstripId = Filmstrips.insert({})
        const frameId = Frames.insert({filmstripId, no: 1})
        console.log(filmstripId, frameId)
        return { filmstripId, frameId }
    },
    'filmstrip.remove'(filmstripId) {
        check(filmstripId, String)
        Frames.remove({filmstripId})
        Filmstrips.remove({_id: filmstripId})
    },
    'filmstrip.toggleLive'(filmstrip) {
        check(filmstrip, Object)
        Filmstrips.update({_id: filmstrip._id}, {$set: {live: !filmstrip.live}})
    },
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
    'questionnaire.save'({ filmstrip, frames }) {
        check(filmstrip, Object)
        check(frames, [Object])
        Filmstrips.insert(filmstrip)
        frames.forEach(frame => Frames.insert(frame))        
        return true
    },
});
  