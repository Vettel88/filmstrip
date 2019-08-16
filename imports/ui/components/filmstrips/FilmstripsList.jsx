import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Image } from 'cloudinary-react'
import { GridCell, GridInner, Fab, Chip, MenuSurfaceAnchor, Menu, MenuItem, Typography } from 'rmwc'
import { withRouter } from 'react-router-dom'
import { withTracker } from 'meteor/react-meteor-data'
import get from 'lodash/get'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Frames } from '/imports/db/frames.js'
import { loadingWrapper, addTranslations, t, withTranslation } from '/imports/ui/UIHelpers.js'
import Video from '/imports/ui/components/VideoPlayer.js';
import './FilmstripsList.less'

const popupMenu = (filmstrip) => {
    const [open, setOpen] = React.useState(false)

    const copyPublicLink = () => alert('TODO')
    const viewInvites = () => alert('TODO')
    const viewCompleted = () => alert('TODO')
    const toggleLiveText = () => filmstrip.live ? t('FramestripsList.SetAsNotLive') : t('FramestripsList.SetAsLive')
    const toggleLive = () => Meteor.call('filmstrip.toggleLive', filmstrip)
    const removeFilmstrip = event => {
        if(confirm(t('FramestripsList.confirmRemoval'))) {
            Meteor.call('filmstrip.remove', filmstrip._id, (error) => {
                if (error) return console.error(error)
            })
        }
    }

    return (
        <MenuSurfaceAnchor>
            <Menu open={open}onClose={evt => setOpen(false)}>
                <MenuItem onClick={copyPublicLink}>{t('FramestripsList.CopyPublicLink')}</MenuItem>
                <MenuItem onClick={viewInvites}>{t('FramestripsList.ViewInvites')}</MenuItem>
                <MenuItem onClick={viewCompleted}>{t('FramestripsList.ViewCompleted')}</MenuItem>
                <MenuItem onClick={toggleLive}>{toggleLiveText()}</MenuItem>
                <MenuItem onClick={removeFilmstrip}>{t('FramestripsList.DeleteFilmstrip')}</MenuItem>
            </Menu>
            <Fab icon="more_horiz" onClick={evt => setOpen(!open)} mini={true} theme={['textPrimaryOnLight', 'background']}/>
        </MenuSurfaceAnchor>
    )
}

const FilmstripsListItem = withRouter(({history, filmstrip}) => {
    const firstFrame = Frames.findOne({ filmstripId: filmstrip._id, no: 1 })
    const frameId = firstFrame._id

    const gotoFirstFrame = event => {
        event.preventDefault()
        history.push(`/filmstrip/${filmstrip._id}/${frameId}/settings`)
    }
    const getInviteesCount = filmstrip => 0
    const getAnswersDoneCount = filmstrip => 0
    const imageOrVideo = () => {
        const publicId = get(firstFrame, 'video.public_id')
        return publicId
            ? <Video publicId={publicId} width="48"/>
            : <Image cloudName="demo" publicId="sample" width="48" crop="scale"/>
    }

    return <li>
        <GridInner>
            <GridCell span={2} style={({textAlign: 'center'})} onClick={gotoFirstFrame}>
                {imageOrVideo()}
                <Chip 
                    label={filmstrip.live ? t('FramestripsList.Live') : t('FramestripsList.NotLive')} 
                    style={({backgroundColor: filmstrip.live ? 'green' : 'red'})} />
            </GridCell>
            <GridCell span={9} onClick={gotoFirstFrame}>
                <Typography use="headline7">{filmstrip.name || t('FramestripsList.undefined')}</Typography>
                <p>{filmstrip.description}</p>
                <p>{getInviteesCount(filmstrip)} invitees, {getAnswersDoneCount(filmstrip)} done</p>
            </GridCell>
            <GridCell span={1}>
                {popupMenu(filmstrip)}
            </GridCell>
        </GridInner>
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
    return {
        isLoading: !handle.ready() || !handleFrames.ready(),
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
        }
    })
})
