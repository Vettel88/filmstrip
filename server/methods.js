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
    'filmstrip.setLive'(filmstrip, live) {
        check(filmstrip, Object)
        check(live, Boolean)
        Filmstrips.update({_id: filmstrip._id}, {$set: { live }})
    },
    'filmstrip.saveWithFrames'(filmstrip, frames){
        check(filmstrip, Object)
        check(frames, [Object])

        const { _id, name, description } = filmstrip
        Filmstrips.update({_id}, {$set: {name, description}})

        frames.forEach(frame => {
            Frames.upsert({
                filmstripId: _id,
                no: frame.no
            }, {$set: {...frame}})
        })
    },
    'filmstrip.frame.save'({filmstripId, no, frame}) {
        check(filmstripId, String)
        check(frame, Object)
        check(no, Number)
        Frames.upsert({filmstripId, no}, {$set: {...frame}})
    },
    'filmstrip.frame.saveVideo'({filmstripId, frameId, cloudinaryPublicId}) {
        check(filmstripId, String)
        check(frameId, String)
        check(cloudinaryPublicId, String)
        Frames.upsert(frameId, {$set: {cloudinaryPublicId}})
    }
});
  