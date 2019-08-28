import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import { MenuSurfaceAnchor, Menu, Grid, MenuItem, ListDivider, IconButton, Typography, GridCell, 
    TopAppBar as UnstyledTopAppBar, TopAppBarSection, TopAppBarNavigationIcon, TopAppBarRow, TopAppBarTitle } from 'rmwc'
import { SnackbarQueue } from '@rmwc/snackbar'
import styled from 'styled-components'
import { Meteor } from 'meteor/meteor'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router'
import { addTranslations, t, withTranslation } from '/imports/ui/UIHelpers.js'
import { Notifications } from '/imports/ui/components/layouts/Notifications.jsx'
import { Invites } from '/imports/db/invites.js'
import { invitesStore } from '/imports/store/invitesStore.js'
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

const goto = (history, filmstripId, frameId, page) => () => history.push(`/filmstrip/${filmstripId}/${frameId}/${page}`)
const logout = history => () => {
    Meteor.logout()
    history.push('/signIn')
}
const toggleOpen = (open, setOpen) => () => setOpen(!open)

const FilmstripMenu = () => {
    const [open, setOpen] = React.useState(false)
    return (
        <Route render={({ history, match }) => {
            const { filmstripId, frameId } = match.params

            Meteor.subscribe('Invites', () => {
                const invites = Invites.find({ filmstripId })
                invitesStore.invitesCount = invites.count()
                invitesStore.responedCount = invites.fetch().filter(i => i.respondedAt).length
            })
        
            return (<MenuSurfaceAnchor>
                <Menu open={open} onClose={() => setOpen(false)} anchorCorner='bottomStart'>
                    <MenuItem onClick={goto(history, filmstripId, frameId, 'settings')}>{t('FilmstripLayout.Settings')}</MenuItem>
                    <MenuItem onClick={goto(history, filmstripId, frameId, 'frames')}>{t('FilmstripLayout.Frames')}</MenuItem>
                    <MenuItem onClick={goto(history, filmstripId, frameId, 'invites')}>{t('FilmstripLayout.Invites')} ({invitesStore.invitesCount})</MenuItem>
                    <MenuItem onClick={goto(history, filmstripId, frameId, 'responded')}>{t('FilmstripLayout.Responded')} ({invitesStore.responedCount})</MenuItem>
                    <ListDivider />
                    <MenuItem onClick={logout(history)}>Logout</MenuItem>
                </Menu>
                <IconButton icon="more_vert" onClick={toggleOpen(open, setOpen)} />
            </MenuSurfaceAnchor>)
        }}/>
    )
}

const Header = withRouter(observer(({ history }) => <TopAppBar fixed={false}>
    <TopAppBarRow>
        <TopAppBarSection>
            <TopAppBarNavigationIcon icon="keyboard_arrow_left" onClick={() => history.push('/')} />
        </TopAppBarSection>
        <TopAppBarSection>
            <TopAppBarTitle>
                {filmstripStore.name}
            </TopAppBarTitle>
        </TopAppBarSection>
        <TopAppBarSection alignEnd>
            <FilmstripMenu/>
        </TopAppBarSection>
    </TopAppBarRow>
</TopAppBar>))

export default class FilmstripLayout extends Component {
    render() {
        return (<div className="FilmstripLayout">
            <Header />
            <SnackbarQueue messages={Notifications.messages} timeout={10000} />
            <StyledGrid>
                <GridCell span={12}>
                    {this.props.children}
                </GridCell>
            </StyledGrid>
        </div>)
    }
}

Meteor.startup(() => {
    addTranslations('en', {    
        FilmstripLayout: {
            Settings: 'Settings',
            Frames: 'Frames',
            Invites: 'Invites',
            Responded: 'Responded',
        }
    })
    addTranslations('es', {
        FilmstripLayout: {
            Settings: 'Ajustes',
            Frames: 'Frames',
            Invites: 'Invitados',
            Responded: 'Respondido',
        }
    })
})
