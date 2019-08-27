import { Meteor } from 'meteor/meteor'
import React from 'react'
import { List, ListItem, ListItemText, ListItemPrimaryText, ListItemSecondaryText, ListItemMeta, TextField, Typography } from 'rmwc'
import ReactFilestack from 'filestack-react'
import { BigButton as Button, Form } from '/imports/ui/components/Forms.jsx';
import { PaddedCard as Card } from '/imports/ui/components/Cards.jsx';
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import Video from '/imports/ui/components/VideoPlayer.js'

const StyledReactFilestack = styled(ReactFilestack)`
  background: var(--mdc-theme-primary) !important;
  color: white !important;
  padding: 6px 12px !important;
  text-align: center !important;
  width: 100% !important;
`

export class ResponseAnswer extends React.Component {

  constructor(props) {

    super(props)

    const serializedCachedState = localStorage.getItem(this.props.currentFrame._id)
    const cachedState = serializedCachedState ? JSON.parse(serializedCachedState) : null

    if (cachedState) {
      this.state = Object.assign(cachedState, {
        showVideoRecorder: false
      })
    }
    else {
      this.state = {
        showVideoRecorder: false,
        text: '',
        link: '',
        files: []
      }
    }

  }

  responseUploadSave = (res) => {
    const stateFiles = this.state.files ? this.state.files : []
    const files = stateFiles.concat(res.filesUploaded)
    console.log(res, files)
    this.updateLocalStorageState({
      files
    })
  }

  updateLocalStorageState = (state) => {
    this.setState(state)
    const newState = Object.assign(this.state, state)
    Meteor.defer(() => {
      localStorage.setItem(this.props.currentFrame._id, JSON.stringify(newState))
    })
  }

  render() {
    const { t, emailBase64 } = this.props
    const currentFrame = this.props.currentFrame
    let textResponse, linkResponse, fileResponse

    if (currentFrame.allowTextAnswer) {
      textResponse = <>
        <TextField
          label={t('Response.Text')}
          onChange={(event) => this.updateLocalStorageState({ text: event.target.value ? event.target.value : '' })}
          value={this.state.text}
          outlined
          rows={4}
          textarea />
      </>
    }

    if (currentFrame.allowAddingLinks) {
      linkResponse = <>
        <TextField
          label={t('URL')}
          onChange={(event) => this.updateLocalStorageState({ link: event.target.value ? event.target.value : '' })}
          value={this.state.link}
          outlined />
      </>
    }

    if (currentFrame.allowAddingLinks) {
      fileResponse = <>
        <List twoLine>
          {
            this.state.files && this.state.files.map(file => {
              const removeItem = (event) => {
                this.updateLocalStorageState({
                  files: this.state.files.filter(f => f.handle !== file.handle)
                })
              }
              return (
                <ListItem key={file.handle}>
                  <ListItemText>
                    <ListItemPrimaryText>{file.filename}</ListItemPrimaryText>
                    <ListItemSecondaryText>{Math.round(file.size / 1024)}kB</ListItemSecondaryText>
                  </ListItemText>
                  <ListItemMeta icon='delete' onClick={removeItem} />
                </ListItem>
              )
            })
          }
        </List>
        <StyledReactFilestack
          apikey={Meteor.settings.public.filestack.apikey}
          onSuccess={(res) => this.responseUploadSave(res)}
          componentDisplayMode={{
            type: 'link',
            customText: `+ ${t('PickFile')}`,
          }}
          render={({ onPick }) => (
            <Button label='' onClick={onPick} />
          )}
        />
      </>
    }

    const addVideo = (event) => {
      event.preventDefault()
      this.props.history.push(`/response/${currentFrame.filmstripId}/${currentFrame._id}/${emailBase64}/recordVideo`)
    }

    return (
      <>
        <Card>
          <Form fullWidth>
            {this.state.cloudinaryPublicId && <div style={{ marginBottom: '24px' }}><Video publicId={this.state.cloudinaryPublicId} width="100%" /></div>}
            <Button
              label={t('Response.RecordButton')}
              raised
              danger
              onClick={addVideo}
            />
            {textResponse}
            {linkResponse}
            {fileResponse}
          </Form>
        </Card>
      </>
    )
  }
}
