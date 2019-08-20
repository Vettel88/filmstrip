import React from 'react';
import { TabBar, Tab, GridCell, GridInner } from 'rmwc'
import { addTranslations, t, withTranslation } from '/imports/ui/UIHelpers.js'
import { InvitesList } from '/imports/ui/components/filmstrips/invites/InvitesList.jsx'
import { Invites } from '/imports/db/invites.js'
import Settings from '/imports/ui/components/filmstrips/FilmstripsItem.jsx'
import '/imports/ui/components/filmstrips/FilmstripsItem.less'

const Done = (props) => <div>Done</div>

const renderContent = (tab, props, setInvitesCount) => {
    const { history, match } = props
    const { filmstripId, frameId } = match.params
    const baseUrl = `/filmstrip/${filmstripId}/${frameId}/`
    switch(tab) {
        case 1:
            // TODO set URL correctly
            // history.replace(`${baseUrl}/invites`)
            const arguments = Object.assign({}, props, {setInvitesCount})
            return <InvitesList {...arguments}/>
            // return <InvitesList {...props}/>
        case 2:
            // history.replace(`${baseUrl}/done`)
            return <Done {...props}/>
        default:
            // history.replace(`${baseUrl}/settings`)
            return <Settings {...props}/>
    }
}

export const FilmstripsItemNavigation = withTranslation()((props) => {
    const [activeTab, setActiveTab] = React.useState(0)

    const [invitesCount, setInvitesCount] = React.useState(0)
    const [doneCount, setDoneCount] = React.useState(0)
    Meteor.subscribe('Invites', () => {
        setInvitesCount(Invites.find().count())
        setDoneCount(Invites.find({completedAt: {$exists: true}}).count())
    })

    return <>
        <GridInner>
            <GridCell span={12}>
                <TabBar activeTabIndex={activeTab} onActivate={evt => setActiveTab(evt.detail.index)}>
                    <Tab>{t('FilmstripsItemNavigation.Settings')}</Tab>
                    <Tab>{t('FilmstripsItemNavigation.Invites')} ({invitesCount})</Tab>
                    <Tab>{t('FilmstripsItemNavigation.Done')} ({doneCount})</Tab>
                </TabBar>
            </GridCell>
            <GridCell span={12}>
                {renderContent(activeTab, props)}
            </GridCell>
        </GridInner>
    </>
})

Meteor.startup(() => {
    addTranslations('en', {    
        FilmstripsItemNavigation: {
            Settings: 'Settings',
            Invites: 'Invites',
            Done: 'Done',
        }
    })
    addTranslations('es', {
        FilmstripsItemNavigation: {
            Settings: 'Ajustes',
            Invites: 'Invitados',
            Done: 'Hecho',
        }
    })
})
