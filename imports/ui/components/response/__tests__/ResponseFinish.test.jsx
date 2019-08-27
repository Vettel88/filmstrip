import React from 'react'
import { shallow } from 'enzyme'
import { ResponseFinish, ResponseConfirmationSent, ResponseConfirm } from '../ResponseFinish'

describe('<ResponseFinish />', () => {
  const responseFinish = shallow(<ResponseFinish />)

  it('<ResponseFinish /> should render', () => {
    expect(responseFinish.exists()).toBe(true)
  })
})

describe('<ResponseConfirmationSent />', () => {
  const responseConfirmationSent = shallow(<ResponseConfirmationSent />)

  it('<ResponseConfirmationSent /> should render', () => {
    expect(responseConfirmationSent.exists()).toBe(true)
  })
})

describe('<ResponseConfirm />', () => {
  const responseConfirm = shallow(<ResponseConfirm />)

  it('<ResponseConfirm /> should render', () => {
    expect(responseConfirm.exists()).toBe(true)
  })
})
