import { check } from 'meteor/check'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import Postmark from 'postmark'

const postmark = new Postmark.ServerClient(Meteor.settings.postmark.apikey)

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
    'questionnaire.save'({ filmstrip, frames }) {
        check(filmstrip, Object)
        check(frames, [Object])
        Filmstrips.insert(filmstrip)
        frames.forEach(frame => Frames.insert(frame))        
        return true
    },
    'questionnaire.sendConfirmation': async function ({ filmstripId, email }) {
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
});
  