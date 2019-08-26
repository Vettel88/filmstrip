import { check, Match } from 'meteor/check'
import * as PostmarkAPI from 'postmark'

export const Postmark = new PostmarkAPI.ServerClient(
  Meteor.settings.postmark.apikey
)

export const sendEmailWithTemplate = async params => {
    check(params, {
        To: String,
        From: Match.Optional(String),
        Template: String,
        Language: String,
        TemplateModel: Object
    })

    const email = {
        From: params.From ? params.From : Meteor.settings.postmark.sender,
        To: params.To,
        TemplateAlias: `${params.Template}-${params.Language}`,
        TemplateModel: Object.assign(params.TemplateModel, {
            support_email: Meteor.settings.public.support.email,
            sender_name: Meteor.settings.public.support.sender,
            product_name: Meteor.settings.public.support.productName,
            product_url: Meteor.settings.public.support.productUrl
        })
    }

    try {
        return await Postmark.sendEmailWithTemplate(email)
    } catch (error) {
        console.error(error)
    }
}

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
