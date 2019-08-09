import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { Grid as UnstyledGrid, Drawer, List, ListItem as LI, DrawerHeader, DrawerContent, DrawerSubtitle, DrawerTitle, GridCell, GridInner, TopAppBar as UnstyledTopAppBar, TopAppBarSection, TopAppBarNavigationIcon, TopAppBarRow, TopAppBarTitle } from 'rmwc'
import styled from 'styled-components'

const Grid = styled(UnstyledGrid)`
  padding-top: 0px !important;
`

export default class AnswerLayout extends Component {
  render() {
    return (
      <>
        <Grid>
            <GridCell>
                {this.props.children}
            </GridCell>
        </Grid>
      </>
    )
  }
}
