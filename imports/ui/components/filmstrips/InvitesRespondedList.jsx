import { Meteor } from 'meteor/meteor'
import React from 'react'
import ReactFilestack from 'filestack-react'
import { Button, TextField, GridCell, GridInner, Fab, Typography, Checkbox, Avatar, Dialog, DialogContent, List, ListItem } from 'rmwc'
import { withRouter } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import get from 'lodash/get'
import { observer } from 'mobx-react'
import { Invites } from '/imports/db/invites.js'
import * as UI from '/imports/ui/UIHelpers.js'
import { t } from '/imports/ui/UIHelpers.js'
import { invitesStore } from '/imports/store/invitesStore.js'
import './InvitesRespondedList.less'

const InvitesRespondedListItem = withRouter(observer(({invite}) => <ListItem>
    <GridInner>
        <GridCell span={2} style={({textAlign: 'center'})} onClick={() => invitesStore.selectInviteResponded(invite)}>
            <Avatar  size="xsmall" name={invite.name}/>
        </GridCell>
        <GridCell span={9} onClick={() => invitesStore.selectInviteResponded(invite)}>
            <Typography use="headline7">{invite.name || t('InvitesResponded.undefined')}</Typography>
            <br/><Typography use="body2">{UI.dateToString(invite.createdAt)}</Typography>
        </GridCell>
        <GridCell span={1}>
            <Checkbox label="" checked={invitesStore.selectedInvitesRespondedIDs.includes(invite._id)} onChange={() => invitesStore.selectInviteResponded(invite)}/>
        </GridCell>
    </GridInner>
</ListItem>))

const setter = set => event => set(event.target.value)

const InvitesRespondedListWrapper = withRouter(observer(({}) => {
    const [filter, setFilter] = React.useState('')
    const inviteFilter = invite => {
        if (!invite.respondedAt) return false
        const email = get(invite, 'email', '').toLowerCase()
        const name = get(invite, 'name', '').toLowerCase()
        const lowerFilter = filter.toLowerCase()
        return email.includes(lowerFilter) || name.includes(lowerFilter)
    }
    const filteredInvites = () => invitesStore.invitesResponded.filter(inviteFilter)
    const [showShareInvite, setShowShareInvite] = React.useState(false)
    const renderShareButton = show => show ? <Fab icon="share" onClick={() => setShowShareInvite(true)}/> : <></>
    
    return (<div className="InvitesRespondedList">
        <GridInner>
            <GridCell span={9}>
                <TextField placeholder={t('InvitesResponded.TypeToSearch')} name="filter" value={filter} onChange={setter(setFilter)}/>
            </GridCell>
            <GridCell span={3} style={({display: 'flex', justifyContent: 'flex-end'})}>
                {renderShareButton(invitesStore.hasSelectedInvitesResponded)}
            </GridCell>
            <GridCell span={9}>
                <Typography use="headline5">{t('InvitesResponded.Responded')}</Typography>
            </GridCell>
            <GridCell span={3} style={({display: 'flex', justifyContent: 'flex-end'})}>
                <Button label={invitesStore.hasSelectedInvitesResponded ? t('InvitesResponded.DeselectAll') : t('InvitesResponded.SelectAll')} onClick={() => invitesStore.selectAllInvitesResponded()} />
            </GridCell>
        </GridInner>
        <List>
            {UI.loadingWrapper(invitesStore.isInvitesRespondedLoading, () => 
                filteredInvites().map(invite => <InvitesRespondedListItem key={invite._id} invite={invite}/>)
            )}
        </List>
        {ShareInvite({showShareInvite, setShowShareInvite})}
    </div>)
}))

export const InvitesRespondedList = UI.withTranslation()(withTracker(({filmstripId, setInvitesRespondedCount}) => {
    invitesStore.filmstripId = filmstripId
    Meteor.subscribe('Invites', () => {
        invitesStore.invitesResponded = Invites.find({filmstripId, respondedAt: { $exists: true } }).fetch()
        invitesStore.isInvitesRespondedLoading = false
    })
    return { setInvitesRespondedCount }
})(InvitesRespondedListWrapper))

