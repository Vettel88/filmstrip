import React from 'react'
import { shallow } from 'enzyme'
import QueueItem from '../QueueItem'
let props = { }
describe('<QueueItem />', () => {
  const queueItem = shallow(<QueueItem {...props} />)

  it('<QueueItem /> should render', () => {
    expect(queueItem.exists()).toBe(true)
  })
})
