import { Accounts } from 'meteor/accounts-base'
import React, { useState } from 'react'
import { Route, Link } from "react-router-dom"
import { TextField, Button } from 'rmwc'
import { validateEmail, validatePassword } from '/imports/ui/UIHelpers.js'
import './users.less'

export const SignUp = () => {
    const [isEmailInvalid, setIsEmailInvalid] = useState(false)
    const [isPasswordInvalid, setIsPasswordInvalid] = useState(false)

    return (
        <Route render={({ history }) => {
            const submit = (event) => {
                event.preventDefault()
                const email = document.querySelector('[name="email"]').value
                const emailValid = validateEmail(email)
                setIsEmailInvalid(!emailValid)
                const password = document.querySelector('[name="password"]').value
                const passwordValid = !validatePassword(password)
                setIsPasswordInvalid(!passwordValid)
                if (emailValid && passwordValid) {
                    Accounts.createUser({ email, password })
                    history.push('/' )
                }
            }

            return (<>
                <form>
                    <TextField name="email" type="email" label="E-Mail" invalid={isEmailInvalid}/>
                    <TextField name="password" type="password" label="Password" invalid={isPasswordInvalid}/>
                    <Button label="Sign Up" onClick={submit} raised/>
                </form>
                <Button><Link to="/signIn">Sign in</Link></Button>
            </>)
        }} />
    )
}
