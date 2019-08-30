import * as UI from '/imports/ui/UIHelpers.js'
import {
    Avatar,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    Fab,
    Grid,
    GridCell,
    GridInner,
    List,
    ListDivider,
    ListGroup,
    ListItem,
    ListItemGraphic,
    ListItemMeta,
    ListItemPrimaryText,
    ListItemSecondaryText,
    ListItemText,
    TextField,
    Typography
} from 'rmwc'
import { BigButton, Form } from '/imports/ui/components/Forms.jsx'
import { Invites } from '/imports/db/invites.js'
import { ListItemAvatar } from '/imports/ui/components/Lists.jsx'
import { Meteor } from 'meteor/meteor'
import React from 'react'
import { emailIsValid } from '/imports/ui/UIHelpers.js'
import get from 'lodash/get'
import { invitesStore } from '/imports/store/invitesStore.js'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { t } from '/imports/ui/UIHelpers.js'
import upperFirst from 'lodash/upperFirst'
import { withRouter } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'

// Avatar needs words starting with uppercase letters, so do that for every word of name
const getAvatarName = name =>
    (name || 'No Name')
        .split(' ')
        .map(w => upperFirst(w))
        .join(' ')

const InvitesListItem = withRouter(
    observer(({ history, invite }) => (
        <ListItem>
            <ListItemAvatar
                icon={<Avatar size='small' name={getAvatarName(invite.name)} />}
            />
            <ListItemText>
                <ListItemPrimaryText>
                    {invite.name || t('Invites.undefined')} ({invite.email})
                </ListItemPrimaryText>
                <ListItemSecondaryText>
                    {UI.dateToString(invite.createdAt)}
                </ListItemSecondaryText>
            </ListItemText>
        </ListItem>
    ))
)

const setter = set => event => set(event.target.value)

const InvitesListWrapper = withRouter(
    observer(({}) => {
        const [filter, setFilter] = React.useState('')
        const inviteFilter = invite => {
            const email = get(invite, 'email', '').toLowerCase()
            const name = get(invite, 'name', '').toLowerCase()
            const lowerFilter = filter.toLowerCase()
            return email.includes(lowerFilter) || name.includes(lowerFilter)
        }
        const filteredInvites = () => invitesStore.invites.filter(inviteFilter)
        const [isCreateInvite, setIsCreateInvite] = React.useState(false)

        return (
            <Grid>
                <GridCell
                    span={12}
                    style={{
                        marginBottom: '12px'
                    }}>
                    <Form fullWidth>
                        <TextField
                            placeholder={t('Invites.TypeToSearch')}
                            name='filter'
                            outlined
                            value={filter}
                            onChange={setter(setFilter)}
                        />
                    </Form>
                </GridCell>

                <GridCell span={12}>
                    <Typography use='headline5' tag='h5'>
                        {t('Invites.Invited')}
                    </Typography>
                </GridCell>
                <GridCell span={12}>
                    <List twoLine avatarList>
                        {UI.loadingWrapper(invitesStore.isInvitesLoading, () =>
                            filteredInvites().map(invite => (
                                <InvitesListItem
                                    key={invite._id}
                                    invite={invite}
                                />
                            ))
                        )}
                    </List>
                    {CreateInvite({ isCreateInvite, setIsCreateInvite })}
                </GridCell>
                <GridCell
                    span={12}
                    style={{
                        textAlign: 'right'
                    }}>
                    <Fab
                        icon='add'
                        onClick={() => setIsCreateInvite(true)}
                        mini={true}
                        className='add'
                    />
                </GridCell>
            </Grid>
        )
    })
)

export const InvitesList = UI.withTranslation()(
    withTracker(({ match }) => {
        const { filmstripId } = match.params
        invitesStore.filmstripId = filmstripId
        Meteor.subscribe('Invites', () => {
            invitesStore.invites = Invites.find(
                { filmstripId },
                { sort: { createdAt: -1 } }
            ).fetch()
            invitesStore.isInvitesLoading = false
        })
        return {}
    })(InvitesListWrapper)
)

export const CreateInvite = UI.withTranslation()(
    ({ t, isCreateInvite, setIsCreateInvite }) => {
        const [name, setName] = React.useState('')
        const [email, setEmail] = React.useState('')
        const save = event => {
            event.preventDefault()
            try {
                UI.checkMandatory(name, { field: t('Invites.Name') })
                UI.checkEmail(email, { field: t('Invites.Email') })
                invitesStore.createInvite({ name, email })
                setEmail('')
                setName('')
                setIsCreateInvite(false)
            } catch (error) {
                if (error) return Notifications.error(error.message, error) // TODO i18n
            }
        }
        return isCreateInvite ? (
            <Dialog
                open={open}
                onClose={_ => {
                    setIsCreateInvite(false)
                }}
                className='CreateInviteDialog'>
                <DialogContent>
                    <Form fullWidth>
                        <Typography tag='h6' use='headline6'>
                            Send an invite
                        </Typography>
                        <TextField
                            placeholder={t('Invites.Name')}
                            name='name'
                            value={name}
                            outlined
                            onChange={setter(setName)}
                        />
                        <TextField
                            placeholder={t('Invites.Email')}
                            name='email'
                            value={email}
                            outlined
                            onChange={setter(setEmail)}
                        />
                        <BigButton
                            raised
                            disabled={
                                name &&
                                name.length > 0 &&
                                email &&
                                emailIsValid(email)
                                    ? false
                                    : true
                            }
                            onClick={save}>
                            {t('Invites.Send')}
                        </BigButton>
                    </Form>
                </DialogContent>
            </Dialog>
        ) : (
            <></>
        )
    }
)

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
            Send: 'Send'
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
            Send: 'Send'
        }
    })
})
