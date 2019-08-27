import React from 'react';
import { observer } from 'mobx-react'
import { Meteor } from 'meteor/meteor'
import { TabBar, Tab, GridCell, GridInner } from 'rmwc'
import { addTranslations, t, withTranslation } from '/imports/ui/UIHelpers.js'
import { InvitesList } from '/imports/ui/components/filmstrips/InvitesList.jsx'
import { InvitesRespondedList } from '/imports/ui/components/filmstrips/InvitesRespondedList.jsx'
import { Invites } from '/imports/db/invites.js'
import { invitesStore } from '/imports/store/invitesStore.js'
import { FilmstripsItem } from '/imports/ui/components/filmstrips/FilmstripsItem.jsx'
import '/imports/ui/components/filmstrips/FilmstripsItem.less'

const renderContent = (tab, props) => {
    const { filmstripId, frameId } = props.match.params
    const propsWithFilmstripId = Object.assign({}, props, {filmstripId, frameId})
    switch(tab) {
        case 1:
            return <InvitesList {...propsWithFilmstripId}/>
        case 2:
            return <InvitesRespondedList {...propsWithFilmstripId}/>
        default:
            return <FilmstripsItem {...props}/>
    }
}

const setActiveTabHandler = (match, setActiveTab) => event => {
    setActiveTab(event.detail.index)
    // replace url without reloading
    const { filmstripId, frameId } = match.params
    const tab = ['settings', 'invites', 'responded'][event.detail.index]
    const url = `/filmstrip/${filmstripId}/${frameId}/${tab}`
    history.replaceState(history.state, '',`${url}`)
}
const pathToTab = pathname => {
    if (pathname.endsWith('/invites')) return 1
    if (pathname.endsWith('/responded')) return 2
    return 0
}

export const FilmstripsItemNavigation = withTranslation()(observer((props) => {
    const [activeTab, setActiveTab] = React.useState(pathToTab(props.location.pathname))
    const { filmstripId } = props.match.params

    Meteor.subscribe('Invites', () => {
        const invites = Invites.find({ filmstripId })
        invitesStore.invitesCount = invites.count()
        invitesStore.responedCount = invites.fetch().filter(i => i.respondedAt).length
    })

    return <>
        <GridInner>
            <GridCell span={12}>
                <TabBar activeTabIndex={activeTab} onActivate={setActiveTabHandler(props.match, setActiveTab)}>
                    <Tab>{t('FilmstripsItemNavigation.Settings')}</Tab>
                    <Tab>{t('FilmstripsItemNavigation.Invites')} ({invitesStore.invitesCount})</Tab>
                    <Tab>{t('FilmstripsItemNavigation.Responded')} ({invitesStore.responedCount})</Tab>
                </TabBar>
            </GridCell>
            <GridCell span={12}>
                {renderContent(activeTab, props)}
            </GridCell>
        </GridInner>
    </>
}))

Meteor.startup(() => {
    addTranslations('en', {    
        FilmstripsItemNavigation: {
            Settings: 'Settings',
            Invites: 'Invites',
            Responded: 'Responded',
        }
    })
    addTranslations('es', {
        FilmstripsItemNavigation: {
            Settings: 'Ajustes',
            Invites: 'Invitados',
            Responded: 'Respondido',
        }
    })
})
