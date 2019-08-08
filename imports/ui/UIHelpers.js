import React from 'react'
import { Preloader } from 'react-materialize'

export const loadingWrapper = (isLoading, fn) =>
    isLoading ? <Preloader size="small" />  : fn()