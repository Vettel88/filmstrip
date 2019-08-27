import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Avatar, GridCell, GridInner, Fab, IconButton, List, ListItem, Dialog, MenuSurfaceAnchor, Menu, MenuItem, Typography, TextField } from 'rmwc'
import { withRouter } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import get from 'lodash/get'
import ClipboardJS from 'clipboard/dist/clipboard.min.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import { Invites } from '/imports/db/invites.js'
import { loadingWrapper, addTranslations, t, withTranslation } from '/imports/ui/UIHelpers.js'
import Video from '/imports/ui/components/VideoPlayer.js'
import './FilmstripsList.less'

const toggleOpenMenu = (open, setOpen) => event => {
    event.preventDefault()
    setOpen(!open)
    return false
}

const popupMenu = (history, filmstrip, frameId) => {
    const [open, setOpen] = React.useState(false)
    const viewInvites = () => history.push(`/filmstrip/${filmstrip._id}/${frameId}/invites`)
    const viewCompleted = () => history.push(`/filmstrip/${filmstrip._id}/${frameId}/responded`)
    const removeFilmstrip = event => {
        if(confirm(t('FramestripsList.confirmRemoval'))) {
            Meteor.call('filmstrip.remove', filmstrip._id, (error) => {
                if (error) return console.error(error)
            })
        }
    }
    const linkId = `link-${filmstrip._id}`

    return (<MenuSurfaceAnchor>
        {/* render the field off canvas, `display: 'hidden` doesn't work as react won't render it all then */}
        <TextField id={linkId} defaultValue={Meteor.absoluteUrl(`/a/${filmstrip._id}`)} style={{position: 'fixed', bottom: '-1000px'}}/>
        <Menu open={open} onClose={evt => setOpen(false)}>
            <MenuItem className="publicLink" data-clipboard-target={`#${linkId}`}>{t('FramestripsList.CopyPublicLink')}</MenuItem>
            <MenuItem onClick={viewInvites}>{t('FramestripsList.ViewInvites')}</MenuItem>
            <MenuItem onClick={viewCompleted}>{t('FramestripsList.ViewCompleted')}</MenuItem>
            <MenuItem onClick={removeFilmstrip}>{t('FramestripsList.DeleteFilmstrip')}</MenuItem>
        </Menu>
        {/* <IconButton icon="more_vert" onClick={evt => setOpen(!open)} /> */}
        <IconButton icon="more_vert" onClick={toggleOpenMenu(open, setOpen)} />
    </MenuSurfaceAnchor>)
}

function hasAncestorClass(element, className) {
    while (element = element.parentElement) {
        if (element.classList.contains(className)) {
           return true
       }
    }
    return false
}

const gotoFirstFrame = (history, filmstrip, frameId) => event => {
    // we have this handler for the whole list item, we want to supress the event if it bubbles up from anything in .actions
    if (!hasAncestorClass(event.target, 'actions')) {
        history.push(`/filmstrip/${filmstrip._id}/${frameId}/settings`)
    }
}

const getInviteesCount = filmstrip => Invites.find({filmstripId: filmstrip._id}).count()
const getAnswersDoneCount = filmstrip => Invites.find({filmstripId: filmstrip._id, respondedAt: {$exists: true}}).count()

const avatarSource = 'https://via.placeholder.com/48'

const FilmstripsListItem = withRouter(({history, filmstrip}) => {
    const firstFrame = Frames.findOne({ filmstripId: filmstrip._id, no: 1 })
    const frameId = get(firstFrame, '_id', '')

    return <li onClick={gotoFirstFrame(history, filmstrip, frameId)}>
        <div className="listContent">
            <img src={avatarSource} title={firstFrame && firstFrame.title}/>
            <div className="listData">
                <Typography use="headline6">{filmstrip.name || t('FramestripsList.undefined')}</Typography>
                <p>{getInviteesCount(filmstrip)} {t('FramestripsList.invitees')}, {getAnswersDoneCount(filmstrip)} {t('FramestripsList.responded')}</p>
            </div>
        </div>
        <div className="actions">
            {popupMenu(history, filmstrip, frameId)}
        </div>
    </li>
})

const FilmstripsListWrapper = withRouter(({history, isLoading, filmstrips}) => {
    const createFilmstrip = event => {
        event.preventDefault()
        Meteor.call('filmstrip.create', (error, result) => {
            if (error) return console.error(error)
            const { filmstripId, frameId } = result
            if (filmstripId && frameId)
                history.push(`/filmstrip/${filmstripId}/${frameId}/settings`)
        })
    }
    
    return (<div className="FilmstripsList">
        <ul>
            {loadingWrapper(isLoading, () => 
                filmstrips.map(filmstrip => <FilmstripsListItem key={filmstrip._id} filmstrip={filmstrip} />))
            }
        </ul>
        <Fab className="footerAction" icon="add" onClick={createFilmstrip} mini={true}/>
    </div>)
})

export const FilmstripsList = withTranslation()(withTracker(() => {
    const handle = Meteor.subscribe('Filmstrips')
    // TODO limit subscribtion to only get the _id of the first frame
    const handleFrames = Meteor.subscribe('Frames')
    const handleInvites = Meteor.subscribe('Invites')
    new ClipboardJS(`.publicLink`)
    return {
        isLoading: !handle.ready() || !handleFrames.ready() || !handleInvites.ready(),
        filmstrips: Filmstrips.find().fetch()
    }
})(FilmstripsListWrapper))

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
            responded: 'responded',
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
            responded: 'responded',
        }
    })
})
