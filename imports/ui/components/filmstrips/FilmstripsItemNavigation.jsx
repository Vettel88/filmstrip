import { withTracker } from 'meteor/react-meteor-data'
import React from 'react';
import { observer } from 'mobx-react'
import { TabBar, Tab, GridCell, GridInner } from 'rmwc'
import { addTranslations, t, withTranslation } from '/imports/ui/UIHelpers.js'
import { InvitesList } from '/imports/ui/components/filmstrips/InvitesList.jsx'
import { InvitesRespondedList } from '/imports/ui/components/filmstrips/InvitesRespondedList.jsx'
import { Invites } from '/imports/db/invites.js'
import Settings from '/imports/ui/components/filmstrips/FilmstripsItem.jsx'
import { InvitesStore } from '/imports/store/InvitesStore.js'
import '/imports/ui/components/filmstrips/FilmstripsItem.less'

const Done = (props) => <div>Done</div>

const renderContent = (tab, props) => {
    const { history, match } = props
    const { filmstripId, frameId } = match.params
    const baseUrl = `/filmstrip/${filmstripId}/${frameId}/`
    const propsWithFilmstripId = Object.assign({}, props, {filmstripId})
    switch(tab) {
        case 1:
            // TODO set URL correctly
            // history.replace(`${baseUrl}/invites`)
            return <InvitesList {...propsWithFilmstripId}/>
            // return <InvitesList {...props}/>
        case 2:
            // history.replace(`${baseUrl}/done`)
            return <InvitesRespondedList {...propsWithFilmstripId}/>
        default:
            // history.replace(`${baseUrl}/settings`)
            return <Settings {...props}/>
    }
}

export const FilmstripsItemNavigation = withTranslation()(observer((props) => {
    const [activeTab, setActiveTab] = React.useState(0)
    const { filmstripId } = props.match.params
    Meteor.subscribe('Invites', () => {
        const invites = Invites.find({ filmstripId })
        InvitesStore.invitesCount = invites.count()
        InvitesStore.responedCount = invites.fetch().filter(i => i.respondedAt).length // done
    })

    return <>
        <GridInner>
            <GridCell span={12}>
                <TabBar activeTabIndex={activeTab} onActivate={evt => setActiveTab(evt.detail.index)}>
                    <Tab>{t('FilmstripsItemNavigation.Settings')}</Tab>
                    <Tab>{t('FilmstripsItemNavigation.Invites')} ({InvitesStore.invitesCount})</Tab>
                    <Tab>{t('FilmstripsItemNavigation.Done')} ({InvitesStore.responedCount})</Tab>
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
            Done: 'Responded',
        }
    })
    addTranslations('es', {
        FilmstripsItemNavigation: {
            Settings: 'Ajustes',
            Invites: 'Invitados',
            Done: 'Respondido',
        }
    })
})
