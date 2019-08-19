import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { Grid as UnstyledGrid, Drawer, List, ListItem as LI, DrawerHeader, DrawerContent, DrawerSubtitle, DrawerTitle, GridCell, GridInner, TopAppBar as UnstyledTopAppBar, TopAppBarSection, TopAppBarNavigationIcon, TopAppBarRow, TopAppBarTitle } from 'rmwc'
import styled from 'styled-components'
import { MenuUser } from '/imports/ui/components/users/MenuUser.jsx'
import UIState from '/imports/ui/UIState.js'
import { Meteor } from 'meteor/meteor'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router'
import stores from '/imports/store'
const { filmstripStore } = stores

const Grid = styled(UnstyledGrid)`
    padding-top: 100px !important;
`

const TopAppBar = styled(UnstyledTopAppBar)`
    background-color: #25455b !important;
`

const Header = withRouter(observer(({history}) => {
    return (
        <>
            <TopAppBar fixed={false}>
                <TopAppBarRow>
                    <TopAppBarSection>
                        <TopAppBarNavigationIcon icon="keyboard_arrow_left" onClick={() => history.goBack()} />
                    </TopAppBarSection>
                    <TopAppBarSection>
                        <TopAppBarTitle>
                            {filmstripStore.name}
                        </TopAppBarTitle>
                    </TopAppBarSection>
                    <TopAppBarSection alignEnd>
                        <MenuUser />
                    </TopAppBarSection>
                </TopAppBarRow>
            </TopAppBar>
        </>
    )
}))

const IfLoggedIn = ({ children }) => {
    if (Meteor.userId()) {
        return <>{ children }</>
    }
    return <></>
}

export default class Layout extends Component {
    render() {
        return (
            <>
                <Header />
                <Grid>
                    <GridCell span={12}>
                        {this.props.children}
                    </GridCell>
                </Grid>
            </>
        )
    }
}
