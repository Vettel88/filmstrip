import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import SimpleSchema from 'simpl-schema'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import Postmark from 'postmark'

let postmark;

if(Meteor.isServer) {
  postmark = new Postmark.ServerClient(Meteor.settings.postmark.apikey)
}

export const ResponseSave = new ValidatedMethod({
  name: 'Response.Save',
  mixins: [],
  validate: new SimpleSchema({
    filmstrip: {
      type: Object,
      blackbox: true, // Blackbox until we have a filmstrip schema
      optional: false
    },
    frames: {
      type: Array,
      optional: false
    },
    'frames.$': {
      type: Object,
      blackbox: true,
      optional: false
    }
  }).validator(),
  run({
    filmstrip,
    frames
  }) {

    filmstrip._id = Random.id()

    filmstrip.frameIds = frames.map(frame => {
      frame._id = Random.id()
      Frames.insert(frame)
      return frame._id
    })

    filmstrip.confirmed = false
    filmstrip.confirmationKey = Random.id(32)

    Filmstrips.insert(filmstrip)
    
    return filmstrip._id

  }
})

export const ResponseVerifyConfirmation = new ValidatedMethod({
  name: 'Response.VerifyConfirmation',
  mixins: [],
  validate: new SimpleSchema({
    filmstripId: {
      type: String,
      optional: false
    },
    email: {
      type: String,
      optional: false
    },
    confirmationKey: {
      type: String,
      optional: false
    }
  }).validator(),
  run({
    filmstripId,
    email,
    confirmationKey
  }) {

    if(Meteor.isServer) {

      const filmstripUpdateOp = Filmstrips.update({
        _id: filmstripId,
        confirmationKey,
        email
      }, {
          $set: {
            confirmed: true,
            confirmedAt: new Date()
          }
      })

      if(filmstripUpdateOp === 1) return true
      else return false

    }

  }
})

export const ResponseSendConfirmation = new ValidatedMethod({
  name: 'Response.SendConfirmation',
  mixins: [],
  validate: new SimpleSchema({
    filmstripId: {
      type: String,
      optional: false
    },
    email: {
      type: String,
      optional: false
    }
  }).validator(),
  async run({
    filmstripId,
    email
  }) {

    if(Meteor.isServer) {

      const filmstrip = Filmstrips.findOne(filmstripId)

      if (!filmstrip) throw "Filmstrip not found";

      const emailBase64 = new Buffer(email).toString('base64')
      const link = process.env.ROOT_URL + `confirm/${filmstripId}/${emailBase64}/${filmstrip.confirmationKey}`

      if (email === filmstrip.email)

      if (filmstrip) {

        try {

          await postmark.sendEmailWithTemplate({
            "From": Meteor.settings.postmark.sender,
            "To": email,
            "TemplateAlias": "ResponseConfirm-en",
            "TemplateModel": {
              "filmstrip_name": filmstrip.name,
              "action_url": link,
              "support_email": Meteor.settings.public.support.email,
              "sender_name": Meteor.settings.public.support.sender,
              "product_name": Meteor.settings.public.support.productName,
              "product_url": Meteor.settings.public.support.productUrl
            }
          })

          return true

        }
        catch (err) {
          console.error('Postmark error:', err)
        }

      }

    }

  }
})
