import React from 'react'
import { shallow } from 'enzyme'
import { FrameVideoRecorder } from '../FrameVideoRecorder'

describe('<FrameVideoRecorder />', () => {
  const frameVideoRecorder = shallow(<FrameVideoRecorder match={{params: { }}} />)

  it('<FrameVideoRecorder /> should render', () => {
    expect(frameVideoRecorder.exists()).toBe(true)
  })
})
