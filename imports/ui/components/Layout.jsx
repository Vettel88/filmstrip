import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { Grid as UnstyledGrid, Drawer, List, ListItem as LI, DrawerHeader, DrawerContent, DrawerSubtitle, DrawerTitle, GridCell, GridInner, TopAppBar, TopAppBarSection, TopAppBarNavigationIcon, TopAppBarRow, TopAppBarTitle } from 'rmwc'
import styled from 'styled-components'

const Grid = styled(UnstyledGrid)`
  padding-top: 100px !important;
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
                    <div id="userInfo">
                        Userinfo
                    </div>
                </TopAppBarSection>
            </TopAppBarRow>
        </TopAppBar>
        <SideNav open={open} setOpen={setOpen} />
    </>
  )
}

const SideNav = ({open, setOpen}) => {
  return (
      <>
          <Drawer modal open={open} onClose={() => setOpen(false)}>
              <DrawerHeader>
                  <DrawerTitle>DrawerHeader</DrawerTitle>
                  <DrawerSubtitle>Subtitle</DrawerSubtitle>
              </DrawerHeader>
              <DrawerContent>
                  <List>
                      <ListItem setOpen={setOpen}><Link to="/">Dashboard</Link></ListItem>
                      <ListItem setOpen={setOpen}><Link to="/queueList">QueueList</Link></ListItem>
                      <ListItem setOpen={setOpen}><Link to="/frameList">FrameList</Link></ListItem>
                  </List>
              </DrawerContent>
          </Drawer>
      </>
  );
}

const ListItem = ({setOpen, children}) => <LI onClick={() => setOpen(false)}>{children}</LI>

export default class Layout extends Component {
    render() {
        return (
            <>
                <Header />
                <Grid>
                    <GridCell>
                        {this.props.children}
                    </GridCell>
                </Grid>
            </>
        )
    }
}
