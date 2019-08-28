import { Meteor } from 'meteor/meteor'
import React from 'react'
import { Link, Route } from 'react-router-dom'
import {
  MenuSurfaceAnchor,
  Menu as UnstyledMenu,
  MenuItem,
  ListDivider,
  Button,
  IconButton,
  Icon,
  Typography
} from 'rmwc'
import styled from 'styled-components'
import { withTracker } from 'meteor/react-meteor-data'

const Menu = styled(UnstyledMenu)`
  min-width: 240px !important;
  p {
    padding-left: 12px;
    padding-right: 12px;
    margin-bottom: 6px;
  }
`

const loggedIn = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <Route
      render={({ history }) => {
        const logout = () => {
          Meteor.logout()
          history.push('/signIn')
        }

        const user = Meteor.user() || {}

        // HOX test user currently doesnt have these
        if (user && !user.profile)
          user.profile = {
            firstname: 'Test',
            lastname: 'Data',
            email: 'test@data.com'
          }

        return (
          <MenuSurfaceAnchor>
            <Menu
              open={open}
              onClose={evt => setOpen(false)}
              anchorCorner='bottomStart'>
              <Typography tag='p' use='body1'>
                {user.profile.firstname} {user.profile.lastname}
              </Typography>
              <Typography tag='p' use='caption'>
                {user.profile.email}
              </Typography>
              <ListDivider />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>

            <IconButton
              label='User menu'
              icon='more_vert'
              onClick={evt => setOpen(!open)}
            />
          </MenuSurfaceAnchor>
        )
      }}
    />
  )
}

const WhiteButton = styled(Button)`
  color: white !important;
  a {
    color: white !important;
  }
`

export const loggedOut = () => (
  <WhiteButton trailingIcon='keyboard_arrow_right'>
    <Link to='/signIn'>Sign in</Link>
  </WhiteButton>
)

export const MenuUserWrapper = ({ isLoggedIn }) =>
  isLoggedIn ? loggedIn() : loggedOut()

export const MenuUser = withTracker(() => {
  const isLoggedIn = !!(Meteor.userId && Meteor.userId())
  return { isLoggedIn }
})(MenuUserWrapper)
