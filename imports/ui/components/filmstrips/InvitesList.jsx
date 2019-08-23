import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Button, TextField, GridCell, GridInner, Fab, Typography, Checkbox, Avatar, Dialog, DialogContent, List, ListItem } from 'rmwc'
import { withRouter } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import get from 'lodash/get'
import { observer } from 'mobx-react'
import { Invites } from '/imports/db/invites.js'
import * as UI from '/imports/ui/UIHelpers.js'
import { t } from '/imports/ui/UIHelpers.js'
import { invitesStore } from '/imports/store/invitesStore.js'

const InvitesListItem = withRouter(observer(({history, invite}) => <ListItem>
    <GridInner>
        <GridCell span={2} style={({textAlign: 'center'})} onClick={() => invitesStore.selectInvite(invite)}>
            <Avatar  size="xsmall" name={invite.name}/>
        </GridCell>
        <GridCell span={9} onClick={() => invitesStore.selectInvite(invite)}>
            <Typography use="headline7">{invite.name || t('Invites.undefined')}</Typography>
            <br/><Typography use="body2">{UI.dateToString(invite.createdAt)}</Typography>
        </GridCell>
        <GridCell span={1}>
            <Checkbox label="" checked={invitesStore.selectedInviteIDs.includes(invite._id)} onChange={() => invitesStore.selectInvite(invite)}/>
        </GridCell>
    </GridInner>
</ListItem>))

const setter = set => event => set(event.target.value)

const InvitesListWrapper = withRouter(observer(({}) => {
    const [filter, setFilter] = React.useState('')
    const inviteFilter = invite => {
        const email = get(invite, 'email', '').toLowerCase()
        const name = get(invite, 'name', '').toLowerCase()
        const lowerFilter = filter.toLowerCase()
        return email.includes(lowerFilter) || name.includes(lowerFilter)
    }
    const filteredInvites = () => invitesStore.invites.filter(inviteFilter)
    const [isCreateInvite, setIsCreateInvite] = React.useState(false)
    const removeInvite = () => {
        if(confirm(t('Invites.confirmRemoval'))) {
            invitesStore.removeSelectedInvites()
        }
    }
    const renderRemoveButton = show => show ? <Fab icon="delete" onClick={removeInvite}/> : <></>
    
    return (<div className="InvitesList">
        <GridInner>
            <GridCell span={9}>
                <TextField placeholder={t('Invites.TypeToSearch')} name="filter" value={filter} onChange={setter(setFilter)}/>
            </GridCell>
            <GridCell span={3} style={({display: 'flex', justifyContent: 'flex-end'})}>
                {renderRemoveButton(invitesStore.hasSelectedInvites)}
                <Fab icon="add" onClick={() => setIsCreateInvite(true)}/>
            </GridCell>
            <GridCell span={9}>
                <Typography use="headline5">{t('Invites.Invited')}</Typography>
            </GridCell>
            <GridCell span={3} style={({display: 'flex', justifyContent: 'flex-end'})}>
                <Button label={invitesStore.hasSelectedInvites ? t('Invites.DeselectAll') : t('Invites.SelectAll')} onClick={() => invitesStore.selectAllInvites()} />
            </GridCell>
        </GridInner>
        <List>
            {UI.loadingWrapper(invitesStore.isInvitesLoading, () => 
                filteredInvites().map(invite => <InvitesListItem key={invite._id} invite={invite}/>)
            )}
        </List>
        {/* user a grid to right align as we should not use flexbox - sniff */}
        <GridInner>
            <GridCell span={9}>
            </GridCell>
            <GridCell span={3} style={({display: 'flex', justifyContent: 'flex-end'})}>
                <Fab icon="add" onClick={() => setIsCreateInvite(true)}/>
            </GridCell>
        </GridInner>
        {CreateInvite({isCreateInvite, setIsCreateInvite})}
    </div>)
}))

export const InvitesList = UI.withTranslation()(withTracker(({filmstripId, setInvitesCount}) => {
    invitesStore.filmstripId = filmstripId
    Meteor.subscribe('Invites', () => {
        invitesStore.invites = Invites.find({filmstripId}).fetch()
        invitesStore.isInvitesLoading = false
    })
    return { setInvitesCount }
})(InvitesListWrapper))

export const CreateInvite = UI.withTranslation()(({t, isCreateInvite, setIsCreateInvite}) => {
    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const save = event => {
        event.preventDefault()
        try {
            UI.checkMandatory(name, { field: t('Invites.Name') })
            UI.checkEmail(email, { field: t('Invites.Email') })
            invitesStore.createInvite({ name, email })
            setIsCreateInvite(false)
        } catch(error) {
            console.error(error.message)
        }
    }
    return isCreateInvite ? <Dialog open={open} onClose={_ => {setIsCreateInvite(false)}} className="CreateInviteDialog">
        <DialogContent>
            <form>
                <TextField placeholder={t('Invites.Name')} name="name" value={name} onChange={setter(setName)}/>
                <TextField placeholder={t('Invites.Email')} name="email" value={email} onChange={setter(setEmail)}/>
                <Button raised onClick={save}>{t('Invites.Save')}</Button>
            </form>
        </DialogContent>
    </Dialog> : <></>
})

Meteor.startup(() => {
    UI.addTranslations('en', {
        Invites: {
            undefined: 'No name given yet',
            Invited: 'Invited',
            TypeToSearch: 'Type to filter',
            SelectAll: 'Select All',
            DeselectAll: 'Deselect All',
            promptEmail: 'Enter an email of a person you want to invite',
            Name: 'Name',
            Email: 'Email',
            Save: 'Save',
            Delete: 'Delete',
            confirmRemoval: 'Do you want to delete the invite(s)?',
        }
    })
    UI.addTranslations('es', {
        Invites: {
            undefined: 'Todavia sin nombre',
            Invited: 'Invitado',
            TypeToSearch: 'Ingresar filtro',
            SelectAll: 'Seleccionar todo',
            DeselectAll: 'Deseleccionar todo',
            promptEmail: 'Ingresa el email de una persona que quieres invitar',
            Name: 'Nombre',
            Email: 'Correo electrónico',
            Save: 'Save',
            Delete: 'Borrar',
            confirmRemoval: 'Quieres borrar el/los invitado(s)',
        }
    })
})