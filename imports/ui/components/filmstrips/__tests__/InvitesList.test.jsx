import React from 'react'
import { shallow } from 'enzyme'
import { InvitesList } from '../InvitesList'

describe('<InvitesList />', () => {
  const invitesList = shallow(<InvitesList />)

  it('<InvitesList /> should render', () => {
    expect(invitesList.exists()).toBe(true)
  })
})
