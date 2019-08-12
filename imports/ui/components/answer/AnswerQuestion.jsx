import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Route, Link, Redirect } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { loadingWrapper, emailIsValid } from '/imports/ui/UIHelpers.js'
import { TextField, Button, Typography } from 'rmwc'
import { withTranslation } from 'react-i18next'

export class AnswerQuestion extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: props.email ? props.email : ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
    }

    handleSubmit(event) {
        event.preventDefault()
    }

    render() {
        
        const t = this.props.t

        return (
            <div className='centered AnswerLanding'>
                <h5><Typography use='headline5'>{this.props.item.title}</Typography></h5>
            </div>
        )
    }

}
