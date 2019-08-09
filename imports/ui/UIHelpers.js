import React from 'react'
import { CircularProgress } from 'rmwc'

export const loadingWrapper = (isLoading, fn) =>
    isLoading ? <CircularProgress size="small" />  : fn()

export const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

export const validateEmail = email => !!email.match(regexEmail)
export const validatePassword = password => password !== 'test'
