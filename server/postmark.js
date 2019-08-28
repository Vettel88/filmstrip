import { check } from 'meteor/check'
import * as PostmarkAPI from 'postmark'

export const Postmark = new PostmarkAPI.ServerClient(
  Meteor.settings.postmark.apikey
)

export const sendEmail = async params => {
  check(params, {
    To: String,
    Subject: String,
    TextBody: String
  })
  const email = Object.assign(
    {},
    {
      From: Meteor.settings.postmark.sender
    },
    params
  )
  try {
    return await Postmark.sendEmail(email)
  } catch (error) {
    console.error(error)
  }
}
