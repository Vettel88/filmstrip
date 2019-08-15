import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Link, Route } from "react-router-dom"
import { MenuSurfaceAnchor, Menu, MenuItem, ListDivider, Button, Icon } from 'rmwc'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'

const StyledLink = styled(Link)`
  color: white !important;
`

const loggedIn = () => {
    const [open, setOpen] = React.useState(false)
    
    return (
        <Route render={({ history }) => {
            const logout = () => {
                Meteor.logout()
                history.push('/signIn' )
            }
            
            return (
                <MenuSurfaceAnchor>
                    <Menu open={open}onClose={evt => setOpen(false)}>
                        {/* <MenuItem>Cookies</MenuItem>
                        <MenuItem>Pizza</MenuItem>
                        <ListDivider /> */}
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>

                    <Button raised onClick={evt => setOpen(!open)}>
                        <Icon icon="account_circle" />
                    </Button>
                </MenuSurfaceAnchor>
            )
        }} />
    )
}

export const loggedOut = () =>
    <Button trailingIcon="keyboard_arrow_right" >
        <StyledLink to="/signIn">Sign in</StyledLink>
    </Button>

export const MenuUserWrapper = ({ isLoggedIn }) =>
    isLoggedIn ? loggedIn() : loggedOut()

export const MenuUser = withTracker(() => {
    const isLoggedIn = !!(Meteor.userId && Meteor.userId())
    return { isLoggedIn }
})(MenuUserWrapper)
