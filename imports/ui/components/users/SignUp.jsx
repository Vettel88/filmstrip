import React, { useState } from 'react'
import {
  validatePassword,
  loadingWrapper
} from '/imports/ui/UIHelpers.js'
import { Link, Redirect } from 'react-router-dom'
import { Icon, TextField, Typography } from 'rmwc'
import { Accounts } from 'meteor/accounts-base'
import { PaddedCard as Card } from '/imports/ui/components/Cards.jsx'
import { ErrorNotice, BigButton as Button, Form } from '/imports/ui/components/Forms.jsx'
import { withTranslation } from 'react-i18next'
import PhoneInput from 'react-phone-number-input'

export const SignUp = withTranslation()(({ t }) => {
  return (
    <>
      <Card>
        <SignupForm t={t} />
        <Typography tag='p' use='body2'>
          <Link to='/signIn'>
            {t('Signup.SignInLink')}
          </Link>
        </Typography>
      </Card>
    </>
  )
})

export const SignupForm = ({ t, email }) => {

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [userEmail, setEmail] = useState(email ? email : '')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [signupError, setSignupError] = useState(false)
  const [toHome, redirectToHome] = useState(false)

  const handlePassword = event => {
    setPassword(event.target.value)
    const passwordValid = validatePassword(event.target.value)
    setIsPasswordInvalid(!passwordValid)
  }

  const handleSubmit = event => {
    event.preventDefault()

    setIsLoading(true)

    const formattedEmail = userEmail.trim().toLowerCase()
    const profile = {
      email: formattedEmail,
      firstname: firstname,
      lastname: lastname,
      createdAt: new Date()
    }

    Accounts.createUser(
      { email: formattedEmail, password, profile },
      (error, result) => {
        setIsLoading(false)

        if (error) {
          setSignupError(error.error.toString())
        } else {
          setSignupError(false)
          redirectToHome(true)
        }
      }
    )
  }

  if (toHome === true) {
    return <Redirect push to='/' />
  }

  return (
    <>
      <Typography use='headline4' tag='h4'>
        {t('Signup.Header')}
      </Typography>
      <Typography use='body2' tag='p'>
        {t('Signup.Copy')}
      </Typography>
      
      {signupError ? (
        <ErrorNotice
          text={t('Signup.Errors.' + signupError)}
        />
      ) : ''}

      <Form fullWidth onSubmit={handleSubmit}>
        <TextField
          type='email'
          name='email'
          label={t('Signup.Email')}
          value={userEmail}
          onChange={(event) => setEmail(event.target.value.trim().toLowerCase())}
        />
        <TextField
          invalid={isPasswordInvalid}
          name='password'
          name='password'
          value={password}
          type='password'
          label={t('Signup.Password')}
          onChange={handlePassword}
          minLength='6'
        />
        <Typography tag='p' use='caption'>
          {t('Signup.PasswordHelp')}
        </Typography>

        <TextField
          label={t('Signup.Firstname')}
          minLength='1'
          name='firstname'
          value={firstname}
          onChange={(event) => setFirstname(event.target.value)}
        />
        <TextField
          label={t('Signup.Lastname')}
          minLength='1'
          name='lastname'
          value={lastname}
          onChange={(event) => setLastname(event.target.value)}
        />
        <PhoneInput
          placeholder={t('Signup.Phone')}
          value={phone}
          name='phone'
          onChange={(value) => setPhone(value)}
        />
        {
          loadingWrapper(isLoading, () => <Button
          label={t('Signup.Button')}
          raised
          disabled={
            firstname &&
              firstname.length > 1 &&
              lastname &&
              lastname.length > 1 &&
              phone &&
              phone.length > 3 &&
              userEmail &&
              password &&
              !isPasswordInvalid
              ? false
              : true
          }
          raised 
          /> )
        }
      </Form>
    </>
  )
}
