import * as UI from '/imports/ui/UIHelpers.js'
import {
    Avatar,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    Elevation,
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
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import { Meteor } from 'meteor/meteor'
import React, { useState } from 'react'
import ReactFilestack from 'filestack-react'
import get from 'lodash/get'
import { invitesStore } from '/imports/store/invitesStore.js'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import { t } from '/imports/ui/UIHelpers.js'
import { withRouter } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'

const avatarName = invite => (invite.email || 'No Name').toUpperCase()
const getCloudinaryPosterUrl = frame => {
    if (frame && frame.cloudinaryPublicId) {
        return `http://res.cloudinary.com/${Meteor.settings.public.cloudinary.cloudName}/video/upload/v1/${frame.cloudinaryPublicId}.jpg`
    } else {
        return ``
    }
}

const StyledListItemGraphic = styled(ListItemGraphic)`
    margin-left: 0;
    margin-right: 16px;
    width: 40px;
    height: 40px;
    display: block;
    position: relative;
    .rmwc-avatar__icon,
    .rmwc-avatar__text {
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 50%;
        display: block;
        width: 40px;
        height: 40px;
        z-index: 2;
    }
    .rmwc-avatar__text {
        z-index: 1;
        border: 1px solid rgba(0, 0, 0, 0.24);
        color: rgba(0, 0, 0, 0.24);
        text-align: center;
        font-family: Roboto;
        font-size: 16px;
        padding-top: 12px;
    }
`

const FilmstripResponsesListItem = withRouter(
    observer(({ filmstrip, history }) => {
        const goToResponse = () => {
            history.push(`/response/${filmstrip._id}`)
        }

        return (
            <ListItem onClick={goToResponse}>
                <StyledListItemGraphic
                    icon={
                        <Avatar
                            size='small'
                            src={getCloudinaryPosterUrl(filmstrip.frame)}
                            name={avatarName(filmstrip)}
                        />
                    }
                />
                <ListItemText>
                    <ListItemPrimaryText>
                        {filmstrip.email || t('InvitesResponded.undefined')}
                    </ListItemPrimaryText>
                    <ListItemSecondaryText>
                        {UI.dateToString(filmstrip.createdAt)}
                    </ListItemSecondaryText>
                </ListItemText>
                <ListItemMeta>
                    <Checkbox
                        label=''
                        onClick={event => {
                            event.stopPropagation()
                            event.preventDefault()
                            invitesStore.selectInviteResponded(filmstrip)
                        }}
                        checked={invitesStore.filmstripsRespondedIDs.includes(
                            filmstrip._id
                        )}
                    />
                </ListItemMeta>
            </ListItem>
        )
    })
)

const setter = set => event => set(event.target.value)

const FilmstripResponsesListWrapper = withRouter(
    observer(({ filmstripId }) => {
        const [filter, setFilter] = React.useState('')
        const filmstripFilter = filmstrip => {
            const email = get(filmstrip, 'email', '').toLowerCase()
            const name = get(filmstrip, 'name', '').toLowerCase()
            const lowerFilter = filter.toLowerCase()
            return email.includes(lowerFilter) || name.includes(lowerFilter)
        }
        const filteredResponseFilmstrips = () =>
            invitesStore.filmstripsResponded.filter(filmstripFilter)
        const [showShareResponse, setShowShareResponse] = React.useState(false)
        const renderShareButton = show =>
            show ? (
                <Fab
                    icon='share'
                    className='share'
                    onClick={() => setShowShareResponse(true)}
                />
            ) : (
                <></>
            )

        return (
            <Grid>
                <GridCell
                    span={12}
                    style={{
                        marginBottom: '12px'
                    }}>
                    <Form fullWidth>
                        <TextField
                            placeholder={t('InvitesResponded.TypeToSearch')}
                            name='filter'
                            value={filter}
                            outlined
                            onChange={setter(setFilter)}
                        />
                    </Form>
                </GridCell>
                <GridCell span={12}>
                    <GridInner>
                        <GridCell desktop={6} tablet={4} phone={2}>
                            <Typography use='headline5' tag='h5'>
                                {t('InvitesResponded.Responded')}
                            </Typography>
                        </GridCell>
                        <GridCell
                            desktop={6}
                            tablet={4}
                            phone={2}
                            align='right'
                            style={{
                                textAlign: 'right'
                            }}>
                            <Button
                                label={
                                    invitesStore.hasSelectedInvitesResponded
                                        ? t('InvitesResponded.DeselectAll')
                                        : t('InvitesResponded.SelectAll')
                                }
                                onClick={() =>
                                    invitesStore.selectAllInvitesResponded()
                                }
                            />
                        </GridCell>
                    </GridInner>
                </GridCell>
                <GridCell span={12}>
                    <List twoLine avatarList>
                        {UI.loadingWrapper(
                            invitesStore.isFilmstripsRespondedLoading,
                            () =>
                                filteredResponseFilmstrips().map(filmstrip => (
                                    <FilmstripResponsesListItem
                                        key={filmstrip._id}
                                        filmstrip={filmstrip}
                                    />
                                ))
                        )}
                    </List>
                </GridCell>
                <GridCell
                    span={12}
                    style={{
                        textAlign: 'right'
                    }}>
                    {renderShareButton(
                        invitesStore.hasSelectedInvitesResponded
                    )}
                </GridCell>
                {ShareResponse({
                    filmstripId,
                    showShareResponse,
                    setShowShareResponse
                })}
            </Grid>
        )
    })
)

export const InvitesRespondedList = UI.withTranslation()(
    withTracker(({ match }) => {
        const { filmstripId } = match.params
        invitesStore.filmstripId = filmstripId
        Meteor.subscribe('CompletedFilmstripResponses', filmstripId, () => {
            invitesStore.filmstripsResponded = Filmstrips.find(
                {
                    responseToFilmstripId: filmstripId
                },
                {
                    sort: {
                        createdAt: -1
                    }
                }
            )
                .fetch()
                .map(filmstrip => {
                    filmstrip.frame = Frames.findOne({
                        filmstripId: filmstrip._id,
                        no: 1
                    })
                    return filmstrip
                })
            invitesStore.isFilmstripsRespondedLoading = false
        })
        return { filmstripId }
    })(FilmstripResponsesListWrapper)
)

export const ShareResponse = UI.withTranslation()(
    ({ t, match, filmstripId, showShareResponse, setShowShareResponse }) => {
        const [email, setEmail] = React.useState(t(''))
        const [subject, setSubject] = React.useState(t(''))
        const [body, setBody] = React.useState('')
        const [files, setFiles] = React.useState([])
        const share = event => {
            event.preventDefault()
            try {
                // TODO it should be possible to enter several emails at once
                UI.checkEmail(email, { field: t('Invites.Email') })
                UI.checkMandatory(subject, {
                    field: t('InvitesResponded.Subject')
                })
                UI.checkMandatory(body, { field: t('InvitesResponded.Body') })
                let bodyWithFile = body
                if (files.length > 0) {
                    let filesTxt
                    filesTxt = files
                        .map(f => {
                            return `${f.filename}: ${f.url}`
                        })
                        .join('\n')
                    bodyWithFile = `${body}\n\n${t(
                        'InvitesResponded.email.fileMsg'
                    )}\n\n${filesTxt}`
                }
                Meteor.call(
                    'filmstrip.invite.shareRespondedInvites',
                    {
                        email,
                        filmstripId,
                        inviteIDs: invitesStore.filmstripsRespondedIDs,
                        subject,
                        body: bodyWithFile,
                        files
                    },
                    error => {
                        if (error)
                            return UI.Notifications.error(
                                t('InvitesResponded.errorShare'),
                                error
                            )
                        setEmail('')
                        setSubject('')
                        setBody('')
                        setFiles([])
                        setShowShareResponse(false)
                        UI.Notifications.success(
                            t('InvitesResponded.email.messageResponsesSent')
                        )
                    }
                )
            } catch (error) {
                UI.Notifications.error(t('InvitesResponded.errorShare'), error)
            }
        }

        return (
            showShareResponse && (
                <Dialog
                    open={open}
                    onClose={() => {
                        setShowShareResponse(false)
                    }}
                    className='CreateInviteDialog'>
                    <DialogContent>
                        <Form fullWidth>
                            <Typography tag='h6' use='headline6'>
                                Share responses
                            </Typography>
                            <TextField
                                placeholder={t('InvitesResponded.Email')}
                                name='email'
                                value={email}
                                outlined
                                onChange={setter(setEmail)}
                                placeholder={t(
                                    'InvitesResponded.email.placeholder.Email'
                                )}
                            />
                            <TextField
                                placeholder={t('InvitesResponded.Subject')}
                                name='subject'
                                value={subject}
                                outlined
                                onChange={setter(setSubject)}
                                placeholder={t(
                                    'InvitesResponded.email.placeholder.Subject'
                                )}
                            />
                            <TextField
                                placeholder={t('InvitesResponded.Body')}
                                name='body'
                                value={body}
                                onChange={setter(setBody)}
                                textarea
                                outlined
                                rows={10}
                                placeholder={t(
                                    'InvitesResponded.email.placeholder.Body',
                                    {
                                        username:
                                            Meteor.user().username ||
                                            'Your Filmstrip user'
                                    }
                                )}
                            />
                            <ReactFilestack
                                apikey={Meteor.settings.public.filestack.apikey}
                                onSuccess={({ filesUploaded }) =>
                                    setFiles(files.concat(filesUploaded))
                                }
                                componentDisplayMode={{
                                    customText: t('InvitesResponded.Upload'),
                                    type: 'link'
                                }}
                                render={({ onPick }) => (
                                    <Button
                                        label={t('InvitesResponded.Upload')}
                                        raised
                                        onClick={onPick}
                                    />
                                )}
                            />
                            <List twoLine>
                                {files.length > 0 &&
                                    files.map(file => {
                                        const removeItem = () => {
                                            setFiles(
                                                files.filter(
                                                    f =>
                                                        f.handle !== file.handle
                                                )
                                            )
                                        }
                                        return (
                                            <ListItem key={file.handle}>
                                                <ListItemText>
                                                    <ListItemPrimaryText>
                                                        {file.filename}
                                                    </ListItemPrimaryText>
                                                    <ListItemSecondaryText>
                                                        {Math.round(
                                                            file.size / 1024
                                                        )}
                                                        kB
                                                    </ListItemSecondaryText>
                                                </ListItemText>
                                                <ListItemMeta
                                                    icon='delete'
                                                    onClick={removeItem}
                                                />
                                            </ListItem>
                                        )
                                    })}
                            </List>
                            <BigButton raised onClick={share}>
                                {t('InvitesResponded.Share')}
                            </BigButton>
                        </Form>
                    </DialogContent>
                </Dialog>
            )
        )
    }
)

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
            Upload: '+ Attach a file',
            Share: 'Share',
            email: {
                placeholder: {
                    Email: 'To',
                    Subject: 'Subject',
                    Body: 'Message content'
                },
                fileMsg: 'Attachment(s):',
                messageResponsesSent: 'The response(s) have been shared'
            },
            errorShare: 'The response(s) could not be shared'
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
                    Subject: 'Here are some interesting Filmstrip responses',
                    Body:
                        'Dear pal,\n\nthese look good to me, what do you think?\n\n{{username}}'
                },
                fileMsg:
                    'El archivo <a href="{{file.url}}">{{file.filename}}</a> ha sido agregado a este email.',
                messageResponsesSent: 'Las respuestas han sido inviadas'
            },
            errorShare: 'The response(s) could not be shared'
        }
    })
})
