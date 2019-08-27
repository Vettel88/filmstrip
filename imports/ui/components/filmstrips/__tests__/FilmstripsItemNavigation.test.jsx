import React from 'react'
import { shallow } from 'enzyme'
import { FilmstripsItemNavigation } from '../FilmstripsItemNavigation'

describe('<FilmstripsItemNavigation />', () => {
  const filmstripsItemNavigation = shallow(<FilmstripsItemNavigation location={{pathname: ''}} match={{params:{}}} />)

  it('<FilmstripsItemNavigation /> should render', () => {
    expect(filmstripsItemNavigation.exists()).toBe(true)
  })
})
