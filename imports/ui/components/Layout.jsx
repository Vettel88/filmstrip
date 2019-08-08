import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { Grid, Drawer, List, ListItem, DrawerHeader, DrawerContent, DrawerSubtitle, DrawerTitle, GridCell, GridInner, TopAppBar, TopAppBarSection, TopAppBarNavigationIcon, TopAppBarRow, TopAppBarTitle } from 'rmwc'

const Header = () => (
    <TopAppBar>
        <TopAppBarRow>
            <TopAppBarSection>
                <SideNav />
                <TopAppBarTitle>
                    {UIState.name}
                </TopAppBarTitle>
            </TopAppBarSection>
            <TopAppBarSection>
                <div id="userInfo">
                    Userinfo
                </div>
            </TopAppBarSection>
        </TopAppBarRow>
    </TopAppBar>
)

const SideNav = () => {
  const [open, setOpen] = React.useState(false);
  return (
      <>
          <TopAppBarNavigationIcon icon="menu" onClick={() => setOpen(true)} />
          <Drawer modal open={open} onClose={() => setOpen(false)}>
              <DrawerHeader>
                  <DrawerTitle>DrawerHeader</DrawerTitle>
                  <DrawerSubtitle>Subtitle</DrawerSubtitle>
              </DrawerHeader>
              <DrawerContent>
                  <List>
                      <ListItem><Link to="/">Dashboard</Link></ListItem>
                      <ListItem><Link to="/queueList">QueueList</Link></ListItem>
                      <ListItem><Link to="/frameList">FrameList</Link></ListItem>
                  </List>
              </DrawerContent>
          </Drawer>
      </>
  );
}

export default class Layout extends Component {
    render() {
        return (
            <>
                <Header />
                <Grid>
                    <GridInner>
                        <GridCell>
                            {this.props.children}
                        </GridCell>
                    </GridInner>
                </Grid>
            </>
        )
    }
}