export const ShareInvite = UI.withTranslation()(({t, showShareInvite, setShowShareInvite}) => {
    const [subject, setSubject] = React.useState(t(''))
    const [body, setBody] = React.useState('')
    const [file, setFile] = React.useState('')
    const share = event => {
        event.preventDefault()
        try {
            UI.checkMandatory(subject, { field: t('InvitesResponded.Subject') })
            UI.checkMandatory(body, { field: t('InvitesResponded.Body') })
            let bodyWithFile = body
            if (file) {
                bodyWithFile = `${body}\n\n${t('InvitesResponded.email.fileMsg', {file})}`
            }
            Meteor.call('filmstrip.invite.shareRespondedInvites', { inviteIDs: invitesStore.selectedInvitesRespondedIDs, subject, body: bodyWithFile, file }, (error) => {
                if (error) return console.error(error)
                setShowShareInvite(false)
                UI.Notifications.success(t('InvitesResponded.email.messageResponsesSent'))
            })    
        } catch(error) {
            UI.Notifications.error(t('InvitesResponded.errorShare'), error)
        }
    }
    return showShareInvite ? <Dialog open={open} onClose={_ => {setShowShareInvite(false)}} className="CreateInviteDialog">
        <DialogContent>
            <form>
                <TextField placeholder={t('InvitesResponded.Subject')} name="subject" value={subject} onChange={setter(setSubject)} placeholder={t('InvitesResponded.email.placeholder.Subject')}/>
                <TextField placeholder={t('InvitesResponded.Body')} name="body" value={body} onChange={setter(setBody)} textarea fullwidth rows={10} placeholder={t('InvitesResponded.email.placeholder.Body', {username: Meteor.user().username || 'Your Filmstrip user'})}/>
                <ReactFilestack
                    apikey={Meteor.settings.public.filestack.apikey}
                    onSuccess={({filesUploaded}) => setFile(filesUploaded[0])}
                    componentDisplayMode={{ customText: t('InvitesResponded.Upload'), type: 'link' }}
                    render={({ onPick }) => <Button label={t('InvitesResponded.Upload')} raised onClick={onPick} />}
                />
                <Button raised onClick={share}>{t('InvitesResponded.Share')}</Button>
            </form>
        </DialogContent>
    </Dialog> : <></>
})

Meteor.startup(() => {
    UI.addTranslations('en', {
        InvitesResponded: {
            undefined: 'No name given yet',
            Responded: 'Responded',
            TypeToSearch: 'Type to filter',
            SelectAll: 'Select All',
            DeselectAll: 'Deselect All',
            Email: 'Email',
            Subject: 'Subject',
            Body: 'Body',
            File: 'File',
            Upload: 'Upload',
            Share: 'Share',
            email: {
                placeholder: {
                    'Subject': 'Here are some interesting Filmstrip responses',
                    'Body': 'Dear Pal,\n\nthese look good to, me, what do you think?\n\n{{username}}',
                },
                fileMsg: 'The file <a href="{{file.url}}">{{file.filename}}</a> has been added to this email.',
                messageResponsesSent: 'The response(s) have been shared',
            },
            errorShare: 'The response(s) could not be shared',
        }
    })
    UI.addTranslations('es', {
        InvitesResponded: {
            undefined: 'Todavia sin nombre',
            Responded: 'Respondido',
            TypeToSearch: 'Ingresar filtro',
            SelectAll: 'Seleccionar todo',
            DeselectAll: 'Deseleccionar todo',
            Email: 'Correo electrónico',
            Subject: 'Tema',
            Body: 'Cuerpo',
            File: 'Archivo',
            Upload: 'Subir',
            Share: 'Compartir',
            email: {
                placeholder: {
                    'Subject': 'Here are some interesting Filmstrip responses',
                    'Body': 'Dear pal,\n\nthese look good to me, what do you think?\n\n{{username}}',
                },
                fileMsg: 'El archivo <a href="{{file.url}}">{{file.filename}}</a> ha sido agregado a este email.',
                messageResponsesSent: 'Las respuestas han sido inviadas',
            },
            errorShare: 'The response(s) could not be shared',
        }
    })
})