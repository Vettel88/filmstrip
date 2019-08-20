import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Button, TextField, GridCell, GridInner, Fab, Typography, Checkbox, Avatar, Dialog, DialogContent, List, ListItem } from 'rmwc'
import { withRouter } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import get from 'lodash/get'
import { Invites } from '/imports/db/invites.js'
import * as UI from '/imports/ui/UIHelpers.js'
import { t } from '/imports/ui/UIHelpers.js'


const InvitesListItem = withRouter(({history, invite}) => {
    
    const [checked, setChecked] = React.useState(false)
    document.addEventListener('Invites.selectAll', () => setChecked(true))

    return <ListItem>
        <GridInner>
            <GridCell span={2} style={({textAlign: 'center'})}>
                <Avatar  size="xsmall" name={invite.name}/>
            </GridCell>
            <GridCell span={9}>
                <Typography use="headline7">{invite.name || t('Invites.undefined')}</Typography>
                <br/><Typography use="body2">{UI.dateToString(invite.createdAt)}</Typography>
            </GridCell>
            <GridCell span={1}>
                <Checkbox label="" checked={checked} onChange={evt => setChecked(evt.currentTarget.checked)}/>
            </GridCell>
        </GridInner>
    </ListItem>
})

const setter = set => event => set(event.target.value)

const InvitesListWrapper = withRouter(({history, isLoading, invites}) => {
    const [filter, setFilter] = React.useState('')
    const inviteFilter = invite => {
        const email = get(invite, 'email', '').toLowerCase()
        const name = get(invite, 'name', '').toLowerCase()
        const lowerFilter = filter.toLowerCase()
        return email.includes(lowerFilter) || name.includes(lowerFilter)
    }
    const filteredInvites = () => invites.filter(inviteFilter)
    const [isCreateInvite, setIsCreateInvite] = React.useState(false)
    const createInvite = event => setIsCreateInvite(true)
    const selectAll = () => document.dispatchEvent(new Event('Invites.selectAll'))
    
    return (<div className="InvitesList">
        <GridInner>
            <GridCell span={12}>
                <TextField placeholder={t('Invites.TypeToSearch')} name="filter" value={filter} onChange={setter(setFilter)}/>
            </GridCell>
            <GridCell span={11}>
                <Typography use="headline5">{t('Invites.Invited')}</Typography>
            </GridCell>
            <GridCell span={1}>
                <Button label={t('Invites.SelectAll')} onClick={selectAll} />
            </GridCell>
        </GridInner>
        <List>
            {UI.loadingWrapper(isLoading, () => 
                filteredInvites().map(invite => <InvitesListItem key={invite._id} invite={invite}/>)
            )}
        </List>
        {/* user a grid to right align as we should not use flexbox - sniff */}
        <GridInner>
            <GridCell span={11}>
            </GridCell>
            <GridCell span={1}>
                <Fab icon="add" onClick={createInvite}/>
            </GridCell>
        </GridInner>
        {CreateInvite({isCreateInvite, setIsCreateInvite})}
    </div>)
})

export const InvitesList = UI.withTranslation()(withTracker(({setInvitesCount}) => {
    const handle = Meteor.subscribe('Invites')
    return {
        isLoading: !handle.ready(),
        invites: Invites.find().fetch(),
        setInvitesCount,
    }
})(InvitesListWrapper))

export const CreateInvite = UI.withTranslation()(({t, isCreateInvite, setIsCreateInvite}) => {
    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const save = event => {
        event.preventDefault()
        try {
            UI.checkMandatory(name, { field: t('Invites.Name') })
            UI.checkEmail(email, { field: t('Invites.Email') })
            Meteor.call('filmstrip.invite.create', {name, email}, (error, result) => {
                if (error) return console.error(error)
            })
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
            promptEmail: 'Enter an email of a person you want to invite',
            Name: 'Name',
            Email: 'Email',
            Save: 'Save',
        }
    })
    UI.addTranslations('es', {
        Invites: {
            undefined: 'Todavia sin nombre',
            Invited: 'Invitado',
            TypeToSearch: 'Ingresar filtro',
            SelectAll: 'Seleccionar todos',
            promptEmail: 'Ingresa el email de una persona que quieres invitar',
            Name: 'Nombre',
            Email: 'Correo electrónico',
            Save: 'Save',
        }
    })
})