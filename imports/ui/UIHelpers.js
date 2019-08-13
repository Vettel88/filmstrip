import React from 'react'
import { CircularProgress } from 'rmwc'
import '@rmwc/circular-progress/circular-progress.css'

export const loadingWrapper = (isLoading, fn) =>
    isLoading ? <CircularProgress />  : fn()

export const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

export const validateEmail = email => !!email.match(regexEmail)
export const validatePassword = password => password !== 'test'

export const emailIsValid = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
