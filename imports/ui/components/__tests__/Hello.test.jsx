import React from 'react'
import { shallow } from 'enzyme'
import Hello from '../Hello'
let props = { }
describe('<Hello />', () => {
  const hello = shallow(<Hello {...props} />)

  it('<Hello /> should render', () => {
    expect(hello.exists()).toBe(true)
  })
})
