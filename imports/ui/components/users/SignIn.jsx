import { Meteor } from 'meteor/meteor'
import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Icon, TextField, Typography } from 'rmwc'
import { loadingWrapper, validatePassword } from '/imports/ui/UIHelpers.js'
import { withTranslation } from 'react-i18next'
import { PaddedCard as Card } from '/imports/ui/components/Cards.jsx'
import {
    BigButton as Button,
    ErrorNotice,
    Form
} from '/imports/ui/components/Forms.jsx'

const SignInForm = ({ t }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [toHome, redirectToHome] = useState(false)

    const handlePassword = event => {
        setPassword(event.target.value)
        const passwordValid = validatePassword(event.target.value)
        setIsPasswordInvalid(!passwordValid)
    }

    const handleSubmit = event => {
        event.preventDefault()

        setIsLoading(true)

        Meteor.loginWithPassword(email, password, (err, res) => {
            setIsLoading(false)

            if (err) {
                console.error(err)
                setHasError(true)
            } else {
                redirectToHome(true)
            }
        })
    }

    if (toHome) {
        return <Redirect push to='/' />
    }

    return (
        <Form fullWidth onSubmit={handleSubmit}>
            {hasError ? <ErrorNotice text={t('SignIn.Error')} /> : ''}
            <TextField
                outlined
                name='email'
                type='email'
                onChange={event =>
                    setEmail(event.target.value.trim().toLowerCase())
                }
                label={t('Signup.Email')}
            />
            <TextField
                outlined
                name='password'
                type='password'
                onChange={handlePassword}
                label={t('Signup.Password')}
                invalid={isPasswordInvalid}
            />
            {loadingWrapper(isLoading, () => (
                <Button
                    label={t('SignIn.Button')}
                    disabled={
                        email && password && !isPasswordInvalid ? false : true
                    }
                    raised
                />
            ))}
        </Form>
    )
}

export const SignIn = withTranslation()(({ t }) => {
    return (
        <Card>
            <Typography use='headline4' tag='h4'>
                {t('SignIn.Header')}
            </Typography>
            <SignInForm t={t} />
            <Typography tag='p' use='body2'>
                <Link to='/signUp'>{t('SignIn.SignupLink')}</Link>
            </Typography>
        </Card>
    )
})
