import React from 'react'
import { shallow } from 'enzyme'
import { ResponseFrame } from '../ResponseFrame'

let props = { frame: {}, filmstrip: { frames: [] }, t: jest.fn() }
describe('<ResponseFrame />', () => {
  const responseFrame = shallow(<ResponseFrame {...props} />)

  it('<ResponseFrame /> should render', () => {
    expect(responseFrame.exists()).toBe(true)
  })
})
