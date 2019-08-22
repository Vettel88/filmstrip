import React from 'react'
import { shallow } from 'enzyme'
import { FilmstripsItemNavigation } from '../FilmstripsItemNavigation'

let props = { match: { params: { }}}
describe('<FilmstripsItemNavigation />', () => {
  const filmstripsItemNavigation = shallow(<FilmstripsItemNavigation {...props} />)

  it('<FilmstripsItemNavigation /> should render', () => {
    expect(filmstripsItemNavigation.exists()).toBe(true)
  })
})
