import { Meteor } from 'meteor/meteor'
import React from 'react'
import { GridCell, GridInner, Fab, Elevation, MenuSurfaceAnchor, Menu, MenuItem, Typography, TextField } from 'rmwc'
import { withRouter } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import get from 'lodash/get'
import ClipboardJS from '/node_modules/clipboard/dist/clipboard.min.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import { Invites } from '/imports/db/invites.js'
import { loadingWrapper, addTranslations, t, withTranslation } from '/imports/ui/UIHelpers.js'
import Video from '/imports/ui/components/VideoPlayer.js'
import './FilmstripsList.less'

const popupMenu = (history, filmstrip, frameId) => {
    const [open, setOpen] = React.useState(false)
    const viewInvites = () => history.push(`/filmstrip/${filmstrip._id}/${frameId}/invites`)
    const viewCompleted = () => history.push(`/filmstrip/${filmstrip._id}/${frameId}/responded`)
    const toggleLiveText = () => filmstrip.live ? t('FramestripsList.SetAsNotLive') : t('FramestripsList.SetAsLive')
    const toggleLive = () => Meteor.call('filmstrip.setLive', filmstrip, !filmstrip.live)
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
        <TextField id={linkId} defaultValue={Meteor.absoluteUrl(`/a/${filmstrip._id}`)} style={{position: 'fixed', bottom: '-100px'}}/>
        <Menu open={open}onClose={evt => setOpen(false)}>
            <MenuItem className="publicLink" data-clipboard-target={`#${linkId}`}>{t('FramestripsList.CopyPublicLink')}</MenuItem>
            <MenuItem onClick={viewInvites}>{t('FramestripsList.ViewInvites')}</MenuItem>
            <MenuItem onClick={viewCompleted}>{t('FramestripsList.ViewCompleted')}</MenuItem>
            <MenuItem onClick={toggleLive}>{toggleLiveText()}</MenuItem>
            <MenuItem onClick={removeFilmstrip}>{t('FramestripsList.DeleteFilmstrip')}</MenuItem>
        </Menu>
        <Fab icon="more_horiz" onClick={evt => setOpen(!open)} mini={true} theme={['textPrimaryOnLight', 'background']}/>
    </MenuSurfaceAnchor>)
}

const FilmstripsListItem = withRouter(({history, filmstrip}) => {
    const firstFrame = Frames.findOne({ filmstripId: filmstrip._id, no: 1 })
    const frameId = get(firstFrame, '_id', '')

    const gotoFirstFrame = event => {
        event.preventDefault()
        history.push(`/filmstrip/${filmstrip._id}/${frameId}/settings`)
    }
    // TODO maybe move this to the store
    const getInviteesCount = filmstrip => Invites.find({filmstripId: filmstrip._id}).count()
    const getAnswersDoneCount = filmstrip => Invites.find({filmstripId: filmstrip._id, respondedAt: {$exists: true}}).count()
    
    const imageOrVideo = () => {
        const publicId = get(firstFrame, 'video.public_id')
        return publicId
            ? <Video publicId={publicId} width="48"/>
            : <img src="https://via.placeholder.com/48x32"/>
    }

    return <li><Elevation z={1}>
        <GridInner>
            <GridCell span={2} style={({textAlign: 'center'})} onClick={gotoFirstFrame}>
                <div>{imageOrVideo()}</div>
                <Typography use="caption" style={({color: filmstrip.live ? 'green' : 'red'})}>
                    {filmstrip.live ? t('FramestripsList.Live') : t('FramestripsList.NotLive')}
                </Typography>
            </GridCell>
            <GridCell span={7} onClick={gotoFirstFrame}>
                <Typography use="headline7">{filmstrip.name || t('FramestripsList.undefined')}</Typography>
                <p>{filmstrip.description}</p>
                <p>{getInviteesCount(filmstrip)} {t('FramestripsList.invitees')}, {getAnswersDoneCount(filmstrip)} {t('FramestripsList.responded')}</p>
            </GridCell>
            <GridCell span={3}>
                {popupMenu(history, filmstrip, frameId)}
            </GridCell>
        </GridInner>
    </Elevation></li>
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
        {/* user a grid to right align as we should not use flexbox - sniff */}
        <GridInner>
            <GridCell span={11}>
            </GridCell>
            <GridCell span={1}>
                <Fab icon="add" onClick={createFilmstrip} mini={true}/>
            </GridCell>
        </GridInner>
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
            NotLive: 'Not live',
            CopyPublicLink: 'Copy public link',
            ViewInvites: 'View invites',
            ViewCompleted: 'View completed',
            SetAsLive: 'Set as live',
            SetAsNotLive: 'Set as not live',
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
            NotLive: 'Not live',
            CopyPublicLink: 'Copy public link',
            ViewInvites: 'View invites',
            ViewCompleted: 'View completed',
            SetAsLive: 'Set as live',
            SetAsNotLive: 'Set as not live',
            DeleteFilmstrip: 'Delete filmstrip',
            invitees: 'invitees',
            responded: 'responded',
        }
    })
})
