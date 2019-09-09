import { Meteor } from 'meteor/meteor'
import {
    Elevation,
    Grid,
    GridCell,
    Typography,
    Button as UnstyledButton,
    Card as UnstyledCard,
    Fab as UnstyledFab
} from 'rmwc'
import React from 'react'
import styled from 'styled-components'
import PhoneInput from 'react-phone-number-input'

/**
 * Phone input field made to look like an outlined
 * Material input field.
 */
export const PhoneField = styled(PhoneInput)`
    font-family: 'Roboto', sans-serif;
    height: 56px;
    border: 1px solid rgba(0, 0, 0, 0.24);
    border-radius: 4px;
    transition: border-color 110ms;
    padding: 1px;

    &:hover {
        border: 1px solid rgba(0, 0, 0, 0.87);
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

    input[type='text'],
    input[type='tel'] {
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
    margin-bottom: 1rem !important;
`

export const UnstyledForm = ({ children, ...rest }) => (
    <form {...rest}>{children}</form>
)

/**
 * 100% width form, including its elements
 */
export const FullWidthForm = styled(UnstyledForm)`
    padding: 0;
    width: 100%;

    .mdc-text-field-character-counter {
        font-size: 9px !important;
        line-height: 9px !important;
        color: #999 !important;
    }

    .mdc-text-field-character-counter::before,
    .mdc-text-field-helper-text::before {
        height: 9px;
    }

    // Add margin under elements, but not the last one
    .mdc-text-field,
    .mdc-text-area,
    .mdc-text-field--textarea,
    .react-phone-number-input {
        margin-bottom: 1rem;

        &:last-child {
            margin-bottom: 0;
        }

        + .mdc-typography--caption {
            margin-top: 0;
            margin-bottom: 1rem;
        }

        // Style character counters
        + .mdc-text-field-helper-line {
            .mdc-text-field-character-counter {
                background: white;
                border-radius: 2px;
                display: inline;
                padding: 2px 4px;
            }
            padding-right: 6px;
            position: relative;
            top: -25px;
            margin-bottom: -17px;
        }
    }

    .mdc-text-field--textarea {
        position: relative;
        textarea {
            padding-top: 14px;
            margin-bottom: 8px !important;
        }
        .mdc-text-field-character-counter {
            display: block;
            padding-right: 6px;
            height: 17px;
            margin-bottom: -17px;
            position: absolute;
            background: white;
            z-index: 2;
            border-radius: 2px;
            display: inline-block;
            padding: 2px 4px;
            bottom: 9px;
            right: 6px;
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
    fullWidth ? <FullWidthForm {...rest} /> : <UnstyledForm {...rest} />

/**
 * Error notice in a form
 */
const Notice = ({ text, ...rest }) => (
    <Elevation z={8} wrap>
        <UnstyledCard {...rest}>
            <Typography use='body2' tag='p'>
                {text}
            </Typography>
        </UnstyledCard>
    </Elevation>
)

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

/**
 * Full width button
 */
export const StickyNavButton = styled(UnstyledButton)`
    width: 100%;
    font-weight: bold !important;
    font-size: 16px !important;
    line-height: 16px !important;
    height: 48px !important;
    padding: 8px 12px !important;
    &:disabled {
        background: #ccc;
    }
`

export const StickyNav = styled(
    ({
        index,
        max,
        prevTitle,
        nextTitle,
        finishTitle,
        onPrevious,
        onNext,
        className
    }) => (
        <Grid className={className}>
            <GridCell desktop={6} tablet={4} phone={2}>
                <StickyNavButton
                    disabled={index === 0 ? 'disabled' : ''}
                    onClick={onPrevious}
                    label={prevTitle}
                    unelevated
                />
            </GridCell>
            <GridCell desktop={6} tablet={4} phone={2}>
                <StickyNavButton
                    onClick={onNext}
                    label={index + 1 === max ? finishTitle : nextTitle}
                    unelevated
                />
            </GridCell>
        </Grid>
    )
)`
    padding: 8px !important;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    height: 64px;
    background: white !important;

    .mdc-layout-grid__inner {
        background: white !important;
        grid-gap: 8px;
    }
`

/**
 * Static button fixed on bottom right
 */
export const StaticFab = styled(UnstyledFab)`
    position: fixed !important;
    bottom: 1em;
    right: 1em;
`
