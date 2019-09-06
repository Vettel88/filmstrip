import {
    Grid,
    GridCell,
    IconButton,
    ListDivider,
    Menu,
    MenuItem,
    MenuSurfaceAnchor,
    TopAppBarNavigationIcon,
    TopAppBarRow,
    TopAppBarSection,
    TopAppBarTitle,
    TopAppBar as UnstyledTopAppBar
} from 'rmwc'
import { addTranslations, t } from '/imports/ui/UIHelpers.js'
import { Filmstrips } from '/imports/db/filmstrips.js'
import { Invites } from '/imports/db/invites.js'
import { invitesStore } from '/imports/store/invitesStore.js'
import { Meteor } from 'meteor/meteor'
import { Notifications } from '/imports/ui/components/layouts/Notifications.jsx'
import { observer } from 'mobx-react'
import { Route } from 'react-router-dom'
import { SnackbarQueue } from '@rmwc/snackbar'
import { withRouter } from 'react-router'
import { withTracker } from 'meteor/react-meteor-data'
import React from 'react'
import styled from 'styled-components'
import stores from '/imports/store'
import './FilmstripLayout.less'
const { filmstripStore } = stores

const StyledGrid = styled(Grid)`
    padding-top: 64px !important;
    @media (max-width: 479px) {
        padding-top: 56px !important;
    }
`

const TopAppBar = styled(UnstyledTopAppBar)`
    background-color: #25455b !important;
`

const goto = (history, filmstripId, frameId, page) => () =>
    history.push(`/filmstrip/${filmstripId}/${frameId}/${page}`)
const logout = history => () => {
    Meteor.logout()
    history.push('/signIn')
}
const toggleOpen = (open, setOpen) => () => setOpen(!open)

const DeleteFrameMenuItem = withRouter(({ history, match }) =>
    filmstripStore.frames.length > 1 ? (
        <>
            <ListDivider />
            <MenuItem
                onClick={async () => {
                    const { filmstripId, frameId } = match.params
                    if (filmstripStore.frames.length > 1) {
                        const nextFrame = await filmstripStore.removeFrame(
                            frameId
                        )
                        history.replace(
                            `/filmstrip/${filmstripId}/${nextFrame._id}/frames`
                        )
                    }
                }}>
                {t('FilmstripLayout.DeleteFrame')}
            </MenuItem>
        </>
    ) : null
)

const FilmstripMenu = () => {
    const [open, setOpen] = React.useState(false)
    return (
        <Route
            render={({ history, match }) => {
                const { filmstripId, frameId } = match.params

                return (
                    <MenuSurfaceAnchor>
                        <Menu
                            open={open}
                            onClose={() => setOpen(false)}
                            anchorCorner='bottomStart'>
                            <MenuItem
                                onClick={goto(
                                    history,
                                    filmstripId,
                                    frameId,
                                    'settings'
                                )}>
                                {t('FilmstripLayout.Settings')}
                            </MenuItem>
                            <MenuItem
                                onClick={goto(
                                    history,
                                    filmstripId,
                                    frameId,
                                    'frames'
                                )}>
                                {t('FilmstripLayout.Frames')}
                            </MenuItem>
                            <MenuItem
                                onClick={goto(
                                    history,
                                    filmstripId,
                                    frameId,
                                    'invites'
                                )}>
                                {t('FilmstripLayout.Invites')} (
                                {invitesStore.invitesCount})
                            </MenuItem>
                            <MenuItem
                                onClick={goto(
                                    history,
                                    filmstripId,
                                    frameId,
                                    'responded'
                                )}>
                                {t('FilmstripLayout.Responded')} (
                                {invitesStore.respondedCount})
                            </MenuItem>
                            <Route
                                path='/filmstrip/:filmstripId/:frameId/frames'
                                component={DeleteFrameMenuItem}
                            />
                            <ListDivider />
                            <MenuItem onClick={logout(history)}>
                                Logout
                            </MenuItem>
                        </Menu>
                        <IconButton
                            icon='more_vert'
                            onClick={toggleOpen(open, setOpen)}
                        />
                    </MenuSurfaceAnchor>
                )
            }}
        />
    )
}

const Header = withRouter(
    observer(({ history }) => (
        <TopAppBar fixed={false}>
            <TopAppBarRow>
                <TopAppBarSection>
                    <TopAppBarNavigationIcon
                        icon='keyboard_arrow_left'
                        onClick={() => history.push('/')}
                    />
                </TopAppBarSection>
                <TopAppBarSection>
                    <TopAppBarTitle>
                        {filmstripStore.filmstrip &&
                            filmstripStore.filmstrip.name}
                    </TopAppBarTitle>
                </TopAppBarSection>
                <TopAppBarSection alignEnd>
                    <FilmstripMenu />
                </TopAppBarSection>
            </TopAppBarRow>
        </TopAppBar>
    ))
)

const FilmstripLayout = props => {
    return (
        <div className='FilmstripLayout'>
            <Header />
            <SnackbarQueue messages={Notifications.messages} timeout={10000} />
            <StyledGrid>
                <GridCell span={12}>{props.children}</GridCell>
            </StyledGrid>
        </div>
    )
}

export default withRouter(
    withTracker(({ match }) => {
        const { filmstripId, frameId } = match.params

        Meteor.subscribe('Invites', () => {
            invitesStore.invitesCount = Invites.find({ filmstripId }).count()
        })
        Meteor.subscribe('Filmstrips', () => {
            invitesStore.respondedCount = Filmstrips.find({
                responseToFilmstripId: filmstripId
            }).count()
        })
        return { filmstripId, frameId }
    })(FilmstripLayout)
)

Meteor.startup(() => {
    addTranslations('en', {
        FilmstripLayout: {
            Settings: 'Settings',
            Frames: 'Frames',
            Invites: 'Invites',
            Responded: 'Responded',
            DeleteFrame: 'Delete this Frame'
        }
    })
    addTranslations('es', {
        FilmstripLayout: {
            Settings: 'Ajustes',
            Frames: 'Frames',
            Invites: 'Invitados',
            Responded: 'Respondido',
            DeleteFrame: 'Eliminar este Marko'
        }
    })
})
