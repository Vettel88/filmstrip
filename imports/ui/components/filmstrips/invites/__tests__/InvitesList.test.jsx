import React from 'react'
import { shallow } from 'enzyme'
import { InvitesList } from '../InvitesList'

let props = { }
describe('<InvitesList />', () => {
  const invitesList = shallow(<InvitesList {...props} />)

  it('<InvitesList /> should render', () => {
    expect(invitesList.exists()).toBe(true)
  })
})
