import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import { Invites } from '/imports/db/invites.js'
import { Meteor } from 'meteor/meteor'
import { Postmark, sendEmail } from '/server/postmark.js'
import { check, Match } from 'meteor/check'
import get from 'lodash/get'

// this check needs to be called with `call` from a method to have `Meteor.userId` available
const checkFilmstripOwner = ({ filmstrip, filmstripId }) => {
  const filmstripToInvestigate =
    filmstrip || Filmstrips.findOne(filmstripId, { fields: { createdBy: 1 } })
  if (Meteor.userId() !== filmstripToInvestigate.createdBy) {
    throw `User ${Meteor.userId()} cannot access filmstrip ${
      filmstripToInvestigate._id
    }`
  }
}

Meteor.methods({
  'filmstrip.create'() {
    const filmstripId = Filmstrips.insert({})
    const frameId = Frames.insert({ filmstripId, no: 1 })
    return { filmstripId, frameId }
  },
  'filmstrip.remove'(filmstripId) {
    check(filmstripId, String)
    checkFilmstripOwner.call(this, { filmstripId })
    Frames.remove({ filmstripId })
    Filmstrips.remove({ _id: filmstripId })
  },
  'filmstrip.saveWithFrames'(filmstrip, frames) {
    check(filmstrip, Object)
    check(frames, [Object])
    checkFilmstripOwner.call(this, { filmstrip })

    const { _id, name, description } = filmstrip
    Filmstrips.update({ _id }, { $set: { name, description } })

    frames.forEach(frame => {
      Frames.upsert(
        {
          filmstripId: _id,
          no: frame.no
        },
        { $set: { ...frame } }
      )
    })
  },
  'filmstrip.frame.create'({ filmstripId, no }) {
    check(filmstripId, String)
    check(no, Number)
    checkFilmstripOwner.call(this, { filmstripId })
    const frameId = Frames.insert({
      filmstripId,
      no,
      title: ``,
      description: ``
    })
    return Frames.findOne(frameId)
  },
  'filmstrip.frame.save'({ filmstripId, no, frame }) {
    check(filmstripId, String)
    check(frame, Object)
    check(no, Number)
    checkFilmstripOwner.call(this, { filmstripId })
    Frames.upsert({ filmstripId, no }, { $set: { ...frame } })
  },
  'filmstrip.frame.saveVideo'({ filmstripId, frameId, cloudinaryPublicId }) {
    check(filmstripId, String)
    check(frameId, String)
    check(cloudinaryPublicId, String)
    checkFilmstripOwner.call(this, { filmstripId })
    Frames.upsert(frameId, { $set: { cloudinaryPublicId } })
  },
  'filmstrip.frame.remove'(_id) {
    check(_id, String)
    const frame = Frames.findOne(_id, { $fields: { filmstripId: 1 } })
    checkFilmstripOwner.call(this, { filmstripId: frame.filmstripId })
    Frames.remove({ _id })
  },
  'answer.save'({ filmstrip, frames }) {
    check(filmstrip, Object)
    check(frames, [Object])
    checkFilmstripOwner.call(this, { filmstrip })
    Filmstrips.insert(filmstrip)
    frames.forEach(frame => Frames.insert(frame))
    return true
  },
  'answer.sendConfirmation': async function({ filmstripId, email }) {
    check(filmstripId, String)
    check(email, String)
    checkFilmstripOwner.call(this, { filmstripId })

    const filmstrip = Filmstrips.findOne(filmstripId)

    if (!filmstrip) throw 'Filmstrip not found'

    const emailBase64 = new Buffer(email).toString('base64')
    const link = process.env.ROOT_URL + `/confirm/${filmstripId}/${emailBase64}`

    if (filmstrip) {
      try {
        await Postmark.sendEmail({
          From: Meteor.settings.postmark.sender,
          To: email,
          Subject: `Confirm your answers to ${filmstrip.name}`,
          TextBody: `Hello,

You're receiving this e-mail to confirm that you have answered film strip ${filmstrip.name}.

Click here to confirm your answers: ${link}

Yours,
Filmstrip.io`
        })
      } catch (err) {
        console.error('Postmark error:', err)
      }
    }

    return true
  },
  async 'filmstrip.invite.create'({ filmstripId, name, email }) {
    check(filmstripId, String)
    check(name, String)
    check(email, String)
    checkFilmstripOwner.call(this, { filmstripId })
    const inviteId = Invites.insert({ filmstripId, name, email })
    const filmstrip = Filmstrips.findOne(filmstripId)
    const username = Meteor.user().username || 'a great filmstrip user'
    const emailBase64 = new Buffer(email).toString('base64')
    const link = Meteor.absoluteUrl(`a/${filmstripId}/${emailBase64}`)
    // TODO i18n
    Postmark.sendEmail({
      From: Meteor.settings.postmark.sender,
      To: email,
      Subject: `You are invited to respond to ${filmstrip.name}`,
      TextBody: `Congratulations,

you have been invited by ${username} to respond to the film strip "${filmstrip.name}".

Click here to answer: ${link}

Yours,
Filmstrip.io`
    })
    return inviteId
  },
  'filmstrip.invite.remove'($in) {
    check($in, [String])
    const invite = Invites.findOne($in[0], { fields: { filmstripId: 1 } })
    checkFilmstripOwner.call(this, { filmstripId: invite.filmstripId })
    return Invites.remove({ _id: { $in }, createdBy: Meteor.userId() })
  },
  async 'filmstrip.invite.shareRespondedInvites'({ email, filmstripId, inviteIDs, subject, body, file }) {
    check(inviteIDs, [String])
    check([email, filmstripId, subject, body], [String])
    check(file, Match.Maybe(Object))

    const getLink = _id => Meteor.absoluteUrl(`/response/${_id}`)
    const responses = Filmstrips.find({ responseToFilmstripId: filmstripId })
        .map(({ _id }) => `\n<a href="${getLink(_id)}"></a>`)

    const postmarkEmail = {
        To: email,
        Subject: subject,
        TextBody: `${body}\n\n${responses}`,
    }
    await sendEmail(postmarkEmail)
  },
})
