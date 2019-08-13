import React from 'react'
import { CircularProgress } from 'rmwc'
import '@rmwc/circular-progress/circular-progress.css'
import i18next from 'i18next'
// import { useTranslation } from 'react-i18next'
import { withTranslation as withTranslationOrig } from 'react-i18next'
import UIState from './UIState.js'
// import { getConsoleOutput } from '@jest/console';

export const loadingWrapper = (isLoading, fn) =>
    isLoading ? <CircularProgress />  : fn()

export const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

export const validateEmail = email => !!email.match(regexEmail)
export const validatePassword = password => password !== 'test'

export const emailIsValid = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// TODO the 'translation' is a hard coded namespace, no good
export const addTranslations = (language, translations, ns = 'translation') => 
  i18next.addResourceBundle(language, ns, translations, true, true)
export const t = (...args) => i18next.t(args)
export const changeLanguage = (language, callback) => i18next.changeLanguage(language, callback)
export const withTranslation = withTranslationOrig // TODO test
