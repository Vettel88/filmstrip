import { check } from 'meteor/check'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import { Invites } from '/imports/db/invites.js'

// TODO move to separate file to instantiate postmark several times
import Postmark from 'postmark'
let postmark;
if(Meteor.isServer) {
  postmark = new Postmark.ServerClient(Meteor.settings.postmark.apikey)
}

Meteor.methods({
    'filmstrip.create'() {
        const filmstripId = Filmstrips.insert({})
        const frameId = Frames.insert({filmstripId, no: 1})
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
    'filmstrip.frame.create'({ filmstripId, no }) {
        check(filmstripId, String)
        check(no, Number)
        const frameId = Frames.insert({ filmstripId, no, title: '', description: `${no}`})
        return Frames.findOne(frameId)
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
    },
    'filmstrip.frame.remove'(_id) {
        console.log('remove', _id)
        check(_id, String)
        Frames.remove({ _id })
    },
    'answer.save'({ filmstrip, frames }) {
        check(filmstrip, Object)
        check(frames, [Object])
        Filmstrips.insert(filmstrip)
        frames.forEach(frame => Frames.insert(frame))        
        return true
    },
    'answer.sendConfirmation': async function ({ filmstripId, email }) {
        check(filmstripId, String)
        check(email, String)

        const filmstrip = Filmstrips.findOne(filmstripId)
        
        if(!filmstrip) throw "Filmstrip not found";

        const emailBase64 = new Buffer(email).toString('base64')
        const link = process.env.ROOT_URL+`confirm/${filmstripId}/${emailBase64}`

        if(filmstrip) {

            try {
                await postmark.sendEmail({
                    "From": Meteor.settings.postmark.sender,
                    "To": email,
                    "Subject": `Confirm your answers to ${filmstrip.name}`,
                    "TextBody": `Hello,

You're receiving this e-mail to confirm that you have answered film strip ${filmstrip.name}.

Click here to confirm your answers: ${link}

Yours,
Filmstrip.io`
                });
            }
            catch (err) {
                console.error('Postmark error:', err);
            }

        }


        return true
    },
    'filmstrip.invite.create'({filmstripId, name, email}) {
        check(filmstripId, String)
        check(name, String)
        check(email, String)
        // TODO move invites into the filmstrips document
        // TODO throw when duplicate email is inserted, maybe just a unique index will do
        const inviteId = Invites.insert({filmstripId, name, email})

        const filmstrip = Filmstrips.findOne(filmstripId)
        const username = Meteor.user().username || 'a great filmstrip user'
        const emailBase64 = new Buffer(email).toString('base64')
        const link = Meteor.absoluteUrl(`a/${filmstripId}/${emailBase64}`)
        // TODO i18n
        postmark.sendEmail({
            "From": Meteor.settings.postmark.sender,
            "To": email,
            "Subject": `You are invited to respond to ${filmstrip.name}`,
            "TextBody": `Congratulations,

you have been invited by ${username} to respond to the film strip "${filmstrip.name}".

Click here to answer: ${link}

Yours,
Filmstrip.io`
        })
        return inviteId
    },
    'filmstrip.invite.remove'($in) {
        console.log({_id: {$in}, createdBy: Meteor.userId()})
        check($in, [String])
        return Invites.remove({_id: {$in}, createdBy: Meteor.userId()})
    },
})
