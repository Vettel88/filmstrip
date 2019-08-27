import React from 'react'
import { shallow } from 'enzyme'
import VideoPlayer from '../VideoPlayer'

describe('<VideoPlayer />', () => {
  const videoPlayer = shallow(<VideoPlayer />)

  it('<VideoPlayer /> should render', () => {
    expect(videoPlayer.exists()).toBe(true)
  })
})
