import React from 'react'
import { shallow } from 'enzyme'
import { FrameVideoRecorder } from '../FrameVideoRecorder'

let props = { match: { params: { }}}
describe('<FrameVideoRecorder />', () => {
  const frameVideoRecorder = shallow(<FrameVideoRecorder {...props} />)

  it('<FrameVideoRecorder /> should render', () => {
    expect(frameVideoRecorder.exists()).toBe(true)
  })
})
