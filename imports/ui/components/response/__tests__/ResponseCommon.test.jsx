import React from 'react'
import { shallow } from 'enzyme'
import { ResponseLayout, ResponseFilmstripNotFound } from '../ResponseCommon'

let props = { }
describe('<ResponseLayout />', () => {
  const responseLayout = shallow(<ResponseLayout {...props} />)

  it('<ResponseLayout /> should render', () => {
    expect(responseLayout.exists()).toBe(true)
  })
})

props = { t: jest.fn() }
describe('<ResponseFilmstripNotFound />', () => {
  const responseFilmstripNotFound = shallow(<ResponseFilmstripNotFound {...props} />)

  it('<ResponseFilmstripNotFound /> should render', () => {
    expect(responseFilmstripNotFound.exists()).toBe(true)
  })
})
