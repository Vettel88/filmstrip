import React from 'react'
import { shallow } from 'enzyme'
import { ResponseLanding } from '../ResponseLanding'

let props = { }
describe('<ResponseLanding />', () => {
  const responseLanding = shallow(<ResponseLanding {...props} />)

  it('<ResponseLanding /> should render', () => {
    expect(responseLanding.exists()).toBe(true)
  })
})
