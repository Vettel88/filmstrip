import { Meteor } from 'meteor/meteor'
import React from 'react'
import ReactFilestack from 'filestack-react'
import { Button, TextField, GridCell, GridInner, Fab, Typography, Checkbox, Avatar, Dialog, DialogContent, List, ListItem } from 'rmwc'
import { withRouter } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import get from 'lodash/get'
import { observer } from 'mobx-react'
import { Invites } from '/imports/db/invites.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import * as UI from '/imports/ui/UIHelpers.js'
import { t } from '/imports/ui/UIHelpers.js'
import { invitesStore } from '/imports/store/invitesStore.js'
import './InvitesRespondedList.less'

const avatarName = invite => (invite.name || 'No Name').toUpperCase()

const InvitesRespondedListItem = withRouter(observer(({invite}) => <li onClick={() => invitesStore.selectInviteResponded(invite)}>
    <Avatar size="xsmall" name={avatarName(invite)}/>
    <div className="description">
        <Typography use="headline6">{invite.name || t('InvitesResponded.undefined')}</Typography>
        <br/><Typography use="body2">{UI.dateToString(invite.createdAt)}</Typography>
    </div>
    <Checkbox label="" checked={invitesStore.filmstripsRespondedIDs.includes(invite._id)}/>
</li>))

const setter = set => event => set(event.target.value)
const renderShareButton = show => show ? <Fab icon="share" onClick={() => setShowShareInvite(true)} className="share" mini={true}/> : <></>

const InvitesRespondedListWrapper = withRouter(observer(({ filmstripId }) => {
    const [filter, setFilter] = React.useState('')
    const inviteFilter = invite => {
        const email = get(invite, 'email', '').toLowerCase()
        const name = get(invite, 'name', '').toLowerCase()
        const lowerFilter = filter.toLowerCase()
        return email.includes(lowerFilter) || name.includes(lowerFilter)
    }
    const filteredInvites = () => invitesStore.filmstripsResponded.filter(inviteFilter)
    const [showShareInvite, setShowShareInvite] = React.useState(false)
    const renderShareButton = show => show ? <Fab icon="share" className="share" onClick={() => setShowShareInvite(true)} mini={true} /> : <></>

    return (<div className="InvitesRespondedList">
        <TextField placeholder={t('InvitesResponded.TypeToSearch')} name="filter" value={filter} onChange={setter(setFilter)}/>
        <div className="listTitle">
            <Typography use="headline5">{t('InvitesResponded.Responded')}</Typography>
            <Button label={invitesStore.hasSelectedInvitesResponded ? t('InvitesResponded.DeselectAll') : t('InvitesResponded.SelectAll')} onClick={() => invitesStore.selectAllInvitesResponded()} />
        </div>

        {renderShareButton(invitesStore.hasSelectedInvitesResponded)}
        <ul>
            {UI.loadingWrapper(invitesStore.isFilmstripsRespondedLoading, () => 
                filteredInvites().map(invite => <InvitesRespondedListItem key={invite._id} invite={invite}/>)
            )}
        </ul>
        {ShareInvite({filmstripId, showShareInvite, setShowShareInvite})}
    </div>)
}))

export const InvitesRespondedList = UI.withTranslation()(withTracker(({match}) => {
    const { filmstripId } = match.params
    invitesStore.filmstripId = filmstripId
    Meteor.subscribe('Filmstrips', () => {
        invitesStore.filmstripsResponded = Filmstrips.find({ responseToFilmstripId: filmstripId }).fetch()
        invitesStore.isFilmstripsRespondedLoading = false
    })
    return { filmstripId }
})(InvitesRespondedListWrapper))

export const ShareInvite = UI.withTranslation()(({t, match, filmstripId, showShareInvite, setShowShareInvite}) => {
    const [email, setEmail] = React.useState(t(''))
    const [subject, setSubject] = React.useState(t(''))
    const [body, setBody] = React.useState('')
    const [file, setFile] = React.useState()
    const share = event => {
        event.preventDefault()
        try {
            // TODO it should be possible to enter several emails at once
            UI.checkEmail(email, { field: t('Invites.Email') })
            UI.checkMandatory(subject, { field: t('InvitesResponded.Subject') })
            UI.checkMandatory(body, { field: t('InvitesResponded.Body') })
            let bodyWithFile = body
            // TODO file is always undefined, I would need some more minutes to fix it
            console.log(file)
            if (file) {
                bodyWithFile = `${body}\n\n${t('InvitesResponded.email.fileMsg', {file})}`
            }
            Meteor.call('filmstrip.invite.shareRespondedInvites', { email, filmstripId, inviteIDs: invitesStore.filmstripsRespondedIDs, subject, body: bodyWithFile, file }, (error) => {
                if (error) return UI.Notifications.error(t('InvitesResponded.errorShare'), error)
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
                <TextField placeholder={t('InvitesResponded.Email')} name="email" value={email} fullwidth
                    onChange={setter(setEmail)} placeholder={t('InvitesResponded.email.placeholder.Email')} />
                <TextField placeholder={t('InvitesResponded.Subject')} name="subject" value={subject} fullwidth
                    onChange={setter(setSubject)} placeholder={t('InvitesResponded.email.placeholder.Subject')} />
                {/* TODO i18n */}
                <TextField placeholder={t('InvitesResponded.Body')} name="body" value={body} 
                    onChange={setter(setBody)} textarea fullwidth rows={10}
                    placeholder={t('InvitesResponded.email.placeholder.Body', {username: Meteor.user().username || 'Your Filmstrip user'})}/>
                <div>
                    <ReactFilestack
                        apikey={Meteor.settings.public.filestack.apikey}
                        onSuccess={({filesUploaded}) => setFile(filesUploaded[0])}
                        componentDisplayMode={{ customText: t('InvitesResponded.Upload'), type: 'link' }}
                        render={({ onPick }) => <Button label={t('InvitesResponded.Upload')} raised onClick={onPick} />}
                    />
                </div>
                <div><Button raised onClick={share}>{t('InvitesResponded.Share')}</Button></div>
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
