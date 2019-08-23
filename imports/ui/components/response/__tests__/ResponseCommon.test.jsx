import React from 'react'
import { shallow } from 'enzyme'
import { ResponseLayout, ResponseFilmstripNotFound } from '../ResponseCommon'

describe('<ResponseLayout />', () => {
  const responseLayout = shallow(<ResponseLayout />)

  it('<ResponseLayout /> should render', () => {
    expect(responseLayout.exists()).toBe(true)
  })
})

describe('<ResponseFilmstripNotFound />', () => {
  const responseFilmstripNotFound = shallow(<ResponseFilmstripNotFound t={jest.fn()} />)

  it('<ResponseFilmstripNotFound /> should render', () => {
    expect(responseFilmstripNotFound.exists()).toBe(true)
  })
})
