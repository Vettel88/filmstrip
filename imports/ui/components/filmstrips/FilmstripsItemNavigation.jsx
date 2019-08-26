import { withTracker } from 'meteor/react-meteor-data'
import React from 'react';
import { observer } from 'mobx-react'
import { Meteor } from 'meteor/meteor'
import { TabBar, Tab, GridCell, GridInner } from 'rmwc'
import { addTranslations, t, withTranslation } from '/imports/ui/UIHelpers.js'
import { InvitesList } from '/imports/ui/components/filmstrips/InvitesList.jsx'
import { InvitesRespondedList } from '/imports/ui/components/filmstrips/InvitesRespondedList.jsx'
import { Invites } from '/imports/db/invites.js'
import { invitesStore } from '/imports/store/invitesStore.js'
import { FilmstripsItem as Settings } from '/imports/ui/components/filmstrips/FilmstripsItem.jsx'
import '/imports/ui/components/filmstrips/FilmstripsItem.less'

const Done = (props) => <div>Done</div>

const renderContent = (tab, props) => {
    const { history, match } = props
    const { filmstripId, frameId } = match.params
    const baseUrl = `/filmstrip/${filmstripId}/${frameId}/`
    const propsWithFilmstripId = Object.assign({}, props, {filmstripId})
    switch(tab) {
        case 1:
            const args = Object.assign({}, props, {filmstripId, setInvitesCount})
            return <InvitesList {...propsWithFilmstripId}/>
        case 2:
            // history.replace(`${baseUrl}/done`)
            return <InvitesRespondedList {...propsWithFilmstripId}/>
        default:
            return <Settings {...props}/>
    }
}

const setActiveTabHandler = setActiveTab => event => setActiveTab(event.detail.index)

export const FilmstripsItemNavigation = withTranslation()(observer((props) => {
    const [activeTab, setActiveTab] = React.useState(0)
    const { filmstripId } = props.match.params
    Meteor.subscribe('Invites', () => {
        const invites = Invites.find({ filmstripId })
        invitesStore.invitesCount = invites.count()
        invitesStore.responedCount = invites.fetch().filter(i => i.respondedAt).length // done
    })

    return <>
        <GridInner>
            <GridCell span={12}>
                <TabBar activeTabIndex={activeTab} onActivate={setActiveTabHandler(setActiveTab)}>
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
