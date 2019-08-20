import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { Grid, Drawer, List, ListItem as LI, DrawerHeader, DrawerContent, DrawerSubtitle, DrawerTitle, GridCell, 
    TopAppBar, TopAppBarSection, TopAppBarNavigationIcon, TopAppBarRow, TopAppBarTitle } from 'rmwc'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import styled from 'styled-components'
import { MenuUser } from '/imports/ui/components/users/MenuUser.jsx'
import UIState from '/imports/ui/UIState.js'
import { observer } from 'mobx-react';
import '/imports/ui/UIState.js'

const StyledGrid = styled(Grid)`
    padding-top: 100px !important;
`

const StyledTopAppBar = styled(TopAppBar)`
    background-color: #25455b !important;
`

const Header = observer(() => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <StyledTopAppBar fixed={false}>
                <TopAppBarRow>
                    <TopAppBarSection>
                        <TopAppBarNavigationIcon icon="menu" onClick={() => setOpen(true)} />
                    </TopAppBarSection>
                    <TopAppBarSection>
                        <TopAppBarTitle>
                            {UIState.name}
                        </TopAppBarTitle>
                    </TopAppBarSection>
                    <TopAppBarSection alignEnd>
                        <MenuUser />
                    </TopAppBarSection>
                </TopAppBarRow>
            </StyledTopAppBar>
            <SideNav open={open} setOpen={setOpen} />
        </>
    )
})

const IfLoggedIn = ({ children }) => {
    if (Meteor.userId()) {
        return <>{ children }</>
    }
    return <></>
}

const SideNav = ({ open, setOpen }) => <>
    <Drawer modal open={open} onClose={() => setOpen(false)}>
        <DrawerHeader>
            <DrawerTitle>DrawerHeader</DrawerTitle>
            <DrawerSubtitle>Subtitle</DrawerSubtitle>
        </DrawerHeader>
        <DrawerContent>
            <List>
                <ListItem setOpen={setOpen}><Link to="/">Dashboard</Link></ListItem>
                <IfLoggedIn>
                    <ListItem setOpen={setOpen} disabled={true}><Link to="/">Filmstrips</Link></ListItem>
                </IfLoggedIn>
            </List>
        </DrawerContent>
    </Drawer>
</>

const ListItem = ({ setOpen, children }) => <LI onClick={() => setOpen(false)}>{children}</LI>

export const Notifications = createSnackbarQueue()

export default class Layout extends Component {
    render() {
        return (
            <>
                <Header />
                <SnackbarQueue messages={Notifications.messages} leading timeout={10000}/>
                <StyledGrid>
                    <GridCell span={12}>
                        {this.props.children}
                    </GridCell>
                </StyledGrid>
            </>
        )
    }
}
