import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { loadingWrapper, emailIsValid } from '/imports/ui/UIHelpers.js'
import { TextField, Button, Typography, Card } from 'rmwc'
import { withTranslation } from 'react-i18next'

export class SignupForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      firstname: '',
      lastname: '',
      email: this.props.email,
      phone: ''
    }
  }

  handleFirstname = (event) => {
    this.setState({
      firstname: event.target.value
    })
  }

  handleLastname = (event) => {
    this.setState({
      lastname: event.target.value
    })
  }

  handleEmail = (event) => {
    this.setState({
      email: event.target.value
    })
  }

  handlePhone = (event) => {
    this.setState({
      phone: event.target.value
    })
  }

  handleSubmit = (event) => {
    console.log("signup", this.state)
    event.preventDefault()
  }

  render() {

    const t = this.props.t
    const email = this.props.email

    return (
      <Card className='Padded4'>
        <h5><Typography use='headline5'>{t('SignupHeader')}</Typography></h5>
        <p><Typography use='body1'>{t('SignupCopy')}</Typography></p>
        <form onSubmit={this.handleSubmit}>
          <TextField label={t('SignupFirstname')} value={this.state.firstname} onChange={this.handleFirstname} className='solitary' outlined />
          <TextField label={t('SignupLastname')} value={this.state.lastname} onChange={this.handleLastname} className='solitary' outlined />
          <TextField label={t('SignupEmail')} value={this.state.email} onChange={this.handleEmail} className='solitary' outlined pattern='^[^\s@]+@[^\s@]+\.[^\s@]+$' />
          <TextField label={t('SignupPhone')} value={this.state.phone} onChange={this.handlePhone} className='solitary' outlined />
          <Button label={t('SignupButton')} raised className='big' disabled={this.state.firstname.length > 0 && this.state.lastname.length > 0 && this.state.phone.length > 3 && this.state.email && emailIsValid(this.state.email) ? false : true} />
        </form>
      </Card>
    )
  }

}
