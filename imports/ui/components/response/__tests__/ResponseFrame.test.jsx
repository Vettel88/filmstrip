import React from 'react'
import { shallow } from 'enzyme'
import { ResponseFrame } from '../ResponseFrame'

describe('<ResponseFrame />', () => {
  const responseFrame = shallow(
    <ResponseFrame
      frame={{}}
      filmstrip= {{frames: []}}
      t={jest.fn()}
    />
  )

  it('<ResponseFrame /> should render', () => {
    expect(responseFrame.exists()).toBe(true)
  })
})
