import React from 'react'
import { shallow } from 'enzyme'
import { ResponseAnswer } from '../ResponseAnswer'

describe('<ResponseAnswer />', () => {
  const responseAnswer = shallow(
    <ResponseAnswer
      frame={{}}
      filmstrip= {{frames: []}}
      t={jest.fn()}
      currentFrame={{}}
    />
  )

  it('<ResponseAnswer /> should render', () => {
    expect(responseAnswer.exists()).toBe(true)
  })
})
