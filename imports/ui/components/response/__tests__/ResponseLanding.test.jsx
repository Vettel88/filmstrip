import React from 'react'
import { shallow } from 'enzyme'
import { ResponseLanding } from '../ResponseLanding'

describe('<ResponseLanding />', () => {
  const responseLanding = shallow(<ResponseLanding />)

  it('<ResponseLanding /> should render', () => {
    expect(responseLanding.exists()).toBe(true)
  })
})
