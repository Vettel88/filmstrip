import React from 'react'
import { shallow } from 'enzyme'
import { ResponseFinish, ResponseConfirmationSent, ResponseConfirm } from '../ResponseFinish'

let props = { }
describe('<ResponseFinish />', () => {
  const responseFinish = shallow(<ResponseFinish {...props} />)

  it('<ResponseFinish /> should render', () => {
    expect(responseFinish.exists()).toBe(true)
  })
})

props = { }
describe('<ResponseConfirmationSent />', () => {
  const responseConfirmationSent = shallow(<ResponseConfirmationSent {...props} />)

  it('<ResponseConfirmationSent /> should render', () => {
    expect(responseConfirmationSent.exists()).toBe(true)
  })
})

props = { }
describe('<ResponseConfirm />', () => {
  const responseConfirm = shallow(<ResponseConfirm {...props} />)

  it('<ResponseConfirm /> should render', () => {
    expect(responseConfirm.exists()).toBe(true)
  })
})
