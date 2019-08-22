import React from 'react'
import { shallow } from 'enzyme'
import VideoPlayer from '../VideoPlayer'

let props = { }
describe('<VideoPlayer />', () => {
  const videoPlayer = shallow(<VideoPlayer {...props} />)

  it('<VideoPlayer /> should render', () => {
    expect(videoPlayer.exists()).toBe(true)
  })
})
