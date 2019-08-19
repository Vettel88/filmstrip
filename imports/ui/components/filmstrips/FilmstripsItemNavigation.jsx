import React, { useState, useEffect } from 'react';
import { TabBar, Tab, GridCell, GridInner } from 'rmwc'
import { loadingWrapper, addTranslations, t, withTranslation, changeLanguage } from '/imports/ui/UIHelpers.js'
import Settings from '/imports/ui/components/filmstrips/FilmstripsItem.jsx'
import './FilmstripsItem.less'

const Invites = (props) => <div>Invites</div>
const Done = (props) => <div>Done</div>

const renderContent = (tab, props) => {
    switch(tab) {
        case 1:
            return <Invites {...props}/>
        case 2:
            return <Done {...props}/>
        default:
            return <Settings {...props}/>
    }
}

export const FilmstripsItemNavigation = withTranslation()((props) => {
    const [activeTab, setActiveTab] = React.useState(0)

    // TODO get this numbers once the collection is there
    const invitesCount = 0
    const doneCount = 0

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
