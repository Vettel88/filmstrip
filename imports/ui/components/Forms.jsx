import { Meteor } from 'meteor/meteor'
import { Card as UnstyledCard, Button as UnstyledButton, Elevation, Typography } from 'rmwc'
import React from 'react'
import styled, { css } from 'styled-components'
import PhoneInput from 'react-phone-number-input'

/**
 * Phone input field made to look like an outlined
 * Material input field.
 */
export const PhoneField = styled(PhoneInput)`
  font-family: 'Roboto', sans-serif;
  height: 56px;
  border: 1px solid rgba(0,0,0,.24);
  border-radius: 4px;
  transition: border-color 110ms;
  padding: 1px;

  &:hover {
    border: 1px solid rgba(0,0,0,.87);
  }

  .react-phone-number-input__icon {
    position: relative;
    top: -1px;
  }

  .react-phone-number-input__country-select-arrow {
    position: relative;
    top: -2px;
  }

  &.react-phone-number-input--focus {
    border-width: 2px;
    border-color: var(--mdc-theme-primary);
    padding: 0px;
  }

  .react-phone-number-input__country {
    padding-left: 12px;
  }

  input[type=text], input[type=tel] {
    font-family: 'Roboto', sans-serif;
    height: 52px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 0 !important;
    width: 100%;
    background: transparent !important;
  }
`

/**
 * Big large button, hard to miss
 */
export const BigButton = styled(UnstyledButton)`
  height: auto !important;
  padding: 20px !important;
  line-height: 1.5rem !important;
  font-size: 1.25rem !important;
  font-weight: bold !important;
  margin-bottom: 1rem !important;
`

export const UnstyledForm = ({ children, ...rest }) =>
  <form {...rest}>
    {children}
  </form>

/**
 * 100% width form, including its elements
 */
export const FullWidthForm = styled(UnstyledForm)`
  padding: 0;
  width: 100%;

  // Add margin under elements, but not the last one
  .mdc-text-field,
  .mdc-text-area,
  .mdc-textarea,
  .react-phone-number-input {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }

    +.mdc-typography--caption {
      margin-top: 0;
      margin-bottom: 1rem;
    }

  }

  // Make elements 100% width
  .mdc-text-field,
  .mdc-text-area,
  .mdc-button {
    width: 100%;
  }

  // Center text in form fields properly
  .mdc-text-field--outlined .mdc-text-field__input {
    padding: 14px 16px 12px 16px;
  }
`

export const Form = ({ fullWidth, ...rest }) =>
  fullWidth ?
    <FullWidthForm {...rest} />
    : <UnstyledForm {...rest} />

/**
 * Error notice in a form
 */
const Notice = ({ text, ...rest }) => 
  <Elevation z={8} wrap>
    <UnstyledCard {...rest}>
      <Typography use='body2' tag='p'>{text}</Typography>
    </UnstyledCard>
  </Elevation>

export const ErrorNotice = styled(Notice)`

  border-radius: 4px;
  padding: 16px;
  margin-bottom: 24px;
  background-color: var(--mdc-theme-error) !important;

  p {
    color: white;

    a {
      color: white;
      font-weight: bold;

      &:hover {
        opacity: 0.85;
      }
    }
  }

`