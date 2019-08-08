import React from 'react'
import { CircularProgress } from 'rmwc'

export const loadingWrapper = (isLoading, fn) =>
    isLoading ? <CircularProgress size="small" />  : fn()