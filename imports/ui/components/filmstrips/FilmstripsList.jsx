import {
    IconButton,
    List,
    ListItem,
    ListItemGraphic,
    ListItemMeta,
    ListItemPrimaryText,
    ListItemSecondaryText,
    ListItemText,
    Menu,
    MenuItem,
    MenuSurfaceAnchor,
    TextField
} from 'rmwc'
import {
    addTranslations,
    loadingWrapper,
    t,
    withTranslation
} from '/imports/ui/UIHelpers.js'
import { FabFooter } from '/imports/ui/components/FabFooter.jsx'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import { Invites } from '/imports/db/invites.js'
import { Meteor } from 'meteor/meteor'
import { withRouter } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import ClipboardJS from 'clipboard/dist/clipboard.min.js'
import get from 'lodash/get'
import React from 'react'

const toggleOpenMenu = (open, setOpen) => event => {
    event.preventDefault()
    setOpen(!open)
    return false
}

const viewInvites = (history, filmstrip, frameId) => () =>
    history.push(`/filmstrip/${filmstrip._id}/${frameId}/invites`)
const viewCompleted = (history, filmstrip, frameId) => () =>
    history.push(`/filmstrip/${filmstrip._id}/${frameId}/responded`)
const removeFilmstrip = filmstrip => () => {
    if (confirm(t('FramestripsList.confirmRemoval'))) {
        Meteor.call('filmstrip.remove', filmstrip._id)
    }
}

const popupMenu = (history, filmstrip, frameId) => {
    const [open, setOpen] = React.useState(false)
    const linkId = `link-${filmstrip._id}`

    return (
        <MenuSurfaceAnchor>
            {/* render the field off canvas, `display: 'hidden` doesn't work as react won't render it all then */}
            <TextField
                id={linkId}
                defaultValue={Meteor.absoluteUrl(`/a/${filmstrip._id}`)}
                style={{ position: 'fixed', bottom: '-1000px' }}
            />
            <Menu hoistToBody open={open} onClose={evt => setOpen(false)}>
                <MenuItem
                    className='publicLink'
                    data-clipboard-target={`#${linkId}`}>
                    {t('FramestripsList.CopyPublicLink')}
                </MenuItem>
                <MenuItem onClick={viewInvites(history, filmstrip, frameId)}>
                    {t('FramestripsList.ViewInvites')}
                </MenuItem>
                <MenuItem onClick={viewCompleted(history, filmstrip, frameId)}>
                    {t('FramestripsList.ViewCompleted')}
                </MenuItem>
                <MenuItem onClick={removeFilmstrip(filmstrip)}>
                    {t('FramestripsList.DeleteFilmstrip')}
                </MenuItem>
            </Menu>
            <IconButton
                icon='more_horiz'
                onClick={toggleOpenMenu(open, setOpen)}
            />
        </MenuSurfaceAnchor>
    )
}

function hasAncestorClass(element, className) {
    while ((element = element.parentElement)) {
        if (element.classList.contains(className)) {
            return true
        }
    }
    return false
}

const gotoFirstFrame = (history, filmstrip, frameId) => event => {
    // do not reroute on menu actions
    if (!['button', 'menuitem'].includes(event.target.getAttribute('role'))) {
        history.push(`/filmstrip/${filmstrip._id}/${frameId}/settings`)
    }
}

const getInviteesCount = filmstrip =>
    Invites.find({ filmstripId: filmstrip._id }).count()
const getAnswersDoneCount = filmstrip =>
    Filmstrips.find({ responseToFilmstripId: filmstrip._id }).count()

const avatarSource = 'https://via.placeholder.com/48'
// Avatar needs words starting with uppercase letters, so do that for every word of name
const getAvatarName = name =>
    (name || 'No Name')
        .split(' ')
        .map(w => upperFirst(w))
        .join(' ')

const FilmstripsListItem = withRouter(({ history, filmstrip }) => {
    const firstFrame = Frames.findOne({ filmstripId: filmstrip._id, no: 1 })
    const frameId = get(firstFrame, '_id', '')

    return (
        <ListItem onClick={gotoFirstFrame(history, filmstrip, frameId)}>
            {/* TODO replace ListItemGraphic with ListItemAvatar when his gets merged */}
            <ListItemGraphic src={avatarSource} />
            {/* <ListItemAvatar
            icon={<Avatar size='small' name={getAvatarName(filmstrip.name)} />}
        /> */}
            <ListItemText>
                <ListItemPrimaryText>
                    {filmstrip.name || t('FramestripsList.undefined')}
                </ListItemPrimaryText>
                <ListItemSecondaryText>
                    {getInviteesCount(filmstrip)}{' '}
                    {t('FramestripsList.invitees')},{' '}
                    {getAnswersDoneCount(filmstrip)}{' '}
                    {t('FramestripsList.responded')}
                </ListItemSecondaryText>
            </ListItemText>
            <ListItemMeta>
                {popupMenu(history, filmstrip, frameId)}
            </ListItemMeta>
        </ListItem>
    )
})

const FilmstripsListWrapper = withRouter(
    ({ history, isLoading, filmstrips }) => {
        const createFilmstrip = event => {
            event.preventDefault()
            Meteor.call('filmstrip.create', (error, result) => {
                if (error) return Notifications.error(error.message, error)
                const { filmstripId, frameId } = result
                if (filmstripId && frameId)
                    history.push(
                        `/filmstrip/${filmstripId}/${frameId}/settings`
                    )
            })
        }

        return (
            <>
                <List twoLine>
                    {loadingWrapper(isLoading, () =>
                        filmstrips.map(filmstrip => (
                            <FilmstripsListItem
                                key={filmstrip._id}
                                filmstrip={filmstrip}
                            />
                        ))
                    )}
                </List>
                <FabFooter icon='add' onClick={createFilmstrip} />
            </>
        )
    }
)

export const FilmstripsList = withTranslation()(
    withTracker(() => {
        const handle = Meteor.subscribe('FilmstripsWithFrameIdAndInvites')
        new ClipboardJS(`.publicLink`)
        return {
            isLoading: !handle.ready(),
            filmstrips: Filmstrips.find().fetch()
        }
    })(FilmstripsListWrapper)
)

Meteor.startup(() => {
    addTranslations('en', {
        FramestripsList: {
            Create: 'Create',
            undefined: 'No name given yet',
            confirmRemoval: 'Do you want to delete the filmstrip?',
            Live: 'Live',
            CopyPublicLink: 'Copy public link',
            ViewInvites: 'View invites',
            ViewCompleted: 'View completed',
            DeleteFilmstrip: 'Delete filmstrip',
            invitees: 'invitees',
            responded: 'responded'
        }
    })
    addTranslations('es', {
        FramestripsList: {
            Create: 'Crear',
            undefined: 'Todavia sin nombre',
            confirmRemoval: 'Quierres borrar el filmstrip?',
            Live: 'Live',
            CopyPublicLink: 'Copy public link',
            ViewInvites: 'View invites',
            ViewCompleted: 'View completed',
            DeleteFilmstrip: 'Delete filmstrip',
            invitees: 'invitees',
            responded: 'responded'
        }
    })
})
