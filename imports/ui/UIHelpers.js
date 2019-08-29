import '@rmwc/circular-progress/circular-progress.css'
import { CircularProgress } from 'rmwc' // eslint-disable-line no-unused-vars
import { Meteor } from 'meteor/meteor'
import { Notifications } from '/imports/ui/components/layouts/Notifications.jsx'
import React from 'react' // eslint-disable-line no-unused-vars
import i18next from 'i18next'
import { withTranslation as withTranslationOrig } from 'react-i18next'

export const loadingWrapper = (isLoading, fn) =>
  isLoading ? <CircularProgress /> : fn()

export const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// methods starting with validate return only a truthy/falsy value
export const validateEmail = email => !!email.match(regexEmail)
export const validatePassword = password => {
  return password.length > 3
}
export const emailIsValid = email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// methods starting with assert will validate and if the result is false display a message to the user
const showAndThrowError = title => {
  Notifications.notify({ title, icon: 'error' })
  throw new Error(title)
}
// TODO make this work with numbers that are 0
export const checkMandatory = (field, params) =>
  !field ? showAndThrowError(t('Validation.mandatory', params)) : null
export const checkEmail = (email, params) =>
  !validateEmail(email)
    ? showAndThrowError(t('Validation.email', params))
    : null

// TODO the 'translation' is a hard coded namespace, no good
export const addTranslations = (language, translations, ns = 'translation') =>
  i18next.addResourceBundle(language, ns, translations, true, true)
export const t = (key, params = {}) => i18next.t(key, params)
export const changeLanguage = (language, callback) =>
  i18next.changeLanguage(language, callback)
export const withTranslation = withTranslationOrig // TODO test

export const dateToString = date => date && date.toLocaleDateString()

export { Notifications } from '/imports/ui/components/layouts/Notifications.jsx'

Meteor.startup(() => {
  addTranslations('en', {
    Validation: {
      mandatory: '{{field}} is mandatory',
      email: 'The given email is invalid'
    }
  })
  addTranslations('es', {
    Validation: {
      mandatory: '{{field}} es obligatorio',
      email: 'El correo electrónico es invalido'
    }
  })
})
