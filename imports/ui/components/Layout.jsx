import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { Grid as UnstyledGrid, Drawer, List, ListItem as LI, DrawerHeader, DrawerContent, DrawerSubtitle, DrawerTitle, GridCell, GridInner, TopAppBar as UnstyledTopAppBar, TopAppBarSection, TopAppBarNavigationIcon, TopAppBarRow, TopAppBarTitle } from 'rmwc'
import styled from 'styled-components'
import { MenuUser } from '/imports/ui/components/users/MenuUser.jsx'
import '/imports/ui/UIState.js'
import { Meteor } from 'meteor/meteor';

const Grid = styled(UnstyledGrid)`
    padding-top: 100px !important;
`

const TopAppBar = styled(UnstyledTopAppBar)`
    background-color: #25455b !important;
`

const Header = () => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <TopAppBar fixed={false}>
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
            </TopAppBar>
            <SideNav open={open} setOpen={setOpen} />
        </>
    )
}

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
                    <ListItem setOpen={setOpen} disabled={true}><Link to="/filmstrips">Filmstrips</Link></ListItem>
                </IfLoggedIn>
            </List>
        </DrawerContent>
    </Drawer>
</>

const ListItem = ({ setOpen, children }) => <LI onClick={() => setOpen(false)}>{children}</LI>

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
